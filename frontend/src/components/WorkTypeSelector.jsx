import { useState } from 'react';
import { getSalaryOptions } from '../api';

export default function WorkTypeSelector({ jobTitle, setSelectedWorkTypes, setSalaryOptions, workTypeOptions }) {
  const [selected, setSelected] = useState([]);

  const toggleWorkType = (type) => {
    const newSelected = selected.includes(type)
      ? selected.filter(t => t !== type)
      : [...selected, type];
    setSelected(newSelected);
    setSelectedWorkTypes(newSelected);
  };

  const handleNext = async () => {
    if (selected.length === 0) return;
    // For simplicity, use the first selected work type for salary options
    const res = await getSalaryOptions(jobTitle, selected[0]);
    setSalaryOptions(res.data.salaryOptions);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {workTypeOptions.map((type) => (
          <button
            key={type}
            onClick={() => toggleWorkType(type)}
            className={`option-btn ${selected.includes(type) ? 'selected' : ''}`}
          >
            {type}
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center' }}>
        <button onClick={handleNext} disabled={selected.length === 0} className="option-btn">Next</button>
      </div>
    </div>
  );
}
