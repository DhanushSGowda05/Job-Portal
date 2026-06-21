import React, { use, useEffect } from 'react'
import {  useParams } from 'react-router-dom'
import { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Loading from '../components/Loading.jsx'
import Navbar from '../components/Navbar.jsx'
import kconvert from 'k-convert';
import moment from 'moment'
import JobCard from '../components/JobCard.jsx'
import Footer from '../components/Footer.jsx'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

const ApplyJob = () => {

  const { id } = useParams();

  const {getToken}=useAuth();

  const [JobData, setJobData] = useState(null);

  const { jobs, backendUrl,userData,userApplications ,fetchUserApplications} = useContext(AppContext)

  const [isAlreadyApplied, setisAlreadyApplied] = useState(false);

  const navigate=useNavigate();
  const fetchJob = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/jobs/${id}`)
      if (data.success) {
        setJobData(data.job);
        console.log(data.job);
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  }

  const applyHandler = async ()=> {
    try {
      if (!userData) {
        return toast.error("Please login to apply for job");
      }
      if (!userData.resume) {
        navigate('/applications');
        return toast.error("Please upload your resume to apply for job");
      }
      const token = await getToken();

      const { data } = await axios.post(backendUrl + '/api/users/apply', {
        jobId: JobData._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        toast.success(data.message);
        fetchUserApplications();
      } else {
        toast.error(data.message);
      }


    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  }

  const checkAlreadyApplied = () => {
    const applied = userApplications.some(application => application.jobId._id === JobData._id);
    setisAlreadyApplied(applied);
  } 

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (JobData && userApplications.length > 0) {
      checkAlreadyApplied();
    }}, [JobData, userApplications,id]);

  return JobData ? (
    <>
      <Navbar />
      <div className='min-h-screen flex flex-cols py-10 container px-4 2xl:px-20 mx-auto'>
        <div className='bg-white text-black rounded-lg w-full'>
          <div className='flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl'>
            <div className='flex flex-cols md:flex-row items-center'>
              <img className='h-24 bg-white rounded-lg p-4 mr-4 max-mb:mb-4 border ' src={JobData.companyId.image} alt="" />
              <div className='text-center md:text-left text-neutral-700'>
                <h1 className='text-2xl sm:text-4xl font-medium '>{JobData.title}</h1>
                <div className='flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-gray-600 mt-2'>
                  <span className='flex items-center gap-2'>
                    <img src={assets.suitcase_icon} alt="" />
                    {JobData.companyId.name}
                  </span>
                  <span className='flex items-center gap-2'>
                    <img src={assets.location_icon} alt="" />
                    {JobData.location}
                  </span>
                  <span className='flex items-center gap-2'>
                    <img src={assets.person_icon} alt="" />
                    {JobData.level}
                  </span>
                  <span className='flex items-center gap-2'>
                    <img src={assets.money_icon} alt="" />
                    CTC :{kconvert.convertTo(JobData.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
              <button onClick={applyHandler}className='bg-blue-600 p-2.5 px-10 text-white rounded'>{isAlreadyApplied ? 'Already Applied' :'Apply Now'}</button>
              <p className='mt-1 text-gray-600'> Posted {moment(JobData.date).fromNow()}</p>
            </div>

          </div>

          <div className='flex flex-col lg:flex-row justify-between items-start'>
            <div className='w-full lg:w-3/5 px-14 mb-20'>
              <h2 className='font-bold text-2xl mb-4'>Job Description</h2>
              <div className="rich-text" dangerouslySetInnerHTML={{ __html: JobData.description }}>
              </div>
              <button onClick={applyHandler} className='bg-blue-600 p-2.5 px-10 text-white rounded mt-10'>{isAlreadyApplied ? 'Already Applied' :'Apply Now'}</button>
            </div>

            <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5' >
              <h2>More Jobs From {JobData.companyId.name}</h2>

              {jobs
                .filter(job => job.companyId._id === JobData.companyId._id && job._id !== JobData._id)
                .filter(job =>{
                  //set of applied job ids
                  const appliedJobIds = new Set(userApplications.map(application => application.jobId && application.jobId._id));
                  //filter out jobs that are already applied
                  return !appliedJobIds.has(job._id);
                }).slice(0, 4)
                .map((Job, index) => (
                  <JobCard key={index} Job={Job} />
                ))}
            </div>


          </div>

        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />

  )
}

export default ApplyJob