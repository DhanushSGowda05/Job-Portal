import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ApplyJob from './pages//ApplyJob.jsx'
import Applications from './pages/Applications.jsx'
import RecruiterLogin from './components/RecruiterLogin.jsx'
import { useContext } from 'react'
import { AppContext } from './context/AppContext.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AddJob from './pages/AddJob.jsx'
import ManageJobs from './pages/ManageJobs.jsx'
import ViewApplications from './pages/ViewApplications.jsx'
import 'quill/dist/quill.snow.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResumeAnalyser from './pages/ResumeAnalyser.jsx'

const App = () => {
  const { showRecruiterLogin, companyToken } = useContext(AppContext);
  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      <ToastContainer />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/apply-job/:id' element={<ApplyJob />} />
        <Route path='/applications' element={<Applications />} />
        <Route path='/resume-analyzer' element={<ResumeAnalyser />} />
        <Route path="/dashboard" element={<Dashboard />}>
          {companyToken ? <>
            <Route path="add-job" element={<AddJob />} />
            <Route path="manage-jobs" element={<ManageJobs />} />
            <Route path="view-applications" element={<ViewApplications />} />
          </> : null}
        </Route>

      </Routes>
    </div>
  )
}

export default App