import React, { useEffect, useRef, useState } from "react";
import { FiAlertCircle, FiCheck, FiClock } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { API_CHALLEGE_START, API_CHALLENGE_CHECK_STATUS_ATTEMPT, API_CHALLENGE_STOP, API_CHALLENGGE_GET_CACHE, BASE_URL, GET_CHALLENGE_DETAILS, SUBMIT_FLAG } from "../../constants/ApiConstant";
import ApiHelper from "../../utils/ApiHelper";

const ChallengeDetail = () => {
  const { id } = useParams();
  const challengeId = id ? parseInt(id, 10) : undefined;
  const [timeLeft, setTimeLeft] = useState(null);
  const [timeLimit, setTimeLimit] = useState(null);
  const [isChallengeStarted, setIsChallengeStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [showTimeUpAlert, setShowTimeUpAlert] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const timerRef = useRef(null); // Timer reference to control interval
  const [isSubmittingFlag, setIsSubmittingFlag] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [url, setUrl] = useState(null);
  const [selectedHint, setSelectedHint] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTimeOut, setisTimeOut]= useState(false)

  
  const hints = [
    {
      id: 1,
      title: "Approach Hint",
      detail: "Consider using a 2D dynamic programming table to store intermediate results."
    },
    {
      id: 2,
      title: "Time Complexity Hint",
      detail: "The optimal solution should have O(m*n) time complexity where m and n are lengths of input strings."
    },
    {
      id: 3,
      title: "Base Case Hint",
      detail: "Start with empty strings as your base case in the DP solution."
    }
  ];

  const Modal = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
          <p className="text-lg mb-4">{message}</p>
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-theme-color-primary text-white rounded-lg hover:bg-theme-color-primary-dark"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const handleHintClick = (hintId) => {
    setSelectedHint(selectedHint === hintId ? null : hintId);
  };

  useEffect(() => {
    const fetchChallengeDetails = async () => {
      const api = new ApiHelper(BASE_URL);
      try {
        const detailsResponse = await api.get(`${GET_CHALLENGE_DETAILS}/${id}`);
        setChallenge(detailsResponse.data);
        setTimeLimit(detailsResponse.data.time_limit || null);

        if (detailsResponse.data.require_deploy) {
            const cacheResponse = await api.postForm(API_CHALLENGGE_GET_CACHE, {
              challenge_id: detailsResponse.data.id,
              generatedToken: localStorage.getItem("accessToken")
          });
          // Handle cache data if needed
        }
        const cache_attempt_response= await api.postForm(API_CHALLENGE_CHECK_STATUS_ATTEMPT, {
          challenge_id: detailsResponse.data.id,
          generatedToken: localStorage.getItem("accessToken")
        });
        if(cache_attempt_response.data.status === 'Submitted'){
          setIsSubmitted(true)
        }else{
          setIsSubmitted(false)
        }
        const storedStartTime = localStorage.getItem(`challenge_${challengeId}_startTime`);
        if (storedStartTime && detailsResponse.data.time_limit) {
          const elapsedSeconds = (Date.now() - parseInt(storedStartTime, 10)) / 1000;
          const initialTimeLeft = detailsResponse.data.time_limit * 60 - elapsedSeconds;
          setTimeLeft(initialTimeLeft > 0 ? initialTimeLeft : 0);
          setIsChallengeStarted(initialTimeLeft > 0);
        }
      } catch (err) {
        console.error("Error fetching challenge:", err);
      }
    };
    fetchChallengeDetails();
  }, [id]);

  useEffect(() => {
    if (isChallengeStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setShowTimeUpAlert(true);
            setisTimeOut(true)
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current); // Clear interval if challenge stops or timeLeft changes
    }

    return () => clearInterval(timerRef.current);
  }, [isChallengeStarted, timeLeft]);

  const handleStartChallenge = async () => {
    if (!challengeId) {
      setError("Invalid challenge ID");
      return;
    }

    const api = new ApiHelper(BASE_URL);
    const generatedToken = localStorage.getItem("accessToken");

    try {
      const response = await api.post(API_CHALLEGE_START, {
        challenge_id: challengeId,
        generatedToken,
      });

      if (response.success) {
        const startTime = Date.now();
        localStorage.setItem(`challenge_${challengeId}_startTime`, startTime);
        setUrl(response.challenge_url);
        setTimeLeft(timeLimit * 60);
        setShowTimeUpAlert(false);
        setIsChallengeStarted(true);
        setIsSubmitted(false);

        if (response.challenge_url) {
          window.open(response.challenge_url, "_blank");
        } else {
          console.error("No URL provided in the response");
        }

      } else {
        console.error("Failed to start challenge:", response.error || "Unknown error");
      }
    } catch (err) {
      console.error("Error starting challenge:", err);
    }
  };

  const handleStopChallenge = async () => {
    const api = new ApiHelper(BASE_URL);
    const generatedToken = localStorage.getItem("accessToken");

    try {
      const response = await api.postForm(API_CHALLENGE_STOP, {
        challenge_id: challengeId,
        generatedToken,
      });
      if (response.message === "Challenge stopped successfully") {
        setIsChallengeStarted(false); // Stop the challenge
        setTimeLeft(null); // Reset the timer to null
        localStorage.removeItem(`challenge_${challengeId}_startTime`);
        clearInterval(timerRef.current); // Clear the timer interval immediately
        setModalMessage("Challenge stopped successfully.");
        setIsModalOpen(true); 
      } else {
        setModalMessage("Fail to stop challenge! Try Again");
        setIsModalOpen(true);
        console.error("Failed to stop challenge:", response.error || "Unknown error");
      }
    } catch (err) {
      console.error("Error stopping challenge:", err);
    }
  };

  const handleSubmitFlag = async () => {
    setIsSubmittingFlag(true);
    setSubmissionError(null);
    const api = new ApiHelper(BASE_URL)
    try {
      const data = {
        challenge_id: challengeId,
        submission: answer,
        generatedToken: localStorage.getItem("accessToken")
      };
      const response = await api.postForm(SUBMIT_FLAG, data)
      if (response?.data.status === "correct") {
        setModalMessage(response.data.message);
      } else if (response?.data.status === "already_solved") {
        setModalMessage(response.data.message || "Solved");
      } else if(response?.data.status==="ratelimited"){
        setModalMessage(response?.data.message)
      } else if(response?.data.status==="Incorrect"
        && response?.data.message.contains("You have")){
        setModalMessage("Your team have zero attempts left for this challenge")
      }
      else {
        setSubmissionError(response?.data?.message || "Incorrect flag");
        setModalMessage(response?.data.message || "Incorrect flag");
      } 
      setIsModalOpen(true);
    } catch (error) {
      setSubmissionError("Error submitting flag.");
      console.error("Error submitting flag:", error);
    } finally {
      setIsSubmittingFlag(false);
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null || !challenge?.require_deploy) return "--:--";
    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      setError("Please enter your answer");
      return;
    }
    setIsSubmitted(false);
    setError("");
  };

  return (
    <div className="min-h-screen bg-theme-color-base p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="lg:flex">
          <div className="lg:w-[70%] p-8 bg-white">
            <h1 className="text-3xl font-bold text-theme-color-primary mb-6" role="heading">
              {challenge ? challenge.name : "..."}
            </h1>
            <div className="prose max-w-none">
              {challenge ? (
                <>
                  <p className="text-theme-color-neutral-content text-lg mb-6">
                    Max attempts: {challenge.max_attempts} <br />
                    Type: {challenge.type}
                  </p>
                  <div className="bg-neutral-low p-4 rounded-md">
                    <h2 className="text-xl font-semibold mb-4">Example:</h2>
                    <div className="bg-white p-4 rounded-md overflow-y-auto max-h-96">
                      <pre className="bg-white p-4 rounded-md whitespace-pre-wrap break-words">
                        {challenge.description}
                      </pre>
                    </div>
                  </div>
                </>
              ) : (
                <p>Loading challenge details...</p>
              )}
            </div>
          </div>

          <div className="lg:w-[30%] bg-theme-color-base p-8">
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-2 text-2xl font-mono bg-white p-4 rounded-lg shadow-md">
                <FiClock className="text-theme-color-primary" />
                <span className="font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {showTimeUpAlert && (
              <div className="bg-theme-color-primary-dark text-white p-4 rounded-lg mb-6 flex items-center justify-center">
                <FiAlertCircle className="mr-2" />
                <span>Time is up!</span>
              </div>
            )}
            {/* Updated Hints Section */}
            <div className="space-y-2 mb-4">
                <h3 className="font-medium text-theme-color-neutral-content mb-3">Available Hints:</h3>
                <div className="grid grid-cols-3 gap-2">
                  {hints.map((hint) => (
                    <div key={hint.id} className="relative">
                      <button
                        onClick={() => handleHintClick(hint.id)}
                        className="w-full h-16 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center font-medium text-theme-color-primary hover:bg-gray-50"
                        type="button"
                      >
                        Hint {hint.id}
                      </button>
                      {selectedHint === hint.id && (
                        <div className="absolute top-full left-0 w-[300px] mt-2 p-4 bg-white rounded-lg shadow-xl border border-gray-100 z-10 transition-all duration-300 transform">
                          <h4 className="font-semibold text-theme-color-primary mb-2">{hint.title}</h4>
                          <p className="text-sm text-gray-600">{hint.detail}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="answer" className="block text-theme-color-neutral-content font-medium mb-2">
                  Your Answer
                </label>
                <textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-theme-color-primary focus:border-transparent ${error ? "border-red-500" : "border-theme-color-neutral"}`}
                  rows="6"
                  placeholder="Enter your solution here..."
                  disabled={isSubmitted || (challenge?.require_deploy && !isChallengeStarted)}
                  aria-label="Answer input field"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
              
              <button
                onClick={handleSubmitFlag}
                type="submit"
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${isSubmitted || (challenge?.require_deploy && !isChallengeStarted)
                  ? "bg-theme-color-neutral cursor-not-allowed"
                  : "bg-theme-color-primary hover:bg-theme-color-primary-dark text-white"
                  }`}
                disabled={isSubmitted || (challenge?.require_deploy && !isChallengeStarted) || isTimeOut }
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
              <Modal
        isOpen={isModalOpen}
        message={modalMessage}
        onClose={() => setIsModalOpen(false)}
      />

              {/* Nút Start Challenge chỉ hiển thị nếu require_deploy là true */}
              {challenge && challenge.require_deploy && (
                <button
                  type="button"
                  onClick={isChallengeStarted ? handleStopChallenge : handleStartChallenge}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${isChallengeStarted
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                >
                  {isChallengeStarted ? "Stop Challenge" : "Start Challenge"}
                </button>
              )}
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;