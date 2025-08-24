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
  const [actionLoading, setActionLoading] = useState({});
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

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

  const handleCancelBooking = async (bookingId) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: true }));
    setActionError('');
    setActionSuccess('');

    try {
      const token = localStorage.getItem('propertyToken');
      if (!token) {
        setActionError('No authentication token found. Please login again.');
        setActionLoading(prev => ({ ...prev, [bookingId]: false }));
        return;
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      await axios.post(`${backendUrl}/api/bookings/cancel`, 
        { booking_id: bookingId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setActionSuccess('Booking cancelled successfully!');
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
      
      // Refresh bookings list
      setTimeout(() => {
        fetchBookings();
        setActionSuccess('');
      }, 1500);

    } catch (err) {
      console.log('Error cancelling booking:', err);
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
      
      if (err.response?.data?.error) {
        setActionError(err.response.data.error);
      } else if (err.response?.data?.details) {
        setActionError(err.response.data.details);
      } else if (err.response) {
        setActionError('Failed to cancel booking. Please try again.');
      } else if (err.request) {
        setActionError('Network error. Please check your connection and try again.');
      } else {
        setActionError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: true }));
    setActionError('');
    setActionSuccess('');

    try {
      const token = localStorage.getItem('propertyToken');
      if (!token) {
        setActionError('No authentication token found. Please login again.');
        setActionLoading(prev => ({ ...prev, [bookingId]: false }));
        return;
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      await axios.post(`${backendUrl}/api/bookings/confirm`, 
        { booking_id: bookingId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setActionSuccess('Booking confirmed successfully!');
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
      
      // Refresh bookings list
      setTimeout(() => {
        fetchBookings();
        setActionSuccess('');
      }, 1500);

    } catch (err) {
      console.log('Error confirming booking:', err);
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
      
      if (err.response?.data?.error) {
        setActionError(err.response.data.error);
      } else if (err.response?.data?.details) {
        setActionError(err.response.data.details);
      } else if (err.response) {
        setActionError('Failed to confirm booking. Please try again.');
      } else if (err.request) {
        setActionError('Network error. Please check your connection and try again.');
      } else {
        setActionError('An unexpected error occurred. Please try again.');
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
              {bookings.filter(b => b.status?.toLowerCase() === 'completed').length}
            </div>
            <div className="booking-page-stat-label">Completed</div>
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
          className={`booking-page-tab-button ${activeTab === 'completed' ? 'booking-page-active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({bookings.filter(b => b.status?.toLowerCase() === 'completed').length})
        </button>
        <button 
          className={`booking-page-tab-button ${activeTab === 'cancelled' ? 'booking-page-active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled ({bookings.filter(b => b.status?.toLowerCase() === 'cancelled').length})
        </button>
      </div>

      {/* Success/Error Messages */}
      {(actionSuccess || actionError) && (
        <div className="booking-page-messages">
          {actionSuccess && (
            <div className="booking-page-success-message">
              {actionSuccess}
            </div>
          )}
          {actionError && (
            <div className="booking-page-error-message">
              {actionError}
            </div>
          )}
        </div>
      )}

      {/* Bookings Table */}
      <div className="booking-page-content">
        {filteredBookings.length > 0 ? (
          <div className="booking-page-table-container">
            <table className="booking-page-table">
              <thead className="booking-page-table-header">
                <tr>
                  <th className="booking-page-table-th">Booking ID</th>
                  <th className="booking-page-table-th">Status</th>
                  <th className="booking-page-table-th">Customer Email</th>
                  <th className="booking-page-table-th">Booking Date</th>
                  <th className="booking-page-table-th">Shift Type</th>
                  <th className="booking-page-table-th">Total Cost</th>
                  <th className="booking-page-table-th">Source</th>
                  <th className="booking-page-table-th">Booked At</th>
                  <th className="booking-page-table-th">Actions</th>
                </tr>
              </thead>
              <tbody className="booking-page-table-body">
                {filteredBookings.map((booking) => (
                  <tr key={booking.booking_id} className="booking-page-table-row">
                    <td className="booking-page-table-td">
                      <span className="booking-page-booking-id-value">#{booking.booking_id}</span>
                    </td>
                    <td className="booking-page-table-td">
                      <span 
                        className="booking-page-status-badge"
                        style={{ backgroundColor: getStatusColor(booking.status) }}
                      >
                        {booking.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="booking-page-table-td">
                      <span className="booking-page-customer-email">{booking.user_email || 'No email provided'}</span>
                    </td>
                    <td className="booking-page-table-td">
                      {formatDate(booking.booking_date)}
                    </td>
                    <td className="booking-page-table-td">
                      <span 
                        className="booking-page-shift-type-badge"
                        style={{ backgroundColor: getShiftTypeColor(booking.shift_type) }}
                      >
                        {booking.shift_type || 'Not specified'}
                      </span>
                    </td>
                    <td className="booking-page-table-td">
                      <span className="booking-page-cost">${booking.total_cost?.toLocaleString() || '0'}</span>
                    </td>
                    <td className="booking-page-table-td">
                      {booking.booking_source || 'Direct'}
                    </td>
                    <td className="booking-page-table-td">
                      {formatDateTime(booking.booked_at)}
                    </td>
                    <td className="booking-page-table-td">
                      <div className="booking-page-action-buttons">
                        {booking.status?.toLowerCase() === 'pending' && (
                          <>
                            <button
                              onClick={() => handleConfirmBooking(booking.booking_id)}
                              disabled={actionLoading[booking.booking_id]}
                              className="booking-page-confirm-button"
                              title="Confirm Booking"
                            >
                              {actionLoading[booking.booking_id] ? (
                                <span className="booking-page-loading-dots"></span>
                              ) : (
                                '✅'
                              )}
                            </button>
                            <button
                              onClick={() => handleCancelBooking(booking.booking_id)}
                              disabled={actionLoading[booking.booking_id]}
                              className="booking-page-cancel-button"
                              title="Cancel Booking"
                            >
                              {actionLoading[booking.booking_id] ? (
                                <span className="booking-page-loading-dots"></span>
                              ) : (
                                '❌'
                              )}
                            </button>
                          </>
                        )}
                        {booking.status?.toLowerCase() === 'confirmed' && (
                          <button
                            onClick={() => handleCancelBooking(booking.booking_id)}
                            disabled={actionLoading[booking.booking_id]}
                            className="booking-page-cancel-button"
                            title="Cancel Booking"
                          >
                            {actionLoading[booking.booking_id] ? (
                              <span className="booking-page-loading-dots"></span>
                            ) : (
                              '❌'
                            )}
                          </button>
                        )}
                        {(booking.status?.toLowerCase() === 'completed' || booking.status?.toLowerCase() === 'cancelled') && (
                          <span className="booking-page-status-text">
                            {booking.status?.toLowerCase() === 'completed' ? '✅ Completed' : '❌ Cancelled'}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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