import mongoose from "mongoose";
import { horariosbpa } from "../config/schedules.js";

const classSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true,
  },
  schedule: {
    type: String,
    required: true,
    index: true,
    enum: horariosbpa
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true // Índice para mejor performance
    },
    attended: {
      type: Boolean,
      default: null,
      index: true
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índice compuesto para búsquedas rápidas
classSchema.index(
  { date: 1, schedule: 1 },
  { unique: true, name: 'unique_class_schedule' }
);


export default mongoose.model("Class", classSchema);