// Assuming this is your index.js file in the routes directory

import express from "express";
import { createQuery, login, logout, placeOrder, register } from "../controller/user.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.get("/cart", isAuthenticated,(req, res)=>{
    res.render("cart"); // Render cart.ejs
});

router.get("/login", (req, res)=>{
    res.render("login");
});

router.post("/login", login);

router.get("/logout", logout);

router.post("/register", register);

router.post("/createQuery", createQuery);

router.post("/placeOrder", placeOrder);

export default router;
