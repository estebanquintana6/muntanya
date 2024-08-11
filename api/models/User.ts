import mongoose from "mongoose";
const { Schema } = mongoose;

// Create Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["ADMIN", "SUPERADMIN"],
    default: "ADMIN",
  },
  created_at: {
    type: Date,
    default: Date.now
  },
});

const Users = mongoose.model('Users', UserSchema);

export default Users;