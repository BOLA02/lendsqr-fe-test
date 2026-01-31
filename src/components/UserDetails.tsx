import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Sidebar from './Sidebar';
import Header from './Header';


import '../styles/UserDetails.scss';
import '../styles/Dashboard.scss';


import  UserAvatarIcon from '../assets/avater_placeholder.svg?react';
import AvaterOverlay from '../assets/avater_overlay.svg?react';
import ArrowLeft from '../assets/arrow_left.svg?react';


interface User {
  id: number;
  organization: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Blacklisted';
  profileImage?: string; // Optional profile image URL
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



const UserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('General Details');
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = () => {
    try {
      setLoading(true);
      
      console.log('Fetching user data for ID:', userId);
      
      const cachedUser = localStorage.getItem(`user_${userId}`);
      
      if (cachedUser) {
        console.log('Found cached user:', cachedUser);
        setUserData(JSON.parse(cachedUser));
      } else {
        console.log('No cached user, checking main list');
        const allUsers = localStorage.getItem('usersData');
        if (allUsers) {
          const users: User[] = JSON.parse(allUsers);
          console.log('Total users in storage:', users.length);
          const user = users.find(u => u.id === Number(userId));
          if (user) {
            console.log('Found user in main list:', user);
            setUserData(user);
            localStorage.setItem(`user_${userId}`, JSON.stringify(user));
          } else {
            console.log('User not found in main list');
          }
        } else {
          console.log('No users data in localStorage');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus: 'Active' | 'Blacklisted') => {
    if (!userData) return;

    const updatedUser = { ...userData, status: newStatus };
    setUserData(updatedUser);

    localStorage.setItem(`user_${userId}`, JSON.stringify(updatedUser));

    const allUsers = localStorage.getItem('usersData');
    if (allUsers) {
      const users: User[] = JSON.parse(allUsers);
      const updatedUsers = users.map(u => 
        u.id === Number(userId) ? updatedUser : u
      );
      localStorage.setItem('usersData', JSON.stringify(updatedUsers));
      
      window.dispatchEvent(new Event('userDataUpdated'));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userData) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setImageError(false);

    // Convert image to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      // Update user data with new image
      const updatedUser = { ...userData, profileImage: imageUrl };
      setUserData(updatedUser);

      // Save to localStorage
      localStorage.setItem(`user_${userId}`, JSON.stringify(updatedUser));

      // Update in main users list
      const allUsers = localStorage.getItem('usersData');
      if (allUsers) {
        const users: User[] = JSON.parse(allUsers);
        const updatedUsers = users.map(u => 
          u.id === Number(userId) ? updatedUser : u
        );
        localStorage.setItem('usersData', JSON.stringify(updatedUsers));
        
        window.dispatchEvent(new Event('userDataUpdated'));
      }

      setUploadingImage(false);
    };

    reader.onerror = () => {
      alert('Failed to upload image. Please try again.');
      setUploadingImage(false);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    if (!userData) return;

    const updatedUser = { ...userData, profileImage: undefined };
    setUserData(updatedUser);
    setImageError(false);

    // Save to localStorage
    localStorage.setItem(`user_${userId}`, JSON.stringify(updatedUser));

    // Update in main users list
    const allUsers = localStorage.getItem('usersData');
    if (allUsers) {
      const users: User[] = JSON.parse(allUsers);
      const updatedUsers = users.map(u => 
        u.id === Number(userId) ? updatedUser : u
      );
      localStorage.setItem('usersData', JSON.stringify(updatedUsers));
      
      window.dispatchEvent(new Event('userDataUpdated'));
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const tabs = ['General Details', 'Documents', 'Bank Details', 'Loans', 'Savings', 'App and System'];

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="dashboard-main">
          <Header onMenuClick={toggleSidebar} />
          <div className="dashboard-content">
            <div className="loading">Loading user details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="dashboard">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="dashboard-main">
          <Header onMenuClick={toggleSidebar} />
          <div className="dashboard-content">
            <button className="back-button" onClick={() => navigate('/dashboard')}>
              <ArrowLeft width={30} />
              <span>Back to Users</span>
            </button>
            <div className="error-state">
              <h2>User not found</h2>
              <p>The user you're looking for doesn't exist.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userTier = (userData.id % 3) + 1;
  const bankBalance = ((userData.id * 12345) % 900000 + 100000).toFixed(2);
  const accountNumber = `${userData.id}${String(userData.id).padStart(9, '0').slice(0, 9)}`;

  return (
    <div className="dashboard">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="dashboard-main">
        <Header onMenuClick={toggleSidebar} />
        <div className="dashboard-content">
          <div className="user-details-page">
            <button className="back-button" onClick={() => navigate('/dashboard')}>
              <ArrowLeft width={30}  />
              <span>Back to Users</span>
            </button>

            <div className="page-header">
              <h1 className="page-title">User Details</h1>
              <div className="action-buttons">
                <button 
                  className="btn-blacklist"
                  onClick={() => handleStatusChange('Blacklisted')}
                  disabled={userData.status === 'Blacklisted'}
                >
                  BLACKLIST USER
                </button>
                <button 
                  className="btn-activate"
                  onClick={() => handleStatusChange('Active')}
                  disabled={userData.status === 'Active'}
                >
                  ACTIVATE USER
                </button>
              </div>
            </div>
            <div className="user-summary">
              <div className="user-summary-card">
                <div className="user-summary-content">
                  <div className="user-basic-info">
                    <div className="user-avatar-container">
                      <label htmlFor="avatar-upload" className="user-avatar-wrapper">
                        <div className="user-avatar">
                          {userData.profileImage && !imageError ? (
                            <img 
                              src={userData.profileImage} 
                              alt={userData.personalInformation.fullName}
                              onError={() => setImageError(true)}
                            />
                          ) : (
                            <UserAvatarIcon width={40} height={40}/>
                          )}
                        </div>
                        <div className="avatar-overlay">
                          <AvaterOverlay />
                          <span>{uploadingImage ? 'Uploading...' : 'Change Photo'}</span>
                        </div>
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        disabled={uploadingImage}
                      />
                      {userData.profileImage && !imageError && (
                        <button 
                          className="remove-photo-btn" 
                          onClick={handleRemoveImage}
                          type="button"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                    <div className="user-name-section">
                      <h2 className="user-name">{userData.personalInformation.fullName}</h2>
                      <p className="user-id">LSQ{String(userData.id).padStart(8, '0')}</p>
                    </div>
                  </div>

                  <div className="user-tier">
                    <p className="tier-label">User's Tier</p>
                    <div className="tier-stars">
                      {[1, 2, 3].map((star) => (
                        <span key={star} className={`star ${star <= userTier ? 'filled' : ''}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="user-bank-info">
                    <h3 className="bank-amount">₦{bankBalance}</h3>
                    <p className="bank-details">{accountNumber}/Providus Bank</p>
                  </div>
                </div>
              </div>

              <div className="tabs-container">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="user-details-content">
              {activeTab === 'General Details' && (
                <>
                  <section className="info-section">
                    <h3 className="section-title">Personal Information</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>FULL NAME</label>
                        <p>{userData.personalInformation.fullName}</p>
                      </div>
                      <div className="info-item">
                        <label>PHONE NUMBER</label>
                        <p>{userData.personalInformation.phoneNumber}</p>
                      </div>
                      <div className="info-item">
                        <label>EMAIL ADDRESS</label>
                        <p>{userData.personalInformation.email}</p>
                      </div>
                      <div className="info-item">
                        <label>BVN</label>
                        <p>{userData.personalInformation.bvn}</p>
                      </div>
                      <div className="info-item">
                        <label>GENDER</label>
                        <p style={{ textTransform: 'capitalize' }}>{userData.personalInformation.gender}</p>
                      </div>
                      <div className="info-item">
                        <label>MARITAL STATUS</label>
                        <p>{userData.personalInformation.maritalStatus}</p>
                      </div>
                      <div className="info-item">
                        <label>CHILDREN</label>
                        <p>{userData.personalInformation.children === 0 ? 'None' : userData.personalInformation.children}</p>
                      </div>
                      <div className="info-item">
                        <label>TYPE OF RESIDENCE</label>
                        <p>{userData.personalInformation.typeOfResidence}</p>
                      </div>
                    </div>
                  </section>

                  <section className="info-section">
                    <h3 className="section-title">Education and Employment</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>LEVEL OF EDUCATION</label>
                        <p>{userData.educationAndEmployment.levelOfEducation}</p>
                      </div>
                      <div className="info-item">
                        <label>EMPLOYMENT STATUS</label>
                        <p>{userData.educationAndEmployment.employmentStatus}</p>
                      </div>
                      <div className="info-item">
                        <label>SECTOR OF EMPLOYMENT</label>
                        <p>{userData.educationAndEmployment.sectorOfEmployment}</p>
                      </div>
                      <div className="info-item">
                        <label>DURATION OF EMPLOYMENT</label>
                        <p>{userData.educationAndEmployment.durationOfEmployment}</p>
                      </div>
                      <div className="info-item">
                        <label>OFFICE EMAIL</label>
                        <p>{userData.educationAndEmployment.officeEmail}</p>
                      </div>
                      <div className="info-item">
                        <label>MONTHLY INCOME</label>
                        <p>{userData.educationAndEmployment.monthlyIncome}</p>
                      </div>
                      <div className="info-item">
                        <label>LOAN REPAYMENT</label>
                        <p>{userData.educationAndEmployment.loanRepayment}</p>
                      </div>
                    </div>
                  </section>

                  <section className="info-section">
                    <h3 className="section-title">Socials</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>TWITTER</label>
                        <p>{userData.socials.twitter}</p>
                      </div>
                      <div className="info-item">
                        <label>FACEBOOK</label>
                        <p>{userData.socials.facebook}</p>
                      </div>
                      <div className="info-item">
                        <label>INSTAGRAM</label>
                        <p>{userData.socials.instagram}</p>
                      </div>
                    </div>
                  </section>

                  <section className="info-section">
                    <h3 className="section-title">Guarantor</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>FULL NAME</label>
                        <p>{userData.guarantor.fullName}</p>
                      </div>
                      <div className="info-item">
                        <label>PHONE NUMBER</label>
                        <p>{userData.guarantor.phoneNumber}</p>
                      </div>
                      <div className="info-item">
                        <label>EMAIL ADDRESS</label>
                        <p>{userData.guarantor.email}</p>
                      </div>
                      <div className="info-item">
                        <label>RELATIONSHIP</label>
                        <p>{userData.guarantor.relationship}</p>
                      </div>
                    </div>
                  </section>

                  <section className="info-section last-section">
                    <div className="info-grid">
                      <div className="info-item">
                        <label>FULL NAME</label>
                        <p>{userData.guarantor.fullName}</p>
                      </div>
                      <div className="info-item">
                        <label>PHONE NUMBER</label>
                        <p>{userData.guarantor.phoneNumber}</p>
                      </div>
                      <div className="info-item">
                        <label>EMAIL ADDRESS</label>
                        <p>{userData.guarantor.email}</p>
                      </div>
                      <div className="info-item">
                        <label>RELATIONSHIP</label>
                        <p>{userData.guarantor.relationship}</p>
                      </div>
                    </div>
                  </section>
                </>
              )}

              {activeTab === 'Documents' && (
                <div className="empty-state">
                  <p>Documents will be displayed here</p>
                </div>
              )}

              {activeTab === 'Bank Details' && (
                <div className="empty-state">
                  <p>Bank details will be displayed here</p>
                </div>
              )}

              {activeTab === 'Loans' && (
                <div className="empty-state">
                  <p>Loan information will be displayed here</p>
                </div>
              )}

              {activeTab === 'Savings' && (
                <div className="empty-state">
                  <p>Savings information will be displayed here</p>
                </div>
              )}

              {activeTab === 'App and System' && (
                <div className="empty-state">
                  <p>App and system information will be displayed here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;