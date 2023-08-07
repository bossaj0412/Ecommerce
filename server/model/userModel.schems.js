import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, " name is required "],
    maxLength: [30, " cannot exceed 30 "],
    minLength: [4, " name should be freater then 4 "],
  },
  email: {
    type: String,
    reqired: [true, " please enter your email "],
    unique: [true, " enter unique mail id"],
    validate: [validator.isEmail, " please enter a valid mail "],
  },
  password: {
    type: String,
    required: [true, " password is required "],
    minLength: [8, " password should be greater then 8 char "],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  role: {
    type: String,
    default: "user",
  },
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
});

// encrypt password

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT token



userSchema.methods = {
  //compare password
  comparePassword: async function (enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password)
  },

  //generate JWT TOKEN
  getJwtToken: function () {
      return JWT.sign(
          {
              _id: this._id,
              role: this.role
          },
          process.env.JWT_SECRET,
          {
              expiresIn: process.env.JWT_EXPIRY
          }
      )
  },

  generateForgotPasswordToken: function(){
      const forgotToken = crypto.randomBytes(20).toString('hex');

      //step 1 - save to DB
      this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(forgotToken)
      .digest("hex")

      this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
      //step 2 - return values to user

      return forgotToken

  }


}


export default mongoose.model("User", userSchema);
