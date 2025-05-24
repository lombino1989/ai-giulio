import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const BookingConfirmationPage = () => {
  const location = useLocation();
  
  // If no state is passed, or booking details are missing, redirect
  if (!location.state || !location.state.confirmedBooking || !location.state.tripDetails) {
    // Redirect to home or profile page if confirmation data is not available
    return <Navigate to="/profile" replace />;
  }

  const { confirmedBooking, tripDetails } = location.state;

  // Calculate duration for display if not directly available in confirmedBooking
  // (assuming tripDetails has checkInDate and checkOutDate from BookingForm)
  const checkIn = new Date(confirmedBooking.check_in_date || tripDetails.checkInDate);
  const checkOut = new Date(confirmedBooking.check_out_date || tripDetails.checkOutDate);
  const duration = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-base-100 shadow-2xl rounded-lg p-8 text-center">
        <div className="mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-success mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-success mb-4">Prenotazione Confermata!</h1>
        <p className="text-lg text-neutral mb-6">
          Grazie per aver prenotato con noi. La tua avventura ti aspetta!
        </p>

        <div className="text-left bg-base-200 p-6 rounded-lg shadow-inner space-y-3 mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4 border-b pb-2">Dettagli della Prenotazione:</h2>
          <p><strong>ID Prenotazione:</strong> <span className="font-mono text-accent">{confirmedBooking.id}</span></p>
          <p><strong>Destinazione:</strong> {tripDetails.name || (confirmedBooking.trip ? confirmedBooking.trip.name : 'N/D')}</p>
          {tripDetails.country && <p><strong>Paese:</strong> {tripDetails.country}</p>}
          <p><strong>Check-in:</strong> {checkIn.toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> {checkOut.toLocaleDateString()}</p>
          <p><strong>Durata Soggiorno:</strong> {duration} notti</p>
          <p><strong>Numero Viaggiatori:</strong> {confirmedBooking.travelers}</p>
          <p className="text-xl font-bold"><strong>Prezzo Totale:</strong> €{confirmedBooking.total_price?.toFixed(2)}</p>
          <p><strong>Stato:</strong> <span className="badge badge-lg badge-success">{confirmedBooking.status || 'Confermata'}</span></p>
          <p><strong>Data Prenotazione:</strong> {new Date(confirmedBooking.booking_date).toLocaleString()}</p>
        </div>

        <p className="text-neutral-focus mb-6">
          Riceverai a breve una mail di conferma con tutti i dettagli del tuo viaggio. 
          Puoi visualizzare questa e altre prenotazioni nella tua pagina Profilo.
        </p>

        <div className="space-x-4">
          <Link to="/profile" className="btn btn-primary">
            Vai al Mio Profilo
          </Link>
          <Link to="/destinations" className="btn btn-outline btn-secondary">
            Esplora Altre Destinazioni
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
