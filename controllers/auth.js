const crypto = require("crypto");

const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");

const { validationResult } = require("express-validator");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
    previousEmailValue: "",
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      previousEmailValue: email,
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }

      return bcryptjs
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.user = user;
            return req.session.save(() => {
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password.");
          return res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign Up",
    errorMessage: message,
    previousEmailValue: "",
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Sign Up",
      errorMessage: errors.array()[0].msg,
      previousEmailValue: email,
    });
  }

  bcryptjs
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });

      return user.save();
    })
    .then(() => {
      res.redirect("/login");
      return transporter.sendMail({
        to: email,
        from: "efecan25252525@gmail.com",
        subject: "Signup Succees!",
        html: "<h1>You have successfully signed up!</h1>",
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Forgot Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "Account not found with that email.");
          return res.redirect("/reset");
        }

        user.resetToken = token;
        user.resetTokenExpiresDate = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        return transporter
          .sendMail({
            to: req.body.email,
            from: "efecan25252525@gmail.com",
            subject: "Reset Password",
            html: `
            <div>
            <h1>Reset Password</h1>
            <a href="http://localhost:3000/reset/${token}">Click to Reset Password</a>
            </div>
            `,
          })
          .then((result) => {
            res.redirect("/login");
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.resetToken;
  User.findOne({
    resetToken: token,
    resetTokenExpiresDate: { $gt: Date.now() },
  }).then((user) => {
    if (!user) {
      req.flash("error", "User not found with that token.");
      return res.redirect("/login");
    }

    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    res.render("auth/new-password", {
      path: "/reset",
      pageTitle: "Forgot Password",
      errorMessage: message,
      userId: user._id.toString(),
      resetToken: token,
    });
  });
};

exports.postNewPassword = (req, res, next) => {
  const userId = req.body.userId;
  const newPassword = req.body.password;
  const token = req.body.resetToken;

  User.findOne({
    _id: userId,
    resetToken: token,
    resetTokenExpiresDate: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "User cannot found with that ID.");
        return res.redirect("/reset");
      }

      return bcryptjs
        .hash(newPassword, 12)
        .then((hashedPassword) => {
          user.password = hashedPassword;
          user.resetToken = undefined;
          user.resetTokenExpiresDate = undefined;
          return user.save();
        })
        .catch((err) => console.log(err));
    })
    .then(() => {
      return res.redirect("/login");
    })
    .catch((err) => console.log(err));
};
