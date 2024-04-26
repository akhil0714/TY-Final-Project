import {app} from "./app.js";
import { connectDB } from "./data/database.js";

// Database connection
connectDB();

app.listen(process.env.PORT, ()=>{
    console.log(`Server is working on ${process.env.PORT}`);
});