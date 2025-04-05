import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardContent from './DashboardContent';
import StatsContent from './StatsContent';
import ProfileContent from './ProfileContent';
import SubjectsContent from './SubjectsContent';
import QuizzesContent from './QuizzesContent';
import BattlesContent from './BattlesContent';
import ProblemsContent from './ProblemsContent';
import AchievementsContent from './AchievementsContent';
import FriendsContent from './FriendsContent';
import IframeContent from './IframeContent';
import { userData } from './userData';

const Dashboard = ({ handleLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('http://localhost:5175/dashboard');
  
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  // Render different content based on active section
  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return <DashboardContent userData={userData} />;
      case 'stats':
        return <StatsContent />;
      case 'profile':
        return <ProfileContent />;
      case 'subjects':
        return <SubjectsContent userData={userData} />;
      case 'quizzes':
        return <QuizzesContent />;
      case 'battles':
        return <BattlesContent userData={userData} />;
      case 'problems':
        return <ProblemsContent userData={userData} />;
      case 'achievements':
        return <AchievementsContent />;
      case 'friends':
        return <FriendsContent />;
      case 'iframe':
        return <IframeContent url={iframeUrl} />;
      default:
        return <DashboardContent userData={userData} />;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`flex min-h-screen bg-gray-50 ${isPageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      {/* Fixed sidebar with proper z-index */}
      <div className="fixed h-full z-10">
        <Sidebar 
          userData={userData} 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          isCollapsed={isSidebarCollapsed}
          handleLogout={handleLogout}
          setIframeUrl={setIframeUrl}
        />
      </div>
      
      {/* Main content with proper margin to prevent overlap */}
      <div className={`flex-grow transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
       
        
        {/* Content with padding to ensure no overlap */}
        <main> {/* Add top padding to account for fixed header */}
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 