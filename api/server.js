import express from "express";
import { db } from "./db";
import { enqueueJob } from "./queue";
import { randomUUID } from "crypto";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Its working",
    uptime: process.uptime(),
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
