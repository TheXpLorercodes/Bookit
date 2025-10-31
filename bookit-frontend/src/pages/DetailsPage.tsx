import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExperienceById } from '../api';
import { ExperienceDetail, TimeSlot } from '../types';
import { useBooking } from '../context/BookingContext';

const DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<ExperienceDetail | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { numPeople, setNumPeople, setSelectedExperience, setSelectedSlot: setContextSlot } = useBooking();

  useEffect(() => {
    if (id) fetchExperience();
  }, [id]);

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const data = await getExperienceById(id!);
      console.log('Experience data:', data);
      setExperience(data);
    } catch (err) {
      setError('Failed to load experience');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique dates only (no duplicates)
  const uniqueDates = experience?.slots
    ? Array.from(new Map(experience.slots.map(slot => [slot.date, slot])).values()).map(s => s.date)
    : [];

  const slots = selectedDate
    ? experience?.slots?.filter((s) => s.date === selectedDate) || []
    : [];

  const handleProceedToCheckout = () => {
    if (selectedSlot && experience) {
      console.log('Proceeding to checkout with:', { experience: experience.id, slot: selectedSlot.id });
      setSelectedExperience(experience);
      setContextSlot(selectedSlot);
      navigate('/checkout');
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

  if (error || !experience) {
    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 16px' }}>
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '16px',
          color: '#dc2626'
        }}>
          {error || 'Experience not found'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 16px' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        style={{
          marginBottom: '24px',
          color: '#0284c7',
          backgroundColor: 'transparent',
          border: 'none',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#0369a1'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#0284c7'}
      >
        ← Back to Experiences
      </button>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Left Column */}
        <div>
          {/* Image */}
          <img
            src={experience.imageUrl}
            alt={experience.title}
            style={{
              width: '100%',
              height: '384px',
              objectFit: 'cover',
              borderRadius: '12px',
              marginBottom: '24px'
            }}
          />

          {/* Title & Description */}
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px' }}>
            {experience.title}
          </h1>
          <p style={{ color: '#4b5563', fontSize: '18px', marginBottom: '24px' }}>
            {experience.description}
          </p>

          {/* Selection Section */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '24px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Select Date & Time</h2>

            {/* Date Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                Date
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px'
              }}>
                {uniqueDates.map((date, index) => (
                  <button
                    key={`${date}-${index}`}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedSlot(null);
                    }}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: selectedDate === date ? 'none' : '1px solid #d1d5db',
                      backgroundColor: selectedDate === date ? '#0284c7' : 'white',
                      color: selectedDate === date ? 'white' : '#1f2937',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedDate !== date) {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedDate !== date) {
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    {new Date(date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                  Time Slot
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px'
                }}>
                  {slots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      disabled={slot.availableSpots === 0}
                      style={{
                        padding: '16px',
                        borderRadius: '8px',
                        border: selectedSlot?.id === slot.id ? '2px solid #0284c7' : '2px solid #d1d5db',
                        backgroundColor: selectedSlot?.id === slot.id ? '#0284c7' : 
                                        slot.availableSpots === 0 ? '#f3f4f6' : 'white',
                        color: selectedSlot?.id === slot.id ? 'white' :
                               slot.availableSpots === 0 ? '#9ca3af' : '#1f2937',
                        fontWeight: '600',
                        cursor: slot.availableSpots === 0 ? 'not-allowed' : 'pointer',
                        opacity: slot.availableSpots === 0 ? 0.6 : 1,
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (slot.availableSpots > 0 && selectedSlot?.id !== slot.id) {
                          e.currentTarget.style.borderColor = '#0284c7';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedSlot?.id !== slot.id) {
                          e.currentTarget.style.borderColor = '#d1d5db';
                        }
                      }}
                    >
                      <div>{slot.startTime} - {slot.endTime}</div>
                      <div style={{ fontSize: '12px', marginTop: '8px' }}>
                        {slot.availableSpots > 0
                          ? `${slot.availableSpots} spots left`
                          : 'Sold out'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Number of People */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                Number of People
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={() => setNumPeople(Math.max(1, numPeople - 1))}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    color: '#0284c7',
                    border: '2px solid #0284c7',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  −
                </button>
                <span style={{ fontSize: '24px', fontWeight: 'bold', width: '32px', textAlign: 'center' }}>
                  {numPeople}
                </span>
                <button
                  onClick={() => setNumPeople(numPeople + 1)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    color: '#0284c7',
                    border: '2px solid #0284c7',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
            padding: '24px',
            position: 'sticky',
            top: '24px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              Booking Summary
            </h3>

            {/* Summary Items */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ marginBottom: '12px' }}>
                <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '4px' }}>Experience</p>
                <p style={{ fontWeight: '600' }}>{experience.title}</p>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '4px' }}>Location</p>
                <p style={{ fontWeight: '600' }}>{experience.location}</p>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '4px' }}>Duration</p>
                <p style={{ fontWeight: '600' }}>{experience.duration}</p>
              </div>

              {selectedDate && (
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '4px' }}>Date</p>
                  <p style={{ fontWeight: '600' }}>
                    {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}

              {selectedSlot && (
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '4px' }}>Time</p>
                  <p style={{ fontWeight: '600' }}>
                    {selectedSlot.startTime} - {selectedSlot.endTime}
                  </p>
                </div>
              )}

              <div>
                <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '4px' }}>People</p>
                <p style={{ fontWeight: '600' }}>{numPeople} person(s)</p>
              </div>
            </div>

            {/* Pricing */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ color: '#4b5563' }}>Price per person</p>
                <p style={{ fontWeight: '600' }}>${experience.pricePerPerson.toFixed(2)}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
                <p>Total</p>
                <p style={{ color: '#0284c7' }}>${(experience.pricePerPerson * numPeople).toFixed(2)}</p>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              disabled={!selectedSlot}
              style={{
                width: '100%',
                padding: '12px 24px',
                backgroundColor: selectedSlot ? '#0284c7' : '#d1d5db',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '16px',
                cursor: selectedSlot ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (selectedSlot) {
                  e.currentTarget.style.backgroundColor = '#0369a1';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedSlot) {
                  e.currentTarget.style.backgroundColor = '#0284c7';
                }
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;