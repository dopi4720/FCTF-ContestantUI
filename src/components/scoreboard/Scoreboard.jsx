import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { FaTrophy } from "react-icons/fa";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Scoreboard = () => {
    const [scores, setScores] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedTeam, setSelectedTeam] = useState(null);

    const sampleData = [
        { id: 1, teamName: "Dragons", score: 85, history: [30, 45, 60, 75, 85] },
        { id: 2, teamName: "Phoenix", score: 92, history: [40, 55, 70, 85, 92] },
        { id: 3, teamName: "Tigers", score: 78, history: [25, 40, 55, 65, 78] },
        { id: 4, teamName: "Lions", score: 88, history: [35, 50, 65, 80, 88] },
        { id: 5, teamName: "Eagles", score: 95, history: [45, 60, 75, 90, 95] }
    ];

    useEffect(() => {
        const fetchScores = async () => {
            try {
                // Simulating API call
                setTimeout(() => {
                    setScores(sampleData);
                    setLoading(false);
                }, 1000);
            } catch (err) {
                setError("Failed to fetch scoreboard data. Please try again later.");
                setLoading(false);
            }
        };

        fetchScores();
    }, []);

    const highestScore = Math.max(...scores.map(team => team.score));

    const chartData = {
        labels: ["Round 1", "Round 2", "Round 3", "Round 4", "Round 5"],
        datasets: scores.map((team) => ({
            label: team.teamName,
            data: team.history,
            borderColor: `hsl(${team.id * 60}, 70%, 50%)`,
            backgroundColor: `hsla(${team.id * 60}, 70%, 50%, 0.1)`,
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            hidden: selectedTeam !== null && selectedTeam !== team.id
        }))
    };

    const chartOptions = {
        responsive: true,
        interaction: {
            mode: "index",
            intersect: false
        },
        plugins: {
            legend: {
                position: "top",
                labels: {
                    font: {
                        family: "Roboto",
                        size: 12
                    }
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                padding: 12,
                titleFont: {
                    family: "Roboto",
                    size: 14
                },
                bodyFont: {
                    family: "Roboto",
                    size: 12
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(0, 0, 0, 0.1)"
                }
            },
            x: {
                grid: {
                    color: "rgba(0, 0, 0, 0.1)"
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] bg-white rounded-lg shadow-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-theme-color-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg" role="alert">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-8xl mx-auto p-4 space-y-8">
            <div className="grid md:grid-cols-[2fr_5fr] gap-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Team Scores</h2>
                    <div className="space-y-2">
                        {scores.map((team) => (
                            <div
                                key={team.id}
                                className={`p-4 rounded-lg transition-all duration-300 ${selectedTeam === team.id
                                    ? "bg-theme-color-primary bg-opacity-10"
                                    : "bg-gray-50 hover:bg-gray-100"
                                    }`}
                                onMouseEnter={() => setSelectedTeam(team.id)}
                                onMouseLeave={() => setSelectedTeam(null)}
                                role="listitem"
                                aria-label={`${team.teamName} score: ${team.score}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-gray-600 font-medium">{team.id}.</span>
                                        <span className="font-semibold text-gray-800">
                                            {team.teamName}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-bold text-gray-800">{team.score}</span>
                                        {team.score === highestScore && (
                                            <FaTrophy className="text-yellow-500 animate-pulse" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Score Progress</h2>
                    <div className="flex items-center justify-center">
                        <div className="relative">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 col-span-full">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Score Progress</h2>
                    <div className="relative flex items-center justify-center">
                        <Line className="max-h-[550px]" data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scoreboard;