import React, { useState } from 'react';
import { toast } from 'react-toastify';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/request-reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to send reset link');
        }
        return response.json();
      })
      .then((data) => {
        toast.success(data.message);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="flex justify-center">
      <div className="p-8 bg-[#B9B9B7] max-w-md">
        <h2 className="text-xl font-bold mb-4 text-green-900 text-center">Request Password Reset</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="flex justify-center my-4 block mb-2 text-sm font-medium text-gray-700">Enter Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow-sm bg-gray-50 border border-green-900 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-green-900 block w-full p-2.5"
              placeholder="fashion@finesse.co.ke"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-900 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-900 focus:ring-offset-2"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};


export default PasswordResetRequest;
