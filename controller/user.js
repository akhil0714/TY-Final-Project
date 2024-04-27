import { User } from "../models/user.js";
import { Query } from "../models/query.js";
// import { Product } from "../models/product.js";
import {Order} from "../models/order.js" // Import Product model for cart functionality
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.render("login", { error: "User Already Exist" })
        let hashedPassword = await bcrypt.hash(password, 10)
        user = await User.create({ name, email, password: hashedPassword })
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
        res.status(200).cookie("token", token).redirect("/");
    }
    catch (e) { console.log(e) };
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email }).select("+password");
        if (!user) return res.render("login", { error1: "Register First" })
        let matchPassword = await bcrypt.compare(password, user.password)
        if (!matchPassword) return res.render("login", { error: "Invalid Email OR Password" })
        if (user.role == "admin") return res.redirect("/admin")
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
        res.status(200).cookie("token", token).redirect("/")
    }
    catch (e) { 
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        }) 
    };
};

export const logout = async (req, res, next) => {
    try {
        res.status(200).cookie("token", "", {
            expires: new Date(Date.now())
        }).redirect("/")
    }
    catch (e) { 
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    };
};

//query 

export const createQuery = async (req, res) => {
    try {
        const { full_name, number, query } = req.body;
        await Query.create({
            full_name,
            number,
            query
        })
        res.redirect("/")
    }
    catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: true
        });
    };
};  
export const placeOrder = async (req, res) => {
    try {
        const {
            full_name,
            phone,
            address,
            city,
            state,
            zipCode,
            payment_method,
            beneficiaryName,
            beneficiaryAccountNumber,
            beneficiaryBankName,
            beneficiaryIFSCCode,
            t_Price,
            hidden_tPrice
        } = req.body;

        // Ensure all required fields are provided
        const requiredFields = ['full_name', 'phone', 'address', 'city', 'state', 'zipCode', 'payment_method'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Check if t_Price is provided and valid
        let totalPrice = parseFloat(t_Price || hidden_tPrice); // Use either t_Price or hidden_tPrice
        
        if (isNaN(totalPrice) || totalPrice <= 0) {
            throw new Error("Invalid or missing total price.");
        }

        //User
        const {token} = req.cookies;
      
        let decoded = await jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded._id);
        
        let user = await User.findById(decoded._id);
        // Create a new order with the provided data
        const newOrder = await Order.create({
            billingAddress: {
                fullName: full_name,
                email: user.email,
                phone,
                address,
                city,
                state,
                zipCode
            },
            payment: {
                method: payment_method,
                details: {
                    beneficiaryName,
                    beneficiaryAccountNumber,
                    beneficiaryBankName,
                    beneficiaryIFSCCode,
                    amount: totalPrice // Use totalPrice directly
                }
            },
            totalAmount: totalPrice, // Use totalPrice directly
            // The status will default to "pending" as per your schema
        });

        // Fetch the saved order data
        const savedOrder = await Order.findById(newOrder._id);

        // Send the saved order data in the response
        // res.status(201).json({ success: true, order: savedOrder });
        res.redirect("/");
        // window.location.href = "/";
    } catch (error) {
        // If an error occurs, log it and send an error response
        console.error("Error placing order:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

