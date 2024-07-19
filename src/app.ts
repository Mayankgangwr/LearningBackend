import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app: Application = express();

app.use(
  cors({
    origin: process.env.LOCAL_CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));

app.use(express.urlencoded({ extended: true, limit: "20kb" }));

app.use(express.static("public"));

app.use(cookieParser());

//routes import
import restaurantRouter from "./routes/restaurant.router";
import productRouter from "./routes/product.route";

//routes declaration

/*
i wrote the route api/v1/restaurant

i have used api because it's api only 
i have used v1 because it is the version one of these api
i have used api because it's api only 
i have used restaurant because this api for restaurant
 */

// route for restaurant
app.use("/api/v1/restaurant", restaurantRouter);

// route for product
app.use("/api/v1/product", productRouter);

app.get("/", (req: Request, res: Response) => {
  res.send(process.env.CLOUDINARY_NAME);
});

export default app;
