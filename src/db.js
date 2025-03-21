import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost/bpa-db')
        console.log("DB is conected")
    } catch(error){
        console.log(error)
    }
}