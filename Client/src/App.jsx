import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ApplyJob from './pages/Seeker/ApplyJob.jsx'
import Applications from './pages/Seeker/Applications.jsx'
import RecruiterLogin from './components/RecruiterLogin.jsx'
import { useContext } from 'react'
import { AppContext } from './context/AppContext.jsx'
import Dashboard from './pages/Recruiter/Dashboard.jsx'
import AddJob from './pages/Recruiter/AddJob.jsx'
import ManageJobs from './pages/Recruiter/ManageJobs.jsx'
import ViewApplications from './pages/Recruiter/ViewApplications.jsx'
import 'quill/dist/quill.snow.css';
import PostSignUpHandler from './auth/PostSignUpHandler.jsx'


const App = () => {
  const { showRecruiterLogin } = useContext(AppContext);
  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      {/*<PostSignUpHandler/>*/}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/apply-job/:id' element={<ApplyJob />} />
        <Route path='/applications' element={<Applications />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="add-job" element={<AddJob />} />
          <Route path="manage-jobs" element={<ManageJobs />} />
          <Route path="view-applications" element={<ViewApplications />} />
        </Route>

      </Routes>
    </div>
  )
}

export default App