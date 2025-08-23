import React, { useState } from 'react';
import axios from 'axios';
import './login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    propertyUsername: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      const response = await axios.post(`${backendUrl}/api/properties/login`, {
        username: formData.propertyUsername,
        password: formData.password
      });

      const data = response.data;

      // Store the token in localStorage
      localStorage.setItem('propertyToken', data.token);
      localStorage.setItem('propertyData', JSON.stringify(data.property));
      
      console.log('Login successful:', data);
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
      
    } catch (err) {
      console.log('Login error:', err);
      
      if (err.response) {
        // Server responded with error status
        setError(err.response.data.error || 'Login failed. Please try again.');
      } else if (err.request) {
        // Request was made but no response received
        setError('Network error. Please check your connection and try again.');
      } else {
        // Something else happened
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-page-background">
        <div className="login-page-pattern"></div>
      </div>
      
      <div className="login-page-card">
        <div className="login-page-header">
          <div className="login-page-logo-container">
            <div className="login-page-logo-icon">🏡</div>
            <h1 className="login-page-logo-text">Huts & Farms</h1>
          </div>
          <p className="login-page-subtitle">Property Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="login-page-form">
          {error && (
            <div className="login-page-error">
              {error}
            </div>
          )}

          <div className="login-page-form-group">
            <label htmlFor="propertyUsername" className="login-page-form-label">
              Property Username
            </label>
            <div className="login-page-input-container">
              <input
                type="text"
                id="propertyUsername"
                name="propertyUsername"
                value={formData.propertyUsername}
                onChange={handleInputChange}
                className="login-page-form-input"
                placeholder="Enter your property username"
                required
              />
              <div className="login-page-input-icon">🏠</div>
            </div>
          </div>

          <div className="login-page-form-group">
            <label htmlFor="password" className="login-page-form-label">
              Password
            </label>
            <div className="login-page-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="login-page-form-input"
                placeholder="Enter your password"
                required
              />
              <div className="login-page-input-icon">🔒</div>
              <button
                type="button"
                className="login-page-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`login-page-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="login-page-loading-spinner">
                <div className="login-page-spinner"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 