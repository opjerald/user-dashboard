import express from "express";
import cors from "cors";

import userRouter from "./routes/user.js";

const app = express();
const PORT = 3000;

app.use(cors({
  origin:['http://localhost:5173'],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}))

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    message: "Hello world!",
  });
});

app.use("/api", userRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
