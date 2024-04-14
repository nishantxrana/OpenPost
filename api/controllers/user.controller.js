import { errorDisplay } from "../../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const test = (req, res) => {
  console.log();
  res.send("Testing from controller");
};

export const updateInfo = async (req, res, next) => {
  if (req.params.userId !== req.user.id) {
    return next(
      errorDisplay(400, "your are not allowed to update this user info")
    );
  }
  if (req.body.password) {
    if (req.body.password.length < 5) {
      return next(errorDisplay(400, "password must be at least 5 characters"));
    }
    req.body.password = await bcryptjs.hash(req.body.password, 10);
  } else {
    delete req.body.password;
  }
  if (req.body.username) {
    if (req.body.username === "") {
      return next(errorDisplay(400, "username must be at least 4 characters"));
    }
    if (req.body.username.length < 4) {
      return next(errorDisplay(400, "username must be at least 4 characters"));
    }
    if (req.body.username.length > 20) {
      return next(
        errorDisplay(400, "username must be less than 20 characters")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorDisplay(400, "username cannot contain spaces"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorDisplay(400, "username can only contain alphabets & numbers")
      );
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorDisplay(400, "username cannot contain capital letters"));
    }
  } else {
    delete req.body.username;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          password: await req.body.password,
          profilePic: await req.body.profilePic,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.userId !== req.user.id) {
    return next(errorDisplay(400, "your are not allowed to delete this user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const logOut =  (req, res, next) => {
  try {
    res.clearCookie("login_token");
    res.status(200).json({ success: true, message: "successfully Logged Out" });
  } catch (error) {
    next(error);
  }
};
