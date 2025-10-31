export interface Experience {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  pricePerPerson: number;
  duration: string;
  maxCapacity: number;
  imageUrl: string;
}

export interface TimeSlot {
  id: string;
  experienceId: string;
  date: string;
  startTime: string;
  endTime: string;
  availableSpots: number;
  totalSpots: number;
  isActive: boolean;
}

export interface ExperienceDetail extends Experience {
  slots: TimeSlot[];
}

export interface Booking {
  id: string;
  experienceId: string;
  slotId: string;
  numPeople: number;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  promoCode?: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  createdAt: string;
  experience?: Experience;
  slot?: TimeSlot;
}

export interface PromoValidation {
  valid: boolean;
  discountType?: string;
  discountValue?: number;
  discountAmount?: number;
  message: string;
}

export interface BookingFormData {
  experienceId: string;
  slotId: string;
  numPeople: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  promo_code?: string;
}
