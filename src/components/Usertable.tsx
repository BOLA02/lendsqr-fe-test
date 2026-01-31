import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Filter from '../assets/filter.svg?react'

import ActiveUserIcon from '../assets/active_users_icon.svg?react';
import Blacklist from '../assets/blacklist.svg?react';
import ViewDetail from '../assets/view_details.svg?react';

import '../styles/Usertable.scss';

interface User {
  id: number;
  organization: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Blacklisted';
  personalInformation: {
    fullName: string;
    email: string;
    bvn: number;
    gender: string;
    maritalStatus: string;
    children: number;
    typeOfResidence: string;
    phoneNumber: string;
  };
  educationAndEmployment: {
    levelOfEducation: string;
    employmentStatus: string;
    sectorOfEmployment: string;
    durationOfEmployment: string;
    officeEmail: string;
    monthlyIncome: string;
    loanRepayment: string;
  };
  socials: {
    twitter: string;
    facebook: string;
    instagram: string;
  };
  guarantor: {
    fullName: string;
    phoneNumber: string;
    email: string;
    relationship: string;
  };
}

interface FilterPosition {
  top: number;
  left: number;
}

const UsersTable: React.FC = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filterPosition, setFilterPosition] = useState<FilterPosition>({ top: 0, left: 0 });
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState({
    organization: '',
    username: '',
    email: '',
    date: '',
    phoneNumber: '',
    status: ''
  });
  
  const filterButtonRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, filters]);

  // Listen for user data updates from UserDetails page
  useEffect(() => {
    const handleUserDataUpdate = () => {
      const cachedUsers = localStorage.getItem('usersData');
      if (cachedUsers) {
        const parsedUsers = JSON.parse(cachedUsers);
        setUsers(parsedUsers);
        setFilteredUsers(parsedUsers);
      }
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    return () => window.removeEventListener('userDataUpdated', handleUserDataUpdate);
  }, []);

  // Update filter position on scroll
  useEffect(() => {
    const updateFilterPosition = () => {
      if (showFilter && filterButtonRef.current) {
        const rect = filterButtonRef.current.getBoundingClientRect();
        setFilterPosition({
          top: rect.bottom + 5,
          left: rect.left - 120
        });
      }
    };

    if (showFilter) {
      window.addEventListener('scroll', updateFilterPosition, true);
      window.addEventListener('resize', updateFilterPosition);
      
      return () => {
        window.removeEventListener('scroll', updateFilterPosition, true);
        window.removeEventListener('resize', updateFilterPosition);
      };
    }
  }, [showFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const cachedUsers = localStorage.getItem('usersData');
      
      if (cachedUsers) {
        const parsedUsers = JSON.parse(cachedUsers);
        setUsers(parsedUsers);
        setFilteredUsers(parsedUsers);
      } else {
        const response = await fetch('/data/user.json');
        const data = await response.json();
        const usersArray = data.users || [];
        
        localStorage.setItem('usersData', JSON.stringify(usersArray));
        setUsers(usersArray);
        setFilteredUsers(usersArray);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    if (filters.organization) {
      filtered = filtered.filter(user => 
        user.organization.toLowerCase().includes(filters.organization.toLowerCase())
      );
    }

    if (filters.username) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(filters.username.toLowerCase())
      );
    }

    if (filters.email) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }

    if (filters.phoneNumber) {
      filtered = filtered.filter(user => 
        user.phoneNumber.includes(filters.phoneNumber)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(user => 
        user.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.date) {
      filtered = filtered.filter(user => {
        const userDate = new Date(user.dateJoined).toISOString().split('T')[0];
        return userDate === filters.date;
      });
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      organization: '',
      username: '',
      email: '',
      date: '',
      phoneNumber: '',
      status: ''
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'status-active';
      case 'Inactive':
        return 'status-inactive';
      case 'Pending':
        return 'status-pending';
      case 'Blacklisted':
        return 'status-blacklisted';
      default:
        return '';
    }
  };

  const toggleFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    filterButtonRef.current = button;
    
    if (!showFilter) {
      const rect = button.getBoundingClientRect();
      setFilterPosition({
        top: rect.bottom + 5,
        left: rect.left - 120
      });
    }
    setShowFilter(!showFilter);
  };

  const handleViewDetails = (userId: number) => {
    const allUsersData = localStorage.getItem('usersData');
    
    if (allUsersData) {
      const allUsers: User[] = JSON.parse(allUsersData);
      const selectedUserData = allUsers.find(u => u.id === userId);
      
      if (selectedUserData) {
        localStorage.setItem(`user_${userId}`, JSON.stringify(selectedUserData));
      }
    }
    
    setSelectedUser(null);
    navigate(`/users/${userId}`);
  };

  const handleBlacklistUser = (userId: number) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: 'Blacklisted' as const } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('usersData', JSON.stringify(updatedUsers));
    
    const user = updatedUsers.find(u => u.id === userId);
    if (user) {
      localStorage.setItem(`user_${userId}`, JSON.stringify(user));
    }
    
    window.dispatchEvent(new Event('userDataUpdated'));
    setSelectedUser(null);
  };

  const handleActivateUser = (userId: number) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: 'Active' as const } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('usersData', JSON.stringify(updatedUsers));
    
    const user = updatedUsers.find(u => u.id === userId);
    if (user) {
      localStorage.setItem(`user_${userId}`, JSON.stringify(user));
    }
    
    window.dispatchEvent(new Event('userDataUpdated'));
    setSelectedUser(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="users-table-container">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="users-table-container">
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>
                <div className="th-content">
                  ORGANIZATION
                  <button className="filter-btn" onClick={toggleFilter}>
                   <Filter width={16} />
                  </button>
                </div>
              </th>
              <th>
                <div className="th-content">
                  USERNAME
                  <button className="filter-btn" onClick={toggleFilter}>
                   <Filter width={16} />
                  </button>
                </div>
              </th>
              <th>
                <div className="th-content">
                  EMAIL
                  <button className="filter-btn" onClick={toggleFilter}>
                    <Filter width={16} />
                  </button>
                </div>
              </th>
              <th>
                <div className="th-content">
                  PHONE NUMBER
                  <button className="filter-btn" onClick={toggleFilter}>
                    <Filter width={16} />
                  </button>
                </div>
              </th>
              <th>
                <div className="th-content">
                  DATE JOINED
                  <button className="filter-btn" onClick={toggleFilter}>
                    <Filter width={16} />
                  </button>
                </div>
              </th>
              <th>
                <div className="th-content">
                  STATUS
                  <button className="filter-btn" onClick={toggleFilter}>
                    <Filter width={16} />
                  </button>
                </div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user.id}>
                  <td data-label="Organization">{user.organization}</td>
                  <td data-label="Username">{user.username}</td>
                  <td data-label="Email">{user.email}</td>
                  <td data-label="Phone Number">{user.phoneNumber}</td>
                  <td data-label="Date Joined">{formatDate(user.dateJoined)}</td>
                  <td data-label="Status">
                    <span className={`status-badge ${getStatusClass(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="action-cell">
                    <button
                      className="action-btn"
                      onClick={() => setSelectedUser(selectedUser === user.id.toString() ? null : user.id.toString())}
                    >
                      ⋮
                    </button>
                    {selectedUser === user.id.toString() && (
                      <div className="action-menu">
                        <button className="action-item" onClick={() => handleViewDetails(user.id)}>
                          <ViewDetail width={14} /> View Details
                        </button>
                        <button className="action-item" onClick={() => handleBlacklistUser(user.id)}>
                          <Blacklist width={14} /> Blacklist User
                        </button>
                        <button className="action-item" onClick={() => handleActivateUser(user.id)}>
                          <ActiveUserIcon width={14} /> Activate User
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="no-results">
                  No users found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <div className="footer-left">
          <span>Showing</span>
          <select 
            className="items-per-page"
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span>out of {filteredUsers.length}</span>
        </div>
        <div className="footer-right">
          <button 
            className="pagination-btn" 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ←
          </button>
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <button
                key={index}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="pagination-dots">{page}</span>
            )
          ))}
          <button 
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            →
          </button>
        </div>
      </div>

      {showFilter && (
        <>
          <div className="filter-overlay" onClick={() => setShowFilter(false)}></div>
          <div 
            className="filter-popup"
            style={{
              position: 'fixed',
              top: `${filterPosition.top}px`,
              left: `${filterPosition.left}px`
            }}
          >
            <div className="filter-content">
              <div className="filter-group">
                <label>Organization</label>
                <input 
                  type="text" 
                  placeholder="Select"
                  value={filters.organization}
                  onChange={(e) => handleFilterChange('organization', e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>Username</label>
                <input 
                  type="text" 
                  placeholder="User"
                  value={filters.username}
                  onChange={(e) => handleFilterChange('username', e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>Email</label>
                <input 
                  type="email" 
                  placeholder="Email"
                  value={filters.email}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>Date</label>
                <input 
                  type="date" 
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="Phone Number"
                  value={filters.phoneNumber}
                  onChange={(e) => handleFilterChange('phoneNumber', e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                  <option value="Blacklisted">Blacklisted</option>
                </select>
              </div>
              <div className="filter-actions">
                <button className="reset-btn" onClick={resetFilters}>Reset</button>
                <button className="apply-btn" onClick={() => setShowFilter(false)}>Filter</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersTable;