import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register } = useContext(UserContext);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (register) {
      register(username, email, password, () => {
        navigate('/'); // Redirect to the Landing page after successful registration
        toast.success("Registration successful! Please log in.");
      });

      // Clear form fields after submission
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else {
      toast.error("Registration function not available");
    }
  }

  return (
    <div className='bg-[#B9B9B7] flex mt-10 items-center justify-center'>
      <div className='w-full max-w-md p-8 rounded-lg shadow-lg'>
        <h4 className='font-bold text-2xl text-center mt-8 text-green-900 py-8'>Register New Account</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Enter Username</label>
            <input
              autoComplete="name"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow-sm border border-gray-300 bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-green-900 focus:border-green-900 block w-full p-3"
              placeholder="John Doe"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Enter Email</label>
            <input
              autoComplete="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm border border-gray-300 bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-green-900 focus:border-green-900 block w-full p-3"
              placeholder="name@gmail.com"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Enter Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm border border-gray-300 bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-green-900 focus:border-green-900 block w-full p-3"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="shadow-sm border border-gray-300 bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-green-900 focus:border-green-900 block w-full p-3"
              required
            />
          </div>
          <div className='flex justify-center'>
            <button
              type="submit"
              className="w-full py-4 px-5 rounded-full text-lg font-medium text-white bg-green-900 hover:bg-green-700 focus:ring-green-800"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
