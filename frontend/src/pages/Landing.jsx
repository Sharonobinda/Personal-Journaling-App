import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import journalImage3 from '../images/journal image3.jpg';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';

const Landing = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login) {
      login(email, password, () => {
        navigate('/journals'); // Navigate to the dashboard after successful login
      });

      // Clear form fields
      setEmail("");
      setPassword("");
    } else {
      toast.error("Login function not available");
    }
  };

  return (
    <div
      className="h-screen flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${journalImage3})` }} // Use the imported image
    >
      <div className="flex flex-col justify-center items-center w-full px-4 bg-opacity-80 rounded-lg p-6 shadow-lg">
        {/* Title Section */}
        <h1 className="text-5xl text-black font-light mb-8 text-center">
          Personal Journal
        </h1>

        {/* Login Form Section */}
        <form onSubmit={handleSubmit} className="w-full max-w-xs mb-6">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm bg-gray-50 border border-green-900 text-gray-900 text-sm rounded-lg block w-full p-2"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm bg-gray-50 border border-green-900 text-gray-900 text-sm rounded-lg block w-full p-2"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className='flex justify-center'>
            <button
              type="submit"
              className="w-full py-4 px-5 rounded-full text-lg font-medium text-white bg-green-900 hover:bg-green-700 focus:ring-green-800"
            >
              Login
            </button>
          </div>
        </form>

        {/* Links Section */}
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">Not registered? <Link to="/register" className="text-green-900 font-semibold">Sign up</Link></p>

          {/* Horizontal line with OR text */}
          <div className="my-4 flex items-center">
            <hr className="flex-grow border-gray-400" />
            <span className="mx-2 text-sm text-gray-600">OR</span>
            <hr className="flex-grow border-gray-400" />
          </div>

          <p className="text-sm text-gray-600">Forgot password? <Link to="/password-reset-request" className="text-green-900 font-semibold">Reset</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
