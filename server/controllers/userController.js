import Job from '../models/Job.js';
import JobApplication from '../models/jobApplication.js';
import User from '../models/User.js'
import {v2 as cloudinary} from 'cloudinary';

//Get user data
export const getUserData = async (req, res) => {
        
    const userId = req.auth.userId;
    try {
        
        const user = await User.findById(userId).select("-password");
        if(!User){
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    }
    catch (error) { 
        res.json({ success: false, message: "Internal server error", error: error.message });
    }
}

//apply for job
export const applyForJob = async (req, res) => {
    const {jobId} =req.body;

    const userId = req.auth.userId;

    try {
        const isAlreadyApplied = await JobApplication.find({ jobId,userId });
        if(isAlreadyApplied.length>0){
            return res.status(400).json({ success: false, message: "User has already applied for this job" });
        }

        const jobData=await Job.findById(jobId);
        if(!jobData){
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        await JobApplication.create({
            companyId:jobData.companyId,
            userId,
            jobId,
            date:Date.now()
        });

        res.json({ success: true, message: "Job application submitted successfully" });
    } catch (error) {
        res.json({ success: false, message: "Internal server error", error: error.message });   
    }
}

//get user applied jobs
export const getUserJobApllications = async (req, res) => {
    try {
        const userId = req.auth.userId;

        const applications = await JobApplication.find({ userId })
        .populate('companyId','name email image')
        .populate('jobId','title description location category salary level date')
        .exec();

        if (applications.length===0){
            return res.status(404).json({ success: false, message: "No job applications found" });
        }
        
        return res.json({ success: true, applications  });
    } catch (error) {
        res.json({ success: false, message: "Internal server error", error: error.message });
    }
}

//update user profile
export const updateUserResume = async (req, res) => {
    try {
        const userId = req.auth.userId;

        const resumeFile= req.file;

        const userData= await User.findById(userId);

        if(resumeFile){
            const resumeUpload= await cloudinary.uploader.upload(resumeFile.path);
            userData.resume=resumeUpload.secure_url;
        }

        await userData.save();

        res.json({ success: true, message: "User resume updated successfully", resume:userData.resume });

    } catch (error) {
        res.json({ success: false, message: "Internal server error", error: error.message });
    }
}