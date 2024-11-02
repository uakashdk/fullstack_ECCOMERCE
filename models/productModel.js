import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    photo: {
      data: {
        type: Buffer,
        required: true, // Optional: uncomment this if you want to make it required
      },
      contentType: {
        type: String,
        required: true, // Optional: uncomment this if you want to make it required
      },
    },
    shipping: {
      type: Boolean,
      default: false, // Optional: set a default value for shipping
    },
  },
  { timestamps: true }
);

// Change the model name to singular
export default mongoose.model("Product", productSchema);
