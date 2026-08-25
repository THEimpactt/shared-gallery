const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    req.session.isLoggedin = true;

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    req.session.save((err) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to create session."
        });
      }

      res.status(200).json({
        message: "Login successful",
        user: req.session.user
      });
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Internal server error"
    });
  }
};

exports.signup = [

  check("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required."),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  async (req, res) => {
    try {

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.array()
        });
      }

      const { username, email, password } = req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          message: "An account with this email already exists."
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        username,
        email,
        password: hashedPassword
      });

      await user.save();

      res.status(201).json({
        message: "Account created successfully."
      });

    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "Internal server error."
      });
    }
  }
];

exports.logout = (req, res) => {

  req.session.destroy((err) => {

    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to logout."
      });
    }

    res.clearCookie("connect.sid");

    res.status(200).json({
      message: "Logged out successfully."
    });
  });
};

exports.getCurrentUser = (req, res) => {

  if (!req.session.isLoggedin) {
    return res.status(401).json({
      loggedIn: false
    });
  }

  res.status(200).json({
    loggedIn: true,
    user: req.session.user
  });
};