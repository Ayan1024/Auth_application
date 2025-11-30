import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId },process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

   const isProd = process.env.NODE_ENV === "production";


res.cookie("jwt", token, {
  httpOnly: true,
  maxAge: 30 * 24 * 60 * 60 * 1000,
   sameSite: isProd ? "none" : "lax",
    secure: isProd,
});


  return token;
};

export default generateTokenAndSetCookie;
