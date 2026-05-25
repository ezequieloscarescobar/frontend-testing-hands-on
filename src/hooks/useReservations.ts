import { useState, useEffect, useCallback } from 'react';
import type { Reservation, ReserveRequest, ConfirmRequest, ReleaseRequest } from '../services/types';
import {
  getReservations,
  reserveStock,
  confirmReservation,
  releaseReservation,
} from '../services/inventoryApi';

const POLL_INTERVAL = 30000;

interface UseReservationsResult {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  reserve: (req: ReserveRequest) => Promise<Reservation>;
  confirm: (req: ConfirmRequest) => Promise<void>;
  release: (req: ReleaseRequest) => Promise<void>;
  refresh: () => void;
}

export function useReservations(): UseReservationsResult {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getReservations();
      setReservations(data);
      setLoading(false); // BUG F2: setLoading(false) solo en el path feliz
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
      // setLoading(false) ausente — loading queda en true para siempre ante error
    }
  }, []);

  useEffect(() => {
    fetchReservations();
    const interval = setInterval(fetchReservations, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchReservations]);

  const reserve = async (req: ReserveRequest): Promise<Reservation> => {
    const reservation = await reserveStock(req);
    setReservations((prev) => [...prev, reservation]);
    return reservation;
  };

  const confirm = async (req: ConfirmRequest): Promise<void> => {
    const updated = await confirmReservation(req);
    setReservations((prev) =>
      prev.map((r) => (r.reservationId === updated.reservationId ? updated : r))
    );
  };

  const release = async (req: ReleaseRequest): Promise<void> => {
    const updated = await releaseReservation(req);
    setReservations((prev) =>
      prev.map((r) => (r.reservationId === updated.reservationId ? updated : r))
    );
  };

  return {
    reservations,
    loading,
    error,
    reserve,
    confirm,
    release,
    refresh: fetchReservations,
  };
}
