import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { IoEyeOutline, IoEyeOffOutline, IoCameraOutline } from "react-icons/io5";

const Signup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "male",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", user.fullName);
      formData.append("username", user.username);
      formData.append("password", user.password);
      formData.append("confirmPassword", user.confirmPassword);
      formData.append("gender", user.gender);
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      const res = await axios.post(`/api/v1/user/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] py-10 px-4 mt-12 md:mt-0">
      {/* Glassmorphism Card */}
      <div className="w-full max-w-[400px] p-8 rounded-3xl backdrop-blur-xl bg-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/20 transition-all duration-300">
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white tracking-wide">Create Account</h1>
          <p className="text-white/60 text-sm mt-2">Join the conversation today.</p>
        </div>

        <form onSubmit={onSubmitHandle} className="flex flex-col gap-4">
          
          {/* Avatar Upload */}
          <div className="flex flex-col items-center justify-center mb-2">
            <div className="relative group cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoChange} 
                className="hidden" 
                id="avatarUpload" 
              />
              <label htmlFor="avatarUpload" className="cursor-pointer block relative w-20 h-20 rounded-full bg-white/10 border-2 border-dashed border-white/40 hover:border-[#00A884] overflow-hidden transition-all flex items-center justify-center">
                {photoPreview ? (
                  <img src={photoPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <IoCameraOutline size={30} className="text-white/50 group-hover:text-[#00A884]" />
                )}
                <div className="absolute inset-0 bg-black/40 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity">
                   <IoCameraOutline size={24} className="text-white" />
                </div>
              </label>
            </div>
            <span className="text-xs text-white/50 mt-2">Upload Profile Photo</span>
          </div>

          {/* Full Name Input */}
          <div className="relative group">
            <input
              required
              id="fullName"
              type="text"
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className="w-full bg-transparent border-b-2 border-white/30 text-white placeholder-transparent px-2 py-1.5 focus:outline-none focus:border-[#00A884] peer transition-colors"
              placeholder="Full Name"
            />
            <label 
              htmlFor="fullName" 
              className="absolute left-2 top-1.5 text-white/50 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-1.5 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#00A884] peer-valid:-top-4 peer-valid:text-xs peer-valid:text-[#00A884]"
            >
              Full Name
            </label>
          </div>

          {/* Username Input */}
          <div className="relative group mt-2">
            <input
              required
              id="usernameReg"
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full bg-transparent border-b-2 border-white/30 text-white placeholder-transparent px-2 py-1.5 focus:outline-none focus:border-[#00A884] peer transition-colors"
              placeholder="Username"
            />
            <label 
              htmlFor="usernameReg" 
              className="absolute left-2 top-1.5 text-white/50 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-1.5 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#00A884] peer-valid:-top-4 peer-valid:text-xs peer-valid:text-[#00A884]"
            >
              Username
            </label>
          </div>

          {/* Password Input */}
          <div className="relative group mt-2">
            <input
              required
              id="passwordReg"
              type={showPassword ? "text" : "password"}
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full bg-transparent border-b-2 border-white/30 text-white placeholder-transparent px-2 py-1.5 pr-10 focus:outline-none focus:border-[#00A884] peer transition-colors"
              placeholder="Password"
            />
            <label 
              htmlFor="passwordReg" 
              className="absolute left-2 top-1.5 text-white/50 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-1.5 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#00A884] peer-valid:-top-4 peer-valid:text-xs peer-valid:text-[#00A884]"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1.5 text-white/50 hover:text-white transition-colors focus:outline-none"
            >
              {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative group mt-2">
            <input
              required
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={user.confirmPassword}
              onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
              className="w-full bg-transparent border-b-2 border-white/30 text-white placeholder-transparent px-2 py-1.5 focus:outline-none focus:border-[#00A884] peer transition-colors"
              placeholder="Confirm Password"
            />
            <label 
              htmlFor="confirmPassword" 
              className="absolute left-2 top-1.5 text-white/50 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-1.5 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#00A884] peer-valid:-top-4 peer-valid:text-xs peer-valid:text-[#00A884]"
            >
              Confirm Password
            </label>
          </div>

          {/* Gender Select */}
          <div className="flex gap-4 items-center justify-center mt-3">
            <label className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white transition-colors">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={user.gender === "male"}
                onChange={(e) => setUser({ ...user, gender: e.target.value })}
                className="accent-[#00A884] w-4 h-4 cursor-pointer"
              />
              <span className="text-sm">Male</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white transition-colors">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={user.gender === "female"}
                onChange={(e) => setUser({ ...user, gender: e.target.value })}
                className="accent-[#00A884] w-4 h-4 cursor-pointer"
              />
              <span className="text-sm">Female</span>
            </label>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-[#00A884] hover:bg-[#008f6f] text-white font-semibold py-3 rounded-xl shadow-lg transition-transform transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="text-center mt-5 text-sm text-white/70">
          Already have an account?{" "}
          <Link to="/login" className="text-[#00A884] hover:underline hover:text-white font-medium transition-colors">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;