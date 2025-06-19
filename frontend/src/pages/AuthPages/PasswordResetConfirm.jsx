import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import background from '../../assets/images/signup-back-image.jpeg';
import logo from '../../assets/icons/logo.png';
import api from '../../services/api';

const PasswordResetConfirm = () => {
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await api.post('auth/password-reset-confirm/', {
        uid,
        token,
        new_password: newPassword,
        new_password2: newPassword2,
      });
      setMessage(res.data.detail || 'Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(
        err.response?.data?.new_password ||
        err.response?.data?.token ||
        err.response?.data?.uid ||
        err.response?.data?.detail ||
        'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-dark900">
      <section
        className="relative flex items-center justify-center w-full min-h-screen px-2 py-6 md:py-12 sm:px-4"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-dark900/60 backdrop-blur-[2px]"></div>
        <div className="relative z-10 w-full max-w-md p-8 rounded-lg bg-white/10 backdrop-blur-sm">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="logo" className="w-16 h-16" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-center text-electric">Set New Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="newPassword" className="block text-white">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-dark900/80 text-white border border-electric focus:outline-none focus:ring-2 focus:ring-electric"
            />
            <label htmlFor="newPassword2" className="block text-white">Confirm New Password</label>
            <input
              type="password"
              id="newPassword2"
              value={newPassword2}
              onChange={e => setNewPassword2(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-dark900/80 text-white border border-electric focus:outline-none focus:ring-2 focus:ring-electric"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 mt-2 font-semibold text-white rounded bg-electric hover:bg-electric/80 transition"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            {message && <div className="p-2 mt-2 text-center text-green-500 bg-green-100 rounded">{message}</div>}
            {error && <div className="p-2 mt-2 text-center text-red-500 bg-red-100 rounded">{error}</div>}
          </form>
        </div>
      </section>
    </main>
  );
};

export default PasswordResetConfirm; 