const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.equals(product._id);
  });

  const updatedCartItems = [...this.cart.items];
  let newQuantity = 1;

  if (cartProductIndex !== -1) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({ productId: product._id, quantity: newQuantity });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteFromCart = function (productId) {
  const updatedCartProducts = this.cart.items.filter((product) => {
    return !product.productId === new ObjectId(productId);
  });

  this.cart.items = updatedCartProducts;

  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const { ObjectId } = require("mongodb");
// const getDb = require("../util/database").getDb;

// class User {
//   constructor(id, username, email, cart) {
//     this.username = username;
//     this.email = email;
//     this._id = id;
//     this.cart = cart;
//   }

//   save() {
//     const db = getDb();
//     return db
//       .collection("users")
//       .insertOne(this)
//       .then((result) => result)
//       .catch((err) => console.log(err));
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.equals(product._id);
//     });

//     const updatedCartItems = [...this.cart.items];
//     let newQuantity = 1;

//     if (cartProductIndex !== -1) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({ productId: product._id, quantity: newQuantity });
//     }
//     const updatedCart = {
//       items: updatedCartItems,
//     };

//     const db = getDb();
//     return db.collection("users").updateOne(
//       {
//         _id: this._id,
//       },
//       {
//         $set: {
//           cart: updatedCart,
//         },
//       }
//     );
//   }

//   getCart() {
//     const db = getDb();

//     const cartProductIds = this.cart.items.map((product) => product.productId);

//     return db
//       .collection("products")
//       .find({ _id: { $in: cartProductIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((product) => {
//           return {
//             ...product,
//             quantity: this.cart.items.find((cartProduct) => {
//               return cartProduct.productId.equals(product._id);
//             }).quantity,
//           };
//         });
//       });
//   }

//   deleteFromCart(productId) {
//     const updatedCartProducts = this.cart.items.filter((product) => {
//       return !product.productId.equals(productId);
//     });

//     const db = getDb();

//     const updatedCart = {
//       items: updatedCartProducts,
//     };

//     return db.collection("users").updateOne(
//       { _id: this._id },
//       {
//         $set: {
//           cart: updatedCart,
//         },
//       }
//     );
//   }

//   addOrder() {
//     const db = getDb();

//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.username,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then(() => {
//         this.cart.items = [];
//         return db.collection("users").updateOne(
//           { _id: this._id },
//           {
//             $set: {
//               cart: { items: [] },
//             },
//           }
//         );
//       })
//       .catch((err) => console.log(err));
//   }

//   getOrders() {
//     const db = getDb();

//     return db.collection("orders").find({ "user._id": this._id }).toArray();
//   }

//   static findById(userId) {
//     const db = getDb();

//     return db
//       .collection("users")
//       .findOne({
//         _id: new ObjectId(userId),
//       })
//       .then((user) => user)
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = User;
