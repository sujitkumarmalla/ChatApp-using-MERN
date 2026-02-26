import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
//register
export const register = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    // Check required fields
    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password mismatch"
      });
    }

    // Check existing username
    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({
        message: "Username already exists"
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Profile photo URLs
    const maleProfilephoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const femaleProfilephoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    // Create user
    await User.create({
      fullName,
      username,
      password: hashPassword,
      profilePhoto:
        gender === "male" ? maleProfilephoto : femaleProfilephoto,
      gender
    });

    return res.status(201).json({
      message: "User registration successful",
      success: true
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

//login
export const login=async(req,res)=>{
    try {
       const {username, password} = req.body;

    // Check required fields
    if (!username || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }
    const user=await User.findOne({username});
    if(!user){
        return res.status(400).json({
            message:"Incorrect username or password",
            success:false
        })
    }
    const isPasswordMatch=await bcrypt.compare(password,user.password);
    if(!isPasswordMatch){
        return res.status(400).json({
            message:"Password Incorrect",
            success:false
        }) 
    }
    const tokenData={
        userId:user._id
    };
    const token=await jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn:"1d"});

    return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpOnly:true,sameSite:"strict"})
    .json({
        _id:user._id,
        username:user.username,
        fullName:user.fullName,
        profilePhoto:user.profilePhoto,
        gender:user.gender
    });



    } catch (error) {
        console.log(error)
    }
}

//logout

export const logout= async(req,res)=>{
try {
    return res.status(200).cookie("token","",{maxAge:0}).json({
        message:"logout succesfully"
        
    })
} catch (error) {
    console.log(error);
}
}


export const getOtherUser = async (req, res) => {
  try {
    const loggedUserId = req.id;

    const otherUsers = await User
      .find({ _id: { $ne: loggedUserId } })
      .select("-password");

    return res.status(200).json(otherUsers);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false
    });
  }
};
