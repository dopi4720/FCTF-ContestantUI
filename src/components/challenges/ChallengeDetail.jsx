import React, { useState, useEffect } from "react";
import { FiClock, FiCheck, FiAlertCircle } from "react-icons/fi";

const ChallengeDetail = () => {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [answer, setAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showTimeUpAlert, setShowTimeUpAlert] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setShowTimeUpAlert(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      setError("Please enter your answer");
      return;
    }
    setIsSubmitted(true);
    setError("");
  };

  return (
    <div className="min-h-screen bg-theme-color-base p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="lg:flex">
          {/* Left Section (70%) */}
          <div className="lg:w-[70%] p-8 bg-white">
            <h1 className="text-3xl font-bold text-theme-color-primary mb-6" role="heading">
              Algorithm Challenge: Dynamic Programming
            </h1>
            <div className="prose max-w-none">
              <p className="text-theme-color-neutral-content text-lg mb-6">
                Implement a solution to find the longest common subsequence of two strings.
                Your algorithm should have an optimal time complexity and handle edge cases appropriately.
              </p>
              <div className="bg-neutral-low p-4 rounded-md">
                <h2 className="text-xl font-semibold mb-4">Example:</h2>
                <pre className="bg-white p-4 rounded-md">
                  Input: str1 = "ABCDGH", str2 = "AEDFHR"
                  Output: "ADH"
                </pre>
              </div>
            </div>
          </div>

          {/* Right Section (30%) */}
          <div className="lg:w-[30%] bg-theme-color-base p-8">
            {/* Timer Section */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-2 text-2xl font-mono bg-white p-4 rounded-lg shadow-md">
                <FiClock className="text-theme-color-primary" />
                <span className="font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Time Up Alert */}
            {showTimeUpAlert && (
              <div className="bg-theme-color-primary-dark text-white p-4 rounded-lg mb-6 flex items-center justify-center">
                <FiAlertCircle className="mr-2" />
                <span>Đã hết giờ</span>
              </div>
            )}

            {/* Answer Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="answer"
                  className="block text-theme-color-neutral-content font-medium mb-2"
                >
                  Your Answer
                </label>
                <textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-theme-color-primary focus:border-transparent ${error ? "border-red-500" : "border-theme-color-neutral"}`}
                  rows="6"
                  placeholder="Enter your solution here..."
                  disabled={isSubmitted || timeLeft === 0}
                  aria-label="Answer input field"
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2
                  ${isSubmitted || timeLeft === 0
                    ? "bg-theme-color-neutral cursor-not-allowed"
                    : "bg-theme-color-primary hover:bg-theme-color-primary-dark text-white"}`}
                disabled={isSubmitted || timeLeft === 0}
              >
                {isSubmitted ? (
                  <>
                    <FiCheck className="text-white" />
                    <span>Submitted</span>
                  </>
                ) : (
                  "Submit Answer"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;