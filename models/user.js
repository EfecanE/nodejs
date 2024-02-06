const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
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
