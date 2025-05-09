import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Movies from './pages/movies';
import MovieData from './pages/MovieData';
import LogInSignUp from './pages/LogInSignUp';
import People from './pages/People';
import Nav from './components/navbar';
import Footer from './components/Footer';
import { AuthProvider } from "./context/AuthContext";



function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App"> 
          <Nav />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies/search" element={<Movies />} />
            <Route path="/movies/data" element={<MovieData />} />
            <Route path="/people" element={<People />} />
            <Route path="/auth" element={<LogInSignUp />} />
          </Routes>

          <Footer />
        </div>
      </AuthProvider>

    </BrowserRouter>
    

  )
}

export default App
