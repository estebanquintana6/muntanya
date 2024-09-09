import mongoose from "mongoose";
const { Schema } = mongoose;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  photo_urls: [{
    type: String,
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
});

const Products = mongoose.model('Products', ProductSchema);

export default Products;