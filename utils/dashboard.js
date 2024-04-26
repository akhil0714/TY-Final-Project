import { Order } from "../models/order.js";

export const getTotalSales = async () => {
    try {
        // Fetch all orders from the database
        const orders = await Order.find();

        // Calculate total sales by summing up totalAmount of all orders
        const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        return totalSales;
    } catch (error) {
        console.error("Error fetching total sales:", error);
        throw error;
    }
};


export const pendingOrders = async () =>{
    try {
        const orders = await Order.find({status:"pending"});
        return orders;
    } catch (error) {
        console.error("Error fetching pending order:", error);
        throw error;
    }
}

export const getWeeklyRevenue = async () => {
    try {
        // Get the current date
        const currentDate = new Date();
        
        // Calculate the start date of the current week (considering Monday as the start of the week)
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Adjust to Monday
        
        // Calculate the end date of the current week (considering Sunday as the end of the week)
        const endDate = new Date(currentDate);
        endDate.setDate(startDate.getDate() + 6); // Adjust to Sunday

        // Query orders within the current week
        const orders = await Order.find({
            createdAt: { $gte: startDate, $lte: endDate }
        });

        // Calculate weekly revenue by summing up totalAmount of all orders
        const weeklyRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        return weeklyRevenue;
    } catch (error) {
        console.error("Error fetching weekly revenue:", error);
        throw error;
    }
};


export const shippedOrder = async () =>{
    try {
        const orders = await Order.find({status:"shipped"});
        return orders;
    } catch (error) {
        console.error("Error fetching pending order:", error);
        throw error;
    }
}
