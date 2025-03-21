import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  schedule: {
    type: String,
    enum: [
      "Lunes 21hs", 
      "Martes 21hs", 
      "Martes 22hs", 
      "Jueves 20hs", 
      "Jueves 21hs", 
      "Viernes 21hs"
    ],
    required: true
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    attended: {
      type: Boolean,
      default: false
    }
  }]
}, { timestamps: true });

export default mongoose.model("Class", classSchema);