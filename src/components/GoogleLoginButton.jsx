import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = ({ text = "Sign in with Google", className = "" }) => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  
  // Check if Google Client ID is configured
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  if (!googleClientId || googleClientId === 'your_google_client_id_here') {
    return (
      <div className={`w-full ${className}`}>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        <div className="mt-6">
          <div className="w-full py-3 px-4 border border-gray-300 rounded-lg text-center text-gray-500 bg-gray-50">
            <span className="text-sm">Google Sign-in (Configure Client ID)</span>
          </div>
        </div>
      </div>
    );
  }

  // Temporary warning message for origin error  
  const showOriginWarning = false; // Hide debug panel temporarily
  
  if (showOriginWarning) {
    return (
      <div className={`w-full ${className}`}>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        <div className="mt-6">
          <div className="w-full py-3 px-4 border border-blue-300 rounded-lg text-center text-blue-700 bg-blue-50">
            <div className="text-sm font-medium">🔧 Debug Info</div>
            <div className="text-xs mt-2 space-y-1">
              <div>Current URL: {window.location.origin}</div>
              <div>Client ID: {googleClientId.slice(0, 20)}...</div>
              <div className="font-medium text-blue-800">Required Origins in Google Console:</div>
              <div className="bg-blue-100 p-2 rounded text-xs">
                • http://localhost:5173<br/>
                • http://localhost:3000<br/>
                • https://yourdomain.com (production)
              </div>
              <div className="text-blue-600 text-xs mt-2">
                ⚠️ 403 errors are cosmetic - authentication still works!
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      console.log("Google Credential:", credentialResponse);
      
      // Call your backend API with the Google token
      const result = await googleLogin(credentialResponse.credential);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        console.error('Google login failed:', result.error);
      }
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleLoginFailure = () => {
    console.log("Google Login Failed");
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="mt-6">
        <div className="w-full [&>div]:w-full [&>div>div]:w-full">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
            theme="outline"
            size="large"
            text={text}
            shape="rectangular"
          />
        </div>
      </div>
    </div>
  );
};

export default GoogleLoginButton;
