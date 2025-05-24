import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { apiRequest } from '../utils/api'; // Import the apiRequest utility

const ProfilePage = () => {
  const { currentUser } = useAuth(); // Token is handled by apiRequest
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) { // No need to check for token here, apiRequest handles it
      const fetchBookings = async () => {
        setIsLoading(true);
        setError('');
        try {
          // Use apiRequest for the authenticated call
          const data = await apiRequest('/my-bookings', 'GET', null, true);
          setBookings(data || []); // Ensure data is an array
        } catch (e) {
          setError(e.message);
          // Error logging is done within apiRequest, but can add more here if needed
          console.error("ProfilePage: Failed to fetch bookings:", e.name, e.message);
          if (e.message.includes("Effettua nuovamente il login")) {
            // This error is thrown by apiRequest on 401, AuthContext will handle logout via event
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchBookings();
    } else {
      setIsLoading(false);
      setError("Utente non autenticato.");
    }
  }, [currentUser]); // Token dependency removed as apiRequest gets it fresh

  if (!currentUser) {
    // This should ideally be handled by ProtectedRoute before component mounts
    return (
        <div className="text-center py-10">
            <p className="text-xl">Devi effettuare il login per visualizzare questa pagina.</p>
            <Link to="/login" className="btn btn-primary mt-4">Login</Link>
        </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-primary mb-8">Il Mio Profilo</h1>
      
      <div className="card bg-base-100 shadow-xl mb-10">
        <div className="card-body">
          <h2 className="card-title text-2xl text-secondary mb-4">Informazioni Utente</h2>
          <p className="text-lg"><strong className="text-neutral">Nome:</strong> {currentUser.name}</p>
          <p className="text-lg"><strong className="text-neutral">Email:</strong> {currentUser.email}</p>
          {/* Add more user details here if available/needed */}
        </div>
      </div>

      <h2 className="text-3xl font-semibold text-primary mb-6">Le Mie Prenotazioni</h2>
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <span className="loading loading-lg loading-spinner text-primary"></span>
        </div>
      )}
      {error && (
        <div className="alert alert-error shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Errore nel caricamento delle prenotazioni: {error}</span>
          </div>
        </div>
      )}
      {!isLoading && !error && bookings.length === 0 && (
        <div className="text-center py-10 bg-base-100 rounded-lg shadow">
          <p className="text-xl text-neutral-focus">Non hai ancora effettuato nessuna prenotazione.</p>
          <Link to="/destinations" className="btn btn-accent mt-6">
            Esplora Destinazioni
          </Link>
        </div>
      )}
      {!isLoading && !error && bookings.length > 0 && (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
          {bookings.map(booking => (
            <div key={booking.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="card-body">
                {booking.trip_image_url && (
                    <figure className="mb-4 rounded-lg overflow-hidden h-48">
                        <img src={booking.trip_image_url} alt={booking.trip_name} className="w-full h-full object-cover" />
                    </figure>
                )}
                <h3 className="card-title text-secondary text-xl">
                  {booking.trip_name || `Prenotazione ID: ${booking.id}`}
                </h3>
                <p className="text-sm text-neutral-focus mb-1">ID Prenotazione: <span className="font-mono text-accent">{booking.id}</span></p>
                
                <div className="divider my-1"></div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <p><strong className="text-neutral">Check-in:</strong> {new Date(booking.check_in_date).toLocaleDateString()}</p>
                  <p><strong className="text-neutral">Check-out:</strong> {new Date(booking.check_out_date).toLocaleDateString()}</p>
                  <p><strong className="text-neutral">Viaggiatori:</strong> {booking.travelers}</p>
                  <p><strong className="text-neutral">Stato:</strong> <span className={`badge ${booking.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>{booking.status}</span></p>
                </div>
                
                <div className="divider my-1"></div>
                
                <p className="text-lg font-semibold text-primary">Prezzo Totale: €{booking.total_price?.toFixed(2)}</p>
                <p className="text-xs text-neutral-focus">Data Prenotazione: {new Date(booking.booking_date).toLocaleString()}</p>
                
                <div className="card-actions justify-end mt-4">
                  <Link to={`/destinations/${booking.trip_id}`} className="btn btn-sm btn-outline btn-primary">
                    Vedi Dettagli Destinazione
                  </Link>
                  {/* Placeholder for future actions like "Cancel Booking" or "Modify" */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
