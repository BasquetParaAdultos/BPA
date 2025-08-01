import mongoose from "mongoose";
import { horariosbpa  } from "../config/schedules.js";

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
    },
    // Datos Generales
    alternate_phone1: { type: String, default: '' },
    alternate_phone2: { type: String, default: '' },
    dni: { type: String, default: '' },
    locality: { type: String, default: '' },
    nationality: { type: String, default: '' },
    birth_date: { 
        type: Date,
        default: null,
        set: function(date) {
            return date ? new Date(date.getTime() - (date.getTimezoneOffset() * 60000)) : date;
        }
    },
    sex: { type: String, enum: ['masculino', 'femenino', 'otro', ''], default: '' },
    address: { type: String, default: '' },
    health_insurance: { type: String, default: '' },
    blood_type: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''], default: '' },

    // Antecedentes de Salud
    chronic_diseases: { type: Boolean, default: false },
    diseases_details: { type: String, default: '' },
    medical_care: { type: Boolean, default: false },
    medication: { type: String, default: '' },
    vaccination_complete: { type: Boolean, default: false },
    allergies: { type: String, default: '' },
    eye_diseases: { type: String, default: '' },
    cardiovascular_diseases: { type: String, default: '' },
    neurological_diseases: { type: String, default: '' },
    hearing_diseases: { type: String, default: '' },
    diabetes: { type: Boolean, default: false },
    disability: { type: Boolean, default: false },
    additional_info: { type: String, default: '' },

    // Subscripción
    subscription: {
        active: {
            type: Boolean,
            default: false
        },
        classesAllowed: {
            type: Number,
            default: 0,
            min: 0,
            max: 4
        },
        selectedSchedules: {
            type: [{
                type: String,
                enum: horariosbpa
            }],
            default: []
        },
        startDate: {
            type: Date,
            default: null,
            set: function(date) {
                return date ? new Date(date.getTime() - (date.getTimezoneOffset() * 60000)) : date;
            }
        },
        expiresAt: {
            type: Date,
            default: null,
            set: function(date) {
                return date ? new Date(date.getTime() - (date.getTimezoneOffset() * 60000)) : date;
            },
            validate: {
                validator: function (v) {
                    return v === null || !isNaN(new Date(v).getTime());
                },
                message: props => `${props.value} no es una fecha válida`
            }
        },
        lastPayment: {
            type: {
                amount: Number,
                date: {
                    type: Date,
                    set: function(date) {
                        return date ? new Date(date.getTime() - (date.getTimezoneOffset() * 60000)) : date;
                    }
                },
                paymentId: String
            },
            default: null
        }
    }
}, {
    timestamps: true
});



// Índices para optimizar consultas
userSchema.index({ 'subscription.active': 1, 'subscription.selectedSchedules': 1 });        // Índice para búsquedas por estado
userSchema.index({ 'subscription.expiresAt': 1 });
// Añade validación de email y normalización
userSchema.path('email').validate(async (email) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
}, 'El correo electrónico ya está registrado');

// Normaliza el email antes de guardar
userSchema.pre('save', function (next) {
    if (this.isModified('email')) {
        this.email = this.email.toLowerCase().trim();
    }
    next();
});

export default mongoose.model('User', userSchema);