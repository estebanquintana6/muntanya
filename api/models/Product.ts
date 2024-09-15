import mongoose from "mongoose";
const { Schema } = mongoose;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true
  },
  photo_urls: [{
    type: String,
  }],
  tags: [{
    type: String,
  }],
  favorite: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now
  },
});

const Products = mongoose.model('Products', ProductSchema);

export default Products;