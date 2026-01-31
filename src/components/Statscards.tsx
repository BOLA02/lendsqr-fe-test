import type { FC, SVGProps } from 'react';
import { useState, useEffect } from 'react';

import ActiveUsers from '../assets/active_users.svg?react';
import UserIcon from '../assets/users_icons.svg?react';
import UserLoans from '../assets/users_loans.svg?react';
import UserSaving from '../assets/users_saving.svg?react';

import '../styles/Statscards.scss';

interface StatCard {
  icon: FC<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  bgColor: string;
}

interface User {
  id: number;
  status: 'Active' | 'Inactive' | 'Pending' | 'Blacklisted';
  educationAndEmployment: {
    loanRepayment: string;
  };
}

const StatsCards: React.FC = () => {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    usersWithLoans: 0,
    usersWithSavings: 0
  });

  useEffect(() => {
    calculateStats();
    
    // Listen for localStorage changes 
    const handleStorageChange = () => {
      calculateStats();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event when data is updated in same tab
    window.addEventListener('userDataUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataUpdated', handleStorageChange);
    };
  }, []);

  const calculateStats = () => {
    const cachedUsers = localStorage.getItem('usersData');
    
    if (cachedUsers) {
      try {
        const users: User[] = JSON.parse(cachedUsers);
        
        const totalUsers = users.length;
        const activeUsers = users.filter(user => user.status === 'Active').length;
        
        // Calculate users with loans
        const usersWithLoans = users.filter(user => {
          const loanAmount = user.educationAndEmployment?.loanRepayment;
          if (!loanAmount) return false;
          
          // Extract numeric value from loan repayment string (e.g., "₦24821" or "24821")
          const numericValue = loanAmount.replace(/[^0-9]/g, '');
          return numericValue && parseInt(numericValue) > 0;
        }).length;
        
        // Calculate users with savings (estimate based on active users - 65% of active users)
        const usersWithSavings = Math.floor(activeUsers * 0.65);
        
        setUserStats({
          totalUsers,
          activeUsers,
          usersWithLoans,
          usersWithSavings
        });
      } catch (error) {
        console.error('Error calculating stats:', error);
      }
    }
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const stats: StatCard[] = [
    {
      icon: UserIcon,
      label: 'USERS',
      value: formatNumber(userStats.totalUsers),
      bgColor: 'rgba(223, 24, 255, 0.1)',
    },
    {
      icon: ActiveUsers,
      label: 'ACTIVE USERS',
      value: formatNumber(userStats.activeUsers),
      bgColor: 'rgba(87, 24, 255, 0.1)',
    },
    {
      icon: UserLoans,
      label: 'USERS WITH LOANS',
      value: formatNumber(userStats.usersWithLoans),
      bgColor: 'rgba(245, 95, 68, 0.1)',
    },
    {
      icon: UserSaving,
      label: 'USERS WITH SAVINGS',
      value: formatNumber(userStats.usersWithSavings),
      bgColor: 'rgba(255, 51, 102, 0.1)',
    },
  ];

  return (
    <div className="stats-cards">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: stat.bgColor }}>
            <stat.icon />
          </div>
          <div className="stat-label">{stat.label}</div>
          <div className="stat-value">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;