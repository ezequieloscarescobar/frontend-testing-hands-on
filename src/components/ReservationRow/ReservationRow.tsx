import StatusBadge from '../StatusBadge/StatusBadge';
import type { Reservation, ConfirmRequest, ReleaseRequest } from '../../services/types';

interface ReservationRowProps {
  reservation: Reservation;
  onConfirm: (req: ConfirmRequest) => Promise<void>;
  onRelease: (req: ReleaseRequest) => Promise<void>;
}

export default function ReservationRow({ reservation, onConfirm, onRelease }: ReservationRowProps) {
  const { reservationId, productId, units, status, expiresAt } = reservation;

  return (
    <tr data-reservation-id={reservationId}>
      <td>{reservationId}</td>
      <td>{productId}</td>
      {/* BUG F6: units.toLocaleString() crashea si units es null/undefined */}
      <td>{units.toLocaleString()}</td>
      <td>
        <StatusBadge status={status} />
      </td>
      <td>{new Date(expiresAt).toLocaleString('es-AR')}</td>
      <td className="actions">
        {/* BUG F5: no verifica status === 'EXPIRED'; confirmar sigue habilitado */}
        <button
          className="btn btn-sm btn-confirm"
          onClick={() => onConfirm({ reservationId })}
          disabled={status === 'CONFIRMED' || status === 'RELEASED'}
        >
          Confirmar
        </button>
        <button
          className="btn btn-sm btn-release"
          onClick={() => onRelease({ reservationId })}
          disabled={status === 'CONFIRMED' || status === 'RELEASED' || status === 'EXPIRED'}
        >
          Liberar
        </button>
      </td>
    </tr>
  );
}
