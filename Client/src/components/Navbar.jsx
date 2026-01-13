import React from 'react'
import { assets } from '../assets/assets'
import { useClerk, useUser, UserButton } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'

const Navbar = () => {

    const { openSignUp } = useClerk();
    const { user } = useUser();
    const navigate = useNavigate();
    const { setshowRecruiterLogin}= useContext(AppContext);

    const handleSeekerSignup = () => {
        localStorage.setItem("signupRole", "seeker");
        openSignUp();
    };
    return (
        <div className="shadow py-4">
            <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
                <img onClick={() => navigate('/')} className='cursor-pointer' src={assets.logo} alt="" />
                {
                    user ? <div className='flex items-center gap-3'>
                        <div className='bg-gradient-to-r from-yellow-500 to-pink-950 text-white px-6 sm:px-9 py-2 rounded-full'>
                            <Link to={'/resume-analyzer'}>Resume Analyser</Link>
                        </div>
                        <div className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full'>
                            <Link to={'/applications'}>Applied Jobs</Link>
                        </div>
                        <p> | </p>
                        <p className='max-sm:hidden'>
                            Hi, {user?.firstName} {user?.lastName}
                        </p>

                        <UserButton />
                    </div>
                        : <div className="flex gap-4 max-sm:text-xs">
                            <button onClick={e => setshowRecruiterLogin(true)} className='text-gray-600'>Recruiter Login</button>
                            <button onClick={e => handleSeekerSignup()} className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full'>Login</button>
                        </div>

                }

            </div>
        </div>
    )
}

export default Navbar