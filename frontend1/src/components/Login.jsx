import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/userSlice";
const Login = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const [user, setUser] = useState({
    username: "",
    password: ""
  });

  const onSubmitHandle = async (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (!user.username || !user.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/user/login",
        user,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true // important for cookies
        }
      );

      toast.success(res.data.message || "Login successful");

      // Optional: save token if backend sends it
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      navigate("/");
      console.log(res.data);
      dispatch(setAuthUser(res.data))
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid username or password"
      );
      console.log(error);
    }

    setUser({
      username: "",
      password: ""
    });
  };

  return (
    <div className="min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-0 border">

        <h1 className="text-3xl font-bold text-center">Login</h1>

        <form onSubmit={onSubmitHandle}>

          {/* Username */}
          <div>
            <label className="label my-2">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              required
              value={user.username}
              onChange={(e) =>
                setUser({ ...user, username: e.target.value })
              }
              className="w-full input input-bordered h-10"
              type="text"
              placeholder="Enter your username"
            />
          </div>

          {/* Password */}
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              required
              value={user.password}
              onChange={(e) =>
                setUser({ ...user, password: e.target.value })
              }
              className="w-full input input-bordered h-10"
              type="password"
              placeholder="Enter your password"
            />
          </div>

          {/* Signup link */}
          <div className="w-full text-center flex justify-center gap-2 mt-2">
            <p>Don't have an account?</p>
            <Link to="/register" className="text-blue-500">
              Sign up
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="btn btn-block btn-md mt-3 border-slate-700"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;