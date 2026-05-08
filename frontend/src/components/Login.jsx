import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
function Login() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password
      });

      if (response.data.success) {
        localStorage.setItem('isLoggedIn', 'true');
localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
         const response = await axios.post(`${API_URL}/signup`, {
        username,
        email,
        password
      });

      if (response.data.success) {
        setSuccess('Account created successfully! Please login.');
        // Clear form
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        // Switch to login after 2 seconds
        setTimeout(() => {
          setIsLogin(true);
          setSuccess('');
        }, 2000);
      }
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f9fafb' }}>
      <style>{`
        .brand-color {
          color: #1F6F5F !important;
        }
        .brand-bg {
          background-color: #1F6F5F !important;
          border-color: #1F6F5F !important;
        }
        .brand-bg:hover {
          background-color: #195f51 !important;
          border-color: #195f51 !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -8px rgba(31, 111, 95, 0.4);
        }
        .brand-border {
          border-color: #1F6F5F !important;
        }
        .brand-border:focus {
          border-color: #1F6F5F !important;
          box-shadow: 0 0 0 0.2rem rgba(31, 111, 95, 0.25);
        }
        .btn-outline-brand {
          border: 2px solid #1F6F5F;
          background: transparent;
          color: #1F6F5F;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .btn-outline-brand:hover {
          background-color: #1F6F5F;
          color: white;
          transform: translateY(-2px);
        }
        .card-shadow {
          box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        .card-shadow:hover {
          transform: translateY(-5px);
        }
        .toggle-btn-active {
          background-color: #1F6F5F !important;
          color: white !important;
          border-color: #1F6F5F !important;
        }
        .toggle-btn-inactive {
          background-color: white !important;
          color: #1F6F5F !important;
          border-color: #1F6F5F !important;
        }
      `}</style>

      <div className="card shadow-lg border-0 card-shadow" style={{ width: '427px', borderRadius: '24px' }}>
        <div className="card-body p-4">
          {/* Back to Home Button */}
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-link text-decoration-none mb-4 p-0 d-flex align-items-center gap-1"
            style={{ color: '#1F6F5F' }}
          >
            <i className="bi bi-arrow-left"></i> Back to Home
          </button>

          {/* Logo/Icon */}
          <div className="text-center mb-4">
            <div className="bg-brand-soft rounded-circle d-inline-flex p-3 mb-3" style={{ backgroundColor: 'rgba(31, 111, 95, 0.1)' }}>
              <i className="bi bi-box-seam" style={{ color: '#1F6F5F', fontSize: '2.5rem' }}></i>
            </div>
            <h2 className="mt-2 fw-bold" style={{ color: '#1F6F5F' }}>StockMaster</h2>
            <p className="text-muted">Inventory Management System</p>
          </div>

          {/* Toggle Buttons */}
          <div className="d-flex gap-2 mb-4">
            <button
              type="button"
              className={`btn w-50 py-2 rounded-pill fw-semibold ${isLogin ? 'toggle-btn-active' : 'btn-outline-brand'}`}
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
              }}
              style={isLogin ? { backgroundColor: '#1F6F5F', color: 'white', border: 'none' } : {}}
            >
              <i className="bi bi-box-arrow-in-right me-1"></i> Login
            </button>
            <button
              type="button"
              className={`btn w-50 py-2 rounded-pill fw-semibold ${!isLogin ? 'toggle-btn-active' : 'btn-outline-brand'}`}
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
              style={!isLogin ? { backgroundColor: '#1F6F5F', color: 'white', border: 'none' } : {}}
            >
              <i className="bi bi-person-plus me-1"></i> Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert" style={{ borderRadius: '12px' }}>
              <i className="bi bi-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="alert alert-success d-flex align-items-center gap-2 py-2" role="alert" style={{ borderRadius: '12px' }}>
              <i className="bi bi-check-circle"></i>
              <span>{success}</span>
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: '#2d3748' }}>
                  <i className="bi bi-person me-1" style={{ color: '#1F6F5F' }}></i> Username
                </label>
                <input
                  type="text"
                  className="form-control py-2 brand-border"
                  style={{ borderRadius: '12px', borderColor: '#e2e8f0' }}
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ color: '#2d3748' }}>
                  <i className="bi bi-lock me-1" style={{ color: '#1F6F5F' }}></i> Password
                </label>
                <input
                  type="password"
                  className="form-control py-2 brand-border"
                  style={{ borderRadius: '12px', borderColor: '#e2e8f0' }}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn w-100 py-2 fw-semibold brand-bg"
                style={{ backgroundColor: '#1F6F5F', color: 'white', borderRadius: '12px', border: 'none' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i> Login
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Signup Form */
            <form onSubmit={handleSignup}>
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: '#2d3748' }}>
                  <i className="bi bi-person me-1" style={{ color: '#1F6F5F' }}></i> Username
                </label>
                <input
                  type="text"
                  className="form-control py-2 brand-border"
                  style={{ borderRadius: '12px', borderColor: '#e2e8f0' }}
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: '#2d3748' }}>
                  <i className="bi bi-envelope me-1" style={{ color: '#1F6F5F' }}></i> Email Address
                </label>
                <input
                  type="email"
                  className="form-control py-2 brand-border"
                  style={{ borderRadius: '12px', borderColor: '#e2e8f0' }}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: '#2d3748' }}>
                  <i className="bi bi-lock me-1" style={{ color: '#1F6F5F' }}></i> Password
                </label>
                <input
                  type="password"
                  className="form-control py-2 brand-border"
                  style={{ borderRadius: '12px', borderColor: '#e2e8f0' }}
                  placeholder="Create a password (min 4 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ color: '#2d3748' }}>
                  <i className="bi bi-shield-lock me-1" style={{ color: '#1F6F5F' }}></i> Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control py-2 brand-border"
                  style={{ borderRadius: '12px', borderColor: '#e2e8f0' }}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn w-100 py-2 fw-semibold brand-bg"
                style={{ backgroundColor: '#1F6F5F', color: 'white', borderRadius: '12px', border: 'none' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus me-2"></i> Create Account
                  </>
                )}
              </button>
            </form>
          )}

          
         
        </div>
      </div>
    </div>
  );
}

export default Login;