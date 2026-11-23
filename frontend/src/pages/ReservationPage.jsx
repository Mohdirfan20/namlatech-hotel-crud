import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchHotelById } from '../redux/hotelSlice';
import { getImageUrl } from '../services/api';
import {
  Calendar,
  Users,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  Star,
  MapPin,
  Lock,
  Sparkles,
  Printer,
  Home,
  Tag,
  Building
} from 'lucide-react';

const ROOM_TIERS = [
  { id: 'deluxe', name: 'Executive Deluxe King Suite', extra: 0, desc: 'King plush bed, city view, 65m²' },
  { id: 'penthouse', name: 'Oceanfront Panoramic Penthouse', extra: 95, desc: 'Top floor, private balcony & jacuzzi, 85m²' },
  { id: 'presidential', name: 'Presidential Royal Residence', extra: 180, desc: 'Private butler, terrace plunge pool, 120m²' }
];

const ReservationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedHotel, detailLoading, error } = useSelector((state) => state.hotels);

  // Workflow steps: 1 = Dates & Rooms, 2 = Guest Info, 3 = Payment, 4 = Confirmed
  const [currentStep, setCurrentStep] = useState(1);

  // Booking Form State
  const today = new Date().toISOString().split('T')[0];
  const threeDaysLater = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(threeDaysLater);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(ROOM_TIERS[0]);

  // Guest Details
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  // Booking result
  const [bookingReference, setBookingReference] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchHotelById(id));
    }
  }, [dispatch, id]);

  // Calculate nights
  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const basePricePerNight = Number(selectedHotel?.price || 0) + selectedRoom.extra;
  const subtotal = basePricePerNight * nights;
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxesAndFees = Math.round((subtotal - discountAmount) * 0.12);
  const grandTotal = subtotal - discountAmount + taxesAndFees;

  // Handle promo apply
  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'NAMLA10') {
      setDiscountPercent(10);
      setPromoMessage('Promo code NAMLA10 applied! 10% discount.');
    } else {
      setPromoMessage('Invalid promo code. Try "NAMLA10"');
    }
  };

  // Submit payment & complete booking
  const handleFinalPayment = (e) => {
    e.preventDefault();
    const refCode = `NLM-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingReference(refCode);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (detailLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Preparing booking console...</p>
      </div>
    );
  }

  if (error || !selectedHotel) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 p-8 rounded-2xl">
          <h2 className="text-lg font-black text-red-700 mb-2">Unable to load hotel for reservation</h2>
          <Link to="/" className="text-xs font-bold text-red-600 underline">Return to Hotel Directory</Link>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(selectedHotel.image_path);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Helmet>
        <title>{`Reserve Accommodation | ${selectedHotel.title} | NamlaTech`}</title>
        <meta name="description" content={`Complete your reservation for ${selectedHotel.title}.`} />
      </Helmet>

      {/* Step Indicator Header */}
      <div className="mb-8">
        <Link
          to={`/hotels/${selectedHotel.id}`}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-red-600 transition mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Hotel Overview</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
              Verified Reservation Checkout
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-black mt-1">
              Reserve Your Stay at {selectedHotel.title}
            </h1>
          </div>

          {/* Stepper Wizard (1 -> 2 -> 3 -> 4) */}
          <div className="flex items-center space-x-2 text-xs font-bold">
            <span className={`px-3 py-1 rounded-full ${currentStep >= 1 ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              1. Dates
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className={`px-3 py-1 rounded-full ${currentStep >= 2 ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              2. Guest
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className={`px-3 py-1 rounded-full ${currentStep >= 3 ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              3. Payment
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className={`px-3 py-1 rounded-full ${currentStep === 4 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              4. Confirmed
            </span>
          </div>
        </div>
      </div>

      {/* CONFIRMED STEP (Step 4) */}
      {currentStep === 4 ? (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-r from-black via-zinc-900 to-red-950 text-white p-8 text-center relative">
            <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ring-red-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs uppercase font-black tracking-widest text-red-400">Reservation Confirmed</span>
            <h2 className="text-3xl font-black text-white mt-1">Thank You, {guestName || 'Valued Guest'}!</h2>
            <p className="text-xs text-gray-300 mt-1">
              Your booking at <strong className="text-white">{selectedHotel.title}</strong> is officially guaranteed.
            </p>
            <div className="mt-4 inline-block bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-mono font-bold tracking-wider text-red-300">
              Booking Reference: #{bookingReference}
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Booking Summary Pass */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-zinc-50 p-5 rounded-2xl border border-gray-200">
              <div>
                <span className="text-gray-400 uppercase font-bold text-[10px] block">Property</span>
                <span className="font-extrabold text-black text-sm block mt-0.5">{selectedHotel.title}</span>
                <span className="text-gray-500 text-[11px] block mt-1">
                  {Number(selectedHotel.latitude).toFixed(3)}° N, {Number(selectedHotel.longitude).toFixed(3)}° E
                </span>
              </div>
              <div>
                <span className="text-gray-400 uppercase font-bold text-[10px] block">Selected Suite</span>
                <span className="font-extrabold text-red-700 text-sm block mt-0.5">{selectedRoom.name}</span>
                <span className="text-gray-500 text-[11px] block mt-1">{adults} Adults, {children} Children</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <span className="text-gray-400 uppercase font-bold text-[10px] block">Check-in</span>
                <span className="font-bold text-black block mt-0.5">{checkIn} (3:00 PM)</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <span className="text-gray-400 uppercase font-bold text-[10px] block">Check-out</span>
                <span className="font-bold text-black block mt-0.5">{checkOut} (11:00 AM) • {nights} Nights</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <span className="text-gray-400 uppercase font-bold text-[10px] block">Guest Contact</span>
                <span className="font-bold text-black block mt-0.5">{guestEmail || 'email@guest.com'}</span>
                <span className="text-gray-500 text-[11px] block">{guestPhone}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <span className="text-gray-400 uppercase font-bold text-[10px] block">Total Amount Paid</span>
                <span className="text-lg font-black text-red-600 block mt-0.5">${grandTotal.toFixed(2)} USD</span>
                <span className="text-emerald-700 text-[10px] font-bold">Paid & Verified via Secure Gateway</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 bg-black hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition flex items-center justify-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Booking Voucher</span>
              </button>
              <Link
                to="/"
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Return to Hotel Directory</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* TWO COLUMN CHECKOUT LAYOUT */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Left Checkout Flow (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* STEP 1: Dates & Suite Selection */}
            {currentStep === 1 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-200 space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-black text-black flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-red-600" /> Step 1: Select Stay Dates & Guests
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose your arrival and departure schedule to compute exact nightly room availability.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Check-in Date</label>
                    <input
                      type="date"
                      min={today}
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl font-bold text-black focus:ring-2 focus:ring-red-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Check-out Date</label>
                    <input
                      type="date"
                      min={checkIn || today}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl font-bold text-black focus:ring-2 focus:ring-red-600 outline-none"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Adults (18+)</label>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl font-bold text-black focus:ring-2 focus:ring-red-600 outline-none"
                    >
                      <option value={1}>1 Adult</option>
                      <option value={2}>2 Adults</option>
                      <option value={3}>3 Adults</option>
                      <option value={4}>4 Adults</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Children</label>
                    <select
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl font-bold text-black focus:ring-2 focus:ring-red-600 outline-none"
                    >
                      <option value={0}>0 Children</option>
                      <option value={1}>1 Child</option>
                      <option value={2}>2 Children</option>
                    </select>
                  </div>
                </div>

                {/* Suite Upgrade Options */}
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-3">Choose Suite Category</label>
                  <div className="space-y-3">
                    {ROOM_TIERS.map((room) => {
                      const isSelected = selectedRoom.id === room.id;
                      return (
                        <div
                          key={room.id}
                          onClick={() => setSelectedRoom(room)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
                            isSelected
                              ? 'border-red-600 bg-red-50/50 shadow-xs'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div>
                            <span className="font-extrabold text-sm text-black block">{room.name}</span>
                            <span className="text-xs text-gray-500 block mt-0.5">{room.desc}</span>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <span className="text-sm font-black text-red-600 block">
                              {room.extra === 0 ? 'Included' : `+$${room.extra}/night`}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">
                              {isSelected ? '✓ Selected' : 'Select'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition"
                >
                  Continue to Guest Information →
                </button>
              </div>
            )}

            {/* STEP 2: Guest Information */}
            {currentStep === 2 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-200 space-y-6">
                <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-black flex items-center">
                      <Users className="w-5 h-5 mr-2 text-red-600" /> Step 2: Guest Details & Preferences
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Enter contact details for booking voucher and confirmation.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-gray-400 hover:text-black font-semibold"
                  >
                    Edit Dates
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mohamed Irfan"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl font-bold text-black focus:ring-2 focus:ring-red-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Email Address (for receipt) *</label>
                      <input
                        type="email"
                        required
                        placeholder="irfan@example.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl font-bold text-black focus:ring-2 focus:ring-red-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl font-bold text-black focus:ring-2 focus:ring-red-600 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Special Requests (Optional)</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Early check-in requested, high floor, quiet room, anniversary flowers..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl font-medium text-black focus:ring-2 focus:ring-red-600 outline-none"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="py-3 px-5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!guestName.trim()) return alert('Please enter your legal name.');
                      if (!guestEmail.trim()) return alert('Please enter your email.');
                      setCurrentStep(3);
                    }}
                    className="flex-1 py-3 px-5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition"
                  >
                    Proceed to Payment Step →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Secure Payment */}
            {currentStep === 3 && (
              <form onSubmit={handleFinalPayment} className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-200 space-y-6">
                <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-black flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-red-600" /> Step 3: Secure Payment & Guarantee
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Guaranteed 256-bit SSL encrypted reservation transaction.</p>
                  </div>
                  <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <Lock className="w-3.5 h-3.5 mr-1" /> SSL Protected
                  </span>
                </div>

                {/* Payment Option Tabs */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2.5 px-4 rounded-xl border-2 text-xs font-bold transition flex items-center justify-center space-x-2 ${
                      paymentMethod === 'card' ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Credit / Debit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('property')}
                    className={`py-2.5 px-4 rounded-xl border-2 text-xs font-bold transition flex items-center justify-center space-x-2 ${
                      paymentMethod === 'property' ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>Pay at Property</span>
                  </button>
                </div>

                {paymentMethod === 'card' ? (
                  <div className="space-y-4 bg-zinc-50 p-5 rounded-2xl border border-gray-200">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Cardholder Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="MOHAMED IRFAN"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-gray-300 rounded-lg font-bold text-black focus:ring-2 focus:ring-red-600 outline-none uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Card Number *</label>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="4532 •••• •••• 8892"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-gray-300 rounded-lg font-mono font-bold text-black focus:ring-2 focus:ring-red-600 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Expiry (MM/YY) *</label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs bg-white border border-gray-300 rounded-lg font-mono font-bold text-black focus:ring-2 focus:ring-red-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">CVV / CVC *</label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          placeholder="•••"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs bg-white border border-gray-300 rounded-lg font-mono font-bold text-black focus:ring-2 focus:ring-red-600 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-1">
                    <p className="font-bold">✓ No prepayment required today.</p>
                    <p className="text-gray-600">You can pay conveniently upon check-in at the hotel front desk via Cash, Card, or UPI.</p>
                  </div>
                )}

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="py-3 px-5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 px-5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition transform active:scale-95"
                  >
                    Pay & Confirm Booking (${grandTotal.toFixed(2)}) →
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Sticky Reservation Price Breakdown */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-200 space-y-5 sticky top-6">
            {/* Property Preview Card */}
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
              <img
                src={imageUrl}
                alt={selectedHotel.title}
                className="w-16 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-red-600 block">Selected Property</span>
                <h3 className="font-extrabold text-sm text-black truncate">{selectedHotel.title}</h3>
                <div className="flex items-center text-amber-500 text-xs font-bold mt-0.5">
                  <Star className="w-3 h-3 fill-amber-400 mr-1" /> 4.9 Superb
                </div>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-gray-600 border-b border-gray-100 pb-4">
              <div className="flex justify-between">
                <span>Base Rate ({nights} {nights === 1 ? 'night' : 'nights'}):</span>
                <span className="font-bold text-black">${(Number(selectedHotel.price) * nights).toFixed(2)}</span>
              </div>
              {selectedRoom.extra > 0 && (
                <div className="flex justify-between text-red-700">
                  <span>Suite Upgrade ({selectedRoom.name}):</span>
                  <span className="font-bold">+${(selectedRoom.extra * nights).toFixed(2)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Promo Discount (10%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Taxes & Tourism Fees (12%):</span>
                <span className="font-bold text-black">${taxesAndFees.toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-xs uppercase font-black text-gray-500 tracking-wider">Total Amount</span>
              <div className="text-right">
                <span className="text-2xl font-black text-red-600 tracking-tight">${grandTotal.toFixed(2)}</span>
                <span className="text-[10px] text-gray-400 block">USD • All inclusive</span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="pt-2">
              <div className="flex space-x-1.5">
                <input
                  type="text"
                  placeholder="Promo code (NAMLA10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg uppercase font-bold text-black outline-none focus:ring-1 focus:ring-red-600"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-lg transition"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p className={`text-[11px] font-bold mt-1 ${discountPercent > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                  {promoMessage}
                </p>
              )}
            </form>

            <div className="p-3 bg-red-50/60 border border-red-100 rounded-xl text-[11px] text-red-900 space-y-1">
              <p className="font-bold flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-red-600" /> Free Cancellation
              </p>
              <p className="text-gray-600 text-[10px]">Cancel up to 48 hours before check-in for a 100% full refund.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationPage;
