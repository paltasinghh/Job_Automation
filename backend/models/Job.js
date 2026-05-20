import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  techStack: [String],
  jobType: String,        // remote / hybrid / onsite
  applyLink: String,
  source: String,
  postedAt: Date         // 👈 IMPORTANT
}, { timestamps: true });

// 🔥 Auto-delete after 72 hours (259200 seconds)
jobSchema.index({ postedAt: 1 }, { expireAfterSeconds: 72 * 60 * 60 });

export default mongoose.model("Job", jobSchema);