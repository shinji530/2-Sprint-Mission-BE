import express from "express";
import productRouter from "./routes/productRouter";
import articleRouter from "./routes/articleRouter";
import commentRouter from "./routes/commentRouter";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", 'https://panda-market-react.netlify.app', 'https://2-sprint-mission-fe.vercel.app'],
};

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api/products", productRouter);
app.use("/api/articles", articleRouter);
app.use("/api", commentRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
