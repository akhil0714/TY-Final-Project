import mongoose from "mongoose";

const querySchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true,
        unique:true
    },
    query:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

export const Query = mongoose.model("Query", querySchema);