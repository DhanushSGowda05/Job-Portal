import Company from "../models/Company.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from 'cloudinary';
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from "../models/jobApplication.js";

// Register a new company

export const registerCompany = async (req, res) => {

    const { name, email, password } = req.body;

    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const companyExists = await Company.findOne({ email: email });

        if (companyExists) {
            return res.status(400).json({ success: false, message: "Company already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path
        );

        const company = await Company.create({
            name,
            email,
            password: hashedPassword,
            image: imageUpload.secure_url
        })

        res.json({
            success: true, message: "Company registered successfully",
            company:
            {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id)
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

//company login
export const loginCompany = async (req, res) => {

    
    try {
        const { email, password } = req.body;
        const company = await Company.findOne({ email: email });

        if (!company) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        if (await bcrypt.compare(password, company.password)) {
            res.json({
                success: true, message: "Login successful",
                company:
                {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image
                },
                token: generateToken(company._id)
            })
        }
        else {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }}
    // Get company data

    export const getCompanyData = async (req, res) => {
       
        try {
            const company=req.company
            res.json({ success: true, company  });  
        } catch (error) {
            res.json({ success: false, message: "Internal server error", error: error.message });
        }

    }

    // post a new job

    export const postJob = async (req, res) => {
        const { title, description, location,category, salary ,level} = req.body;
        
        const companyId = req.company._id;
        
        try {
            
            const newJob = new Job({
                companyId,
                title,
                description,
                location,
                salary,
                level,
                category,
                date: Date.now(),
            })

            await newJob.save();

            res.json({ success: true, message: "Job posted successfully", job: newJob });
        } catch (error) {
            
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        }
    }

    //Get company job Aplicants

    export const getJobApplicants = async (req, res) => {
        try {
            const companyId = req.company._id;
            //find job applications for user
            const applications = await JobApplication.find({ companyId })
            .populate('userId','name image resume')
            .populate('jobId','title location category salary level ')
            .exec();

            return res.json({ success: true, applications });
        } catch (error) {
            res.json({ success: false, message: "Internal server error", error: error.message });
        }
    }

    //get company posted jobs

    export const getPostedJobs = async (req, res) => {
        try {
            const companyId = req.company._id;
            const jobs = await Job.find({ companyId: companyId });
            
            //to do adding no of applicants info in data
            const jobsData = await Promise.all(jobs.map(async (job) => {
                const applicantsCount = await JobApplication.find({ jobId: job._id });
                return {...job.toObject(), applicantsCount: applicantsCount.length };
            }))

            res.json({ success: true, jobsData });
        } catch (error) {
            res.json({ success: false, message: error.message });   
        }
    }

    //change job application status
    export const changeApplicationStatus = async (req, res) => {
        try {
            const {id,status}=req.body
        //find job application by id and update status
        await JobApplication.findOneAndUpdate({_id: id}, {status});

        res.json({ success: true, message: "Application status updated successfully" });
        } catch (error) {
            res.json({ success: false, message: "Internal server error", error: error.message });
        }
    }

    //change job visibility
    export const changeJobVisibility = async (req, res) => {
        try {
            const {id}=req.body

            const companyId = req.company._id;

            const job = await Job.findById(id);
            if(companyId.toString()===job.companyId.toString()){
                job.visible = !job.visible;
            }
            await job.save();

            res.json({ success: true, message: "Job visibility changed successfully", job });
        } catch (error) {
            res.json({ success: false, message: "Internal server error", error: error.message });
        }
    }