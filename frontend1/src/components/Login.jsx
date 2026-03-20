import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/userSlice";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    username: "",
    password: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandle = async (e) => {
    e.preventDefault();

    if (!user.username || !user.password) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8081/api/v1/user/login",
        user,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true 
        }
      );

      toast.success(res.data.message || "Login successful");

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      dispatch(setAuthUser(res.data));
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid username or password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364]">
      {/* Glassmorphism Card */}
      <div className="w-[90%] max-w-[350px] p-8 rounded-3xl backdrop-blur-xl bg-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/20 transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-wide">Welcome Back</h1>
          <p className="text-white/60 text-sm mt-2">Log in to continue your secure chat.</p>
        </div>

        <form onSubmit={onSubmitHandle} className="flex flex-col gap-6">
          {/* Username Input */}
          <div className="relative group">
            <input
              required
              id="username"
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full bg-transparent border-b-2 border-white/30 text-white placeholder-transparent px-2 py-2 focus:outline-none focus:border-[#00A884] peer transition-colors"
              placeholder="Username"
            />
            <label 
              htmlFor="username" 
              className="absolute left-2 top-2 text-white/50 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#00A884] peer-valid:-top-4 peer-valid:text-xs peer-valid:text-[#00A884]"
            >
              Username
            </label>
          </div>

          {/* Password Input */}
          <div className="relative group mt-2">
            <input
              required
              id="password"
              type={showPassword ? "text" : "password"}
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full bg-transparent border-b-2 border-white/30 text-white placeholder-transparent px-2 py-2 pr-10 focus:outline-none focus:border-[#00A884] peer transition-colors"
              placeholder="Password"
            />
            <label 
              htmlFor="password" 
              className="absolute left-2 top-2 text-white/50 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#00A884] peer-valid:-top-4 peer-valid:text-xs peer-valid:text-[#00A884]"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-white/50 hover:text-white transition-colors focus:outline-none"
            >
              {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-[#00A884] hover:bg-[#008f6f] text-white font-semibold py-3 rounded-xl shadow-lg transition-transform transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-white/70">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#00A884] hover:underline hover:text-white font-medium transition-colors">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;