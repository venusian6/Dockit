import express from "express";
// import { db } from "./shared/db.js";
// import { enqueueJob } from "./queue";
// import { randomUUID } from "crypto";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Its working",
    uptime: process.uptime(),
  });
});

// app.post("/deploy", async (req, res) => {
//   try {
//     const { server_id } = req.body;

//     if (!server_id) {
//       return res.status(400).json({
//         error: " server_id is req",
//       });
//     }
//     const user_id = "22222";

//     const serverResult = await db.query(
//       "SELECT id FROM servers WHERE id=$1 AND user_id=$2",
//       [server_id, user_id]
//     );

//     if (serverResult.row.length === 0) {
//       return res.status(400).json({
//         error: " Server not found or not owned by user",
//       });
//     }

//     const job_id = randomUUID();

//     await db.query(
//       `INSERT INTO jobs(
//     id,user_id,server_id,status,created_at)VALUES($1,$2,$3,'queued',NOW())`,
//       [job_id, user_id, server_id]
//     );

//     //enqueue job

//     await enqueueJob(job_id);
//     res.status(202).json({ job_id, status: "queued" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal error" });
//   }
// });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
