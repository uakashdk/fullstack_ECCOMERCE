import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { comparePassword, hashPassword } from "../utils/AuthHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    // Destructure 'question' from req.body
    const { name, email, password, phone, address, question, answer } =
      req.body;

    // Add logs to debug validation issues
    console.log("Received registration data:", {
      name,
      email,
      password,
      phone,
      address,
      question, // Add the question to debug log
      answer,
    });

    // Validations
    if (!name) {
      return res
        .status(400)
        .json({ success: false, error: "Name is required" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: "Email is required" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, error: "Password is required" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password should be at least 6 characters long",
      });
    }
    if (!phone) {
      return res
        .status(400)
        .json({ success: false, error: "Phone number is required" });
    }
    if (!address) {
      return res
        .status(400)
        .json({ success: false, error: "Address is required" });
    }
    if (!question) {
      // Add validation for the question
      return res
        .status(400)
        .json({ success: false, error: "Security question is required" });
    }
    if (!answer) {
      return res
        .status(400)
        .json({ success: false, error: "Security answer is required" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already registered, please login",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create and save the new user
    const user = new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      question, // Include the security question
      answer,
    });
    await user.save();

    // Respond with success
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

//POST LOGIN
// POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    // Compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        // 401 for unauthorized
        success: false,
        message: "Invalid Password",
      });
    }

    // Token generation
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address, // Correcting the typo from `adddress` to `address`
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error); // More informative logging
    res.status(500).send({
      success: false,
      message: "Error in login",
      error: error.message || "Server Error", // Send a more user-friendly error message
    });
  }
};

//forgotPasswordController

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Emai is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

// UPDATE PROFILE CONTROLLLER

export const updateProfilecontroller = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    const user = await userModel.findById(req.user._id);
    // password
    if (password && password.length < 6) {
      return res.json({ message: "Password is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const UpdatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,

        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      UpdatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Updateing Product",
    });
  }
};

// Order Routes
export const getOrdersController = async (req, res) => {
  try {
    // Fetch orders for the logged-in user and populate fields
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo") // Exclude photo field from products
      .populate("buyer", "name"); // Include only the buyer's name

    // Send response with orders, ensuring orders is always an array
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      orders: orders || [], // Fallback to empty array if no orders are found
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    // Send a clear error response
    res.status(500).json({
      success: false,
      message: "Error while retrieving orders",
      error: error.message, // Send only the error message for readability
    });
  }
};

// get all orders controller

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo") // Exclude photo field
      .populate("buyer", "name")
      .sort({ createdAt: -1 }); // Corrected `CreatedAt` to `createdAt`

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting all orders",
    });
  }
};

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};
