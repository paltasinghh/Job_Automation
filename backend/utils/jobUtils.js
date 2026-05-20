export const detectJobType = (text = "") => {
    const t = text.toLowerCase();
    if (t.includes("remote") || t.includes("work from home") || t.includes("wfh")) return "remote";
    if (t.includes("hybrid")) return "hybrid";
    return "onsite";
  };
  
  export const parsePostedAt = (text = "") => {
    const t = text.toLowerCase();
  
    const hours = t.match(/(\d+)\s*hour/);
    if (hours) return new Date(Date.now() - Number(hours[1]) * 60 * 60 * 1000);
  
    const days = t.match(/(\d+)\s*day/);
    if (days) return new Date(Date.now() - Number(days[1]) * 24 * 60 * 60 * 1000);
  
    if (t.includes("just posted") || t.includes("today")) return new Date();
  
    return new Date(); // fallback
  };
  
  export const normalizeJob = (job) => ({
    title: job.title || "",
    company: job.company || "",
    location: (job.location || "").toLowerCase(),
    techStack: (job.techStack || []).map(s => s.toLowerCase()),
    jobType: job.jobType || "onsite",
    applyLink: job.applyLink || "",
    source: job.source || "",
    postedAt: job.postedAt || new Date()
  });