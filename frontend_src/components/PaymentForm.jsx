import React, { useState } from 'react';

const PaymentForm = ({ onSubmit, isLoading, totalAmount }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation (very simplified)
    if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
      setError('Tutti i campi della carta sono obbligatori.');
      return;
    }
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        setError('Numero di carta non valido. Dovrebbe essere di 16 cifre.');
        return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        setError('Data di scadenza non valida. Formato MM/AA richiesto.');
        return;
    }
    if (!/^\d{3}$/.test(cvv)) {
        setError('CVV non valido. Dovrebbe essere di 3 cifre.');
        return;
    }

    // Simulate payment processing
    // In a real app, this would involve tokenizing card details and sending to a payment gateway
    console.log('Simulating payment processing with:', { cardNumber, expiryDate, cvv, cardHolder, totalAmount });
    
    // Call the parent's submit handler after "successful" simulated payment
    // Pass along some dummy payment data if needed, or just confirm success
    onSubmit({
      paymentMethod: 'simulated_card',
      transactionId: `SIM_${Date.now()}`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="alert alert-warning text-sm p-3">{error}</div>}
      
      <div className="form-control">
        <label htmlFor="cardHolder" className="label">
          <span className="label-text text-neutral font-semibold">Nome Titolare Carta</span>
        </label>
        <input
          type="text"
          id="cardHolder"
          placeholder="Mario Rossi"
          className="input input-bordered w-full focus:ring-primary focus:border-primary"
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
        />
      </div>

      <div className="form-control">
        <label htmlFor="cardNumber" className="label">
          <span className="label-text text-neutral font-semibold">Numero Carta</span>
        </label>
        <input
          type="text"
          id="cardNumber"
          placeholder="•••• •••• •••• ••••"
          className="input input-bordered w-full focus:ring-primary focus:border-primary"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label htmlFor="expiryDate" className="label">
            <span className="label-text text-neutral font-semibold">Scadenza (MM/AA)</span>
          </label>
          <input
            type="text"
            id="expiryDate"
            placeholder="MM/AA"
            className="input input-bordered w-full focus:ring-primary focus:border-primary"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label htmlFor="cvv" className="label">
            <span className="label-text text-neutral font-semibold">CVV</span>
          </label>
          <input
            type="text"
            id="cvv"
            placeholder="•••"
            className="input input-bordered w-full focus:ring-primary focus:border-primary"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
        </div>
      </div>
      
      <div className="pt-4">
        <button type="submit" className="btn btn-accent btn-block disabled:opacity-75" disabled={isLoading}>
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            `Paga Ora €${totalAmount?.toFixed(2) || '0.00'}`
          )}
        </button>
      </div>
      <p className="text-xs text-neutral-focus text-center mt-2">
        Questo è un modulo di pagamento simulato. Non inserire dati reali.
      </p>
    </form>
  );
};

export default PaymentForm;
