import express from "express";
import path from "path";
import userRouter from "./routes/user.js";
import adminRouter from "./routes/admin.js";
import cookieparser from "cookie-parser";
import { config } from "dotenv";
import { User } from "./models/user.js";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import { Product } from "./models/product.js";


export const app = express();

config({
    path: "./data/config.env"
});

app.use(bodyParser.json());

app.use(cookieparser());
// Middleware
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: false }))
// app.use(userRouter);
app.use("/", userRouter);
app.use(adminRouter);

app.set("view engine", "ejs")

app.get("/", async (req, res) => {
    const { token } = req.cookies;
    const products = await Product.find();
    if (!token) return res.render("main", { products });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(decoded._id);
    res.render("main", { user, products });
});