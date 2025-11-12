import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage'
import Contact from './Pages/Contact'
import AboutSectionn from './Pages/About'
import PortfolioWrapper from './Pages/PortfolioWrapper'
import BlogPlatform from './Pages/Blog/Blog'
import LoginPage from './Pages/Blog/Login'
import SignupPage from './Pages/Blog/signup'
import Profile from './Pages/Blog/Profile'
import Create from './Pages/Blog/Create'
import Explore from './Pages/Blog/Explore'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutSectionn />} />
        <Route path="/portfolio" element={<PortfolioWrapper />} />
        <Route path="/blog" element={<BlogPlatform />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/:username/dashboard" element={<Profile />} />
        <Route path="/dashboard" element={<Profile />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </div>
  )
}

export default App