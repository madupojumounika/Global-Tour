import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Explore from './Explore';

function App() {
  return (
    <Router>
      {/* Navbar */}
      <nav className="bg-slate-900 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="text-white font-black text-xl">GLOBAL<span className="text-blue-500">TOUR</span></div>
        <div className="flex gap-6">
          <Link to="/" className="text-slate-200 hover:text-blue-500">Home</Link>
          <Link to="/explore" className="text-slate-200 hover:text-blue-500">Explore</Link>
          <Link to="/itinerary" className="text-slate-200 hover:text-blue-500">Itinerary</Link>
          <button className="bg-blue-500 text-white px-5 py-2 rounded-xl shadow-lg hover:shadow-blue-400/50">
            PLAN TRIP
          </button>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </Router>
  );
}

export default App;
