import { useState } from 'react';

import Sidebar from './Sidebar';
import Header from './Header';
import StatsCards from './Statscards';
import Usertable from './Usertable';

import '../styles/Dashboard.scss';

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="dashboard-main">
        <Header onMenuClick={toggleSidebar} />
        <div className="dashboard-content">
          <h1 className="page-title">Users</h1>
          <StatsCards />
          <Usertable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;