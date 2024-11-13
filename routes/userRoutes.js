import express from "express";
import { allUsers, createUserJDsHistory, deleteUser, editUser, singleUser } from "../controllers/userController.js";
const router = express.Router();

//user routes

//GET - /api/allUsers
router.get('/allUsers', allUsers);
//GET - /api/singleUser
router.get('/user/:id', singleUser);
//PUT - /api/edit/id
router.patch('/user/edit/:id', editUser);
//DELETE - /user/delete/id
router.delete('/user/delete/:id', deleteUser);
//POST - /api/user/jobhistory
router.post('/user/jdhistory', createUserJDsHistory);

export default router;