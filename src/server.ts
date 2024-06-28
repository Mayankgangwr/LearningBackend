import dotenv from "dotenv";
import connectDB from './config/index';
import app from "./app";

dotenv.config({
  path: './.env'
})

connectDB()
  .then(() => {
    const port = process.env.PORT || 8000;

    app.on("error", (err) => {
      console.log("Error", err);
      throw err;
    });

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed !! ", err);
  });