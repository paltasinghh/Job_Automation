import app from "./app.js";
import { connectDB } from "./config/db.js";
import cron from "node-cron";
import { deleteOldJobs } from "./controllers/jobController.js";

const PORT = 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);

    // 🔥 Schedule cleanup every hour
    cron.schedule("0 * * * *", () => {
      console.log("Running scheduled cleanup...");
      deleteOldJobs();
    });
  });
});