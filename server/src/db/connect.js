import mongoose from 'mongoose';

async function connectMongoDB(uri) {
    return await mongoose.connect(uri);
}

export default connectMongoDB