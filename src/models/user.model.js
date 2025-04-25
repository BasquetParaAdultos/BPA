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
    birth_date: { type: Date, default: null },
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
        // Nuevo campo para cantidad de clases permitidas
        classesAllowed: { 
            type: Number, 
            default: 0,
            min: 0,
            max: 4
        },
        // Movemos selectedSchedules aquí y actualizamos enum
        selectedSchedules: [{
            type: String,
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
        }],
        // Renombramos expiresAt por consistencia
        expiresAt: {
            type: Date,
            default: null
        },
        lastPayment: {
            amount: Number,
            date: Date,
            paymentId: String
          }
    }
}, {
    timestamps: true
});

// Middleware para limpieza de datos antiguos
userSchema.pre('save', function(next) {
    // Migrar datos de suscripción antigua si existen
    if(this.payment_status) {
        this.subscription.active = this.payment_status === 'paid';
        this.subscription.expiresAt = this.expiration_date;
    }
    
    // Eliminar campos obsoletos
    if(this.payment_status) delete this.payment_status;
    if(this.subscription_date) delete this.subscription_date;
    if(this.expiration_date) delete this.expiration_date;
    
    next();
});

export default mongoose.model('User', userSchema);