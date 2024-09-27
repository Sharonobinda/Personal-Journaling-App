import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function LoginPage() {
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    login(email, password, () => navigate('/journals')); 

    setEmail("");
    setPassword("");
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 bg-gray-200 rounded-lg shadow-lg">
        <h2 className="text-center text-xl font-bold mb-6 text-green-900">Login</h2>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Enter Your Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow-sm bg-gray-50 border border-green-900 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-green-900 block w-full p-2"
            placeholder="john@example.com" 
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Enter Your Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow-sm bg-gray-50 border border-green-900 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-green-900 block w-full p-2"
            placeholder="Password"
            required
          />
        </div>
        <div className="my-2 flex justify-center text-sm text-green-900">
          <Link to="/password-reset-request">Forgot Password?</Link>
        </div>
        <div className='flex justify-center'>
          <button
            type="submit"
            className="font-sans text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-900 hover:bg-green-700 focus:ring-green-800">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
