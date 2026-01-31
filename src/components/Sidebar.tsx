import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SwitchOrganisation from '../assets/organisation.svg?react';
import ArrowDown from '../assets/arrow_down.svg?react'
import Home from '../assets/home.svg?react';

import Users from '../assets/users.svg?react';
import Guarantors from '../assets/guarantor.svg?react';
import Loans from '../assets/loans.svg?react';
import Decision from '../assets/decision.svg?react';
import Savings from '../assets/savings.svg?react';
import LoanRequests from '../assets/request_loan.svg?react';
import Whitelist from '../assets/whitelist.svg?react';
import Karma from '../assets/karma.svg?react';

import Organisation from '../assets/organisation.svg?react';
import LoanProduct from '../assets/products.svg?react';
import SavingProduct from '../assets/savings_products.svg?react';
import Fees from '../assets/fees.svg?react';
import Transactions from '../assets/transaction.svg?react';
import Services from '../assets/services.svg?react';
import ServicesAccount from '../assets/services_account.svg?react';
import Settlements from '../assets/settlements.svg?react';
import Report from '../assets/reports.svg?react';

import Preferences from '../assets/preferences.svg?react';
import FeesPricing from '../assets/fees_and_pricing.svg?react';
import Audit from '../assets/audit_logs.svg?react';

import Logout from '../assets/logout.svg?react'

import '../styles/Sidebar.scss';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [activeItem, setActiveItem] = useState<string>('Users');
  const navigate = useNavigate();

  const menuItems = [
    {
      section: 'CUSTOMERS',
      items: [
        { icon: Users, label: 'Users' },
        { icon: Guarantors, label: 'Guarantors' },
        { icon: Loans, label: 'Loans' },
        { icon: Decision, label: 'Decision Models' },
        { icon: Savings, label: 'Savings' },
        { icon: LoanRequests, label: 'Loan Requests' },
        { icon: Whitelist, label: 'Whitelist' },
        { icon: Karma, label: 'Karma' },
      ],
    },
    {
      section: 'BUSINESSES',
      items: [
        { icon: Organisation, label: 'Organization' },
        { icon: LoanProduct, label: 'Loan Products' },
        { icon: SavingProduct, label: 'Savings Products' },
        { icon: Fees, label: 'Fees and Charges' },
        { icon: Transactions, label: 'Transactions' },
        { icon: Services, label: 'Services' },
        { icon: ServicesAccount, label: 'Service Account' },
        { icon: Settlements, label: 'Settlements' },
        { icon: Report, label: 'Reports' },
      ],
    },
    {
      section: 'SETTINGS',
      items: [
        { icon: Preferences, label: 'Preferences' },
        { icon: FeesPricing, label: 'Fees and Pricing' },
        { icon: Audit, label: 'Audit Logs' },
      ],
    },
  ];

  const handleMenuItemClick = (label: string) => {
    setActiveItem(label);
    // Add your navigation logic here
    console.log(`Navigating to ${label}`);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    
    // Remove authentication flag from localStorage
    localStorage.removeItem('isAuthenticated');
    
    // Dispatch custom event to notify App.tsx
    window.dispatchEvent(new Event('logout'));
    
    // Navigate to login page
    navigate('/');
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-content">
          <div className="organization-selector">
            <SwitchOrganisation className="switch_organisation" width={16} />
            <span className="org-text">Switch Organization</span>
            <ArrowDown className="switch_organisation" width={14} />
          </div>

          <div className="dashboard-link">
            <Home className='Home' width={16} />
            <span>Dashboard</span>
          </div>

          {menuItems.map((section, idx) => (
            <div key={idx} className="menu-section">
              <div className="section-title">{section.section}</div>
              <ul className="menu-list">
                {section.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className={`menu-item ${activeItem === item.label ? 'active' : ''}`}
                    onClick={() => handleMenuItemClick(item.label)}
                  >
                    <span className="menu-icon">
                      <item.icon width={16} height={12.8} />
                    </span>
                    <span className="menu-label">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="sidebar-footer">
            <div className="logout-container">
              <div className="logout-button" onClick={handleLogout}>
                <Logout width={16} height={16}/>
                <span className="logout-text">Logout</span>
              </div>
            </div>
            <div className="version-info">v1.2.0</div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;