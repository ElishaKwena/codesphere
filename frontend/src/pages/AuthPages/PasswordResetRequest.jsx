import React, { useState } from 'react';
import background from '../../assets/images/signup-back-image.jpeg';
import logo from '../../assets/icons/logo.png';
import api from '../../services/api';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await api.post('auth/password-reset/', { email });
      setMessage(res.data.detail || 'Check your email for a password reset link.');
    } catch (err) {
      setError(
        err.response?.data?.email ||
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
          <h2 className="mb-4 text-2xl font-bold text-center text-electric">Reset Your Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="email" className="block text-white">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-dark900/80 text-white border border-electric focus:outline-none focus:ring-2 focus:ring-electric"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 mt-2 font-semibold text-white rounded bg-electric hover:bg-electric/80 transition"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            {message && <div className="p-2 mt-2 text-center text-green-500 bg-green-100 rounded">{message}</div>}
            {error && <div className="p-2 mt-2 text-center text-red-500 bg-red-100 rounded">{error}</div>}
          </form>
        </div>
      </section>
    </main>
  );
};

export default PasswordResetRequest; 