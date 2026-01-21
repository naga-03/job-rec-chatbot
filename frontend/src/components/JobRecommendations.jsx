export default function JobRecommendations({ recommendations }) {
  return (
    <div>
      {recommendations.map((job, idx) => (
        <div key={idx} className="job-card">
          <h3>{job['Job Title']} - {job['Company']}</h3>
          <p>{job['Work Type']} | ₹{job['salary_inr'].toLocaleString('en-IN')} | {job['location']}</p>
        </div>
      ))}
    </div>
  );
}
