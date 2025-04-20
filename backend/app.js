import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import reservationRouter from "./routes/reservationRoute.js";
import { dbConnection } from "./database/dbConnection.js";
import donationRoutes from './routes/donationRoutes.js';
import customerRoutes from "./routes/customerRoutes.js";
import razorpayRoute from "./routes/razorpayRoute.js";
import paymentSuccessRoutes from "./routes/paymentSuccessRoutes.js";

const app = express();
dotenv.config({ path: "./config/config.env" });

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    methods: ["POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/reservation", reservationRouter);
app.use("/api/donations", donationRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/razorpay", razorpayRoute); // ✅ NEW
app.use("api/payment-success", paymentSuccessRoutes );

app.get("/", (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "HELLO WORLD AGAIN",
  });
});

dbConnection();
app.use(errorMiddleware);

export default app;
