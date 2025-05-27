import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Tiempo de espera para seleccionar servidor
            socketTimeoutMS: 45000, // Tiempo de espera de operaciones
            ssl: true, // Para MongoDB Atlas
        });
        console.log("✅ DB conectada");
    } catch (error) {
        console.error("⛔ Error de conexión:", error);
        process.exit(1);
    }
};