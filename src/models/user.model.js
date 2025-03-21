import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    payment_status: {
        type: String,
        enum: ['pending', 'paid', 'expired'],
        default: 'pending'
      },
      subscription_date: Date,
      expiration_date: Date,
      phone: {
        type: String,
        trim: true,
        default: ''
    },
    full_name: {
        type: String,
        trim: true,
        default: ''
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    profile_picture: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
})

export default mongoose.model('User', userSchema)
