import { saveAs } from 'file-saver';
import React, { useEffect, useRef, useState } from "react";
import { FaDownload } from 'react-icons/fa';
import { FiAlertCircle, FiCheck, FiClock } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { API_CHALLEGE_START, API_CHALLENGE_STOP, APi_GET_CHALLENGES_HINTS, API_UNLOCK_HINTS, BASE_URL, GET_CHALLENGE_DETAILS, SUBMIT_FLAG } from "../../constants/ApiConstant";
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
    const [modalMessage, setModalMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTimeOut, setisTimeOut] = useState(false)
    const [hints, setHints] = useState([])
    const [unlockHints, setUnlockHints] = useState([])
    const [hint, setHint] = useState(null)
    const [isStarting, setIsStarting] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(null)

    const fetchHints = async () => {
        const api = new ApiHelper(BASE_URL);
        try {
            const response = await api.get(`${APi_GET_CHALLENGES_HINTS}/${challengeId}/all`);
            if (response.hints) {
                const fetchedHintData = response.hints.hints
                setHints(fetchedHintData || []);
            } else {
                console.error("Failed to fetch hints:", response.error || "Unknown error");
            }
        } catch (error) {
            console.error("Error fetching hints:", error);
        }
    };

    useEffect(() => {
        fetchHints();
    }, [challengeId]);

    const FetchHintDetails = async (hintId) => {
        try {
            const api = new ApiHelper(BASE_URL);
            const response = await api.get(`${APi_GET_CHALLENGES_HINTS}/${hintId}`);
            if (response.success) {
                const hintDetails = response.data;
                setHint(hintDetails || []);
                return response;
            } else {
                console.error("Failed to fetch hints:", response.error || "Unknown error");
            }
        } catch (error) {
            console.error("Error fetching hints:", error);
        }
    };

    const getFileName = (filePath) => {
        const pathParts = filePath.split("/");
        const fullName = pathParts[pathParts.length - 1];
        return fullName.split("?")[0];
    };


    const handleDowloadFiles = async (filePath) => {
        const api = new ApiHelper(BASE_URL);
        try {
            const response = await api.get(`${BASE_URL}${filePath}`);
            let fileName = getFileName(filePath)

            saveAs(`${BASE_URL}${filePath}`, fileName)
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    //SUA MODAL O DAY
    const Modal = ({ isOpen, message, title, onClose }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-7 rounded-lg shadow-xl max-w-xl w-1/2 sm:max-w-full" >
                    <h2 className="text-2xl mb-3"><b>{title}</b></h2>
                    <p className="text-lg mb-4">{message}</p>
                    <div className="flex flex-col items-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-theme-color-primary text-white rounded-lg hover:bg-theme-color-primary-dark"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };



    const HintUnlocks = async (hintId) => {
        const api = new ApiHelper(BASE_URL);
        try {
            const response = await api.post(`${API_UNLOCK_HINTS}`, {
                type: 'hints',
                target: hintId,
            });
            if (response.success) {
                setUnlockHints((prev) => [...prev, hintId]);
            }
            return response;
        } catch (error) {
            console.error('Failed to unlock hint:', error);
            return { success: false, errors: error.response?.data?.errors || {} };
        }
    };

    //CLICK UNLOCK TAIN DAYYYYYYYYYYYYYYYYYYYYYYYYY
    const handleUnlockHintClick = async (hintId) => {
        try {
            const response = await HintUnlocks(hintId);
            if (response?.success) {
                setModalMessage("Unlock success")
                setIsModalOpen(true)
            } else {
                if (response.errors?.score) {
                    const errorMessage = response.errors.score;
                    setModalMessage(`${errorMessage}`);
                } else if (response.errors?.target) {
                    // Show error and fetch hint details
                    const errorMessage = response.errors.target;
                    setModalMessage(errorMessage);
                    setIsModalOpen(true);
                } else {
                    // Default error message for other cases
                    setModalMessage("Failed to unlock hint. Try again.");
                }
            }
        } catch (error) {
            setModalMessage("An error occurred while processing your request.");
            console.error('Error in handleHintClick:', error);
        } finally {
            setIsModalOpen(true); // Ensure the modal opens
        }
    };

    useEffect(() => {
        fetchChallengeDetails();
    }, [id]);


    const fetchChallengeDetails = async () => {
        const api = new ApiHelper(BASE_URL);

        try {
            const detailsResponse = await api.get(`${GET_CHALLENGE_DETAILS}/${id}`);
            if (!detailsResponse.data) {
                console.error("No data returned from challenge details API.");
                return;
            }
            const data = detailsResponse.data;
            setChallenge(data);
            setIsSubmitted(data.solve_by_myteam);

            if (data.time_limit !== -1) {
                setTimeLimit(data.time_limit * 60 || null);
                setTimeRemaining(detailsResponse.time_remaining);

                if (detailsResponse.time_remaining > 0) {
                    setUrl(data.challenge_url || null);

                    setIsChallengeStarted(detailsResponse.is_started || false);
                    if (detailsResponse.is_started) {
                        setUrl(data.challenge_url || null)
                    }
                } else {
                    setUrl(null);
                    setIsChallengeStarted(false);
                }
            } else {
                setTimeLimit(null);
                setUrl(null);
                setIsChallengeStarted(false);
            }
            return detailsResponse.time_remaining;
        } catch (err) {
            console.error("Error fetching challenge details:", err.message || err);
        }
    };


    useEffect(() => {
        if (isChallengeStarted && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timerRef.current);
                        return 0;
                    }
                    return prevTime - 1; // Decrease time by 1 second
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current); // Cleanup on unmount
    }, [isChallengeStarted, timeRemaining]);

    // SHOW HINT DETAILS DAYYYYYYYYYYYYYYYYYYYY
    const handeHintDetailClick = async (hintId) => {
        const hintDetailsResponse = await FetchHintDetails(hintId);
        if (hintDetailsResponse?.data) {
            setModalMessage(
                `Hint: ${hintDetailsResponse.data.content || "Details not available"} `
            );
            setIsModalOpen(true)
        } else {
            setModalMessage("Unable to fetch hint details.");
            setIsModalOpen(true)
        }
    }

    // CLICK START BUTTON
    const handleStartChallenge = async () => {
        if (!challengeId) {
            setError("Invalid challenge ID");
            return;
        }

        const api = new ApiHelper(BASE_URL);
        const generatedToken = localStorage.getItem("accessToken");

        setIsStarting(true);
        try {
            const response = await api.post(API_CHALLEGE_START, {
                challenge_id: challengeId,
                generatedToken,
            });

            if (response.success) {
                try {
                    const timeRemaining = await fetchChallengeDetails();

                    setUrl(response.challenge_url || null);
                    setIsChallengeStarted(true);
                    setIsSubmitted(false);

                    if (timeRemaining !== null) {
                        setTimeRemaining(timeRemaining);
                    }

                    if (response.challenge_url) {
                        // setModalMessage(`Your connection info is: ${response.challenge_url}`);
                        // setIsModalOpen(true);
                        //SEND TO THE CONNECTION_URL, NHMA NO DANG BI DINH CA PATH (ex, /challenge)
                        const currentSchema = window.location.protocol;
                        const challengeUrl = `${currentSchema}//${response.challenge_url}`;
                        window.open(challengeUrl, "_blank");
                    }
                } catch (detailsError) {
                    console.error("Error updating challenge details:", detailsError);
                }
            } else {
                console.error("Failed to start challenge:", response.error || "Unknown error");
            }
        } catch (err) {
            console.error("Error starting challenge:", err.message || err);
        } finally {
            setIsStarting(false);
        }
    };

    const handleStopChallenge = async () => {
        const api = new ApiHelper(BASE_URL);
        try {
            const response = await api.postForm(API_CHALLENGE_STOP, {
                challenge_id: challengeId,
            });
            if (response.isSuccess) {
                setIsChallengeStarted(false);
                setTimeLeft(null);

                clearInterval(timerRef.current);
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
            } else if (response?.data.status === "ratelimited") {
                setModalMessage(response?.data.message)
            } else if (response?.status_code) {
                console.log('Hello')
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
        const hours = Math.floor(seconds / 3600);
        const remainingSecondsAfterHours = seconds % 3600;
        const minutes = Math.floor(remainingSecondsAfterHours / 60);
        const remainingSeconds = remainingSecondsAfterHours % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
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
                                    <h1 className="text-theme-color-neutral-content text-lg mb-6">
                                        Max attempts: {challenge.max_attempts} <br />
                                        Submission: {challenge.attemps} times <br />
                                        Type: {challenge.type}
                                        <br />
                                        <br />


                                    </h1>

                                    <div className="bg-neutral-low p-4 rounded-md">
                                        <div className="bg-white p-4 rounded-md overflow-y-auto max-h-96">
                                            <pre className="bg-white p-4 rounded-md whitespace-pre-wrap break-words">
                                                {challenge.description}
                                            </pre>
                                            {challenge.files && (
                                                <div>
                                                    <h3 className="text-xl font-semibold mb-4">Files:</h3>
                                                    <div className="flex flex-wrap gap-4">
                                                        {challenge.files.map((file, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() => handleDowloadFiles(file)}
                                                                className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            >
                                                                <FaDownload className="mr-2" />
                                                                {getFileName(file)}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {url && (
                                                <pre className="bg-white p-4 rounded-md whitespace-pre-wrap break-words">
                                                    Your connection info is: {url}
                                                </pre>
                                            )}

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
                                {!isChallengeStarted && (
                                    <span className="font-bold">{formatTime(timeLimit)}</span>
                                )}
                                {isChallengeStarted && (
                                    <span className='font-bold'>{formatTime(timeRemaining)}</span>
                                )}

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
                                    <div key={hint.id}>
                                        <button type="button" className="w-full h-16 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300  items-center justify-center font-medium text-theme-color-primary hover:bg-gray-5" onClick={() => handeHintDetailClick(hint.id)}>
                                            <div className="text-center">Hint</div>
                                            <div className="text-center">{hint.cost} Points</div>
                                        </button>
                                        <button
                                            onClick={() => handleUnlockHintClick(hint.id)}
                                            className="w-full h-16 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center font-medium text-theme-color-primary hover:bg-gray-50"
                                            type="button"
                                        >
                                            Unlock
                                        </button>
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
                                disabled={isSubmitted || (challenge?.require_deploy && !isChallengeStarted) || isTimeOut}
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
                            {challenge?.require_deploy && !isChallengeStarted && !isSubmitted && (
                                <button
                                    type="button"
                                    onClick={handleStartChallenge}
                                    disabled={isStarting} // Disable button while starting
                                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${isStarting
                                        ? "bg-gray-500 text-white cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700 text-white"
                                        }`}
                                >
                                    {isStarting ? "Starting..." : "Start Challenge"}
                                </button>
                            )}

                            {/* Display the Stop Challenge button if the challenge is started and require_deploy is true */}
                            {isChallengeStarted && challenge?.require_deploy && (
                                <button
                                    type="button"
                                    onClick={handleStopChallenge}
                                    className="w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Stop Challenge
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
