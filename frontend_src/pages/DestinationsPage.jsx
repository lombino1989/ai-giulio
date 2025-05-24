import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

const DestinationsPage = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterRating, setFilterRating] = useState(0); // 0 means no filter

  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/trips');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTrips(data || []); // Ensure data is an array
      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch trips:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const uniqueCountries = useMemo(() => {
    if (!Array.isArray(trips)) return [];
    const countries = trips.map(trip => trip.country).filter(Boolean);
    return [...new Set(countries)].sort();
  }, [trips]);

  const filteredTrips = useMemo(() => {
    if (!Array.isArray(trips)) return [];
    return trips.filter(trip => {
      const nameMatch = trip.name.toLowerCase().includes(searchTerm.toLowerCase());
      const countryMatch = filterCountry ? trip.country === filterCountry : true;
      const ratingMatch = filterRating ? trip.rating >= filterRating : true;
      return nameMatch && countryMatch && ratingMatch;
    });
  }, [trips, searchTerm, filterCountry, filterRating]);

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
        <h2 className="text-2xl text-error">Errore nel caricamento delle destinazioni: {error}</h2>
        <p>Riprova più tardi.</p>
      </div>
    );
  }
  
  if (!Array.isArray(trips)) {
    console.error("Trips data is not an array:", trips);
     return (
      <div className="text-center py-10">
        <h2 className="text-2xl text-error">Errore: Formato dati destinazioni non valido.</h2>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Esplora le Nostre Destinazioni</h1>

      {/* Filters and Search */}
      <div className="mb-8 p-6 bg-base-200 rounded-lg shadow">
        <div className="grid md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="search" className="label">
              <span className="label-text text-neutral">Cerca per nome</span>
            </label>
            <input
              type="text"
              id="search"
              placeholder="Es. Bali, Roma..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="country" className="label">
              <span className="label-text text-neutral">Filtra per paese</span>
            </label>
            <select
              id="country"
              className="select select-bordered w-full"
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
            >
              <option value="">Tutti i paesi</option>
              {uniqueCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="rating" className="label">
              <span className="label-text text-neutral">Rating minimo ({filterRating || 'Qualsiasi'})</span>
            </label>
            <input
              type="range"
              id="rating"
              min="0"
              max="5"
              step="0.5"
              className="range range-primary"
              value={filterRating}
              onChange={(e) => setFilterRating(parseFloat(e.target.value))}
            />
             <div className="w-full flex justify-between text-xs px-2 text-neutral">
              <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrips.map(trip => (
            <div key={trip.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="h-56">
                <img src={trip.image_url || `https://picsum.photos/seed/${trip.id}/400/225`} alt={trip.name} className="w-full h-full object-cover"/>
              </figure>
              <div className="card-body">
                <h2 className="card-title text-secondary">
                  {trip.name}
                  {trip.country && <span className="badge badge-accent ml-2">{trip.country}</span>}
                </h2>
                <p className="text-neutral-focus text-sm mb-2 h-20 overflow-hidden">{trip.description || 'Nessuna descrizione breve disponibile.'}</p>
                <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-lg text-primary">€{trip.price_per_night?.toFixed(2)} <span className="text-sm text-neutral">/notte</span></span>
                    {trip.rating && (
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                            <span className="text-neutral font-semibold">{trip.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>
                <div className="card-actions justify-end">
                  <Link to={`/destinations/${trip.id}`} className="btn btn-primary btn-sm">
                    Vedi Dettagli
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-xl text-neutral">Nessuna destinazione trovata corrispondente ai criteri di ricerca.</h2>
        </div>
      )}
    </div>
  );
};

export default DestinationsPage;
