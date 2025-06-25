import mongoose from "mongoose";
import { horariosbpa } from "../config/schedules.js";

// Mapa de días en español
const spanishDays = {
  monday: "lunes",
  tuesday: "martes",
  wednesday: "miércoles",
  thursday: "jueves",
  friday: "viernes",
  saturday: "sábado",
  sunday: "domingo"
};

const classSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true,
    set: function(date) {
      // Ajustar a UTC pero mantener la hora local
      return new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    }
  },
  schedule: {
    type: String,
    required: true,
    index: true,
    enum: horariosbpa,
    validate: {
      validator: function(schedule) {
        // Validar solo cuando date está presente
        if (!this.date) return true;
        
        // Obtener día de la fecha
        const dateDay = new Date(this.date).toLocaleDateString('es-AR', {
          weekday: 'long',
          timeZone: 'America/Argentina/Buenos_Aires'
        }).toLowerCase();
        
        // Obtener día del horario (primera palabra)
        const scheduleDay = schedule.split(' ')[0].toLowerCase();
        
        return dateDay === scheduleDay;
      },
      message: props => `La fecha no coincide con el día del horario: ${props.value}`
    }
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

// Índices optimizados
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