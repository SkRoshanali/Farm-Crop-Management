import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../api/authApi';
import { setCredentials } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors
    
    try {
      const result = await login({ email, password }).unwrap();
      
      console.log('Login successful, result:', result);
      console.log('Session expires at:', result.sessionExpires, 'Current time:', Date.now());
      
      dispatch(setCredentials({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: {
          id: result.userId,
          email: result.email,
          fullName: result.fullName,
          role: result.role,
          sessionExpires: result.sessionExpires,
        },
      }));
      
      console.log('Credentials set in Redux');
      
      dispatch(showToast({
        message: 'Login successful!',
        type: 'success',
      }));
      
      // Redirect based on role
      if (result.role === 'BUYER') {
        console.log('Redirecting to buyer dashboard');
        navigate('/buyer/dashboard');
      } else {
        console.log('Redirecting to internal dashboard');
        navigate('/internal/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Extract error message from response
      let message = 'Login failed. Please try again.';
      
      if (error.data?.message) {
        message = error.data.message;
      } else if (error.status === 400) {
        message = 'Invalid email or password. Please check your credentials.';
      } else if (error.status === 401) {
        message = 'Invalid email or password.';
      } else if (error.status === 403) {
        message = 'Your account is not active. Please contact administrator.';
      }
      
      setErrorMessage(message);
      dispatch(showToast({
        message,
        type: 'error',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-primary mb-2">AEMS</h1>
          <p className="text-gray-600">Agri Export Management System</p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold text-center mb-6">Login to Your Account</h2>
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{errorMessage}</p>
              {errorMessage.includes('pending admin approval') && (
                <p className="text-xs text-red-600 mt-2">
                  Please wait for an administrator to approve your account, or contact support for assistance.
                </p>
              )}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Register as Buyer
              </Link>
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-2 font-semibold">
              Demo Accounts:
            </p>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Super Admin:</strong> superadmin@aems.com / Admin@123</p>
              <p><strong>Admin:</strong> admin@aems.com / Admin@123</p>
              <p><strong>Manager:</strong> manager@aems.com / Manager@123</p>
              <p><strong>Employee:</strong> employee@aems.com / Employee@123</p>
              <p><strong>Buyer:</strong> buyer@aems.com / Buyer@123</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-gray-600 hover:text-primary text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;