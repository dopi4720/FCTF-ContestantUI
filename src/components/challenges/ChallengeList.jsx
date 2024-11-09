import { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import { BASE_URL, GET_CHALLENGE_LIST_PATH } from "../../constants/ApiConstant";
import ApiHelper from "../../utils/ApiHelper";

const ChallengeList = () => {
  const { categoryName } = useParams(); // Lấy `abcxyz` từ URL, đặt tên là `category`
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      const api = new ApiHelper(BASE_URL);
      try {
        const response = await api.get(GET_CHALLENGE_LIST_PATH + encodeURIComponent(categoryName));
        setChallenges(response.data);
        setError(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(true);
      }
    };

    fetchChallenge();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-center mb-4 text-[#f17226]" role="heading">
        Topic: {categoryName}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
        {challenges.map((challenge) => (
          <Link
            to={`/challenge/${challenge.id}`}
            key={challenge.id}
            className="bg-white w-full max-w-sm rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out p-6 cursor-pointer"
          >
            <div className="flex flex-col text-center space-y-3">
              <h3 className="text-xl font-bold text-theme-color-primary-content">
                {challenge.name}
              </h3>
              <p className="text-theme-color-neutral text-left">
                <b>Limit Time:</b>   {challenge.time_limit ? challenge.time_limit + " minutes" : "None"}
              </p>
              <p className="text-theme-color-neutral text-left">
                <b>Max attempts:</b>   {challenge.max_attempts}
              </p>
              <p className="text-theme-color-neutral text-left">
                <b>Points:</b>  {challenge.value}
              </p>
            </div>
          </Link>
        ))}
      </div>
      {error && (
        <div className="mt-4 text-center text-theme-color-neutral-dark">
          Unable to fetch categories. Showing sample data.
        </div>
      )}
    </div>
  );
};

export default ChallengeList;