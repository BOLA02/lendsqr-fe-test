import { useState } from 'react';

import LoginLogo  from "../assets/logo-login.png";
import LoginUi from "../assets/login-ui.png";

import '../styles/Login.scss';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submitted:', { email, password });
    
    // Set authentication in localStorage
    localStorage.setItem('isAuthenticated', 'true');
    
    // Call the onLogin callback
    onLogin();
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="logo">
          <img src={LoginLogo} alt="logo" />
        </div>
        
        <div className="illustration">
          <img src={LoginUi} alt="" />
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-wrapper">
          <h1 className="welcome-title">Welcome!</h1>
          <p className="welcome-subtitle">Enter details to login.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <a href="#" className="forgot-password">
              FORGOT PASSWORD?
            </a>

            <button type="submit" className="login-button">
              LOG IN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;