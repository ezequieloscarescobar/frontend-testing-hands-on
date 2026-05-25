import { useState } from 'react';
import type { ReserveRequest } from '../../services/types';

interface ReservationFormProps {
  onSubmit: (req: ReserveRequest) => Promise<void>;
  submitting?: boolean;
  error?: string | null;
}

export default function ReservationForm({ onSubmit, submitting, error }: ReservationFormProps) {
  const [productId, setProductId] = useState('');
  const [unitsInput, setUnitsInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // BUG F3: Number() convierte '' -> 0, valores negativos pasan sin validar
    const units = Number(unitsInput);
    await onSubmit({ productId, units });
  };

  return (
    <form className="reservation-form" onSubmit={handleSubmit}>
      <h3>Nueva Reserva</h3>
      {error && <p className="form-error">{error}</p>}
      <div className="form-group">
        {/* BUG F7: input sin <label> ni aria-label asociado */}
        <input
          type="text"
          className="form-input"
          placeholder="ID del producto (ej: prod-1)"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
      </div>
      <div className="form-group">
        {/* BUG F7: input sin <label> ni aria-label asociado */}
        <input
          type="number"
          className="form-input"
          placeholder="Cantidad de unidades"
          value={unitsInput}
          onChange={(e) => setUnitsInput(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Reservando...' : 'Reservar'}
      </button>
    </form>
  );
}
