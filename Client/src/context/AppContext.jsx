import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";


export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const {user} = useUser();
    const {getToken}= useAuth();

    const [searchFilter, setsearchFilter] = useState({
        title: '',
        location: ''
    })

    const [isSearched, setisSearched] = useState(false)

    const [jobs, setjobs] = useState([])

    const [showRecruiterLogin, setshowRecruiterLogin] = useState(false)

    const [companyToken, setcompanyToken] = useState(null)

    const [companyData, setcompanyData] = useState(null)
    
    const [userData, setuserData] = useState(null)
    const [userApplications, setuserApplications] = useState([])
    
    //function to fetch all jobs
    const fetchJobs = async () => {
        
        try {
            const {data}= await axios.get(backendUrl + '/api/jobs')
            if (data.success) {
                setjobs(data.jobs);
                console.log(data.jobs);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message || "An error occurred");
        }
    }
    //fetch company data
    const fetchCompanyData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/company/company', { headers: { token: companyToken } })
            if (data.success) {
                setcompanyData(data.company);
                console.log(data);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message || "An error occurred");
        }
    }

    //fecth userdata

    const fetchUserData = async () => {
        try {
            const token = await getToken();
            const {data} =await axios.get(backendUrl + '/api/users/user',
            {headers:{Authorization:`Bearer ${token}`}})
            if (data.success) {
                setuserData(data.user);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message || "An error occurred");
        }
    }

    //users applied applications can be fetched here
    const fetchUserApplications = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(backendUrl + '/api/users/applications', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setuserApplications(data.applications);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message || "An error occurred");
        }
    }

    useEffect(() => {
        fetchJobs();

        const storedCompanyToken = localStorage.getItem("companyToken");

        if (storedCompanyToken) {
            setcompanyToken(storedCompanyToken);
        }
    }, [])

    useEffect(() => {
        if (companyToken) {
            fetchCompanyData();
        }
    }, [companyToken])

    useEffect(() => {
        if (user) {
            fetchUserData();
            fetchUserApplications();
        }}, [user])

    
    const value = {
        setsearchFilter, searchFilter,
        setisSearched, isSearched,
        jobs, setjobs,
        showRecruiterLogin, setshowRecruiterLogin,
        companyToken, setcompanyToken,
        companyData, setcompanyData,
        backendUrl,
        userData, setuserData,
        userApplications, setuserApplications,
        fetchUserData,
        fetchUserApplications

    };
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>)
}