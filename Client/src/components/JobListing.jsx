import React, { useEffect } from 'react'
import { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, JobCategories, JobLocations, } from '../assets/assets'
import JobCard from './JobCard'

const JobListing = () => {
    const { searchFilter, isSearched, setsearchFilter, jobs } = useContext(AppContext)


    const [showFilters, setshowFilters] = useState(false);

    const [currentPage, setcurrentPage] = useState(1);

    const [selectedCategories, setselectedCategories] = useState([]);
    const [selectedLocations, setselectedLocations] = useState([]);


    const [filteredJobs, setfilteredJobs] = useState(jobs);

    const handleCategoryChange = (category) => {
        setselectedCategories(
            prev => {
                if (prev.includes(category)) {
                    return prev.filter(cat => cat !== category);
                } else {
                    return [...prev, category];
                }
            }
        )

    }

    const handleLocationChange = (location) => {
        setselectedLocations(
            prev => {
                if (prev.includes(location)) {
                    return prev.filter(loc => loc !== location);
                } else {
                    return [...prev, location];
                }
            }
        )

    }

    useEffect(() => {
        const matchCategory = (job) => {
            if (selectedCategories.length === 0) return true;
            return selectedCategories.includes(job.category);
        }
        const matchLocation = (job) => {
            if (selectedLocations.length === 0) return true;
            return selectedLocations.includes(job.location);
        }
        const matchTitle = (job) => {
            if (searchFilter.title === '') return true;
            return job.title.toLowerCase().includes(searchFilter.title.toLowerCase());
        }
        const matchSearchLocation = (job) => {
            if (searchFilter.location === '') return true;
            return job.location.toLowerCase().includes(searchFilter.location.toLowerCase());
        }
        const newFilteredJobs = jobs.slice().reverse().filter(job => matchCategory(job) && matchLocation(job) && matchTitle(job) && matchSearchLocation(job));
        setfilteredJobs(newFilteredJobs);
        setcurrentPage(1);
    },[jobs, selectedCategories, selectedLocations, searchFilter]);

    return (

        <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8 '>
            {/* sidebar */}
            <div className='w-full lg:w-1/4 bg-white px-4'>
                {/* search filter */}
                {
                    isSearched && (searchFilter.title !== '' || searchFilter.location !== '') &&
                    (
                        <>
                            <h3 className='font-medium text-lg mb-4'>Current Search</h3>
                            <div className='mb-4 text-gray-600'>
                                {searchFilter.title && (
                                    <span className='inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded'>
                                        {searchFilter.title}
                                        <img onClick={e => setsearchFilter(prev => ({ ...prev, title: "" }))} className='cursor-pointer pt-1' src={assets.cross_icon} />
                                    </span>
                                )}

                                {searchFilter.location && (
                                    <span className='ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded'>
                                        {searchFilter.location}
                                        <img onClick={e => setsearchFilter(prev => ({ ...prev, location: "" }))} className='cursor-pointer pt-1' src={assets.cross_icon} />
                                    </span>
                                )}
                            </div>
                        </>
                    )

                }
                <button onClick={e => setshowFilters(prev => !prev)} className='px-6 py-1.5 rounded border border-gray-400 lg-hidden'>
                    {showFilters ? "Close" : "Filters"}
                </button>
                {/*search by catogories */}
                <div className={showFilters ? '' : 'max-lg:hidden'}>
                    <h4 className='font-medium text-lg py-4'>Search By Categories</h4>
                    <ul className='space-y-4 text-gray-600'>
                        {JobCategories.map((category, index) => (
                            <li key={index} className='flex gap-3 items-center cursor-pointer' >
                                <input
                                    className='scale-125'
                                    type="checkbox"
                                    onChange={() => handleCategoryChange(category)}
                                    checked={selectedCategories.includes(category)}
                                />
                                {category}
                            </li>
                        ))}
                    </ul>
                </div>
                {/*search by location */}
                <div className={showFilters ? '' : 'max-lg:hidden'}>
                    <h4 className='font-medium text-lg py-4 pt-14'>Search By Location</h4>
                    <ul className='space-y-4 text-gray-600'>
                        {JobLocations.map((location, index) => (
                            <li key={index} className='flex gap-3 items-center cursor-pointer' >
                                <input className='scale-125' type="checkbox"
                                    onChange={() => handleLocationChange(location)}
                                    checked={selectedLocations.includes(location)} />
                                {location}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* job listings */}
            <section className='w-full lg:w-3/4 text-gray-800 max-lg:px-4'>
                <h3 className='font-medium text-3xl py-2' id='job-list'>Latest Jobs</h3>
                <p className='mb-8'>Get your Desired Jobs from Top Companies</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                    {/* Job Card */}
                    {filteredJobs.slice((currentPage - 1) * 6, currentPage * 6).map((job, index) => (
                        <JobCard key={index} Job={job} />
                    ))}
                </div>

                {/* pagination */}
                {filteredJobs.length > 0 && (
                    <div className='flex items-center justify-center space-x-2 mt-10'>
                        <a href="#job-list">
                            <img onClick={() => setcurrentPage(Math.max(currentPage - 1, 1))} src={assets.left_arrow_icon} alt="" />
                        </a>
                        {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map((_, index) => (
                            <a key={index} href="#job-list">
                                <button onClick={() => setcurrentPage(index + 1)} className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${currentPage === index + 1 ? 'bg-blue-100 text-blue-500' : 'text-gray-500 '}`}>{index + 1}</button>
                            </a>

                        ))}
                        <a href="#job-list">
                            <img onClick={() => setcurrentPage(Math.min(currentPage + 1, Math.ceil(filteredJobs.length / 6)))} src={assets.right_arrow_icon} alt="" />
                        </a>
                    </div>
                )
                }
            </section>
        </div>
    )
}

export default JobListing