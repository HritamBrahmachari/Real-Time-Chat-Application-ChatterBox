import React, { useState } from "react";
import { Link } from "react-router-dom";

import useSignup from "../../hooks/useSignup";
import GenderCheckBox from "./GenderCheckBox";

const SignUp = () => {
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const { loading, signup } = useSignup();

  const handleCheckboxChange = (gender) => {
    setInputs({ ...inputs, gender });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(inputs);
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-md border border-gray-400 shadow-md bg-white bg-opacity-80">
        <h1 className="text-3xl font-semibold text-center text-black mb-4">
          Signup to <span className="text-[#466B7C]">ChatterBox</span>
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="label p-2">
              <span className="text-base font-medium text-gray-700">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full input input-bordered h-10 bg-white"
              value={inputs.fullName}
              onChange={(e) =>
                setInputs({ ...inputs, fullName: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label className="label p-2 ">
              <span className="text-base font-medium text-gray-700">Username</span>
            </label>
            <input
              type="text"
              placeholder="johndoe"
              className="w-full input input-bordered h-10 bg-white"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
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
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label className="label">
              <span className="text-base font-medium text-gray-700">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full input input-bordered h-10 bg-white"
              value={inputs.confirmPassword}
              onChange={(e) =>
                setInputs({ ...inputs, confirmPassword: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Gender</label>
            <GenderCheckBox
              onCheckBoxChange={handleCheckboxChange}
              selectedGender={inputs.gender}
            />
          </div>
          
          <div className="mt-5 mb-4 text-center">
            <Link
              className="text-blue-600 font-medium hover:underline hover:text-blue-800"
              to="/login"
            >
              Already have an account? <span className="font-semibold">Login</span>
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
                "Sign Up"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
