import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import taskRoutes from './routes/tasks';

import request from 'request';

const app: Application = express();

app.use(cors({
    origin: process.env.LOCAL_CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "20kb" }));

app.use(express.urlencoded({ extended: true, limit: "20kb" }));

app.use(express.static("public"));

app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
    res.send("Hello World!")
})

app.use('/api', (req, res) => {
    const url = `https://carapi.app${req.url}`;
    req.pipe(request(url)).pipe(res);
  });

export default app;