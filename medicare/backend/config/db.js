import mongoose from "mongoose";

const connectDB = async () => {

    await mongoose.connect(process.env.MONGO_URI).then(() => { 

    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  }).catch 
  ((err) =>{
    console.error(` MongoDB connection error: ${err.message}`);

});
}
export default connectDB;
