import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Use for feedback

function ProfilePage() {
  const { currentUser, update_user } = useContext(UserContext); // Make sure you're using UserContext correctly
  const nav = useNavigate();

  const [username, setUsername] = useState("");

  // Set the username when currentUser is available
  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || "");
    }
  }, [currentUser]);

  // Redirect to login if no currentUser
  useEffect(() => {
    if (!currentUser) {
      nav("/login");
    }
  }, [currentUser, nav]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call update_user function when submitting
    update_user(username);
    toast.success('Profile updated successfully!'); // Feedback on success
  };

  return (
    <div className="mt-20">
      <div className="flex items-center justify-center">
        <div className="relative w-full max-w-md p-4 rounded-lg shadow-lg text-green-900">
          <div className="relative bg-[#B9B9B7] flex h-32 w-full justify-center rounded-xl">
            <div>
              <h4 className='font-bold text-2xl text-center mt-8'>My Profile</h4>
            </div>
          </div>
          <div className="mt-8 space-y-2 flex flex-col items-center">
            <h4 className="text-xl font-bold text-gray-700">
              {username || "Username not available"}
            </h4>
          </div>

          <div className='w-full max-w-md p-8'>
            <h4 className='font-bold text-2xl text-center mt-8 text-green-900'>Update Profile</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">Enter username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="shadow-sm border border-green-900 bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-green-900 focus:border-green-900 block w-full p-3"
                  required
                />
              </div>
              <div className='flex justify-center'>
                <button
                  type="submit"
                  className="font-sans text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-900 hover:bg-green-700 focus:ring-green-800">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
