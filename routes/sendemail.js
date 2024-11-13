import express from "express";
import { sendMailbyEmail } from "../controllers/sendMail.js";

const router = express.Router();

router.get('/sendMailbyEmail',sendMailbyEmail);
export default router;