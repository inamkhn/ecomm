import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/user.js";
import { sendToken } from "../utils/sendToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return next(new ErrorHandler("Please enter all field", 400));
  let user = await User.findOne({ email });
  if (user) return next(new ErrorHandler("User Already Exist", 409));
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(200).json("User is successfully created");
  } catch (error) {
    console.log(error);
  }
};


// export const login = async (req, res, next) => {
//   const { email, password } = req.body;

//   if (!email || !password)
//     return next(new ErrorHandler("Please enter all field", 400));
//   try {
//     const user = await User.findOne({ email }).select("+password");
//     if (!user)
//       return next(new ErrorHandler("Incorrect Email or Password", 401));
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch)
//       return next(new ErrorHandler("Incorrect Email or Password", 401));
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//     sendToken(res, user, `Welcome back, ${user.name}`, 200);
//     res
//       .cookie("access_token", token, { httpOnly: true })
//       .status(200)
//       .json(rest);
//   } catch (error) {
//     console.log(error);
//   }
// };

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    //|| !file
    return next(new ErrorHandler("Please enter all field", 400));
  try {
    let user = await User.findOne({ email });
    if (!user)
      return next(new ErrorHandler("Incorrect Email and Password", 409));

    const comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword)
      return next(new ErrorHandler("Incorrect Email and Password", 409));
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = user._doc;
    res.cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    console.log(error);
  }
};


export const logout = async (req, res, next) => {
  res
    .status(200)
    .cookie("access_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
};

export const getMyProfile = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};


export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}


export const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
}

export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Can not delete admin user');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}


export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}


export const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}


