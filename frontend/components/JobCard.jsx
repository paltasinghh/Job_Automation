export default function JobCard({ job }) {
  const isMatched = job.matchScore !== undefined;

  return (
    <div style={{
      border: "1px solid #e0e0e0",
      padding: "20px",
      borderRadius: "12px",
      background: "#ffffff",
      boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "default",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      position: "relative"
    }}>
      {isMatched && (
        <div style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: job.matchScore > 70 ? "#4caf50" : job.matchScore > 40 ? "#ff9800" : "#f44336",
          color: "white",
          padding: "4px 8px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "bold"
        }}>
          {job.matchScore}% Match
        </div>
      )}

      <h3 style={{ margin: "0 0 5px 0", color: "#333", fontSize: "1.2rem" }}>
        {job.title || "No Title"}
      </h3>

      <div style={{ fontSize: "0.9rem", color: "#666" }}>
        <p style={{ margin: "2px 0" }}><b>🏢 Company:</b> {job.company || "N/A"}</p>
        <p style={{ margin: "2px 0" }}><b>📍 Location:</b> {job.location || "N/A"}</p>
        <p style={{ margin: "2px 0" }}><b>💼 Type:</b> <span style={{ textTransform: "capitalize" }}>{job.jobType || "Not specified"}</span></p>
        <p style={{ margin: "2px 0" }}><b>🔗 Source:</b> {job.source || "Unknown"}</p>
      </div>

      <div style={{ marginTop: "10px" }}>
        <p style={{ margin: "0 0 5px 0", fontSize: "0.85rem", fontWeight: "bold", color: "#444" }}>Tech Stack:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {job.techStack?.length ? job.techStack.map((tech, i) => (
            <span key={i} style={{
              background: "#f0f2f5",
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "0.75rem",
              color: "#555"
            }}>
              {tech}
            </span>
          )) : <span style={{ fontSize: "0.75rem", color: "#999" }}>N/A</span>}
        </div>
      </div>

      {isMatched && job.missingSkills?.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <p style={{ margin: "0 0 5px 0", fontSize: "0.85rem", fontWeight: "bold", color: "#d32f2f" }}>Missing Skills:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {job.missingSkills.map((skill, i) => (
              <span key={i} style={{
                background: "#ffebee",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "0.75rem",
                color: "#c62828"
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: "auto", paddingTop: "15px" }}>
        {job.applyLink ? (
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              textAlign: "center",
              background: "#007bff",
              color: "white",
              padding: "10px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "0.9rem"
            }}
          >
            Apply Now
          </a>
        ) : (
          <button disabled style={{
            display: "block",
            width: "100%",
            background: "#ccc",
            color: "white",
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            fontSize: "0.9rem"
          }}>
            No Apply Link
          </button>
        )}
      </div>
    </div>
  );
}