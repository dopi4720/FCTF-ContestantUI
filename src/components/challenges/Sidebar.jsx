import { useState, useEffect, useRef } from "react";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { LuComputer } from "react-icons/lu";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [topics, setTopics] = useState([
        { id: 1, name: "Technology" },
        { id: 2, name: "Science" },
        { id: 3, name: "Business" },
        { id: 4, name: "Health" },
        { id: 5, name: "Education" },
        { id: 6, name: "Entertainment" },
        { id: 7, name: "Sports" },
        { id: 8, name: "Politics" },
    ]);
    const [filteredTopics, setFilteredTopics] = useState(topics);
    const searchTimeout = useRef(null);

    const handleSearch = (value) => {
        setSearchQuery(value);
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            const filtered = topics.filter((topic) =>
                topic.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredTopics(filtered);
            // API call can be made here after the delay
            console.log("Making API call with query:", value);
        }, 1000);
    };

    const handleTopicClick = (topic) => {
        console.log("Selected topic:", topic.name);
    };

    useEffect(() => {
        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            //CALL API TO GET TOPIC HERE
        }
    }, [isOpen]);

    return (
        <div className="relative">
            <div
                className={`fixed top-[64px] left-0 h-[calc(100vh-60px)] bg-white shadow-lg transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 w-64 z-40  border-t border-gray-200`}
            >
                <div className="p-4 overflow-y-auto h-full">
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Search topics..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full px-4 py-2 rounded-md border border-theme-color-base bg-white focus:outline-none focus:border-theme-color-primary focus:ring-1 focus:ring-theme-color-primary"
                        />
                        <FiSearch className="absolute right-3 top-2.5 text-gray-400" size={20} />
                    </div>

                    <div className="space-y-2">
                        {filteredTopics.map((topic) => (
                            <button
                                key={topic.id}
                                onClick={() => handleTopicClick(topic)}
                                className="w-full px-4 py-3 rounded-md flex items-center space-x-3 hover:bg-theme-color-base transition-colors duration-200 text-left"
                            >
                                <LuComputer />
                                <span className="text-theme-color-neutral-content font-medium">
                                    {topic.name}
                                </span>
                            </button>
                        ))}
                        {filteredTopics.length === 0 && (
                            <div className="text-center py-4 text-theme-color-neutral">
                                No topics found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;