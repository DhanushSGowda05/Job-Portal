import express from 'express';
import { getJobs, getJobById } from '../controllers/jobController.js';


const router = express.Router();

//Route to get all data

router.get('/', getJobs);

//Route to get a single job
router.get('/:id', getJobById);

export default router;