import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // --- 1. Add state for showing the password ---
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('https://courier-app-server.onrender.com/api/auth/register', { username, password });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <img src="/images/logo.png" alt="Logo" className="auth-logo" />
        <h2>Create Your Account</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Username" 
          required 
        />
        <input 
          // --- 2. Make the input type dynamic ---
          type={showPassword ? 'text' : 'password'} 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        />
        
        {/* --- 3. Add the checkbox and label --- */}
        <div className="show-password-container">
          <input 
            id="showPasswordRegister"
            type="checkbox" 
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)} 
          />
          <label htmlFor="showPasswordRegister">Show Password</label>
        </div>

        <button type="submit">Register</button>
        <p>Already have an account? <Link to="/login">Sign In</Link></p>
      </form>
    </div>
  );
}