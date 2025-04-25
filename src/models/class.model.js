import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true,
    validate: {
      validator: function (value) {
        return value > new Date(); // Solo fechas futuras
      },
      message: 'La fecha debe ser futura'
    }
  },
  schedule: {
    type: String,
    required: true,
    index: true,
    enum: [
      "Lunes 7hs en Meridiano V°",
      "Lunes 21hs en El Bosque",
      "Martes 21hs en El Bosque",
      "Martes 22hs en El Bosque",
      "Miercoles 7hs en Meridiano V°",
      "Jueves 19hs en Estación Norte (Femenino)",
      "Jueves 20hs en Estación Norte (Mixto)",
      "Viernes 7hs en Meridiano V°",
      "Viernes 21hs en El Bosque",
      "Sabado 9hs en El Bosque",
      "Sabado 10hs en El Bosque",
      "Sabado 11hs en El Bosque"
    ]
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
classSchema.index({
  date: 1,
  schedule: 1,
  "attendees.user": 1
}, {
  unique: true,
  name: 'unique_attendance'
});


export default mongoose.model("Class", classSchema);