import mongoose from "mongoose";
const { Schema } = mongoose;

const ContactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  instagram: {
    type: String,
    required: false,
  },
  knowMethod: {
    type: String,
    required: false,
  },
  services: [
    {
      type: String,
      required: false,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  attended: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now
  },
});

const Contacts = mongoose.model("Contacts", ContactSchema);

export default Contacts;
