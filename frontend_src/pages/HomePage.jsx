import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="text-center py-10">
      <h1 className="text-5xl font-bold text-primary mb-6">
        Benvenuti nella Nostra Agenzia Viaggi!
      </h1>
      <p className="text-xl text-neutral mb-8">
        Esplora destinazioni da sogno e prenota la tua prossima avventura con noi.
      </p>
      <div className="space-x-4">
        <Link to="/destinations" className="btn btn-primary btn-lg">
          Vedi Destinazioni
        </Link>
        <Link to="/about" className="btn btn-secondary btn-lg">
          Scopri di Più su di Noi
        </Link>
      </div>
      
      {/* Placeholder for dynamic content like featured destinations or offers */}
      <div className="mt-16">
        <h2 className="text-3xl font-semibold text-neutral mb-6">Offerte Speciali</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Placeholder cards - these would be dynamic */}
          <div className="card shadow-lg bg-base-100">
            <figure><img src="https://picsum.photos/seed/offer1/400/200" alt="Offerta 1" className="h-48 w-full object-cover" /></figure>
            <div className="card-body">
              <h3 className="card-title text-secondary">Weekend a Parigi</h3>
              <p className="text-neutral-focus">Volo + Hotel da €299!</p>
              <div className="card-actions justify-end">
                <button className="btn btn-sm btn-accent">Dettagli</button>
              </div>
            </div>
          </div>
          <div className="card shadow-lg bg-base-100">
            <figure><img src="https://picsum.photos/seed/offer2/400/200" alt="Offerta 2" className="h-48 w-full object-cover" /></figure>
            <div className="card-body">
              <h3 className="card-title text-secondary">Relax alle Maldive</h3>
              <p className="text-neutral-focus">Resort All-Inclusive da €999!</p>
              <div className="card-actions justify-end">
                <button className="btn btn-sm btn-accent">Dettagli</button>
              </div>
            </div>
          </div>
          <div className="card shadow-lg bg-base-100">
            <figure><img src="https://picsum.photos/seed/offer3/400/200" alt="Offerta 3" className="h-48 w-full object-cover" /></figure>
            <div className="card-body">
              <h3 className="card-title text-secondary">Avventura in Perù</h3>
              <p className="text-neutral-focus">Tour Machu Picchu da €799!</p>
              <div className="card-actions justify-end">
                <button className="btn btn-sm btn-accent">Dettagli</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
