export interface Product {
  productId: string;
  available: number;
  reserved: number;
}

export interface ProductWithName extends Product {
  name: string;
}

export interface Reservation {
  reservationId: string;
  productId: string;
  units: number;
  status: 'RESERVED' | 'CONFIRMED' | 'RELEASED' | 'EXPIRED';
  expiresAt: string;
}

export interface ReserveRequest {
  productId: string;
  units: number;
  orderId?: string;
}

export interface ConfirmRequest {
  reservationId: string;
}

export interface ReleaseRequest {
  reservationId: string;
}
