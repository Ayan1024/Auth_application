import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log("JWT Cookie:", token); // Debug

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debug

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Error in protectRoute.js:", err.message);
    res.status(500).json({ message: err.message });
  }
  console.log("Cookies received:", req.cookies);
console.log("Authorization header:", req.headers.authorization);

};

export default protectRoute;
