import mongoose from "mongoose";
const { Schema } = mongoose;

const BlogEntry = new Schema({
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
  created_at: {
    type: Date,
    default: Date.now
  },
});

const Products = mongoose.model('BlogEntry', BlogEntry);

export default Products;