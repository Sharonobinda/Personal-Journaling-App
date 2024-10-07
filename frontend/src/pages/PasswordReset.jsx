import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const PasswordReset = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Optional: Check if passwords match before sending request
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    fetch(`http://127.0.0.1:5000/reset-password/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: newPassword }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to reset password');
        }
        return response.json();
      })
      .then((data) => {
        toast.success(data.message);
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-green-900 text-center">Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-700 text-center">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="shadow-sm bg-gray-50 border border-green-900 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-green-900 block w-full p-2.5"
              placeholder="Enter your new password"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700 text-center">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="shadow-sm bg-gray-50 border border-green-900 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-green-900 block w-full p-2.5"
              placeholder="Confirm your new password"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-green-900 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-900 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
