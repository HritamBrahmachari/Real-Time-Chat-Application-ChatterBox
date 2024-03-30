import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDb.js";
import { app, server } from "./socket/socket.js";

const PORT = process.env.PORT || 8000;

dotenv.config();

app.use(express.json()); //to parse the incoming requests with JSON playloads (from req.body)
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// app.get("/", (req, res) => {
//   //root route http://localhost:5000
//   res.send("hellooo");
// });

server.listen(process.env.PORT, () => {
  connectToMongoDB();
  console.log(`Server runing  on port ${process.env.PORT}`);
});
