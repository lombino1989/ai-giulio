import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BookingForm = ({ tripId, pricePerNight }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError('Devi effettuare il login per prenotare.');
      // Optionally, redirect to login, saving current page to return to
      // navigate('/login', { state: { from: location } }); 
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setError('Seleziona le date di check-in e check-out.');
      return;
    }
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      setError('La data di check-out deve essere successiva alla data di check-in.');
      return;
    }
    if (travelers <= 0) {
      setError('Il numero di viaggiatori deve essere almeno 1.');
      return;
    }

    const bookingDetails = {
      tripId,
      pricePerNight,
      checkInDate,
      checkOutDate,
      travelers,
    };

    // Navigate to checkout page with booking details
    navigate('/checkout', { state: { bookingDetails } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 md:p-6 bg-base-100 rounded-lg shadow-md">
      {error && <div className="alert alert-error text-sm p-3">{error}</div>}
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="form-control">
          <label htmlFor="checkInDate" className="label">
            <span className="label-text text-neutral font-semibold">Check-in</span>
          </label>
          <input
            type="date"
            id="checkInDate"
            className="input input-bordered w-full focus:ring-primary focus:border-primary"
            value={checkInDate}
            min={today} // Prevent selecting past dates for check-in
            onChange={(e) => setCheckInDate(e.target.value)}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="checkOutDate" className="label">
            <span className="label-text text-neutral font-semibold">Check-out</span>
          </label>
          <input
            type="date"
            id="checkOutDate"
            className="input input-bordered w-full focus:ring-primary focus:border-primary"
            value={checkOutDate}
            min={checkInDate || today} // Prevent selecting dates before check-in
            onChange={(e) => setCheckOutDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-control">
        <label htmlFor="travelers" className="label">
          <span className="label-text text-neutral font-semibold">Numero di Viaggiatori</span>
        </label>
        <input
          type="number"
          id="travelers"
          className="input input-bordered w-full focus:ring-primary focus:border-primary"
          value={travelers}
          min="1"
          onChange={(e) => setTravelers(parseInt(e.target.value, 10))}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary btn-block disabled:opacity-75" disabled={!currentUser}>
        {currentUser ? 'Procedi al Checkout' : 'Effettua il Login per Prenotare'}
      </button>
    </form>
  );
};

export default BookingForm;
