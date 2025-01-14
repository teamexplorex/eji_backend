import connectDB from "./config/db.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
dotenv.config();
connectDB()

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "10kb" }));
app.use("/uploads", express.static("uploads"));

fs.readdirSync("./routes").map(async (route) => {
  const { router } = await import(`./routes/${route}`);
  app.use(`/api/${route.replace(".js", "")}`, router);
});

app.get("/", async (_, res) => {
  res.json("Api is running");
});

app.listen(process.env.PORT, () =>
  console.log("Server is listening on port " + process.env.PORT)
);