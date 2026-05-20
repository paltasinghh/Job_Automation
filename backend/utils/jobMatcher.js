export const calculateMatchScore = (job, userProfile) => {
    let score = 0;
  
    const jobSkills = job.techStack || [];
    const userSkills = userProfile.skills || [];
  
    // ✅ Skill match
    const matchedSkills = jobSkills.filter(skill =>
      userSkills.includes(skill.toLowerCase())
    );
  
    score += (matchedSkills.length / (jobSkills.length || 1)) * 50;
  
    // ✅ Location match
    if (userProfile.location && job.location?.includes(userProfile.location)) {
      score += 20;
    }
  
    // ✅ Job type match
    if (userProfile.jobType && job.jobType === userProfile.jobType) {
      score += 20;
    }
  
    // ✅ Recency (new jobs boost)
    const daysOld =
      (Date.now() - new Date(job.postedAt)) / (1000 * 60 * 60 * 24);
  
    if (daysOld <= 1) score += 10;
    else if (daysOld <= 3) score += 5;
  
    return {
      matchScore: Math.round(score),
      matchedSkills,
      missingSkills: userSkills.filter(
        skill => !jobSkills.includes(skill.toLowerCase())
      )
    };
  };