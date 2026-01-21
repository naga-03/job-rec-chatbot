import { useState } from 'react';
import { getJobTypes } from '../api';

export default function JobTitleInput({ setJobTitle, setWorkTypeOptions }) {
  const [inputJobTitle, setInputJobTitle] = useState('');

  const handleNext = async () => {
    setJobTitle(inputJobTitle);
    const res = await getJobTypes(inputJobTitle);
    setWorkTypeOptions(res.data.jobTypes);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter job title"
        value={inputJobTitle}
        onChange={(e) => setInputJobTitle(e.target.value)}
      />
      <button onClick={handleNext}>Next</button>
    </div>
  );
}
