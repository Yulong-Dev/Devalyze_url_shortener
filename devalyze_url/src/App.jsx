import React from "react";
import Hero from "./components/Hero";
import More from "./components/More";
import FaqSection from "./components/FaqSection";
import Footer from "./components/Footer";
import "./index.css";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Sign from './pages/SignIn';
import Create from './pages/SignUp';


function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/SignIn' element={<Sign/>} />
          <Route path='/SignUp' element={<Create />} />
        </Routes>
    </Router>
  
  );
}

export default App;


