import { render, screen } from '@testing-library/react';
import ReservationRow from './ReservationRow';

const baseReservation = {
  reservationId: 'res-1',
  productId: 'prod-1',
  units: 2,
  status: 'RESERVED' as const,
  expiresAt: '2026-12-31T10:00:00',
};

describe('ReservationRow', () => {
  it('renders reservation data', () => {
    render(
      <table>
        <tbody>
          <ReservationRow
            reservation={baseReservation}
            onConfirm={jest.fn()}
            onRelease={jest.fn()}
          />
        </tbody>
      </table>
    );
    expect(screen.getByText('prod-1')).toBeInTheDocument();
    expect(screen.getByText('res-1')).toBeInTheDocument();
  });

  // Sin test de que Confirmar esté deshabilitado cuando status === 'EXPIRED' (F5)
  // Sin test de que Liberar esté deshabilitado cuando corresponde
  // Sin test de que los callbacks se invoquen con los argumentos correctos
});
