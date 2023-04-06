import dotenv from "dotenv";
import mongoose from "mongoose";
import { app } from "./app.js";
const PORT = process.env.PORT || 5000;

dotenv.config();


mongoose
.connect(
    `mongodb+srv://admin:admin@test.qidx0uu.mongodb.net/photobank`,
    { dbName: "photobank" }
  ).then(() => {
    app.listen(PORT, console.log("Server started on port 5000"));
  })
  .catch((err) => {
    console.log(err);
  });