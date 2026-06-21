import React, { use } from 'react'
import { assets } from '../assets/assets'
import { useContext ,useRef} from 'react'
import { AppContext } from '../context/AppContext'
const Hero = () => {

    const {setsearchFilter,setisSearched}=useContext(AppContext)

    const titleRef= useRef(null)
    const locationRef= useRef(null)

    const onSearch=()=>{
        setsearchFilter({
            title:titleRef.current.value,
            location:locationRef.current.value
        })
        setisSearched(true)
        console.log({
            title:titleRef.current.value,
            location:locationRef.current.value
        })
    }

    return (
        <div className='container 2xl:px-20 mx-auto my-10'>
            <div className='bg-gradient-to-r from-purple-700 to-purple-950 text-white py-16 text-center rounded-xl p-10   gap-6 max-sm:gap-4 max-sm:p-5'>
                <h2 className='text-2xl md:text-3xl lg:text-4xl font-medium mb-4'> Over 10,000+ jobs to apply</h2>
                <p className='mb-8 max-w-xl mx-auto text-sm font-light px-5'>Your next Big Career Move Starts Right Here- Explore more</p>
                <div className='flex items-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto'>
                    <div className='flex items-center border border-gray-300 rounded m-1'>
                        <img className='h-4 sm:h-5 pl-2' src={assets.search_icon} alt="" />
                        <input type="text" placeholder='Search for Jobs' className='max-sm:text-xs text-gray-800 p-2 rounded bg-white outline-none w-full' ref={titleRef}/>

                    </div>
                    <div className='flex items-center border border-gray-300 rounded m-1'>
                        <img className='h-4 sm:h-5 pl-2' src={assets.location_icon} alt="" />
                        <input type="text" placeholder='location' className='max-sm:text-xs  text-gray-800 p-2 rounded bg-white  outline-none w-full' ref={locationRef}/>

                    </div>
                    <button onClick={onSearch} className='bg-blue-600 px-6 py-2 rounded text-white m-1'>Search</button>
                </div>
            </div>
            <div className='border border-gray-300 shadow-md mx-auto mt-5 p-6 rounded-md flex'>
                <div className='flex flex-wrap items-center justify-between w-full max-sm:flex-col max-sm:gap-4'>
                    <p className='font-medium'>Trusted By</p>
                    <img className='h-6' src={assets.microsoft_logo} alt="" />
                    <img className='h-6' src={assets.walmart_logo} alt="" />
                    <img className='h-6' src={assets.adobe_logo} alt="" />
                    <img className='h-6' src={assets.samsung_logo} alt="" />
                    <img className='h-6' src={assets.accenture_logo} alt="" />
                    <img className='h-6' src={assets.amazon_logo} alt="" />
                </div>
            </div>
        </div>
    )
}

export default Hero