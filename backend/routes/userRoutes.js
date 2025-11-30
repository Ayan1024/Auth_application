import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/signup", signupUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/me", protectRoute, (req, res) => {
  res.json(req.user); 
});

router.put("/update", protectRoute, updateUser);
router.delete("/delete", protectRoute, deleteUser);

export default router;
