import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Routes>
      {/* 🏠 Default Route: Landing Page sabse pehle khulegi */}
      <Route path="/" element={<LandingPage />} />
      
      {/* 🔐 Login Route */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login />} /> 
      {/* 📊 Dashboard Route */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;