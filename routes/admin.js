import express from "express";
import { addProduct, deleteproduct,updateOrderStatus, deletequery, deleteuser, getquery, manageuser, viewproduct , getOrder, adminPage} from "../controller/admin.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.get("/admin" , adminPage)

router.get("/manageuser", manageuser)

router.get("/manageuser/delete/:id", deleteuser)

router.get("/addproduct", (req, res)=>{
    res.render("addproduct");
})

router.post("/addproduct", upload.single('coverimage'), addProduct);

router.get("/viewproduct", viewproduct)

router.get("/product/delete/:id", deleteproduct)

router.get("/getquery", getquery)

router.get("/query/delete/:id", deletequery)
router.get("/placeorder" , getOrder)

router.put('/orders/:orderId', updateOrderStatus);

export default router;
