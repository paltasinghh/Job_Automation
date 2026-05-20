import axios from "axios";

const API = "http://127.0.0.1:5000/api";

export const fetchJobs = (params) =>
  axios.get(`${API}/jobs`, { params });

export const scrapeJobs = (params) =>
  axios.get(`${API}/scrape`, { params });

export const matchJobs = (data) =>
  axios.post(`${API}/match`, data);

export const cleanupJobs = () =>
  axios.delete(`${API}/jobs/cleanup`);