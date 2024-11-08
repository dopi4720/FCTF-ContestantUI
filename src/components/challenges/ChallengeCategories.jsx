import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { BASE_URL, GET_CHALLENGE_CATEGORIES_PATH } from "../../constants/ApiConstant";
import ApiHelper from "../../utils/ApiHelper";

const ChallengeCategories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const api = new ApiHelper(BASE_URL);
      try {
        const response = await api.get(GET_CHALLENGE_CATEGORIES_PATH);
        setCategories(response.data);
        setError(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories(fallbackCategories);
        setError(true);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
        {categories.map((category) => (
          <Link
            to={`/category/${category.topic_name}`}
            key={category.topic_name}
            className="bg-white w-full max-w-sm rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out p-6 cursor-pointer"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <h3 className="text-xl font-bold text-theme-color-primary-content">
                {category.topic_name}
              </h3>
              <p className="text-theme-color-neutral">
                {category.challenge_count} Challenges
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

export default ChallengeCategories;