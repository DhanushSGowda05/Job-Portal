import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const [searchFilter,setsearchFilter] = useState({
        title:'',
        location:''
    })

    const [isSearched,setisSearched] = useState(false)

    const [jobs,setjobs]=useState([])

    const [showRecruiterLogin,setshowRecruiterLogin]=useState(false)    

    const fetchJobs=async()=>{
        setjobs(jobsData)
    }
               
    useEffect(()=>{
        fetchJobs();
    },[])

    const value = {
        setsearchFilter,searchFilter,
        setisSearched,isSearched,
        jobs,setjobs,
        showRecruiterLogin,setshowRecruiterLogin

    };
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>)
}