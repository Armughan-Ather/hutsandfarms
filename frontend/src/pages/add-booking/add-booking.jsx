 import React, { useState } from 'react';
 import axios from 'axios';
 import './add-booking.css';
 
 const AddBooking = () => {
   const [formData, setFormData] = useState({
     cnic: '',
     phone_no: '',
     booking_date: '',
     shift_type: '',
     booking_source: ''
   });
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');
 
   const handleChange = (e) => {
     const { name, value } = e.target;
     setFormData((prev) => ({ ...prev, [name]: value }));
   };
 
   const handleSubmit = async (e) => {
     e.preventDefault();
     setLoading(true);
     setError('');
     setSuccess('');
 
     try {
       const token = localStorage.getItem('propertyToken');
       if (!token) {
         setError('No authentication token found. Please login again.');
         setLoading(false);
         return;
       }
 
       const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
       await axios.post(
         `${backendUrl}/api/bookings/create`,
         formData,
         {
           headers: {
             'Authorization': `Bearer ${token}`,
             'Content-Type': 'application/json'
           }
         }
       );
 
       setSuccess('Booking created successfully!');
       setLoading(false);
 
       setTimeout(() => {
         window.location.href = '/bookings';
       }, 1200);
     } catch (err) {
       if (err.response?.data?.error) {
         setError(err.response.data.error);
       } else if (err.response?.data?.details) {
         setError(err.response.data.details);
       } else if (err.request) {
         setError('Network error. Please check your connection and try again.');
       } else {
         setError('An unexpected error occurred. Please try again.');
       }
       setLoading(false);
     }
   };
 
   const handleBackToBookings = () => {
     window.location.href = '/bookings';
   };
 
   const handleBackToDashboard = () => {
     window.location.href = '/dashboard';
   };
 
   return (
     <div className="add-booking-page-container">
       <header className="add-booking-page-header">
         <div className="add-booking-page-header-inner">
           <div className="add-booking-page-header-left">
             <h1 className="add-booking-page-title">Add New Booking</h1>
             <p className="add-booking-page-subtitle">Create a booking quickly with validated inputs</p>
           </div>
           <div className="add-booking-page-header-actions">
             <button onClick={handleBackToBookings} className="add-booking-page-ghost-button">← Back to Bookings</button>
             <button onClick={handleBackToDashboard} className="add-booking-page-ghost-button">⌂ Dashboard</button>
           </div>
         </div>
       </header>
 
       <main className="add-booking-page-main">
         <div className="add-booking-page-card">
           <div className="add-booking-page-card-header">
             <h2>Create Booking</h2>
             <p>Enter customer info and booking details</p>
           </div>
 
           {error && <div className="add-booking-page-alert add-booking-page-alert-error">{error}</div>}
           {success && <div className="add-booking-page-alert add-booking-page-alert-success">{success}</div>}
 
           <form className="add-booking-page-form" onSubmit={handleSubmit}>
             <div className="add-booking-page-grid">
               <div className="add-booking-page-form-group">
                 <label htmlFor="cnic" className="add-booking-page-label">CNIC Number <span className="add-booking-page-required">*</span></label>
                 <input
                   id="cnic"
                   name="cnic"
                   type="text"
                   placeholder="12345-1234567-1 or 1234512345671"
                   value={formData.cnic}
                   onChange={handleChange}
                   className="add-booking-page-input"
                   required
                 />
                 <small className="add-booking-page-help">13 digits, with or without dashes</small>
               </div>
 
               <div className="add-booking-page-form-group">
                 <label htmlFor="phone_no" className="add-booking-page-label">Phone Number <span className="add-booking-page-required">*</span></label>
                 <input
                   id="phone_no"
                   name="phone_no"
                   type="tel"
                   placeholder="+923001234567"
                   value={formData.phone_no}
                   onChange={handleChange}
                   className="add-booking-page-input"
                   required
                 />
                 <small className="add-booking-page-help">10-15 digits, optional + prefix</small>
               </div>
 
               <div className="add-booking-page-form-group">
                 <label htmlFor="booking_date" className="add-booking-page-label">Booking Date <span className="add-booking-page-required">*</span></label>
                 <input
                   id="booking_date"
                   name="booking_date"
                   type="date"
                   min={new Date().toISOString().split('T')[0]}
                   value={formData.booking_date}
                   onChange={handleChange}
                   className="add-booking-page-input"
                   required
                 />
                 <small className="add-booking-page-help">Select a future date</small>
               </div>
 
               <div className="add-booking-page-form-group">
                 <label htmlFor="shift_type" className="add-booking-page-label">Shift Type <span className="add-booking-page-required">*</span></label>
                 <select
                   id="shift_type"
                   name="shift_type"
                   value={formData.shift_type}
                   onChange={handleChange}
                   className="add-booking-page-select"
                   required
                 >
                   <option value="">Select shift type</option>
                   <option value="Day">Day</option>
                   <option value="Night">Night</option>
                   <option value="Full Day">Full Day</option>
                   <option value="Full Night">Full Night</option>
                 </select>
               </div>
 
               <div className="add-booking-page-form-group">
                 <label htmlFor="booking_source" className="add-booking-page-label">Booking Source <span className="add-booking-page-required">*</span></label>
                 <select
                   id="booking_source"
                   name="booking_source"
                   value={formData.booking_source}
                   onChange={handleChange}
                   className="add-booking-page-select"
                   required
                 >
                   <option value="">Select booking source</option>
                   <option value="Website">Website</option>
                   <option value="WhatsApp Bot">WhatsApp Bot</option>
                   <option value="Third-Party">Third-Party</option>
                 </select>
               </div>
             </div>
 
             <div className="add-booking-page-actions">
               <button
                 type="button"
                 onClick={handleBackToBookings}
                 className="add-booking-page-button add-booking-page-button-ghost"
                 disabled={loading}
               >
                 Cancel
               </button>
               <button
                 type="submit"
                 className="add-booking-page-button add-booking-page-button-primary"
                 disabled={loading}
               >
                 {loading ? (
                   <span className="add-booking-page-loading" aria-hidden />
                 ) : 'Create Booking'}
               </button>
             </div>
           </form>
         </div>
       </main>
     </div>
   );
 };
 
 export default AddBooking;
 

