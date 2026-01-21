import { useState, useEffect, useRef } from "react";
import ChatBubble from "./components/ChatBubble";
import JobRecommendations from "./components/JobRecommendations";
import { getJobTypes, getSalaryOptions, getRecommendations } from "./api";
import "./app.css";

function App() {
  const [step, setStep] = useState(1); // 1: job title, 2: work type, 3: salary, 4: recommendations
  const [messages, setMessages] = useState([
    { text: "Hi! What job role are you looking for?", sender: "bot", timestamp: new Date().toLocaleTimeString() }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [selectedWorkType, setSelectedWorkType] = useState("");
  const [salary, setSalary] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [workTypeOptions, setWorkTypeOptions] = useState([]);
  const [salaryOptions, setSalaryOptions] = useState([]);

  const [workTypes, setWorkTypes] = useState(['internship', 'temporary', 'full-time', 'contract', 'part-time']);

  useEffect(() => {
    if (workTypeOptions.length > 0) {
      setWorkTypes(workTypeOptions);
    }
  }, [workTypeOptions]);
  const chatAreaRef = useRef(null);

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { text, sender, timestamp: new Date().toLocaleTimeString() }]);
  };

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, step]);

  const handleInputSubmit = async () => {
    if (!inputValue.trim()) return;

    if (step === 1) {
      setJobTitle(inputValue);
      addMessage(inputValue, "user");
      setInputValue("");
      try {
        const res = await getJobTypes(inputValue);
        setWorkTypeOptions(res.data.jobTypes);
        addMessage("Great! Choose your preferred work type 👇", "bot");
        setStep(2);
      } catch (error) {
        console.error(error);
      }
    } else if (step === 3) {
      setSalary(inputValue);
      addMessage(inputValue, "user");
      setInputValue("");
      try {
        const res = await getRecommendations(jobTitle, [selectedWorkType], inputValue);
        setRecommendations(res.data.jobs || []);
        addMessage("Here are the best jobs for you 👇", "bot");
        setStep(4);
      } catch (error) {
        console.error(error);
        setRecommendations([]);
      }
    }
  };

  const handleWorkTypeSelect = async (type) => {
    setSelectedWorkType(type);
    addMessage(type, "user");
    setSalaryOptions([1000000, 1400000, 1800000]);
    addMessage("Now select your expected salary (₹)", "bot");
    setStep(3);
  };

  const handleSalarySelect = async (salaryValue) => {
    setSalary(salaryValue);
    addMessage(salaryValue, "user");
    try {
      const res = await getRecommendations(jobTitle, [selectedWorkType], salaryValue);
      setRecommendations(res.data.jobs || []);
      addMessage("Here are the best jobs for you 👇", "bot");
      setStep(4);
    } catch (error) {
      console.error(error);
      setRecommendations([]);
    }
  };

  return (
    <div className="chat-container">
      <div className="header">
        <h1> Job Recommendation Chatbot</h1>
        <p>Find your dream job with AI-powered recommendations</p>
      </div>
      <div className="chat-area" ref={chatAreaRef}>
        {messages.map((msg, index) => (
          <ChatBubble key={index} text={msg.text} sender={msg.sender} timestamp={msg.timestamp} />
        ))}
        {step === 4 && <JobRecommendations recommendations={recommendations} />}
      </div>
      {step === 2 && (
        <div className="work-type-buttons">
          {workTypes.map((type) => (
            <button key={type} className="option-btn vertical" onClick={() => handleWorkTypeSelect(type)}>
              {type}
            </button>
          ))}
        </div>
      )}
      {step === 3 && (
        <div className="salary-buttons">
          {salaryOptions.map((salary) => (
            <button key={salary} className="option-btn vertical" onClick={() => handleSalarySelect(salary)}>
              ₹{salary.toLocaleString('en-IN')}
            </button>
          ))}
        </div>
      )}
      {step === 1 && (
        <div className="input-area">
          <input
            type="text"
            placeholder="Enter job title"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
          />
          <button onClick={handleInputSubmit}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;
