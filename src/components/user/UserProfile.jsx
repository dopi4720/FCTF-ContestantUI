import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { FaLock, FaTrophy, FaUsers, FaCalendarAlt, FaMedal, FaChartLine } from "react-icons/fa";

const UserProfile = () => {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const teamMembers = [
        { name: "John Doe", role: "Team Lead", email: "john@ctf.com", points: 2500 },
        { name: "Jane Smith", role: "Security Expert", email: "jane@ctf.com", points: 2100 },
        { name: "Mike Johnson", role: "Cryptographer", email: "mike@ctf.com", points: 1900 }
    ];

    const performanceData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Team Points",
                data: [1200, 1900, 2400, 2800, 3200, 3800],
                borderColor: "#ff6700",
                tension: 0.4
            }
        ]
    };

    const achievements = [
        { id: 1, title: "First Blood", description: "First to solve a challenge", type: "gold" },
        { id: 2, title: "Speed Demon", description: "Completed 5 challenges in 1 hour", type: "silver" },
        { id: 3, title: "Master Hacker", description: "Solved all web challenges", type: "bronze" }
    ];

    const recentChallenges = [
        { name: "Web Exploit 101", difficulty: "Easy", completed: true, progress: 100 },
        { name: "Binary Analysis", difficulty: "Hard", completed: false, progress: 75 },
        { name: "Cryptography Challenge", difficulty: "Medium", completed: true, progress: 100 }
    ];

    const upcomingEvents = [
        { name: "Global CTF 2024", date: "2024-03-15", location: "Online" },
        { name: "Security Summit CTF", date: "2024-04-01", location: "New York" }
    ];

    return (
        <div className="min-h-screen p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center">
                   <div>
                   <div className="flex items-center justify-center">
                        <div className="relative w-[125px] h-[125px] overflow-hidden rounded-full group ring-1 transition-all mb-3">
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcwhPhFEnyOzxoKysVzNiMn245tFGSEBFavA&s"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>

                    </div>
                    <div className="flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-xl font-bold">Khoa Điếu Cày</h2>
                            <p className="text-gray-600">Tên team</p>
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="flex items-center text-theme-color-primary hover:text-theme-color-primary-dark"
                            >
                                <div className="flex items-center space-x-1">
                                    <FaLock />
                                    <span className="">Change Password</span>
                                </div>
                            </button>
                        </div>
                    </div>
                   </div>
                </div>

                {/* Team Ranking Card */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Team Ranking</h2>
                        <FaTrophy className="text-yellow-500 text-2xl" />
                    </div>
                    <div className="text-5xl font-bold text-theme-color-primary mb-3">#3</div>
                    <p className="text-gray-600">Team points: </p>
                    <div className="mt-4 bg-gray-200 rounded-full h-2">
                        <div className="bg-theme-color-primary h-2 rounded-full w-3/4"></div>
                    </div>
                </div>

                {/* Performance Chart Card */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Team Performance</h2>
                    <Line data={performanceData} options={{ responsive: true }} />
                </div>

                {/* Team Members Table */}
                <div className="bg-white rounded-lg shadow p-6 col-span-full">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Team Members</h2>
                        <FaUsers className="text-theme-color-primary text-2xl" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border border-primary rounded-lg overflow-hidden divide-y divide-primary">
                            <thead>
                                <tr className="bg-primary text-white">
                                    <th className="p-4 text-left">Name</th>
                                    <th className="p-4 text-left">Role</th>
                                    <th className="p-4 text-left">Email</th>
                                    <th className="p-4 text-left">Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teamMembers.map((member, index) => (
                                    <tr key={index} className="border-t border-primary">
                                        <td className="p-4">{member.name}</td>
                                        <td className="p-4">{member.role}</td>
                                        <td className="p-4">{member.email}</td>
                                        <td className="p-4">{member.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Achievements Card */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Achievements</h2>
                    <div className="space-y-4">
                        {achievements.map((achievement) => (
                            <div key={achievement.id} className="flex items-center space-x-3">
                                <FaMedal className={`text-2xl ${achievement.type === "gold" ? "text-yellow-500" : achievement.type === "silver" ? "text-gray-400" : "text-yellow-700"}`} />
                                <div>
                                    <h3 className="font-semibold">{achievement.title}</h3>
                                    <p className="text-sm text-gray-600">{achievement.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Challenges Card */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Recent Challenges</h2>
                    <div className="space-y-4">
                        {recentChallenges.map((challenge, index) => (
                            <div key={index} className="border-b pb-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold">{challenge.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs ${challenge.difficulty === "Easy" ? "bg-green-100 text-green-800" : challenge.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                                        {challenge.difficulty}
                                    </span>
                                </div>
                                <div className="mt-2 bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${challenge.completed ? "bg-green-500" : "bg-theme-color-primary"}`}
                                        style={{ width: `${challenge.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events Card */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Upcoming Events</h2>
                        <FaCalendarAlt className="text-theme-color-primary text-2xl" />
                    </div>
                    <div className="space-y-4">
                        {upcomingEvents.map((event, index) => (
                            <div key={index} className="border-b pb-4">
                                <h3 className="font-semibold">{event.name}</h3>
                                <p className="text-sm text-gray-600">{event.date}</p>
                                <p className="text-sm text-gray-600">{event.location}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Change Password</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Old Password</label>
                                <input
                                    type="password"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-theme-color-primary focus:ring focus:ring-theme-color-primary focus:ring-opacity-50"
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <input
                                    type="password"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-theme-color-primary focus:ring focus:ring-theme-color-primary focus:ring-opacity-50"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-theme-color-primary focus:ring focus:ring-theme-color-primary focus:ring-opacity-50"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                    onClick={() => setShowPasswordModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-theme-color-primary text-white rounded-md hover:bg-theme-color-primary-dark"
                                    onClick={() => {
                                        // Handle password change logic here
                                        setShowPasswordModal(false);
                                    }}
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;