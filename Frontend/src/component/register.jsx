import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor',
    phone: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    
    try {
      const response = await fetch('/api/register', {
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
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="flex items-start justify-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-md mt-16 mb-8 bg-[#FDFCDC] rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-14 h-14 bg-[#FED9B7] rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#F07167]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#0081A7]">Create Account</h2>
            <p className="text-[#00AFB9] text-sm">Join our community</p>
          </div>

          {error && (
            <div className="p-2 text-xs text-[#F07167] bg-[#FED9B7] rounded border border-[#F07167] mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid gap-3">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 text-sm border border-[#FED9B7] rounded-lg focus:ring-1 focus:ring-[#00AFB9] focus:border-transparent bg-[#FDFCDC]"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 text-sm border border-[#FED9B7] rounded-lg focus:ring-1 focus:ring-[#00AFB9] focus:border-transparent bg-[#FDFCDC]"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 text-sm border border-[#FED9B7] rounded-lg focus:ring-1 focus:ring-[#00AFB9] focus:border-transparent bg-[#FDFCDC]"
                required
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 text-sm border border-[#FED9B7] rounded-lg focus:ring-1 focus:ring-[#00AFB9] focus:border-transparent bg-[#FDFCDC]"
                required
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 text-sm border border-[#FED9B7] rounded-lg focus:ring-1 focus:ring-[#00AFB9] focus:border-transparent bg-[#FDFCDC]"
                required
              >
                <option value="donor">Donor</option>
                <option value="volunteer">Volunteer</option>
              </select>

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 text-sm border border-[#FED9B7] rounded-lg focus:ring-1 focus:ring-[#00AFB9] focus:border-transparent bg-[#FDFCDC]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-[#F07167] to-[#00AFB9] text-[#FDFCDC] text-sm font-medium rounded-lg hover:from-[#00AFB9] hover:to-[#0081A7] focus:outline-none focus:ring-1 focus:ring-[#F07167] transition shadow-sm"
            >
              Register Now
            </button>
          </form>

          <div className="text-center text-xs text-[#00AFB9] mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0081A7] hover:text-[#F07167] font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;