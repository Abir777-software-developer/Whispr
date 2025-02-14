import express from "express";
import { registerUser, authUser } from "../controllers/userControllers.js";
import { allUsers } from "../controllers/userControllers.js";
import { protect } from "../middleware/authmiddleware.js";
const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);

export default router;
