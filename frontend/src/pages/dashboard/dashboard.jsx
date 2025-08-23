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

  const handleEdit = () => {
    // TODO: Navigate to edit page
    alert('Edit functionality will be implemented here');
  };

  const handleBookings = () => {
    // Navigate to bookings page
    window.location.href = '/bookings';
  };

  const handleLogout = () => {
    localStorage.removeItem('propertyToken');
    localStorage.removeItem('propertyData');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="dashboard-page-loading">
        <div className="dashboard-page-loading-spinner">
          <div className="dashboard-page-spinner"></div>
          <span>Loading property details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page-error">
        <div className="dashboard-page-error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="dashboard-page-retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!propertyData) {
    return (
      <div className="dashboard-page-error">
        <div className="dashboard-page-error-container">
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
        <div className="dashboard-page-header-content">
          <div className="dashboard-page-header-left">
            <h1 className="dashboard-page-property-name">{property.name}</h1>
            <p className="dashboard-page-property-type">{property.type}</p>
          </div>
          <div className="dashboard-page-header-right">
            <button onClick={handleEdit} className="dashboard-page-edit-button">
              ✏️ Edit Property
            </button>
            <button onClick={handleBookings} className="dashboard-page-bookings-button">
              📅 View Bookings
            </button>
            <button onClick={handleLogout} className="dashboard-page-logout-button">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-page-tabs">
        <button 
          className={`dashboard-page-tab-button ${activeTab === 'overview' ? 'dashboard-page-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`dashboard-page-tab-button ${activeTab === 'details' ? 'dashboard-page-active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button 
          className={`dashboard-page-tab-button ${activeTab === 'pricing' ? 'dashboard-page-active' : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          Pricing
        </button>
        <button 
          className={`dashboard-page-tab-button ${activeTab === 'amenities' ? 'dashboard-page-active' : ''}`}
          onClick={() => setActiveTab('amenities')}
        >
          Amenities
        </button>
        <button 
          className={`dashboard-page-tab-button ${activeTab === 'media' ? 'dashboard-page-active' : ''}`}
          onClick={() => setActiveTab('media')}
        >
          Media
        </button>
      </div>

      {/* Content Area */}
      <div className="dashboard-page-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="dashboard-page-tab-content">
            <div className="dashboard-page-overview-grid">
              <div className="dashboard-page-overview-card">
                <h3>Basic Information</h3>
                <div className="dashboard-page-info-item">
                  <span className="dashboard-page-label">Name:</span>
                  <span className="dashboard-page-value">{property.name}</span>
                </div>
                <div className="dashboard-page-info-item">
                  <span className="dashboard-page-label">Type:</span>
                  <span className="dashboard-page-value">{property.type}</span>
                </div>
                <div className="dashboard-page-info-item">
                  <span className="dashboard-page-label">Description:</span>
                  <span className="dashboard-page-value">{property.description || 'No description available'}</span>
                </div>
                <div className="dashboard-page-info-item">
                  <span className="dashboard-page-label">Max Occupancy:</span>
                  <span className="dashboard-page-value">{property.max_occupancy} people</span>
                </div>
              </div>

              <div className="dashboard-page-overview-card">
                <h3>Location</h3>
                <div className="dashboard-page-info-item">
                  <span className="dashboard-page-label">Address:</span>
                  <span className="dashboard-page-value">{property.address}</span>
                </div>
                <div className="dashboard-page-info-item">
                  <span className="dashboard-page-label">City:</span>
                  <span className="dashboard-page-value">{property.city}</span>
                </div>
                <div className="dashboard-page-info-item">
                  <span className="dashboard-page-label">Province:</span>
                  <span className="dashboard-page-value">{property.province}</span>
                </div>
                <div className="dashboard-page-info-item">
                  <span className="dashboard-page-label">Country:</span>
                  <span className="dashboard-page-value">{property.country}</span>
                </div>
              </div>

              <div className="dashboard-page-overview-card">
                <h3>Contact Information</h3>
                <div className="dashboard-page-info-item">
                  <span className="dashboard-page-label">Contact Person:</span>
                  <span className="dashboard-page-value">{property.contact_person}</span>
                </div>
                <div className="dashboard-page-info-item">
                  <span className="dashboard-page-label">Phone:</span>
                  <span className="dashboard-page-value">{property.contact_number}</span>
                </div>
                <div className="dashboard-page-info-item">
                  <span className="dashboard-page-label">Email:</span>
                  <span className="dashboard-page-value">{property.email}</span>
                </div>
                <div className="dashboard-page-info-item">
                  <span className="dashboard-page-label">Owner:</span>
                  <span className="dashboard-page-value">{owner_username || 'Not specified'}</span>
                </div>
              </div>

              <div className="dashboard-page-overview-card">
                <h3>Business Details</h3>
                <div className="dashboard-page-info-item">
                  <span className="dashboard-page-label">Advance Payment:</span>
                  <span className="dashboard-page-value">{property.advance_percentage}%</span>
                </div>
                <div className="dashboard-page-info-item">
                  <span className="dashboard-page-label">Created:</span>
                  <span className="dashboard-page-value">{new Date(property.created_at).toLocaleDateString()}</span>
                </div>
                <div className="dashboard-page-info-item">
                  <span className="dashboard-page-label">Last Updated:</span>
                  <span className="dashboard-page-value">{new Date(property.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="dashboard-page-tab-content">
            <div className="dashboard-page-details-section">
              <h3>Property Details</h3>
              <div className="dashboard-page-details-grid">
                <div className="dashboard-page-detail-item">
                  <strong>Property ID:</strong> {property.property_id}
                </div>
                <div className="dashboard-page-detail-item">
                  <strong>Username:</strong> {property.username}
                </div>
                <div className="dashboard-page-detail-item">
                  <strong>Description:</strong> {property.description || 'No description available'}
                </div>
                <div className="dashboard-page-detail-item">
                  <strong>Address:</strong> {property.address}
                </div>
                <div className="dashboard-page-detail-item">
                  <strong>City:</strong> {property.city}
                </div>
                <div className="dashboard-page-detail-item">
                  <strong>Province:</strong> {property.province}
                </div>
                <div className="dashboard-page-detail-item">
                  <strong>Country:</strong> {property.country}
                </div>
                <div className="dashboard-page-detail-item">
                  <strong>Contact Person:</strong> {property.contact_person}
                </div>
                <div className="dashboard-page-detail-item">
                  <strong>Contact Number:</strong> {property.contact_number}
                </div>
                <div className="dashboard-page-detail-item">
                  <strong>Email:</strong> {property.email}
                </div>
                <div className="dashboard-page-detail-item">
                  <strong>Max Occupancy:</strong> {property.max_occupancy} people
                </div>
                <div className="dashboard-page-detail-item">
                  <strong>Type:</strong> {property.type}
                </div>
                <div className="dashboard-page-detail-item">
                  <strong>Advance Percentage:</strong> {property.advance_percentage}%
                </div>
                <div className="dashboard-page-detail-item">
                  <strong>Created At:</strong> {new Date(property.created_at).toLocaleString()}
                </div>
                <div className="dashboard-page-detail-item">
                  <strong>Updated At:</strong> {new Date(property.updated_at).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="dashboard-page-tab-content">
            {pricing ? (
              <div className="dashboard-page-pricing-section">
                <h3>Pricing Information</h3>
                <div className="dashboard-page-pricing-card">
                  <div className="dashboard-page-pricing-info">
                    <div className="dashboard-page-info-item">
                      <span className="dashboard-page-label">Season Start:</span>
                      <span className="dashboard-page-value">{new Date(pricing.season_start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="dashboard-page-info-item">
                      <span className="dashboard-page-label">Season End:</span>
                      <span className="dashboard-page-value">{new Date(pricing.season_end_date).toLocaleDateString()}</span>
                    </div>
                    <div className="dashboard-page-info-item">
                      <span className="dashboard-page-label">Special Offers:</span>
                      <span className="dashboard-page-value">{pricing.special_offer_note || 'No special offers'}</span>
                    </div>
                  </div>
                  
                  {pricing.shift_pricing && pricing.shift_pricing.length > 0 && (
                    <div className="dashboard-page-shift-pricing">
                      <h4>Shift-based Pricing</h4>
                      <div className="dashboard-page-shift-pricing-header">
                        <div className="dashboard-page-header-item">Day of Week</div>
                        <div className="dashboard-page-header-item">Shift Type</div>
                        <div className="dashboard-page-header-item">Price</div>
                      </div>
                      <div className="dashboard-page-shift-grid">
                        {pricing.shift_pricing.map((shift, index) => (
                          <div key={index} className="dashboard-page-shift-item">
                            <span className="dashboard-page-day">{shift.day_of_week}</span>
                            <span className="dashboard-page-shift">{shift.shift_type}</span>
                            <span className="dashboard-page-price">${shift.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="dashboard-page-no-data">
                <p>No pricing information available.</p>
              </div>
            )}
          </div>
        )}

        {/* Amenities Tab */}
        {activeTab === 'amenities' && (
          <div className="dashboard-page-tab-content">
            {amenities && amenities.length > 0 ? (
              <div className="dashboard-page-amenities-section">
                <h3>Amenities</h3>
                <div className="dashboard-page-amenities-grid">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="dashboard-page-amenity-item">
                      <span className="dashboard-page-amenity-type">{amenity.type}</span>
                      <span className="dashboard-page-amenity-value">{amenity.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="dashboard-page-no-data">
                <p>No amenities information available.</p>
              </div>
            )}
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="dashboard-page-tab-content">
            <div className="dashboard-page-media-section">
              {/* Images */}
              {images && images.length > 0 && (
                <div className="dashboard-page-media-group">
                  <h3>Images ({images.length})</h3>
                  <div className="dashboard-page-images-grid">
                    {images.map((image, index) => (
                      <div key={index} className="dashboard-page-image-item">
                        <img src={image.image_url} alt={`Property image ${index + 1}`} />
                        <div className="dashboard-page-image-info">
                          <span>Uploaded: {new Date(image.uploaded_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {videos && videos.length > 0 && (
                <div className="dashboard-page-media-group">
                  <h3>Videos ({videos.length})</h3>
                  <div className="dashboard-page-videos-grid">
                    {videos.map((video, index) => (
                      <div key={index} className="dashboard-page-video-item">
                        <video controls>
                          <source src={video.video_url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        <div className="dashboard-page-video-info">
                          <span>Uploaded: {new Date(video.uploaded_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!images || images.length === 0) && (!videos || videos.length === 0) && (
                <div className="dashboard-page-no-data">
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