import React from 'react';

const AboutPage = () => {
  return (
    <div className="py-10 px-4">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">
        Chi Siamo
      </h1>
      <div className="max-w-3xl mx-auto bg-base-100 shadow-xl rounded-lg p-8">
        <p className="text-lg text-neutral mb-4">
          Benvenuti in Agenzia Viaggi Fantastica! La nostra missione è trasformare i vostri sogni di viaggio in realtà indimenticabili. 
          Con anni di esperienza nel settore turistico, ci dedichiamo a curare ogni dettaglio del vostro itinerario, 
          offrendovi destinazioni mozzafiato e un servizio clienti impeccabile.
        </p>
        <p className="text-lg text-neutral mb-4">
          Siamo un team di appassionati viaggiatori e professionisti del turismo, pronti ad ascoltare le vostre esigenze 
          e a consigliarvi le migliori soluzioni per vacanze, viaggi di nozze, avventure esotiche o semplici weekend di relax.
        </p>
        <p className="text-lg text-neutral mb-4">
          La nostra filosofia si basa sulla trasparenza, l'affidabilità e la ricerca continua della qualità. Collaboriamo 
          con i migliori tour operator, compagnie aeree e strutture alberghiere per garantirvi sempre il massimo comfort 
          e sicurezza.
        </p>
        <h2 className="text-2xl font-semibold text-secondary mt-6 mb-3">Perché Sceglierci?</h2>
        <ul className="list-disc list-inside text-neutral space-y-2 mb-6">
          <li>Consulenza personalizzata e itinerari su misura.</li>
          <li>Ampia scelta di destinazioni in tutto il mondo.</li>
          <li>Assistenza completa prima, durante e dopo il viaggio.</li>
          <li>Prezzi competitivi e offerte esclusive.</li>
          <li>Passione per i viaggi e profonda conoscenza delle destinazioni.</li>
        </ul>
        <p className="text-lg text-neutral">
          Contattateci oggi stesso per iniziare a pianificare la vostra prossima avventura. Il mondo vi aspetta!
        </p>
        <div className="mt-8 text-center">
            <img src="https://picsum.photos/seed/team/600/300" alt="Il nostro team" className="rounded-lg shadow-md mx-auto" />
            <p className="text-sm text-gray-500 mt-2">Il nostro team dedicato (immagine di repertorio)</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
