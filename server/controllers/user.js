import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getActiveUsers, setActiveUsers } from "../index.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // password hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // user & token creation
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    // setting the user state as active by adding it to the map
    const activeUsers = getActiveUsers();
    activeUsers.set(newUser.email, newUser.username);
    setActiveUsers(activeUsers);

    return res.status(200).json({ user: newUser, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.status(404).json({ message: "User does not exist!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invaild credentials!" });
    }
    delete user.password;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // setting the user state as active by adding it to the map
    const activeUsers = getActiveUsers();
    activeUsers.set(user.email, user.username);
    setActiveUsers(activeUsers);

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong with user login" });
  }
};

export const showUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).lean();
    delete user.password;
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const fetchUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: "User not found!" });

    // setting the user state as active by adding it to the map
    const activeUsers = getActiveUsers();
    activeUsers.delete(user.email);
    setActiveUsers(activeUsers);

    res.status(200).json({ message: "user logged out successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
