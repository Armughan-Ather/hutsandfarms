import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './bookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('propertyToken');
      if (!token) {
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      const response = await axios.get(`${backendUrl}/api/bookings/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setBookings(response.data.bookings);
      setLoading(false);
    } catch (err) {
      console.log('Error fetching bookings:', err);
      
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        localStorage.removeItem('propertyToken');
        localStorage.removeItem('propertyData');
      } else if (err.response) {
        setError(err.response.data.error || 'Failed to fetch bookings');
      } else if (err.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      case 'completed':
        return '#3b82f6';
      default:
        return '#64748b';
    }
  };

  const getShiftTypeColor = (shiftType) => {
    switch (shiftType?.toLowerCase()) {
      case 'day':
        return '#10b981';
      case 'night':
        return '#1e293b';
      case 'full day':
        return '#3b82f6';
      case 'full night':
        return '#8b5cf6';
      default:
        return '#64748b';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status?.toLowerCase() === activeTab;
  });

  if (loading) {
    return (
      <div className="bookings-page-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Loading bookings...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bookings-page-error">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bookings-page-container">
      {/* Header */}
      <div className="bookings-page-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">Property Bookings</h1>
            <p className="page-subtitle">Manage and view all your property bookings</p>
          </div>
          <div className="header-right">
            <button onClick={handleBackToDashboard} className="back-button">
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bookings-page-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{bookings.length}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length}
            </div>
            <div className="stat-label">Confirmed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {bookings.filter(b => b.status?.toLowerCase() === 'pending').length}
            </div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {bookings.filter(b => b.status?.toLowerCase() === 'cancelled').length}
            </div>
            <div className="stat-label">Cancelled</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bookings-page-tabs">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Bookings ({bookings.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'confirmed' ? 'active' : ''}`}
          onClick={() => setActiveTab('confirmed')}
        >
          Confirmed ({bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({bookings.filter(b => b.status?.toLowerCase() === 'pending').length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled ({bookings.filter(b => b.status?.toLowerCase() === 'cancelled').length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="bookings-page-content">
        {filteredBookings.length > 0 ? (
          <div className="bookings-list">
            {filteredBookings.map((booking) => (
              <div key={booking.booking_id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-id">
                    <span className="label">Booking ID:</span>
                    <span className="value">#{booking.booking_id}</span>
                  </div>
                  <div 
                    className="booking-status"
                    style={{ backgroundColor: getStatusColor(booking.status) }}
                  >
                    {booking.status || 'Unknown'}
                  </div>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="label">Customer:</span>
                      <span className="value">{booking.username || 'Unknown User'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Booking Date:</span>
                      <span className="value">{formatDate(booking.booking_date)}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="label">Shift Type:</span>
                      <span 
                        className="shift-type"
                        style={{ backgroundColor: getShiftTypeColor(booking.shift_type) }}
                      >
                        {booking.shift_type || 'Not specified'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Total Cost:</span>
                      <span className="value cost">${booking.total_cost?.toLocaleString() || '0'}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="label">Source:</span>
                      <span className="value">{booking.booking_source || 'Direct'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Booked At:</span>
                      <span className="value">{formatDateTime(booking.booked_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="booking-footer">
                  <div className="footer-item">
                    <span className="label">Created:</span>
                    <span className="value">{formatDateTime(booking.created_at)}</span>
                  </div>
                  <div className="footer-item">
                    <span className="label">Updated:</span>
                    <span className="value">{formatDateTime(booking.updated_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-bookings">
            <div className="no-data-content">
              <h3>No Bookings Found</h3>
              <p>
                {activeTab === 'all' 
                  ? 'You don\'t have any bookings yet.'
                  : `No ${activeTab} bookings found.`
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings; 