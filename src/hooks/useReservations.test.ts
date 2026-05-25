import { renderHook, waitFor } from '@testing-library/react';
import { useReservations } from './useReservations';

// Anti-patrón: mockea fetch global a mano en vez de usar MSW
// El shape devuelto es distinto al contrato real del backend
// (usa 'id', 'product', 'qty', 'state' en vez de
//  'reservationId', 'productId', 'units', 'status')
// El test pasa pero no refleja el contrato real
beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      { id: 'r-1', product: 'prod-1', qty: 2, state: 'RESERVED' },
    ],
  }) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('useReservations', () => {
  it('fetches reservations on mount', async () => {
    const { result } = renderHook(() => useReservations());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Solo verifica que hay elementos, sin validar el shape correcto
    expect(result.current.reservations.length).toBeGreaterThan(0);
  });

  // Sin tests de:
  // - estado loading durante la carga
  // - que loading queda en true ante error (F2)
  // - que error se popula correctamente
  // - reserve / confirm / release
  // - polling
});
