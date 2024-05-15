import { Product } from "../models/product.js";
import { Query } from "../models/query.js";
import { User } from "../models/user.js"
import { Order } from '../models/order.js';
import fs from "fs";
import { deliveredOrder, getTotalSales, getWeeklyRevenue, pendingOrders } from "../utils/dashboard.js";

//admin page
export const adminPage = async (req, res)=>{
    const weeklyRevenue = await getWeeklyRevenue();
    const Order = await deliveredOrder();
    const pending = await pendingOrders();
    const totalSales = await getTotalSales();
    res.render("admin", {totalSales , pending, weeklyRevenue, Order});
}

// manage user
export const manageuser = async (req, res) => {
    try {
        let user = await User.find({ role: "user" });
    res.render("manageuser", { user })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const deleteuser = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.id })
    res.redirect("/manageuser");
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const addProduct = async (req, res) => {
    try {
        const { name, amount, description } = req.body;
        let image = '';
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        }
        await Product.create({
            name, 
            amount,
            image,
            description,
        });
        res.redirect("/addproduct");
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


export const viewproduct = async (req, res)=> {
    try {
        const products = await Product.find();
    res.render("viewproduct", {products});
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};

export const deleteproduct = async (req, res)=>{
    try {
        let product = await Product.findById(req.params.id)
    let filePath = product.image
    fs.unlink(`./public/${filePath}`, (err) =>{
        if(err){
            console.error(err);
        }else{
            console.log("File Deleted Successfully.")
        }
    });
    await Product.deleteOne({_id: req.params.id});
    res.redirect("/viewproduct");
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })  
    }
}

export const getquery = async (req, res)=> {
    try {
        const query = await Query.find()
        res.render("query", {query})
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export const deletequery = async (req, res)=> {
    try {
        await Query.deleteOne({_id: req.params.id});
        res.redirect("/getquery");
    } catch (error) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })  
    }
}
export const getOrder = async (req, res) => {
    try {
        // Fetch orders from the database
        const orders = await Order.find();

        // Render the placeOrder view and pass the orders data to it
        res.render("placeOrder", { orders });
    } catch (error) {
        console.error("Error fetching orders for admin:", error);
        res.status(500).json({ success: false, message: "Internal Server Error while fetching orders" });
    }
};
export const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
      // Find the order by ID and update its status
      const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  
      // Check if order was found and updated
      if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };