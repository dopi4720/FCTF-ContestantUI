import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginForm from './components/auth/LoginComponent'
import ChallengeCategories from './components/challenges/ChallengeCategories'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChallengeList from './components/challenges/ChallengeList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChallengeCategories />} />
        <Route path="/challenge/:id" element={<></>} />
        <Route path="/category/:categoryName" element={<ChallengeList/>} />
      </Routes>
    </Router>
  )
}

export default App
