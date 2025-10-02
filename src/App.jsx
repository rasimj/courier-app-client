import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx';
import './App.css'; 

function App() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="App">
      <header className="App-header">
  
        <Link to="/">
          <img src="/images/logo.png" alt="Professional Couriers Logo" className="header-logo" />
        </Link>
        
        <nav>
          {token && (
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          )}
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/" 
            element={token ? <HomePage /> : <Navigate to="/login" />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;