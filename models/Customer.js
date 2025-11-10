const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
      trim: true,
      default: ""
    },
     lastName: {
      type: String,
      required: false,
      trim: true,
      default: ""
    },
    userType:{
      type: String,
      enum: ['student', 'teacher','admin'],
      default: 'student'
    },
   
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    profilePicture: {
      type: String, 
      default: '',   
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
