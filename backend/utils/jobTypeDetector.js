export const detectJobType = (text = "") => {
    const t = text.toLowerCase();
  
    if (t.includes("remote")) return "remote";
    if (t.includes("hybrid")) return "hybrid";
    if (t.includes("work from home")) return "remote";
  
    return "onsite";
  };