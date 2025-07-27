import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Password Strength Meter Component
const PasswordStrengthMeter = ({ password }) => {
  const getStrength = () => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };

  const strength = getStrength();
  const strengthText = ['Weak', 'Fair', 'Good', 'Strong'][strength] || '';
  const strengthColor = ['red', 'orange', 'blue', 'green'][strength] || 'gray';

  return (
    <div className="mt-1">
      <div className="flex gap-1 h-1">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i}
            className={`flex-1 rounded-full ${
              i <= strength ? `bg-${strengthColor}-500` : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      {password && (
        <p className={`text-xs mt-1 text-${strengthColor}-600`}>
          Password strength: {strengthText}
        </p>
      )}
    </div>
  );
};

// Location Data
const locationData = {
  Gujarat: {
    Ahmedabad: ['Village A', 'Village B'],
    Surat: ['Village C', 'Village D'],
  },
  Maharashtra: {
    Pune: ['Village E', 'Village F'],
    Mumbai: ['Village G', 'Village H'],
  },
  Punjab: {
    Amritsar: ['Village I', 'Village J'],
    Ludhiana: ['Village K', 'Village L'],
  },
};

const Signup = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    state: '',
    district: '',
    village: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);

  // Get location options
  const states = Object.keys(locationData);
  const districts = formData.state ? Object.keys(locationData[formData.state]) : [];
  const villages = formData.district ? locationData[formData.state][formData.district] : [];

  // Auto-focus first input
  useEffect(() => {
    document.querySelector('input[name="fullName"]').focus();
  }, []);

  // Username availability check (debounced)
  useEffect(() => {
    if (!formData.username) return;
    
    const timer = setTimeout(async () => {
      try {
        // Replace with actual API call
        // const available = await checkUsernameAvailability(formData.username);
        const available = !['admin', 'user', 'test'].includes(formData.username.toLowerCase());
        setUsernameAvailable(available);
      } catch (error) {
        console.error('Error checking username:', error);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [formData.username]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      newErrors.username = 'Username must be 3-20 characters (letters, numbers, _)';
    } else if (!usernameAvailable) {
      newErrors.username = 'Username is already taken';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number (10 digits required)';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.state) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.district) {
      newErrors.district = 'District is required';
    }
    
    if (!formData.village) {
      newErrors.village = 'Village is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!formData.agreeTerms) {
      setSubmitError('You must agree to the terms and conditions');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Replace with actual API call
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }
      
      // On successful signup
      localStorage.setItem('authToken', 'demo-token');
      setIsLoggedIn(true);
      navigate('/dashboard');
    } catch (error) {
      setSubmitError(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-100 to-green-300 min-h-screen pt-28 pb-10 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
          Create Your Account
        </h2>
        
        {submitError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">
            {submitError}
          </div>
        )}

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label className="block mb-1 text-sm text-gray-600">Full Name *</label>
            <input
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Your full name"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
              }`}
              required
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">Username *</label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Unique username"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
              }`}
              required
            />
            {errors.username ? (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            ) : formData.username && usernameAvailable && (
              <p className="text-green-500 text-xs mt-1">Username available</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">Phone Number *</label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
              }`}
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <label className="block mb-1 text-sm text-gray-600">Email *</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">Password *</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2 right-3 text-sm text-gray-500 hover:text-green-700"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <PasswordStrengthMeter password={formData.password} />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters with uppercase, number, and special character
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">Confirm Password *</label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-2 right-3 text-sm text-gray-500 hover:text-green-700"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* State Dropdown */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">State *</label>
            <div className="relative">
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full appearance-none px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.state ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                }`}
                required
              >
                <option value="" disabled>Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">
                ▼
              </span>
            </div>
            {errors.state && (
              <p className="text-red-500 text-xs mt-1">{errors.state}</p>
            )}
          </div>

          {/* District Dropdown */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">District *</label>
            <div className="relative">
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                disabled={!formData.state}
                className={`w-full appearance-none px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 ${
                  !formData.state ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                } ${
                  errors.district ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                }`}
                required
              >
                <option value="" disabled>Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">
                ▼
              </span>
            </div>
            {errors.district && (
              <p className="text-red-500 text-xs mt-1">{errors.district}</p>
            )}
          </div>

          {/* Village Dropdown */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">Village *</label>
            <div className="relative">
              <select
                name="village"
                value={formData.village}
                onChange={handleChange}
                disabled={!formData.district}
                className={`w-full appearance-none px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 ${
                  !formData.district ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                } ${
                  errors.village ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                }`}
                required
              >
                <option value="" disabled>Select Village</option>
                {villages.map((village) => (
                  <option key={village} value={village}>{village}</option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">
                ▼
              </span>
            </div>
            {errors.village && (
              <p className="text-red-500 text-xs mt-1">{errors.village}</p>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="sm:col-span-2 flex items-start mt-2">
            <input
              type="checkbox"
              className="mt-1 mr-2"
              checked={formData.agreeTerms}
              onChange={handleChange}
              name="agreeTerms"
              required
            />
            <p className="text-sm text-gray-600">
              I agree to the{' '}
              <Link to="/terms" className="text-green-700 font-medium underline">
                Terms & Conditions
              </Link> *
            </p>
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2 mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition font-semibold flex items-center justify-center ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : 'Sign Up'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-green-700 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;