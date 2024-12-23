import express from 'express';
import { addCandidateToJD, createJD, deleteJD, editJD, getCandidatesFromJD, getJDsByUser, lockJD, ShowJDs, ShowLockedJDs, singleJD, unlockJD, removeCandidateFromJD } from '../controllers/jdController.js'; 
import { isAuthenticated, isClient, isRecruiter, protect } from '../middleware/auth.js';

const router = express.Router();

// JD ROUTES

// POST /api/jd/create - to create a jd
router.post('/jd/create', createJD, isAuthenticated);

//GET /api/jd/:id - Get a single JD by ID
router.get('/jd/:id', singleJD, isAuthenticated);

//GET /api/showJDs - show all JDs
router.get('/showJDs', ShowJDs, isAuthenticated);

//PUT - /api/jd/edit/:id - edit a jd
router.put('/jd/edit/:id', editJD);

//DELETE - /api/jd/delete/:id
router.delete('/jd/delete/:id', deleteJD);

//PUT - /api/lock/:jd_id
router.put('/lock/:id',  lockJD);

//GET - /api/locked-jds
router.get('/locked-jds',  ShowLockedJDs);

//PUT - /api/jds/unlock/:id
router.put('/unlock/:id', unlockJD, isAuthenticated, isRecruiter);

//POST - /api/add-candidate
router.post('/add-candidate', addCandidateToJD);

//GET - /api/ShowUserJD
router.get('/ShowUserJD',isAuthenticated, getJDsByUser);

//GET - /jds/:jd_id/candidates
router.get('/jds/:jd_id/candidates', getCandidatesFromJD);

//POST - /api/jd/remove-candidate
router.post('/jd/remove-candidate', removeCandidateFromJD);

export default router;
