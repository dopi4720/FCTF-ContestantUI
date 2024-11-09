import { useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import ChallengeCategories from './components/challenges/ChallengeCategories'
import ChallengeDetail from './components/challenges/ChallengeDetail'
import ChallengeList from './components/challenges/ChallengeList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChallengeCategories />} />
        <Route path="/challenge/:id" element={<ChallengeDetail></ChallengeDetail>} />
        <Route path="/category/:categoryName" element={<ChallengeList/>} />
      </Routes>
    </Router>
  )
}

export default App
