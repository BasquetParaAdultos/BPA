import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    clase:{
        type: String,
        required: true
    },
    asistencia: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }, 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true
})

export default mongoose.model('Task', taskSchema)