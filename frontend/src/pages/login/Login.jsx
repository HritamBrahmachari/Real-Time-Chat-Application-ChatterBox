import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loading, login } = useLogin();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };
  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-md border border-gray-400 shadow-md bg-white bg-opacity-80">
        <h1 className="text-3xl font-semibold text-center text-black mb-4">
          Login to
          <span className="text-[#466B7C]"> ChatterBox</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="label p-2">
              <span className="text-base font-medium text-gray-700">Username</span>
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full input input-bordered h-10 bg-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="label">
              <span className="text-base font-medium text-gray-700">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full input input-bordered h-10 bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="mt-5 mb-4 text-center">
            <Link
              to="/signup"
              className="text-blue-600 font-medium hover:underline hover:text-blue-800"
            >
              Don't have an account? <span className="font-semibold">Sign Up</span>
            </Link>
          </div>

          <div>
            <button
              className="btn btn-block btn-sm mt-2 bg-blue-500 text-white hover:bg-blue-600 border-none"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
