import { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import LoginComponent from './components/auth/LoginComponent';
import ChallengeDetail from './components/challenges/ChallengeDetail';
import ChallengeList from './components/challenges/ChallengeList';
import ChallengeTopics from './components/challenges/ChallengeTopics';
import Template from './components/Template';

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
