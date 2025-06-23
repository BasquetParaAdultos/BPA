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
      index: true
    },
    attended: {
      type: Boolean,
      default: null
    },
    // Añadido campo de timestamp para seguimiento
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Índices optimizados para consultas frecuentes
classSchema.index({ date: 1, schedule: 1 }, { unique: true });
classSchema.index({ "attendees.user": 1 });
classSchema.index({ date: 1, "attendees.attended": 1 });

// Virtual para determinar si la clase es futura
classSchema.virtual('isFuture').get(function() {
  return this.date > new Date();
});

// Middleware para validación adicional
classSchema.pre('save', function(next) {
  if (this.date < new Date()) {
    next(new Error('No se puede crear una clase en el pasado'));
  } else {
    next();
  }
});

export default mongoose.model("Class", classSchema);