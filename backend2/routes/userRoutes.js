import express from "express";
import { getOtherUser, login, logout, register, updateProfilePhoto } from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";

const router=express.Router();

router.route("/register").post(upload.single("profilePhoto"), register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/").get(isAuthenticated,getOtherUser);
router.route("/profile-photo").put(isAuthenticated, upload.single("profilePhoto"), updateProfilePhoto);
export default router;