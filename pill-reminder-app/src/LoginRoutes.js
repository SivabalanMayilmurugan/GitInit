import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import Dashboard from './Dashboard';


// 🏠 Home Page
function Home() {
  return (
    <div 
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: '#E8F7FF',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' 
          xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23E8F7FF'/%3E
          %3Cpath d='M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z' 
          fill='%23BBE3FA' fill-opacity='0.6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6} lg={4}>
            <div className="p-4 rounded shadow bg-white">
              <div className="text-center mb-4">
                <h2 className="fw-bold">DoseMate</h2>
                <p className="mb-0">
                  Welcome to DoseMate! We’re here to help you stay on track with your medications.
                </p>
              </div>
              <div className="d-flex flex-column align-items-center">
                <Link to="/login" className="w-100 text-decoration-none">
                  <Button variant="primary" className="mb-3 w-100" style={{ borderRadius: '30px' }}>
                    Login 💊
                  </Button>
                </Link>
                <Link to="/signup" className="w-100 text-decoration-none">
                  <Button variant="outline-primary" className="w-100" style={{ borderRadius: '30px' }}>
                    Sign Up 💊
                  </Button>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

// 🔐 Login Page
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8090/api/v1/user/login', { email, password });
  
      if (res.status === 200 && res.data === "Login successful") {
        localStorage.setItem('userName', email.split('@')[0]);
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data || 'Login failed. Please try again.');
    }
  };
  

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <Col xs={12} md={6} lg={4}>
        <div className="p-4 rounded shadow bg-white">
          <h3 className="text-center mb-4">Login</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate('/')}>Back</Button>
              <Button type="submit" variant="primary">Login</Button>
            </div>
          </Form>
        </div>
      </Col>
    </Container>
  );
}

// 📝 Signup Page
function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ user_name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match!');
    }
    try {
      const res = await axios.post('http://localhost:8090/api/v1/user/save', {
        userName: formData.user_name,
        email: formData.email,
        password: formData.password
      });
      if (res.status === 200) {
        setSuccess('User registered successfully!');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setError('Signup failed. Try again.');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <Col xs={12} md={6} lg={4}>
        <div className="p-4 rounded shadow bg-white">
          <h3 className="text-center mb-4">Sign Up</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSignup}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={formData.user_name}
                onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                placeholder="Enter username"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm password"
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate('/')}>Back</Button>
              <Button type="submit" variant="primary">Sign Up</Button>
            </div>
          </Form>
        </div>
      </Col>
    </Container>
  );
}

// 📊 Dashboard Page

// 🌐 Routes
export default function LoginRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Add your Dashboard page route later here */}
      </Routes>
    </Router>
  );
}
