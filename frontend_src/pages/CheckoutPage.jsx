import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PaymentForm from '../components/PaymentForm';
import { apiRequest } from '../utils/api'; // Import the apiRequest utility

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Token is handled by apiRequest
  
  const [bookingDetails, setBookingDetails] = useState(null);
  const [tripDetails, setTripDetails] = useState(null); // To store fetched trip name/image
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentError, setPaymentError] = useState('');


  useEffect(() => {
    if (location.state?.bookingDetails) {
      setBookingDetails(location.state.bookingDetails);
      const fetchTrip = async () => {
        setIsLoading(true); // Start loading before fetch
        setError('');
        try {
          // Use apiRequest for fetching public trip details (requiresAuth = false)
          const data = await apiRequest(`/trips/${location.state.bookingDetails.tripId}`, 'GET', null, false);
          setTripDetails(data);
        } catch (err) {
          setError(err.message || "Dettagli del viaggio non trovati.");
        } finally {
          setIsLoading(false); // Stop loading after fetch
        }
      };
      fetchTrip();
    } else {
      setError('Dettagli della prenotazione non trovati.');
    }
  }, [location.state]);

  const handlePaymentSuccess = async (paymentData) => {
    if (!bookingDetails || !currentUser) { // Token check is implicitly handled by apiRequest
      setPaymentError('Errore: Utente non autenticato o dettagli prenotazione mancanti.');
      return;
    }
    setIsLoading(true);
    setPaymentError('');

    const { tripId, checkInDate, checkOutDate, travelers, pricePerNight } = bookingDetails;
    
    // Calculate total price again for safety, or trust passed state
    const date1 = new Date(checkInDate);
    const date2 = new Date(checkOutDate);
    const durationOfStay = Math.ceil((date2 - date1) / (1000 * 60 * 60 * 24));
    const totalPrice = pricePerNight * durationOfStay * travelers;

    const bookingPayload = {
      trip_id: tripId,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      travelers: parseInt(travelers, 10),
      total_price: parseFloat(totalPrice.toFixed(2)),
    };

    try {
      // Use apiRequest for the authenticated POST call
      const responseData = await apiRequest('/bookings', 'POST', bookingPayload, true);
      
      // Navigate to confirmation page with all relevant data
      // responseData directly contains the booking object from the API
      navigate('/booking-confirmation', {
        state: { 
          confirmedBooking: responseData.booking,
          tripDetails: { ...tripDetails, ...bookingDetails }
        }
      });

    } catch (err) {
      setPaymentError(err.message || 'Si è verificato un errore. Riprova.');
      // Error logging is done within apiRequest
      if (err.message.includes("Effettua nuovamente il login")) {
        // AuthContext will handle logout via event
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (error && !tripDetails) { // If there was an error fetching trip details initially
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl text-error mb-4">Errore nel Caricamento del Checkout</h1>
        <p className="text-neutral-focus mb-4">{error}</p>
        <button onClick={() => navigate('/destinations')} className="btn btn-primary">
          Torna alle Destinazioni
        </button>
      </div>
    );
  }
  
  if (!bookingDetails || !tripDetails) { // Still loading or redirecting due to missing details
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <span className="loading loading-lg loading-spinner text-primary"></span>
      </div>
    );
  }

  // Calculate duration and total price for display
  const date1 = new Date(bookingDetails.checkInDate);
  const date2 = new Date(bookingDetails.checkOutDate);
  const durationOfStay = Math.ceil((date2 - date1) / (1000 * 60 * 60 * 24));
  const displayTotalPrice = bookingDetails.pricePerNight * durationOfStay * bookingDetails.travelers;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Booking Summary Section */}
        <div className="bg-base-100 shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-secondary mb-6">Riepilogo Prenotazione</h2>
          {tripDetails.image_url && (
            <img src={tripDetails.image_url} alt={tripDetails.name} className="rounded-lg mb-4 h-48 w-full object-cover" />
          )}
          <h3 className="text-xl font-medium text-neutral mb-1">{tripDetails.name}</h3>
          {tripDetails.country && <p className="text-sm text-neutral-focus mb-4">{tripDetails.country}</p>}
          
          <div className="space-y-2 text-neutral">
            <p><strong>Check-in:</strong> {new Date(bookingDetails.checkInDate).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> {new Date(bookingDetails.checkOutDate).toLocaleDateString()}</p>
            <p><strong>Durata:</strong> {durationOfStay} notti</p>
            <p><strong>Viaggiatori:</strong> {bookingDetails.travelers}</p>
            <p><strong>Prezzo per notte:</strong> €{bookingDetails.pricePerNight?.toFixed(2)}</p>
          </div>
          <div className="divider"></div>
          <p className="text-2xl font-bold text-primary text-right">
            Totale: €{displayTotalPrice.toFixed(2)}
          </p>
        </div>

        {/* Payment Form Section */}
        <div className="bg-base-100 shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-secondary mb-6">Dati Pagamento</h2>
          {paymentError && <div className="alert alert-error text-sm p-3 mb-4">{paymentError}</div>}
          <PaymentForm 
            onSubmit={handlePaymentSuccess} 
            isLoading={isLoading} 
            totalAmount={displayTotalPrice}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
