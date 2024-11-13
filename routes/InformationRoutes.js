import express from 'express';
import {CreateInfo} from '../controllers/InformationController.js';


const router = express.Router();

//POST /api/InformationForm
router.post("/InformationForm", CreateInfo);


export default router;