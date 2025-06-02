import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import User from '../Model/User';
import AuthService from '../Service/AuthService';
import genusLogo from './genus-power-logo.png';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Both fields are required.');
      return;
    }
    localStorage.setItem('userEmail', email);
    await fetchLoginData();
  };

  const fetchLoginData = async () => {
    try {
      setLoading(true);
      const loginRequest = new User(email, password);
      const loginSuccess = await AuthService.login(loginRequest);

      if (loginSuccess.success) {
        const result = loginSuccess?.data;
        localStorage.setItem('Token', result.token);
        localStorage.setItem('email', result.workEmail);
        localStorage.setItem('UserCode', result.employeeCode);
        localStorage.setItem('PlantCode', result.locationName);
        localStorage.setItem('UserName', result.employeeName.split(' ')[0]);

        // 🚀 Fetch Plants and Projects (you must implement this API in your AuthService)
        const response = await AuthService.getPlantsAndProjects(result.employeeCode); // 🔧
        if (response.success) {
          localStorage.setItem('PlantList', JSON.stringify(response.data.plants || []));
          localStorage.setItem('ProjectList', JSON.stringify(response.data.projects || []));
        }

        navigate('/home');
      } else {
        setLoading(false);
        setError("Invalid employee code or password.");
        alert("Invalid User or Password.");
      }
    } catch (err) {
      setError(err);
      navigate('/login');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="wrapper">
      <form className="form-signin" onSubmit={handleSubmit}>
        <div className="logo-container">
          <img src={genusLogo} alt="Genus Power Logo" className="genus-logo" />
        </div>
        <h2>JHALAK APPLICATION</h2>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="input-icon">
          <i className="fas fa-user input-left"></i>
          <input
            type="text"
            name="username"
            required
            id="txtusrnme"
            placeholder="User Name"
            style={{ letterSpacing: '0.5px' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-icon">
          <i className="fas fa-lock input-left"></i>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            id="txtpasswrd"
            maxLength="20"
            placeholder="Password"
            style={{ letterSpacing: '0.5px' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i
            className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
            id="togglePassword"
            onClick={togglePasswordVisibility}
          ></i>
        </div>

        <button type="submit" id="btnlogin">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
