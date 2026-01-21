import { getRecommendations } from '../api';

export default function SalarySelector({ jobTitle, selectedWorkTypes, salaryOptions, setRecommendations }) {
  const selectSalary = async (sal) => {
    try {
      const res = await getRecommendations(jobTitle, selectedWorkTypes, sal);
      setRecommendations(res.data.jobs);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Optionally, set an error state or display a user-friendly message
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {salaryOptions.map((sal) => (
          <button key={sal} onClick={() => selectSalary(sal)} className="option-btn">
            ₹{sal.toLocaleString('en-IN')}
          </button>
        ))}
      </div>
    </div>
  );
}
