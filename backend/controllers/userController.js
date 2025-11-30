import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";

//signup function "/api/users/signup"
const signupUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    console.log("Request Body:", req.body); // Check if req.body is parsed correctly

    const user = await User.findOne({ email });
    console.log(
      "User findOne result:",
      user ? "User exists" : "User not found"
    );

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    console.log("Salt generated.");
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Password hashed.");

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    console.log("New User instance created.");

    await newUser.save();
    console.log("New User saved to DB.");

    if (newUser) {


      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      });
    } else {
      res.status(400).json({ error: "Invalid user data provided" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error("Error in signupUser in userController.js:", err.message);
  }
};

//login function "/api/users/login"
const loginUser = async (req, res) => {
  try {
    const {email, password } = req.body;
    const user = await User.findOne({email});
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "invalid or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(
      "error in the loginUser function in the userController.js",
      err.message
    );
  }
};
//
//logout function "api/users/logout"
const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "logout sucessfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(
      "error in logoutuser function in the userController.js",
      err.message
    );
  }
};

// controllers/userController.js
const updateUser = async (req, res) => {
  const userId = req.user._id; // from auth middleware
  const { name, currentPassword, newPassword } = req.body;
  const user = await User.findById(userId);

  if (newPassword) {
    if (!currentPassword) return res.status(400).json({ error: "Current password required" });
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(400).json({ error: "Current password incorrect" });
    user.password = await bcrypt.hash(newPassword, 10);
  }

  if (name) user.name = name;
  await user.save();

  res.json({ _id: user._id, name: user.name, email: user.email, phone: user.phone, createdAt: user.createdAt });
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user?._id; 
    if (!userId) return res.status(401).json({ error: "Unauthorized" });


    await User.findByIdAndDelete(userId);


    res.cookie("jwt", "", { maxAge: 1 });

    res.status(200).json({ message: "Account deleted" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ error: err.message });
  }
};


export { signupUser, loginUser, logoutUser, updateUser, deleteUser };
