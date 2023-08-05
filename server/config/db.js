import mongoose from "mongoose";

export const connectToDB = async () => {
    mongoose
      .connect(process.env.MONGO_URI)
      .then((conn) => {
        console.log(`Connecte DB: ${conn.connection.host}`);
      })
      .catch((err) => {
        console.log(err.message);
        process.exit(1);
      });
  };
  
