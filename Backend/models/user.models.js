import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    // ================= BASIC INFO =================
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    fullName:{
       type: String,
       required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ================= PROFILE =================
    avatar: {
      type: String, // cloudinary url
      default: "",
    },

    coverImage: {
      type: String, // cloudinary url
      default: "",
    },

    // ================= LOCATION =================
    location: {
      ip: {
        type: String,
        default: null,
      },
      city: {
        type: String,
        default: null,
      },
      region: {
        type: String,
        default: null,
      },
      country: {
        type: String,
        default: null,
      },
    },

    // ================= SOCIAL =================
    followersCount: {
      type: Number,
      default: 0,
    },

    followingCount: {
      type: Number,
      default: 0,
    },

    // ================= PLAN & ACTIVITY =================
    plan: {
      type: String,
      enum: ["free", "premium", "pro"],
      default: "free",
    },

    points: {
      type: Number,
      default: 0,
    },

    downloads: [
      {
        type: String,
      },
    ],

    groups: [
      {
        type: String,
      },
    ],

    // ================= AUTH =================
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ==================================================
// 🔐 PASSWORD HASH (before save)
// ==================================================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ==================================================
// 🔐 PASSWORD COMPARE
// ==================================================
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// ==================================================
// 🔐 ACCESS TOKEN
// ==================================================
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// ==================================================
// 🔁 REFRESH TOKEN
// ==================================================
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
