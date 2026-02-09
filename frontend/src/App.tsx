import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import JobDetails from './pages/JobDetails';
import OnboardingWizard from './pages/OnboardingWizard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Settings from './pages/Settings';
import MyResumes from './pages/MyResumes';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes (Wrapped in Layout for the Sidebar) */}
        <Route 
          path="/dashboard" 
          element={
            <Layout>
              <Dashboard />
            </Layout>
          } 
        />

        <Route
          path="/onboarding"
          element={
            <Layout>
              <OnboardingWizard />
            </Layout>
          }
        />
        
        <Route 
          path="/profile" 
          element={
            <Layout>
              <Profile />
            </Layout>
          } 
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
        <Route
          path="/resumes"
          element={
            <Layout>
              <MyResumes />
            </Layout>
          }
        />
        <Route
          path="/resume-analysis"
          element={
            <Layout>
              <ResumeAnalyzer />
            </Layout>
          }
        />
        <Route 
  path="/jobs/:id" 
  element={
    <Layout>
      <JobDetails />
    </Layout>
  } 
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;