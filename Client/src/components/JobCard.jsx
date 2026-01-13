import React, { use } from 'react'
import { assets, jobsApplied } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const JobCard = ({ Job }) => {

    const navigate= useNavigate();

    return (
        <div className='border p-6 shadow rounded '>
            <div className='flex justify-between items-center'>
                <img className='h-8'src={Job.companyId.image} alt="" />
            </div>
            <h4 className='font-medium-xl mt-2'>{Job.title}</h4>
            <div className='flex items-center gap-3 mt-2 text-xs'>
                <span className='bg-blue-50 border border-blue-200 px-4 py-1.5 rounded'>
                    {Job.location}
                </span>
                <span className='bg-red-50 border border-red-200 px-4 py-1.5 rounded'>
                    {Job.level}
                </span>
            </div>
            <p className='text-gray-500 text-sm mt-4'dangerouslySetInnerHTML={{ __html: Job.description.slice(0, 150) }}></p>
            <div className='mt-4 flex gap-4 text-sm'>
                <button onClick={() =>{navigate(`/apply-job/${Job._id}`);scrollTo(0,0)}}className='bg-blue-600 text-white px-4 py-2 rounded'>Apply Now</button>
                <button onClick={() =>{navigate(`/apply-job/${Job._id}`);scrollTo(0,0)}}className='text-gray-500 border border-gray-500 px-4 py-2 rounded'>Learn More</button>
            </div>
        </div>
    )
}

export default JobCard