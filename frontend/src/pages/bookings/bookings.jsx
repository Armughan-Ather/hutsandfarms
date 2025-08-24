import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './bookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addBookingLoading, setAddBookingLoading] = useState(false);
  const [addBookingError, setAddBookingError] = useState('');
  const [addBookingSuccess, setAddBookingSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    cnic: '',
    phone_no: '',
    booking_date: '',
    shift_type: '',
    booking_source: ''
  });

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

  const handleAddNewBooking = () => {
    setShowAddModal(true);
    setAddBookingError('');
    setAddBookingSuccess('');
    setFormData({
      cnic: '',
      phone_no: '',
      booking_date: '',
      shift_type: '',
      booking_source: ''
    });
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setAddBookingError('');
    setAddBookingSuccess('');
    setFormData({
      cnic: '',
      phone_no: '',
      booking_date: '',
      shift_type: '',
      booking_source: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddBookingLoading(true);
    setAddBookingError('');
    setAddBookingSuccess('');

    try {
      const token = localStorage.getItem('propertyToken');
      if (!token) {
        setAddBookingError('No authentication token found. Please login again.');
        setAddBookingLoading(false);
        return;
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      const response = await axios.post(`${backendUrl}/api/bookings/create`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setAddBookingSuccess('Booking created successfully!');
      setAddBookingLoading(false);
      
      // Refresh bookings list
      setTimeout(() => {
        fetchBookings();
        handleCloseModal();
      }, 1500);

    } catch (err) {
      console.log('Error creating booking:', err);
      setAddBookingLoading(false);
      
      if (err.response?.data?.error) {
        setAddBookingError(err.response.data.error);
      } else if (err.response?.data?.details) {
        setAddBookingError(err.response.data.details);
      } else if (err.response) {
        setAddBookingError('Failed to create booking. Please try again.');
      } else if (err.request) {
        setAddBookingError('Network error. Please check your connection and try again.');
      } else {
        setAddBookingError('An unexpected error occurred. Please try again.');
      }
    }
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
      <div className="booking-page-loading">
        <div className="booking-page-loading-spinner">
          <div className="booking-page-spinner"></div>
          <span>Loading bookings...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="booking-page-error">
        <div className="booking-page-error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="booking-page-retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page-container">
      {/* Header */}
      <div className="booking-page-header">
        <div className="booking-page-header-content">
          <div className="booking-page-header-left">
            <h1 className="booking-page-page-title">Property Bookings</h1>
            <p className="booking-page-page-subtitle">Manage and view all your property bookings</p>
          </div>
          <div className="booking-page-header-right">
            <button onClick={handleAddNewBooking} className="booking-page-add-booking-button">
              ➕ Add New Booking
            </button>
            <button onClick={handleBackToDashboard} className="booking-page-back-button">
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="booking-page-stats">
        <div className="booking-page-stats-grid">
          <div className="booking-page-stat-card">
            <div className="booking-page-stat-number">{bookings.length}</div>
            <div className="booking-page-stat-label">Total Bookings</div>
          </div>
          <div className="booking-page-stat-card">
            <div className="booking-page-stat-number">
              {bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length}
            </div>
            <div className="booking-page-stat-label">Confirmed</div>
          </div>
          <div className="booking-page-stat-card">
            <div className="booking-page-stat-number">
              {bookings.filter(b => b.status?.toLowerCase() === 'pending').length}
            </div>
            <div className="booking-page-stat-label">Pending</div>
          </div>
          <div className="booking-page-stat-card">
            <div className="booking-page-stat-number">
              {bookings.filter(b => b.status?.toLowerCase() === 'cancelled').length}
            </div>
            <div className="booking-page-stat-label">Cancelled</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="booking-page-tabs">
        <button 
          className={`booking-page-tab-button ${activeTab === 'all' ? 'booking-page-active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Bookings ({bookings.length})
        </button>
        <button 
          className={`booking-page-tab-button ${activeTab === 'confirmed' ? 'booking-page-active' : ''}`}
          onClick={() => setActiveTab('confirmed')}
        >
          Confirmed ({bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length})
        </button>
        <button 
          className={`booking-page-tab-button ${activeTab === 'pending' ? 'booking-page-active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({bookings.filter(b => b.status?.toLowerCase() === 'pending').length})
        </button>
        <button 
          className={`booking-page-tab-button ${activeTab === 'cancelled' ? 'booking-page-active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled ({bookings.filter(b => b.status?.toLowerCase() === 'cancelled').length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="booking-page-content">
        {filteredBookings.length > 0 ? (
          <div className="booking-page-bookings-list">
            {filteredBookings.map((booking) => (
              <div key={booking.booking_id} className="booking-page-booking-card">
                <div className="booking-page-booking-header">
                  <div className="booking-page-booking-id">
                    <span className="booking-page-label">Booking ID:</span>
                    <span className="booking-page-value">#{booking.booking_id}</span>
                  </div>
                  <div 
                    className="booking-page-booking-status"
                    style={{ backgroundColor: getStatusColor(booking.status) }}
                  >
                    {booking.status || 'Unknown'}
                  </div>
                </div>

                <div className="booking-page-booking-details">
                  <div className="booking-page-detail-row">
                    <div className="booking-page-detail-item">
                      <span className="booking-page-label">Customer Email:</span>
                      <span className="booking-page-value booking-page-customer-email">{booking.user_email || 'No email provided'}</span>
                    </div>
                    <div className="booking-page-detail-item">
                      <span className="booking-page-label">Booking Date:</span>
                      <span className="booking-page-value">{formatDate(booking.booking_date)}</span>
                    </div>
                  </div>

                  <div className="booking-page-detail-row">
                    <div className="booking-page-detail-item">
                      <span className="booking-page-label">Shift Type:</span>
                      <span 
                        className="booking-page-shift-type"
                        style={{ backgroundColor: getShiftTypeColor(booking.shift_type) }}
                      >
                        {booking.shift_type || 'Not specified'}
                      </span>
                    </div>
                    <div className="booking-page-detail-item">
                      <span className="booking-page-label">Total Cost:</span>
                      <span className="booking-page-value booking-page-cost">${booking.total_cost?.toLocaleString() || '0'}</span>
                    </div>
                  </div>

                  <div className="booking-page-detail-row">
                    <div className="booking-page-detail-item">
                      <span className="booking-page-label">Source:</span>
                      <span className="booking-page-value">{booking.booking_source || 'Direct'}</span>
                    </div>
                    <div className="booking-page-detail-item">
                      <span className="booking-page-label">Booked At:</span>
                      <span className="booking-page-value">{formatDateTime(booking.booked_at)}</span>
                    </div>
                  </div>

                  <div className="booking-page-detail-row">
                    <div className="booking-page-detail-item">
                      <span className="booking-page-label">User ID:</span>
                      <span className="booking-page-value booking-page-user-id">{booking.user_id}</span>
                    </div>
                    <div className="booking-page-detail-item">
                      <span className="booking-page-label">Property ID:</span>
                      <span className="booking-page-value booking-page-property-id">{booking.property_id}</span>
                    </div>
                  </div>
                </div>

                <div className="booking-page-booking-footer">
                  <div className="booking-page-footer-item">
                    <span className="booking-page-label">Created:</span>
                    <span className="booking-page-value">{formatDateTime(booking.created_at)}</span>
                  </div>
                  <div className="booking-page-footer-item">
                    <span className="booking-page-label">Updated:</span>
                    <span className="booking-page-value">{formatDateTime(booking.updated_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="booking-page-no-bookings">
            <div className="booking-page-no-data-content">
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

      {/* Add Booking Modal */}
      {showAddModal && (
        <div className="booking-page-modal-overlay" onClick={handleCloseModal}>
          <div className="booking-page-modal" onClick={(e) => e.stopPropagation()}>
            <div className="booking-page-modal-header">
              <h2>Add New Booking</h2>
              <button 
                className="booking-page-modal-close" 
                onClick={handleCloseModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="booking-page-form">
              {addBookingError && (
                <div className="booking-page-form-error">
                  {addBookingError}
                </div>
              )}

              {addBookingSuccess && (
                <div className="booking-page-form-success">
                  {addBookingSuccess}
                </div>
              )}

              <div className="booking-page-form-group">
                <label htmlFor="cnic" className="booking-page-form-label">
                  CNIC Number <span className="booking-page-required">*</span>
                </label>
                <input
                  type="text"
                  id="cnic"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleInputChange}
                  placeholder="e.g., 12345-1234567-1 or 1234512345671"
                  className="booking-page-form-input"
                  required
                />
                <small className="booking-page-form-help">
                  Enter 13 digits (with or without dashes)
                </small>
              </div>

              <div className="booking-page-form-group">
                <label htmlFor="phone_no" className="booking-page-form-label">
                  Phone Number <span className="booking-page-required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone_no"
                  name="phone_no"
                  value={formData.phone_no}
                  onChange={handleInputChange}
                  placeholder="e.g., +923001234567"
                  className="booking-page-form-input"
                  required
                />
                <small className="booking-page-form-help">
                  Enter 10-15 digits (optional + prefix)
                </small>
              </div>

              <div className="booking-page-form-group">
                <label htmlFor="booking_date" className="booking-page-form-label">
                  Booking Date <span className="booking-page-required">*</span>
                </label>
                <input
                  type="date"
                  id="booking_date"
                  name="booking_date"
                  value={formData.booking_date}
                  onChange={handleInputChange}
                  className="booking-page-form-input"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
                <small className="booking-page-form-help">
                  Select a future date
                </small>
              </div>

              <div className="booking-page-form-group">
                <label htmlFor="shift_type" className="booking-page-form-label">
                  Shift Type <span className="booking-page-required">*</span>
                </label>
                <select
                  id="shift_type"
                  name="shift_type"
                  value={formData.shift_type}
                  onChange={handleInputChange}
                  className="booking-page-form-select"
                  required
                >
                  <option value="">Select shift type</option>
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                  <option value="Full Day">Full Day</option>
                  <option value="Full Night">Full Night</option>
                </select>
              </div>

              <div className="booking-page-form-group">
                <label htmlFor="booking_source" className="booking-page-form-label">
                  Booking Source <span className="booking-page-required">*</span>
                </label>
                <select
                  id="booking_source"
                  name="booking_source"
                  value={formData.booking_source}
                  onChange={handleInputChange}
                  className="booking-page-form-select"
                  required
                >
                  <option value="">Select booking source</option>
                  <option value="Website">Website</option>
                  <option value="WhatsApp Bot">WhatsApp Bot</option>
                  <option value="Third-Party">Third-Party</option>
                </select>
              </div>

              <div className="booking-page-form-actions">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="booking-page-form-cancel"
                  disabled={addBookingLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="booking-page-form-submit"
                  disabled={addBookingLoading}
                >
                  {addBookingLoading ? (
                    <>
                      <span className="booking-page-loading-dots"></span>
                      Creating...
                    </>
                  ) : (
                    'Create Booking'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings; 