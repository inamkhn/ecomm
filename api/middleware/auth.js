import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/user.js";

export const isAuthenticated = async (req, res, next) => {
   const token = req.cookie.access_token
  if (!token) return next(new ErrorHandler("Not Logged In", 401));
  const decoded = jwt.verify(token,process.env.JWT_SECRET);
  req.user = await User.findById(decoded._id);
  next();
}

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return next(
      new ErrorHandler(
        `${req.user.role} is not allowed to access this resource`,
        403
      )
    );
  next();
};
