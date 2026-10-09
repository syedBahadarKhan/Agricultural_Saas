import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

export default function Register() {
  const [role, setRole] = useState('FARMER');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await register({
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
      });

      if (response.success) {
        if (response.data.role === 'BUYER') {
          navigate('/buyer');
        } else {
          navigate('/farmer');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-navy-900">
          Join AgriSaaS Pakistan
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-agrigreen-600 hover:text-agrigreen-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setRole('FARMER')}
                className={`py-3 border rounded-lg text-center font-medium transition ${role === 'FARMER' ? 'bg-agrigreen-50 border-agrigreen-500 text-agrigreen-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
              >
                Farmer
              </button>
              <button 
                type="button"
                onClick={() => setRole('BUYER')}
                className={`py-3 border rounded-lg text-center font-medium transition ${role === 'BUYER' ? 'bg-agrigreen-50 border-agrigreen-500 text-agrigreen-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
              >
                Buyer
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-slate-700">First name</label>
                <div className="mt-1">
                  <input 
                    type="text" 
                    name="first-name" 
                    id="first-name" 
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-agrigreen-500 focus:border-agrigreen-500 sm:text-sm" 
                  />
                </div>
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-slate-700">Last name</label>
                <div className="mt-1">
                  <input 
                    type="text" 
                    name="last-name" 
                    id="last-name" 
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-agrigreen-500 focus:border-agrigreen-500 sm:text-sm" 
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
              <div className="mt-1">
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-agrigreen-500 focus:border-agrigreen-500 sm:text-sm" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone Number</label>
              <div className="mt-1">
                <input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  required 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-agrigreen-500 focus:border-agrigreen-500 sm:text-sm" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1">
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-agrigreen-500 focus:border-agrigreen-500 sm:text-sm" 
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-agrigreen-600 hover:bg-agrigreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agrigreen-500 transition disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
