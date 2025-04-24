import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: 'donor',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onLogin(data.user);
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      {/* Main card */}
      <div className="relative w-full max-w-md p-8 space-y-6 bg-[#FDFCDC] rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-[#FED9B7] rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#F07167]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#0081A7]">Welcome Back</h2>
          <p className="text-[#00AFB9] mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-[#F07167] bg-[#FED9B7] rounded-lg border border-[#F07167]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 border border-[#FED9B7] rounded-lg focus:ring-2 focus:ring-[#00AFB9] focus:border-transparent bg-[#FDFCDC]"
            required
          >
            <option value="donor">Donor</option>
            <option value="volunteer">Volunteer</option>
          </select>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-[#FED9B7] rounded-lg focus:ring-2 focus:ring-[#00AFB9] focus:border-transparent transition bg-[#FDFCDC]"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-[#FED9B7] rounded-lg focus:ring-2 focus:ring-[#00AFB9] focus:border-transparent transition bg-[#FDFCDC]"
            required
          />

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-[#F07167] to-[#00AFB9] text-[#FDFCDC] font-medium rounded-lg hover:from-[#00AFB9] hover:to-[#0081A7] focus:outline-none focus:ring-2 focus:ring-[#F07167] focus:ring-offset-2 transition shadow-sm hover:shadow-md"
          >
            Sign In
          </button>
        </form>

        <div className="flex justify-center items-center text-sm text-[#00AFB9]">
          <span>
            Don't have an account?{' '}
            <Link to="/register" className="text-[#0081A7] hover:text-[#F07167] font-medium underline">
              Register
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;