import express from "express";
import cors from 'cors'
import ordensRoutes from "./routes/ordensRoutes.js"

const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use(ordensRoutes);

export default app;