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


export const pendingOrders = async () => {
    try {
        const orders = await Order.find({ status: "pending" });
        return orders;
    } catch (error) {
        console.error("Error fetching pending order:", error);
        throw error;
    }
}

// export const getWeeklyRevenue = async () => {
//     try {
//         // Get the current date
//         const currentDate = new Date();

//         // Calculate the end date of the current week (considering Sunday as the end of the week)
//         const endDate = new Date(currentDate);
//         endDate.setDate(currentDate.getDate() - (currentDate.getDay() + 1) % 7); // Adjust to previous Sunday

//         // Calculate the start date of the current week (considering Sunday as the start of the week)
//         const startDate = new Date(endDate);
//         startDate.setDate(endDate.getDate() - 6); // Adjust to Monday

//         // Query orders within the current week
//         const orders = await Order.find({
//             createdAt: { $gte: startDate, $lte: endDate }
//         });

//         // Calculate weekly revenue by summing up totalAmount of all orders
//         const weeklyRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
//         return weeklyRevenue;
//     } catch (error) {
//         console.error("Error fetching weekly revenue:", error);
//         throw error;
//     }
// };

export const getWeeklyRevenue = async ()=> {
    // Calculate the start date of the current week
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - currentDay);

    // Calculate the end date of the current week
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6); // Assuming Sunday is the end of the week

    try {
        // Find orders within the current week
        const orders = await Order.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate
            },
            status: { $ne: "cancelled" } // Exclude cancelled orders if applicable
        });

        // Calculate the total revenue
        let totalRevenue = 0;
        orders.forEach(order => {
            totalRevenue += order.totalAmount;
        });

        return totalRevenue;
    } catch (error) {
        console.error("Error calculating weekly revenue:", error);
        throw error;
    }
}

// Usage example
// getWeeklyRevenue().then(weeklyRevenue => {
//     console.log("Weekly revenue:", weeklyRevenue);
// }).catch(error => {
//     console.error("Error:", error);
// });



export const shippedOrder = async () => {
    try {
        const orders = await Order.find({ status: "shipped" });
        return orders;
    } catch (error) {
        console.error("Error fetching pending order:", error);
        throw error;
    }
}
