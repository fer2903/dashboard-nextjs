import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["DeFi", "NFT", "Layer1", "Layer2", "Stablecoin", "Exchange", "Otro"],
      default: "Otro",
    },
    symbol: {
      type: String,
      required: [true, "El símbolo es requerido"],
      uppercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "El precio es requerido"],
      min: [0, "El precio no puede ser negativo"],
    },
    stock: {
      type: Number,
      required: [true, "El stock es requerido"],
      min: [0, "El stock no puede ser negativo"],
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Product = models.Product || mongoose.model("Product", ProductSchema);
