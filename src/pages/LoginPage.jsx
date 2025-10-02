import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Auth.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/'; 
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
      
        <h2 >Sign In</h2>
        {error && <p className="error-message">{error}</p>}
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Username" 
          required 
        />
        <input 
          type={showPassword ? 'text' : 'password'} 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        />
        <div className="show-password-container">
          <input 
            id="showPassword"
            type="checkbox" 
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)} 
          />
          <label htmlFor="showPassword">Show Password</label>
        </div>
        <button type="submit">Login</button>
        <p>Don't have an account? <Link to="/register">Create one</Link></p>
      </form>
    </div>
  );
}