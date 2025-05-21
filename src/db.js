import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost/bpa-db', {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            appName: 'BPA'
        });

        // Eliminar el comando setParameter
        console.log("✅ DB conectada");

    } catch (error) {
        console.error("⛔ Error de conexión:", error);
        process.exit(1);
    }
};