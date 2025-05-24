import React, { useState, useEffect } from 'react';
import { useParams, useNavigate }_from 'react-router-dom';
import BookingForm from '../components/BookingForm'; // Will create this next

const DestinationDetailPage = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTripDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/trips/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Destinazione non trovata.');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          const data = await response.json();
          setTrip(data);
        }
      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch trip details:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTripDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <span className="loading loading-lg loading-spinner text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl text-error">Errore: {error}</h2>
        <button onClick={() => navigate('/destinations')} className="btn btn-primary mt-4">
          Torna alle Destinazioni
        </button>
      </div>
    );
  }

  if (!trip) {
    // Should be caught by error state, but as a fallback
    return <div className="text-center py-10 text-xl">Destinazione non disponibile.</div>;
  }

  // Helper to render list items safely, especially for attractions and tags
  const renderList = (items, defaultMessage = "Non specificato") => {
    if (!items || (Array.isArray(items) && items.length === 0)) {
      return <span className="text-neutral-focus">{defaultMessage}</span>;
    }
    if (Array.isArray(items)) {
      return (
        <ul className="list-disc list-inside text-neutral-focus">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }
    return <span className="text-neutral-focus">{items.toString()}</span>; // Fallback for non-array, non-empty items
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-base-100 shadow-xl rounded-lg overflow-hidden">
        <figure className="h-96">
          <img src={trip.image_url || `https://picsum.photos/seed/${trip.id}/1200/600`} alt={trip.name} className="w-full h-full object-cover"/>
        </figure>
        <div className="p-6 md:p-8">
          <div className="md:flex justify-between items-start">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">{trip.name}</h1>
              {trip.country && <p className="text-xl text-secondary mb-4">{trip.country}</p>}
            </div>
            <div className="text-right mt-4 md:mt-0">
                {trip.rating && (
                    <div className="flex items-center justify-end mb-2">
                        <svg className="w-6 h-6 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                        <span className="text-xl text-neutral font-semibold">{trip.rating.toFixed(1)} / 5</span>
                    </div>
                )}
                <span className="text-3xl font-bold text-primary">€{trip.price_per_night?.toFixed(2)}</span>
                <span className="text-neutral text-sm"> /notte</span>
            </div>
          </div>

          <p className="text-neutral-focus my-6 text-lg leading-relaxed">
            {trip.long_description || trip.description || 'Nessuna descrizione dettagliata disponibile.'}
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div>
              <h3 className="text-2xl font-semibold text-secondary mb-3">Attrazioni Principali</h3>
              {renderList(trip.attractions, "Nessuna attrazione specificata.")}
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-secondary mb-3">Tags</h3>
              {Array.isArray(trip.tags) && trip.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {trip.tags.map(tag => (
                    <span key={tag} className="badge badge-lg badge-outline badge-accent">{tag}</span>
                  ))}
                </div>
              ) : renderList(trip.tags, "Nessun tag specificato.")}
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-secondary mb-3">Periodo Migliore per Visitare</h3>
              <p className="text-neutral-focus">{trip.best_time_to_visit || 'Non specificato'}</p>
            </div>
          </div>
          
          {/* Booking Form Section */}
          <div className="mt-10 p-6 bg-base-200 rounded-lg shadow-inner">
            <h2 className="text-3xl font-bold text-primary text-center mb-6">Prenota Ora il Tuo Soggiorno!</h2>
            {trip.price_per_night != null ? (
              <BookingForm tripId={trip.id} pricePerNight={trip.price_per_night} />
            ) : (
              <div className="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>Informazioni sul prezzo non disponibili. Impossibile prenotare al momento.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailPage;
