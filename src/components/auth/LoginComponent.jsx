import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { BASE_URL, LOGIN_PATH } from "../../constants/ApiConstant";
import { ACCESS_TOKEN_KEY } from "../../constants/LocalStorageKey";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [errors, setErrors] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!username) {
      return "Username is required";
    }
    if (!usernameRegex.test(username)) {
      return "Username should not contain special characters";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === "username") {
      setErrors((prev) => ({
        ...prev,
        username: validateUsername(value)
      }));
    } else if (name === "password") {
      setErrors((prev) => ({
        ...prev
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      setErrors({
        username: usernameError
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(BASE_URL + LOGIN_PATH, formData);
      
      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN_KEY, response.data.generatedToken);
        console.log("Login successful");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Login Into F-CTF System
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.username ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              aria-invalid={errors.username ? "true" : "false"}
              aria-describedby="username-error"
              autoComplete="username"
            />
            {errors.username && (
              <p
                className="mt-2 text-sm text-red-600"
                id="username-error"
                role="alert"
              >
                {errors.username}
              </p>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby="password-error"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p
                className="mt-2 text-sm text-red-600"
                id="password-error"
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Loading...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;