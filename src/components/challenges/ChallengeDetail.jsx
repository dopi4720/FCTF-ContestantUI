import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from "react";
import { FiAlertCircle, FiCheck, FiClock } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { API_CHALLEGE_START, API_CHALLENGE_CHECK_CACHE, API_CHALLENGE_STOP, BASE_URL, GET_CHALLENGE_DETAILS, SUBMIT_FLAG } from "../../constants/ApiConstant";
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

  useEffect(() => {
    const fetchChallengeDetails = async () => {
      const api = new ApiHelper(BASE_URL);
      try {
        const response = await api.get(`${GET_CHALLENGE_DETAILS}/${id}`);
        setChallenge(response.data);
        console.log("Challenge details:", response.data);
        setTimeLimit(response.data.time_limit || null);

        const storedStartTime = localStorage.getItem(`challenge_${challengeId}_startTime`);
        if (storedStartTime && response.data.time_limit) {
          const elapsedSeconds = (Date.now() - parseInt(storedStartTime, 10)) / 1000;
          const initialTimeLeft = response.data.time_limit * 60 - elapsedSeconds;
          setTimeLeft(initialTimeLeft > 0 ? initialTimeLeft : 0);
          setIsChallengeStarted(initialTimeLeft > 0);
        }
      } catch (err) {
        console.error("Error fetching challenge:", err);
        setError("Failed to load challenge details.");
      }
    };

    fetchChallengeDetails();
  }, [id]);

  useEffect(()=> {
    const api= new ApiHelper(BASE_URL);
    try {
      const response= api.get(API_CHALLENGE_CHECK_CACHE, {
        challenge_id: challengeId,
        generatedToken: localStorage.getItem("accessToken")
      })
      
      
    } catch (error) {
      
    }
  })

  useEffect(() => {
    if (isChallengeStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setShowTimeUpAlert(true);
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
        setTimeLeft(timeLimit * 60);
        setShowTimeUpAlert(false);
        setIsChallengeStarted(true);
        setIsSubmitted(false);
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
      } else {
        console.error("Failed to stop challenge:", response.error || "Unknown error");
      }
    } catch (err) {
      console.error("Error stopping challenge:", err);
    }
  };

  const handleSubmitFlag = async () => {
    setIsSubmittingFlag(true);
    setSubmissionError(null);
    const api= new ApiHelper(BASE_URL)
    try {
      const sessionCookie = Cookies.get('session');  
    if (sessionCookie) {
  console.log('Session cookie:', sessionCookie);
} else {
  console.log('Session cookie not found');
}
      const data = {
        challenge_id: challengeId,
        submission: answer,
        generatedToken: localStorage.getItem("accessToken")
        
      }; 
      const response = await api.postForm(SUBMIT_FLAG, data)
      // const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      //console.log(generatedToken)
      console.log(response)
      if (response?.data.data.status === "correct") {
        alert(`${response.data.data.message}`);
      } else if (response?.data.data.status === "already_solved") {
        alert(`${response.data.data.message}`);
      } else {
        setSubmissionError(response?.data?.data?.message || "Incorrect flag");
        alert(`${response?.data.data.message}`);
      }
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
    setIsSubmitted(true);
    setError("");
    console.log("Answer submitted:", answer);
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
                    <pre className="bg-white p-4 rounded-md">{challenge.description}</pre>
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
                disabled={isSubmitted || (challenge?.require_deploy && !isChallengeStarted)}
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

              {/* Nút Start Challenge chỉ hiển thị nếu require_deploy là true */}
              {challenge &&  (
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