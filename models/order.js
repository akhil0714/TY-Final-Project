import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    billingAddress: {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone :{
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        }
    },
    payment: {
        method: {
            type: String,
            enum: ["UPI", "NEFT", "COD"],
            required: true
        },
        details: {
            beneficiaryName: String,
            beneficiaryAccountNumber: String,
            beneficiaryBankName: String,
            beneficiaryIFSCCode: String,
            
        }
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending","delivered","dispatched"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => new Date(createdAtVal).toLocaleString()
    }
});

export const Order = mongoose.model("Order", orderSchema);