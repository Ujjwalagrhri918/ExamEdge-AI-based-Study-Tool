import React, { useContext, useEffect, useState } from 'react';
import { UploadContext } from '../context/UploadContext';
import './MCQs.css';

const MCQs = () => {
  const { selectedFile, URL } = useContext(UploadContext);
  const [mcqs, setMcqs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMCQs = async () => {
      if (!selectedFile) return;

      const fileName = typeof selectedFile === 'string'
        ? selectedFile
        : selectedFile?.name;

      const cacheKey = `${fileName}_mcqs`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        setMcqs(JSON.parse(cached));
      } else {
        try {
          setLoading(true);
          const response = await fetch(
            `${URL}/generate-mcqs/${fileName}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
            }
          );

          const data = await response.json();
          if (data?.mcqs?.length) {
            setMcqs(data.mcqs);
            localStorage.setItem(cacheKey, JSON.stringify(data.mcqs));
          } else {
            setMcqs([]);
          }
        } catch (error) {
          console.error('Error fetching MCQs:', error);
          setMcqs([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMCQs();
  }, [selectedFile]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowAnswer(true);
    if (option === mcqs[currentIndex].answer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < mcqs.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      setFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setScore(0);
    setFinished(false);
  };

  if (!selectedFile) {
    return (
      <div className="mcq-container">
        📄 Please upload a document to generate MCQs.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mcq-container">
        ⏳ Generating MCQs...
      </div>
    );
  }

  if (!mcqs.length) {
    return (
      <div className="mcq-container">
        ⚠️ No MCQs available for this document.
      </div>
    );
  }

  if (finished) {
    return (
      <div className="mcq-container">
        <div className="result-box">
          <h2>Your Score: {score} / {mcqs.length}</h2>
          <button className="try-again-btn" onClick={restartQuiz}>Try Again</button>
        </div>
      </div>
    );
  }

  const currentMCQ = mcqs[currentIndex];

  return (
    <div className="mcq-container">
      <div className="question-box">
        <h2>Question {currentIndex + 1} of {mcqs.length}</h2>
        <p className="question-text">{currentMCQ.question}</p>
        <div className="options-list">
          {currentMCQ.options.map((option, idx) => (
            <button
              key={idx}
              className={`option-btn ${
                showAnswer
                  ? option === currentMCQ.answer
                    ? 'correct'
                    : option === selectedOption
                    ? 'incorrect'
                    : ''
                  : ''
              }`}
              onClick={() => !showAnswer && handleOptionClick(option)}
              disabled={showAnswer}
            >
              {option}
            </button>
          ))}
        </div>
        {showAnswer && (
          <div className="feedback">
            {selectedOption === currentMCQ.answer
              ? '✅ Correct!'
              : `❌ Wrong! Correct Answer: ${currentMCQ.answer}`}
          </div>
        )}
        {showAnswer && (
          <button className="next-btn" onClick={nextQuestion}>Next</button>
        )}
      </div>
    </div>
  );
};

export default MCQs;
