import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking, validatePromoCode } from '../api';
import { useBooking } from '../context/BookingContext';
import { PromoValidation } from '../types';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedExperience, selectedSlot, numPeople, resetBooking } = useBooking();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    promoCode: '',
  });

  const [promoValidation, setPromoValidation] = useState<PromoValidation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    console.log('CheckoutPage - Experience:', selectedExperience?.id, 'Slot:', selectedSlot?.id);
    if (!selectedExperience || !selectedSlot) {
      console.log('Missing experience or slot, redirecting to home');
      navigate('/');
    }
  }, [selectedExperience, selectedSlot, navigate]);

  const totalAmount = (selectedExperience?.pricePerPerson || 0) * numPeople;
  const discountAmount = promoValidation?.discountAmount || 0;
  const finalAmount = totalAmount - discountAmount;

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.customerName.trim() || formData.customerName.length < 2) {
      errors.customerName = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customerEmail)) {
      errors.customerEmail = 'Invalid email address';
    }

    if (formData.customerPhone && formData.customerPhone.length < 10) {
      errors.customerPhone = 'Invalid phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePromoValidate = async () => {
    if (!formData.promoCode.trim()) return;

    try {
      const validation = await validatePromoCode(formData.promoCode, totalAmount);
      setPromoValidation(validation);

      if (!validation.valid) {
        setError(validation.message);
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      setError('Failed to validate promo code');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      console.log('Creating booking with:', {
        experience_id: selectedExperience!.id,
        slot_id: selectedSlot!.id,
        num_people: numPeople,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        promo_code: formData.promoCode
      });

      const bookingData = {
        experience_id: selectedExperience!.id,
        slot_id: selectedSlot!.id,
        num_people: numPeople,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        promo_code: formData.promoCode,
      };

      const booking = await createBooking(bookingData);
      
      console.log('Booking created successfully:', booking.id);
      
      resetBooking();
      
      // Navigate to result page with booking ID
      setTimeout(() => {
        navigate(`/result/${booking.id}`);
      }, 500);

    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedExperience || !selectedSlot) {
    return <div></div>;
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 16px' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '32px' }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Left Column - Form */}
        <div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Customer Info */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
              padding: '24px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Your Information</h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Full Name *</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: validationErrors.customerName ? '2px solid #dc2626' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'inherit'
                  }}
                  placeholder="John Doe"
                />
                {validationErrors.customerName && (
                  <p style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>{validationErrors.customerName}</p>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Email *</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: validationErrors.customerEmail ? '2px solid #dc2626' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'inherit'
                  }}
                  placeholder="john@example.com"
                />
                {validationErrors.customerEmail && (
                  <p style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>{validationErrors.customerEmail}</p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Phone (Optional)</label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: validationErrors.customerPhone ? '2px solid #dc2626' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'inherit'
                  }}
                  placeholder="+1234567890"
                />
                {validationErrors.customerPhone && (
                  <p style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>{validationErrors.customerPhone}</p>
                )}
              </div>
            </div>

            {/* Promo Code */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
              padding: '24px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Promo Code</h2>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={formData.promoCode}
                  onChange={(e) => {
                    setFormData({ ...formData, promoCode: e.target.value.toUpperCase() });
                    setPromoValidation(null);
                  }}
                  placeholder="Enter promo code"
                  disabled={promoValidation?.valid}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'inherit'
                  }}
                />
                {!promoValidation?.valid && (
                  <button
                    type="button"
                    onClick={handlePromoValidate}
                    disabled={!formData.promoCode.trim()}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: '#0284c7',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: formData.promoCode.trim() ? 'pointer' : 'not-allowed',
                      opacity: formData.promoCode.trim() ? 1 : 0.5
                    }}
                  >
                    Apply
                  </button>
                )}
                {promoValidation?.valid && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, promoCode: '' });
                      setPromoValidation(null);
                    }}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>

              {promoValidation?.valid && (
                <div style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px',
                  padding: '12px',
                  marginTop: '12px',
                  color: '#16a34a',
                  fontWeight: '600'
                }}>
                  ✓ Promo code applied! You saved ${promoValidation.discountAmount?.toFixed(2)}
                </div>
              )}
            </div>

            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '16px',
                color: '#dc2626'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#0284c7',
                color: 'white',
                padding: '16px',
                borderRadius: '8px',
                fontWeight: '600',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Processing...' : 'Complete Booking'}
            </button>
          </form>
        </div>

        {/* Right Column - Summary */}
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
            padding: '24px',
            position: 'sticky',
            top: '20px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Order Summary</h3>

            <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ marginBottom: '12px' }}>
                <p style={{ color: '#4b5563', fontSize: '14px' }}>Experience</p>
                <p style={{ fontWeight: '600' }}>{selectedExperience.title}</p>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <p style={{ color: '#4b5563', fontSize: '14px' }}>Date</p>
                <p style={{ fontWeight: '600' }}>
                  {new Date(selectedSlot.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <p style={{ color: '#4b5563', fontSize: '14px' }}>Time</p>
                <p style={{ fontWeight: '600' }}>{selectedSlot.startTime} - {selectedSlot.endTime}</p>
              </div>

              <div>
                <p style={{ color: '#4b5563', fontSize: '14px' }}>People</p>
                <p style={{ fontWeight: '600' }}>{numPeople}</p>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p>Subtotal</p>
                <p>${totalAmount.toFixed(2)}</p>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: '600', marginBottom: '8px' }}>
                  <p>Discount</p>
                  <p>-${discountAmount.toFixed(2)}</p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', paddingTop: '16px', borderTop: '2px solid #0284c7' }}>
                <p>Total</p>
                <p style={{ color: '#0284c7' }}>${finalAmount.toFixed(2)}</p>
              </div>
            </div>

            <button
              onClick={() => navigate(-1)}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#f3f4f6',
                color: '#0284c7',
                border: '2px solid #0284c7',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
