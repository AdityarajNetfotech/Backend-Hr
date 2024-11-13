import mongoose from 'mongoose';

export const dbconnections = () => {
    mongoose.connect(process.env.MONGO_URI, { dbName: 'HR_Based_Project' })
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.error('Error connecting to MongoDB', err);
        });
}

export default dbconnections;
