import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { GiFarmTractor } from 'react-icons/gi';
import { MdLock, MdPerson, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import './LoginPage.css';

export default function LoginPage() {
  const [form, setForm]         = useState({ username: '', password: '' });
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) { toast.error('All fields are required'); return; }
    setLoading(true);
    try {
      const data = await authService.login(form);
      login(data.token, { username: data.username, role: data.role });
      toast.success(`Welcome back, ${data.username}!`);
      navigate('/dashboard');
    } catch {
      // error handled in interceptor
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    setForm({ username: role === 'admin' ? 'admin' : 'user',
              password: role === 'admin' ? 'admin123' : 'user123' });
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-card fade-in">
        <div className="login-brand">
          <GiFarmTractor size={40} />
          <h1>FarmCrop <span>Manager</span></h1>
        </div>
        <p className="login-sub">Sign in to manage your farm operations</p>

        <div className="login-demo">
          <span>Quick demo:</span>
          <button type="button" onClick={() => fillDemo('admin')}>Admin</button>
          <button type="button" onClick={() => fillDemo('user')}>User</button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <MdPerson className="login-field__icon" />
            <input
              name="username" type="text" placeholder="Username"
              value={form.username} onChange={handleChange} autoFocus
            />
          </div>
          <div className="login-field">
            <MdLock className="login-field__icon" />
            <input
              name="password" type={showPwd ? 'text' : 'password'}
              placeholder="Password" value={form.password} onChange={handleChange}
            />
            <button type="button" className="login-field__toggle" onClick={() => setShowPwd(v => !v)}>
              {showPwd ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>
          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? <span className="login-spinner" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
