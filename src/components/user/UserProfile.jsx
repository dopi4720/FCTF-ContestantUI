import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { useParams } from "react-router-dom";
import ApiHelper from "../../utils/ApiHelper";
import { BASE_URL, API_USER_PROFILE } from "../../constants/ApiConstant";



const UserProfile = () => {
    const id = useParams().id;
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        team: "",
        currentPassword: "",
        newPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    // Add useEffect get data from API
    useEffect(() => {
        const fetchUserData = async () => {
            const api = new ApiHelper(BASE_URL);
            try {
                const response = await api.getbyAuth(API_USER_PROFILE);
                const data = response.data;
                setFormData((prev) => ({
                    ...prev,
                    username: data.username,
                    email: data.email,
                    team: data.team
                }));
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Only update fields that are not read-only
        if (name !== "username" && name !== "email" && name !== "team") {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));

            // Real-time validation
            const newErrors = { ...errors };
            if (name === "newPassword") {
                if (!validatePassword(value)) {
                    newErrors.newPassword = "Password must contain at least 8 characters, including letters, numbers, and special characters";
                } else {
                    delete newErrors.newPassword;
                }
            }
            setErrors(newErrors);
        }
    };

    // Effect to auto-clear notifications after 5 seconds
    useEffect(() => {
        if (notification.message) {
            const timer = setTimeout(() => {
                setNotification({ message: '', type: '' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const api = new ApiHelper(BASE_URL);
        try {
            const data = {
                "password": formData.newPassword,
                "confirm": formData.currentPassword,
            }
            const response = await api.patch(API_USER_PROFILE, data);
            if (response.success) {
                setNotification({ message: response.message, type: 'success' });
            } else {
                setNotification({ message: response.message, type: 'error' });
            }

        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-2 sm:px-2 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
                {notification.message && (
                    <div
                        className={`p-4 mb-4 text-sm rounded-lg ${notification.type === 'success'
                            ? 'text-green-700 bg-green-100 border border-green-400'
                            : 'text-red-700 bg-red-100 border border-red-400'
                            }`}
                        role="alert"
                    >
                        {notification.message}
                    </div>
                )}
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">User Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
                            aria-label="Username"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
                            aria-label="Email"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="team" className="block text-sm font-medium text-gray-700">
                            Team
                        </label>
                        <input
                            type="text"
                            id="team"
                            name="team"
                            value={formData.team}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
                            aria-label="Team"
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                            Current Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                id="currentPassword"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                                aria-label="Current Password"
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                            >
                                {showCurrentPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                aria-label="New Password"
                                autoComplete="new-password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                aria-label={showNewPassword ? "Hide password" : "Show password"}
                            >
                                {showNewPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-600" role="alert">
                                {errors.newPassword}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || Object.keys(errors).length > 0}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600"
                        aria-label="Update Profile"
                    >
                        {loading ? (
                            <FaSpinner className="animate-spin h-5 w-5" />
                        ) : (
                            "Update Profile"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;