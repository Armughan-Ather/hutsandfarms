import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';

const Dashboard = () => {
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchPropertyData();
  }, []);

  const fetchPropertyData = async () => {
    try {
      const token = localStorage.getItem('propertyToken');
      if (!token) {
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      const response = await axios.get(`${backendUrl}/api/properties`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setPropertyData(response.data);
      setLoading(false);
    } catch (err) {
      console.log('Error fetching property data:', err);
      
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        localStorage.removeItem('propertyToken');
        localStorage.removeItem('propertyData');
      } else if (err.response) {
        setError(err.response.data.error || 'Failed to fetch property data');
      } else if (err.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('propertyToken');
    localStorage.removeItem('propertyData');
    window.location.reload();
  };

  const handleEdit = () => {
    // TODO: Navigate to edit page
    alert('Edit functionality will be implemented here');
  };

  const handleBookings = () => {
    // Navigate to bookings page
    window.location.href = '/bookings';
  };

  if (loading) {
    return (
      <div className="dashboard-page-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Loading property details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page-error">
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

  if (!propertyData) {
    return (
      <div className="dashboard-page-error">
        <div className="error-container">
          <h2>No Data</h2>
          <p>No property data found.</p>
        </div>
      </div>
    );
  }

  const { property, pricing, amenities, images, videos, owner_username } = propertyData;

  return (
    <div className="dashboard-page-container">
      {/* Header */}
      <div className="dashboard-page-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="property-name">{property.name}</h1>
            <p className="property-type">{property.type}</p>
          </div>
          <div className="header-right">
            <button onClick={handleEdit} className="edit-button">
              ✏️ Edit Property
            </button>
            <button onClick={handleBookings} className="bookings-button">
              📅 View Bookings
            </button>
            <button onClick={handleLogout} className="logout-button">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-page-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button 
          className={`tab-button ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          Pricing
        </button>
        <button 
          className={`tab-button ${activeTab === 'amenities' ? 'active' : ''}`}
          onClick={() => setActiveTab('amenities')}
        >
          Amenities
        </button>
        <button 
          className={`tab-button ${activeTab === 'media' ? 'active' : ''}`}
          onClick={() => setActiveTab('media')}
        >
          Media
        </button>
      </div>

      {/* Content Area */}
      <div className="dashboard-page-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Basic Information</h3>
                <div className="info-item">
                  <span className="label">Name:</span>
                  <span className="value">{property.name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Type:</span>
                  <span className="value">{property.type}</span>
                </div>
                <div className="info-item">
                  <span className="label">Description:</span>
                  <span className="value">{property.description || 'No description available'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Max Occupancy:</span>
                  <span className="value">{property.max_occupancy} people</span>
                </div>
              </div>

              <div className="overview-card">
                <h3>Location</h3>
                <div className="info-item">
                  <span className="label">Address:</span>
                  <span className="value">{property.address}</span>
                </div>
                <div className="info-item">
                  <span className="label">City:</span>
                  <span className="value">{property.city}</span>
                </div>
                <div className="info-item">
                  <span className="label">Province:</span>
                  <span className="value">{property.province}</span>
                </div>
                <div className="info-item">
                  <span className="label">Country:</span>
                  <span className="value">{property.country}</span>
                </div>
              </div>

              <div className="overview-card">
                <h3>Contact Information</h3>
                <div className="info-item">
                  <span className="label">Contact Person:</span>
                  <span className="value">{property.contact_person}</span>
                </div>
                <div className="info-item">
                  <span className="label">Phone:</span>
                  <span className="value">{property.contact_number}</span>
                </div>
                <div className="info-item">
                  <span className="label">Email:</span>
                  <span className="value">{property.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">Owner:</span>
                  <span className="value">{owner_username || 'Not specified'}</span>
                </div>
              </div>

              <div className="overview-card">
                <h3>Business Details</h3>
                <div className="info-item">
                  <span className="label">Advance Payment:</span>
                  <span className="value">{property.advance_percentage}%</span>
                </div>
                <div className="info-item">
                  <span className="label">Created:</span>
                  <span className="value">{new Date(property.created_at).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <span className="label">Last Updated:</span>
                  <span className="value">{new Date(property.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="tab-content">
            <div className="details-section">
              <h3>Property Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <strong>Property ID:</strong> {property.property_id}
                </div>
                <div className="detail-item">
                  <strong>Username:</strong> {property.username}
                </div>
                <div className="detail-item">
                  <strong>Description:</strong> {property.description || 'No description available'}
                </div>
                <div className="detail-item">
                  <strong>Address:</strong> {property.address}
                </div>
                <div className="detail-item">
                  <strong>City:</strong> {property.city}
                </div>
                <div className="detail-item">
                  <strong>Province:</strong> {property.province}
                </div>
                <div className="detail-item">
                  <strong>Country:</strong> {property.country}
                </div>
                <div className="detail-item">
                  <strong>Contact Person:</strong> {property.contact_person}
                </div>
                <div className="detail-item">
                  <strong>Contact Number:</strong> {property.contact_number}
                </div>
                <div className="detail-item">
                  <strong>Email:</strong> {property.email}
                </div>
                <div className="detail-item">
                  <strong>Max Occupancy:</strong> {property.max_occupancy} people
                </div>
                <div className="detail-item">
                  <strong>Type:</strong> {property.type}
                </div>
                <div className="detail-item">
                  <strong>Advance Percentage:</strong> {property.advance_percentage}%
                </div>
                <div className="detail-item">
                  <strong>Created At:</strong> {new Date(property.created_at).toLocaleString()}
                </div>
                <div className="detail-item">
                  <strong>Updated At:</strong> {new Date(property.updated_at).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="tab-content">
            {pricing ? (
              <div className="pricing-section">
                <h3>Pricing Information</h3>
                <div className="pricing-card">
                  <div className="pricing-info">
                    <div className="info-item">
                      <span className="label">Season Start:</span>
                      <span className="value">{new Date(pricing.season_start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Season End:</span>
                      <span className="value">{new Date(pricing.season_end_date).toLocaleDateString()}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Special Offers:</span>
                      <span className="value">{pricing.special_offer_note || 'No special offers'}</span>
                    </div>
                  </div>
                  
                  {pricing.shift_pricing && pricing.shift_pricing.length > 0 && (
                    <div className="shift-pricing">
                      <h4>Shift-based Pricing</h4>
                      <div className="shift-pricing-header">
                        <div className="header-item">Day of Week</div>
                        <div className="header-item">Shift Type</div>
                        <div className="header-item">Price</div>
                      </div>
                      <div className="shift-grid">
                        {pricing.shift_pricing.map((shift, index) => (
                          <div key={index} className="shift-item">
                            <span className="day">{shift.day_of_week}</span>
                            <span className="shift">{shift.shift_type}</span>
                            <span className="price">${shift.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="no-data">
                <p>No pricing information available.</p>
              </div>
            )}
          </div>
        )}

        {/* Amenities Tab */}
        {activeTab === 'amenities' && (
          <div className="tab-content">
            {amenities && amenities.length > 0 ? (
              <div className="amenities-section">
                <h3>Amenities</h3>
                <div className="amenities-grid">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="amenity-item">
                      <span className="amenity-type">{amenity.type}</span>
                      <span className="amenity-value">{amenity.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-data">
                <p>No amenities information available.</p>
              </div>
            )}
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="tab-content">
            <div className="media-section">
              {/* Images */}
              {images && images.length > 0 && (
                <div className="media-group">
                  <h3>Images ({images.length})</h3>
                  <div className="images-grid">
                    {images.map((image, index) => (
                      <div key={index} className="image-item">
                        <img src={image.image_url} alt={`Property image ${index + 1}`} />
                        <div className="image-info">
                          <span>Uploaded: {new Date(image.uploaded_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {videos && videos.length > 0 && (
                <div className="media-group">
                  <h3>Videos ({videos.length})</h3>
                  <div className="videos-grid">
                    {videos.map((video, index) => (
                      <div key={index} className="video-item">
                        <video controls>
                          <source src={video.video_url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        <div className="video-info">
                          <span>Uploaded: {new Date(video.uploaded_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!images || images.length === 0) && (!videos || videos.length === 0) && (
                <div className="no-data">
                  <p>No media files available.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 