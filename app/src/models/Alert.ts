import mongoose, { Schema, models } from "mongoose";

const AlertSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "El título es requerido"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "El mensaje es requerido"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["info", "warning", "error", "success"],
      default: "info",
    },
    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
    source: {
      type: String,
      trim: true,
      default: "system",
    },
  },
  { timestamps: true }
);

export const Alert = models.Alert || mongoose.model("Alert", AlertSchema);
