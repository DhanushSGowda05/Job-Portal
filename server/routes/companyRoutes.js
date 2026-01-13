import express from 'express';
import { registerCompany, loginCompany,getCompanyData, getPostedJobs, getJobApplicants, postJob, changeApplicationStatus, changeJobVisibility } from '../controllers/companyController.js';  
import upload from '../config/multer.js';
import  protectCompany  from '../middleware/authmiddleware.js';


const router = express.Router();

//register company
router.post('/register',upload.single('image'), registerCompany);

//company login
router.post('/login', loginCompany);

//get company data
router.get('/company',protectCompany, getCompanyData);

//post job
router.post('/post-job',protectCompany,postJob);

//get job applicants
router.get('/applicants',protectCompany, getJobApplicants);

//company list
router.get('/list-jobs',protectCompany,getPostedJobs);

//change applications status
router.post('/change-status',protectCompany,changeApplicationStatus);

//change apply visibility
router.post('/change-visibility',protectCompany,changeJobVisibility);

export default router;