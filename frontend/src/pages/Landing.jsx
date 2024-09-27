import React from 'react';
import { Link } from 'react-router-dom';
import journalImage2 from '../images/journal image2.jpg'; // Adjust the path as necessary

const Landing = () => {
  return (
    <div
      className="h-screen flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${journalImage2})` }} // Use the imported image
    >
      <div className="flex flex-col justify-center items-center w-full px-4">
        {/* Title Section */}
        <h1 className="text-5xl text-black font-light mb-12 text-center">
          Personal Journal
        </h1>

        {/* Button Section */}
        <div className="w-full max-w-xs text-center">
          <Link to="/login">
            <button
              className="w-full py-4 px-5 rounded-full text-lg font-medium"
              style={{ backgroundColor: '#2563EB', color: '#FFF' }} // Blue for login button
            >
              Login
            </button>
          </Link>

          {/* Adding margin to the Register button */}
          <Link to="/register">
            <button
              className="w-full py-4 px-5 rounded-full text-lg font-medium mt-4" // Added mt-4 for margin-top
              style={{ backgroundColor: '#16A34A', color: '#FFF' }} // Green for register button
            >
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;


