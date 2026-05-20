"use client";

import { useState, useEffect } from "react";
import { fetchJobs, scrapeJobs, matchJobs, cleanupJobs } from "../services/jobService";
import JobCard from "../components/JobCard";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all" or "match"
  
  const [filters, setFilters] = useState({
    keyword: "nodejs",
    location: "remote",
    jobType: "",
    hours: ""
  });

  const [matchData, setMatchData] = useState({
    skills: "nodejs, react, mongodb",
    location: "remote",
    jobType: "remote"
  });

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setActiveTab("all");
    try {
      const res = await fetchJobs(filters);
      setJobs(res.data);
    } catch (err) {
      console.error("Search Error:", err);
      alert("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    setLoading(true);
    try {
      const res = await scrapeJobs({
        keyword: filters.keyword,
        location: filters.location
      });
      alert(`Scraping completed! Found ${res.data.totalScraped} jobs, saved ${res.data.totalSaved}.`);
      handleSearch();
    } catch (err) {
      console.error("Scrape Error:", err);
      alert("Scraping failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = async () => {
    setLoading(true);
    setActiveTab("match");
    try {
      const data = {
        skills: matchData.skills.split(",").map(s => s.trim()),
        location: matchData.location,
        jobType: matchData.jobType
      };
      const res = await matchJobs(data);
      setJobs(res.data);
    } catch (err) {
      console.error("Match Error:", err);
      alert("Failed to match jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async () => {
    if (!confirm("Are you sure you want to delete jobs older than 72 hours?")) return;
    setLoading(true);
    try {
      const res = await cleanupJobs();
      alert(`Cleanup successful! Deleted ${res.data.deletedCount} old jobs.`);
      handleSearch();
    } catch (err) {
      console.error("Cleanup Error:", err);
      alert("Cleanup failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "40px 20px",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh"
    }}>
      <header style={{ marginBottom: "40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#2c3e50", marginBottom: "10px" }}>🚀 Job Automation Dashboard</h1>
        <p style={{ color: "#7f8c8d" }}>Scrape, Track, and Match your dream jobs automatically</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "30px" }}>
        {/* Sidebar Controls */}
        <aside>
          {/* Search & Scrape Box */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>🔍 Search & Scrape</h2>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Keyword</label>
              <input
                style={inputStyle}
                placeholder="e.g. Node.js"
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Location</label>
              <input
                style={inputStyle}
                placeholder="e.g. Remote"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button onClick={handleSearch} style={{ ...buttonStyle, flex: 1, backgroundColor: "#3498db" }}>Search</button>
              <button onClick={handleScrape} style={{ ...buttonStyle, flex: 1, backgroundColor: "#2ecc71" }}>Scrape</button>
            </div>
          </div>

          {/* Match Skills Box */}
          <div style={{ ...cardStyle, marginTop: "20px" }}>
            <h2 style={sectionTitleStyle}>🎯 Match My Skills</h2>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Your Skills (comma separated)</label>
              <textarea
                style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                placeholder="nodejs, react, mongodb..."
                value={matchData.skills}
                onChange={(e) => setMatchData({ ...matchData, skills: e.target.value })}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Preferred Location</label>
              <input
                style={inputStyle}
                placeholder="e.g. Remote"
                value={matchData.location}
                onChange={(e) => setMatchData({ ...matchData, location: e.target.value })}
              />
            </div>
            <button onClick={handleMatch} style={{ ...buttonStyle, width: "100%", marginTop: "10px", backgroundColor: "#9b59b6" }}>
              Find Best Matches
            </button>
          </div>

          {/* Admin Controls */}
          <div style={{ ...cardStyle, marginTop: "20px", borderTop: "4px solid #e74c3c" }}>
            <h2 style={sectionTitleStyle}>⚙️ Admin</h2>
            <p style={{ fontSize: "0.8rem", color: "#95a5a6", marginBottom: "10px" }}>
              Purge jobs older than 72 hours from the database.
            </p>
            <button onClick={handleCleanup} style={{ ...buttonStyle, width: "100%", backgroundColor: "#e74c3c" }}>
              Run Cleanup Now
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ margin: 0, color: "#34495e" }}>
              {activeTab === "all" ? "Latest Jobs" : "Personalized Matches"} 
              <span style={{ fontSize: "1rem", color: "#95a5a6", marginLeft: "10px" }}>
                ({jobs.length} found)
              </span>
            </h2>
            
            {loading && <div className="loader" style={loaderStyle}></div>}
          </div>

          {jobs.length === 0 && !loading ? (
            <div style={{ 
              textAlign: "center", 
              padding: "60px", 
              background: "white", 
              borderRadius: "12px",
              color: "#95a5a6"
            }}>
              <h3>No jobs found</h3>
              <p>Try searching with different keywords or run a new scrape.</p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px"
            }}>
              {jobs.map((job, i) => (
                <JobCard key={job._id || i} job={job} />
              ))}
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .loader {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3498db;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Styles
const cardStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
};

const sectionTitleStyle = {
  fontSize: "1.1rem",
  color: "#2c3e50",
  marginBottom: "15px",
  borderBottom: "1px solid #eee",
  paddingBottom: "10px"
};

const inputGroupStyle = {
  marginBottom: "15px"
};

const labelStyle = {
  display: "block",
  fontSize: "0.85rem",
  fontWeight: "bold",
  color: "#7f8c8d",
  marginBottom: "5px"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box"
};

const buttonStyle = {
  padding: "10px 15px",
  borderRadius: "6px",
  border: "none",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "opacity 0.2s"
};

const loaderStyle = {
  marginLeft: "10px"
};
