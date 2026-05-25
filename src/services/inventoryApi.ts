import type { Product, Reservation, ReserveRequest, ConfirmRequest, ReleaseRequest } from './types';

export async function getAvailability(productId: string): Promise<Product> {
  const res = await fetch(`/api/inventory/availability/${productId}`);
  if (!res.ok) throw new Error(`Error al obtener disponibilidad: ${res.status}`);
  return res.json();
}

export async function getReservations(): Promise<Reservation[]> {
  const res = await fetch('/api/inventory/reservations');
  if (!res.ok) throw new Error(`Error al obtener reservas: ${res.status}`);
  return res.json();
}

export async function reserveStock(request: ReserveRequest): Promise<Reservation> {
  const res = await fetch('/api/inventory/reserve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error || 'Error al reservar stock');
  }
  return res.json();
}

export async function confirmReservation(request: ConfirmRequest): Promise<Reservation> {
  const res = await fetch('/api/inventory/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error || 'Error al confirmar reserva');
  }
  return res.json();
}

export async function releaseReservation(request: ReleaseRequest): Promise<Reservation> {
  const res = await fetch('/api/inventory/release', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error || 'Error al liberar reserva');
  }
  return res.json();
}
