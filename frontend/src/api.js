import axios from "axios";

const BASE_URL = "https://job-rec-backend.onrender.com";

export const getJobTypes = (jobTitle) =>
  axios.post(`${BASE_URL}/get_job_types`, { jobTitle });

export const getSalaryOptions = (jobTitle, workType) =>
  axios.post(`${BASE_URL}/get_salary_options`, { jobTitle, workType });

export const getRecommendations = (jobTitle, workTypes, salary) =>
  axios.post(`${BASE_URL}/get_recommendations`, {
    jobTitle,
    workTypes,
    salary,
  });
