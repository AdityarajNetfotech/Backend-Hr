import express from 'express';
import { deleteCandidate, editCandidate, postcandidate, showAllCandidate, singleCandidate } from '../controllers/CandidateControlles.js';

const router = express.Router();

//GET - /api/candidate/postcandidate
router.post('/candidate/postcandidate', postcandidate);
//GET - /api/candidate/:id
router.get('/candidate/:id',singleCandidate);
//GET - /api/candidate/getAllcandidate
router.get('/candidates', showAllCandidate); 
//PUT - /api/edit/id
router.put('/candidate/edit/:id', editCandidate);
//DELETE - api/candidate/delete/id
router.delete('/candidate/delete/:id', deleteCandidate);

export default router;
