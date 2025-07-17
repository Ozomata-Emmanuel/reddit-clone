import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavigationBar from './components/NavigationBar';
import SinglePostPage from './pages/SinglePostPage';
import CreatePostPage from './pages/CreatePostPage';
import UserProfilePage from './pages/UserProfilePage';
import DashboardOverview from './pages/DashboardOverview';
import DashboardPage from './pages/DashboardPage';
import DashboardUsers from './pages/DashboardUsers';
import DataProvider, { DataContext } from './context/DataContext';
import UserSettings from './pages/UserSettings';
import EditPostPage from './pages/EditPostPage';
import { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import NotFound from './pages/NotFound';

function App() {
  const location = useLocation();
  const { user } = useContext(DataContext);
  
  const isDashboardRoute = () => {
    return location.pathname.startsWith('/dashboard');
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  return (
    <div className="">
      {!isDashboardRoute() && <NavigationBar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<SinglePostPage />} />
        <Route path="/user_profile/:id" element={<UserProfilePage />} />
        <Route path="/edit_post/:id" element={<EditPostPage />} />
        <Route path="/create_post" element={<CreatePostPage />} />
        <Route path="/settings/:id" element={<UserSettings />} />
        <Route path="*" element={<NotFound />} />
        
        {isAdmin() && (
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route index element={<DashboardOverview />} />
            <Route path="overview" element={<DashboardOverview />} />
            <Route path="users" element={<DashboardUsers />} />
          </Route>
        )}
      </Routes>
      <ToastContainer />
    </div>
  );
}

function AppMain() {
  return (
    <DataProvider>
      <Router>
        <App />
      </Router>
    </DataProvider>
  );
}

export default AppMain;