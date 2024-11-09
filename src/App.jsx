import { useState } from 'react'
import './App.css'
import Template from './components/Template'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChallengeTopics from './components/challenges/ChallengeTopics';
import ChallengeDetail from './components/challenges/ChallengeDetail';
import ChallengeList from './components/challenges/ChallengeList';
import LoginComponent from './components/auth/LoginComponent';
import Sidebar from './components/challenges/Sidebar';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Template />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/rankings" element={<Template />} />
        <Route path="/tickets" element={<Template />} />
        <Route path="/topics" element={
          <Template>
            <ChallengeTopics />
          </Template>} />
        <Route path="/challenge/:id" element={<Template><ChallengeDetail /></Template>} />
        <Route path="/topic/:categoryName" element={<Template><ChallengeList /></Template>} />
      </Routes>
    </Router>
  )
}

export default App
