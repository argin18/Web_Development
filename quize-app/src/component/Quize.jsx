import React from "react";
import { useState, useEffect } from "react";

const questions = [
  {
    question: "What is the capital of Nepal?",
    options: ["New Dilli", "Kathmandu", "Dhaka", "Lalitpur"],
    answer: "Kathmandu",
  },
  {
    question: "Which language is used for web development?",
    options: ["Python", "Java", "C++", "JavaScript"],
    answer: "JavaScript",
  },
  {
    question: "Who developed the theory of relativity?",
    options: ["Newton", "Einstein", "Galileo", "Tesla"],
    answer: "Einstein",
  },
  {
    question: "Who is the first female prime minister of nepal ?",
    options: ["Susila karki", "Bidhya devi bhandari", "Anuradha Koirala", "Manisha Koirala"],
    answer: "Susila karki",
  },
  {
    question: "name of highest mountain in the world?",
    options: [ "Kanchan janga", "K2","SagarMatha", "Makalu"],
    answer: "SagarMatha",
  },
];

const Quize = () => {
  const [currentQue, setCurrentQue] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    }
    const timer = setInterval(() => {
      setTimeLeft((e) => (e > 0 ? e - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (option) => {
    if (option === questions[currentQue].answer) {
      setScore(score + 1);
    }
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    const next = currentQue + 1;

    if (next < questions.length) {
      setCurrentQue(next);
      setTimeLeft(20);
    } else {
      setShowResult(true);
    }
  };
  return (
    <>
      <div className="box1">
        {showResult ? (
          <div>
            <h2 className="title">Quize Complete !</h2>
            <p className="p">
              Your Score: {score}/{questions.length}{" "}
            </p>
            <button
              onClick={() => {
                setCurrentQue(0);
                setScore(0);
                setShowResult(false);
                setTimeLeft(10);
              }}
            >
              Restart Quiz
            </button>
          </div>
        ) : (
          <div className="card">
            <h2 className="title">{questions[currentQue].question}</h2>
            <p className="timer">Time Left: {timeLeft}s</p>

            <div className="optContain">
              {questions[currentQue].options.map((option) => (
                <button
                  className="option"
                  key={option}
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Quize;
