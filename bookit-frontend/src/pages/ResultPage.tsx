import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBooking } from '../api';
import { Booking } from '../types';

const ResultPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('ResultPage mounted with bookingId:', bookingId);
    if (bookingId) {
      fetchBooking();
    } else {
      setLoading(false);
      setError('No booking ID provided');
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching booking with ID:', bookingId);
      const data = await getBooking(bookingId!);
      console.log('Booking data received:', data);
      setBooking(data);
    } catch (err) {
      console.error('Error fetching booking:', err);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '48px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #0284c7',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 16px' }}>
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '16px',
          color: '#dc2626'
        }}>
          {error || 'Booking not found'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '672px', margin: '0 auto', padding: '48px 16px' }}>
      {/* Success Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ fontSize: '60px', marginBottom: '16px' }}>✅</div>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>Booking Confirmed!</h1>
        <p style={{ color: '#4b5563', fontSize: '18px' }}>Your travel experience is booked and ready</p>
      </div>

      {/* Main Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Booking ID Section - PROMINENT */}
        <div style={{
          padding: '32px 24px',
          borderBottom: '2px solid #0284c7',
          backgroundColor: '#f0f9ff'
        }}>
          <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>YOUR BOOKING ID</p>
          <p style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#0284c7',
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            letterSpacing: '2px'
          }}>
            {booking.id}
          </p>
        </div>

        {/* Experience Details */}
        <div style={{ padding: '32px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Experience Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '4px' }}>Experience Name</p>
              <p style={{ fontWeight: '600', fontSize: '16px' }}>{booking.experience?.title || 'N/A'}</p>
            </div>
            <div>
              <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '4px' }}>Location</p>
              <p style={{ fontWeight: '600', fontSize: '16px' }}>{booking.experience?.location || 'N/A'}</p>
            </div>
            <div>
              <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '4px' }}>Duration</p>
              <p style={{ fontWeight: '600', fontSize: '16px' }}>{booking.experience?.duration || 'N/A'}</p>
            </div>
            <div>
              <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '4px' }}>Category</p>
              <p style={{
                fontWeight: '600',
                fontSize: '14px',
                display: 'inline-block',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                padding: '6px 12px',
                borderRadius: '20px'
              }}>
                {booking.experience?.category || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div style={{ padding: '32px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Booking Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '4px' }}>Date</p>
              <p style={{ fontWeight: '600', fontSize: '16px' }}>
                {booking.slot ? new Date(booking.slot.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) : 'N/A'}
              </p>
            </div>
            <div>
              <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '4px' }}>Time Slot</p>
              <p style={{ fontWeight: '600', fontSize: '16px' }}>
                {booking.slot ? `${booking.slot.startTime} - ${booking.slot.endTime}` : 'N/A'}
              </p>
            </div>
            <div>
              <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '4px' }}>Number of Guests</p>
              <p style={{ fontWeight: '600', fontSize: '16px' }}>{booking.numPeople} {booking.numPeople === 1 ? 'Guest' : 'Guests'}</p>
            </div>
            <div>
              <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '4px' }}>Status</p>
              <p style={{
                fontWeight: '600',
                fontSize: '14px',
                display: 'inline-block',
                backgroundColor: '#f0fdf4',
                color: '#16a34a',
                padding: '6px 12px',
                borderRadius: '20px'
              }}>
                ✓ Confirmed
              </p>
            </div>
          </div>
        </div>

        {/* Guest Information */}
        <div style={{ padding: '32px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Guest Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '4px' }}>Full Name</p>
              <p style={{ fontWeight: '600', fontSize: '16px' }}>{booking.customerName}</p>
            </div>
            <div>
              <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '4px' }}>Email Address</p>
              <p style={{ fontWeight: '600', fontSize: '16px' }}>{booking.customerEmail}</p>
            </div>
            {booking.customerPhone && (
              <div>
                <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '4px' }}>Phone Number</p>
                <p style={{ fontWeight: '600', fontSize: '16px' }}>{booking.customerPhone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Price Summary */}
        <div style={{ padding: '32px 24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Price Summary</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <p style={{ color: '#4b5563' }}>Price per Person</p>
            <p style={{ fontWeight: '600' }}>${booking.experience?.pricePerPerson.toFixed(2)}</p>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <p style={{ color: '#4b5563' }}>Number of Guests</p>
            <p style={{ fontWeight: '600' }}>x{booking.numPeople}</p>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
            <p style={{ color: '#4b5563', fontWeight: '600' }}>Subtotal</p>
            <p style={{ fontWeight: '600' }}>${booking.totalAmount.toFixed(2)}</p>
          </div>

          {booking.discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#16a34a', fontWeight: '600' }}>
              <p>Discount ({booking.promoCode})</p>
              <p>-${booking.discountAmount.toFixed(2)}</p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '2px solid #0284c7' }}>
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Total Amount Paid</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#0284c7' }}>${booking.finalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Confirmation Message */}
      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <p style={{ color: '#4b5563', marginBottom: '24px', fontSize: '16px' }}>
          A confirmation email has been sent to <span style={{ fontWeight: '600', color: '#0284c7' }}>{booking.customerEmail}</span>
        </p>
        <p style={{ color: '#4b5563', marginBottom: '32px', fontSize: '14px' }}>
          Please check your email for additional details and booking confirmation.
        </p>
        
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#0284c7',
            color: 'white',
            padding: '12px 32px',
            borderRadius: '8px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0369a1'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
        >
          Book Another Experience
        </button>
      </div>
    </div>
  );
};

export default ResultPage;