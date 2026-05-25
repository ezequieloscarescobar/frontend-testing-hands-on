import { http, HttpResponse } from 'msw';

// Inconsistencia intencional #1: expiresAt es timestamp numérico en vez de ISO string
// Inconsistencia intencional #2: POST /reserve responde 200 en vez de 201 (el contrato real es 201)
// Los tests actuales no validan el status code ni el formato de expiresAt, por eso pasan

export const handlers = [
  http.get('/api/inventory/availability/:productId', ({ params }) => {
    const stockMap: Record<string, { available: number; reserved: number }> = {
      'prod-1': { available: 15, reserved: 0 },
      'prod-2': { available: 50, reserved: 2 },
      'prod-3': { available: 0,  reserved: 0 },
      'prod-4': { available: 8,  reserved: 1 },
      'prod-5': { available: 23, reserved: 3 },
    };
    const stock = stockMap[params.productId as string] ?? { available: 10, reserved: 0 };
    return HttpResponse.json({
      productId: params.productId,
      available: stock.available,
      reserved: stock.reserved,
    });
  }),

  http.get('/api/inventory/reservations', () => {
    return HttpResponse.json([
      {
        reservationId: 'res-mock-1',
        productId: 'prod-1',
        units: 2,
        status: 'RESERVED',
        // Inconsistencia: número Unix en vez de ISO string
        expiresAt: Date.now() + 600000,
      },
    ]);
  }),

  // Inconsistencia: devuelve 200 OK en vez del 201 Created que define el contrato real
  http.post('/api/inventory/reserve', async ({ request }) => {
    const body = await request.json() as { productId: string; units: number };
    return HttpResponse.json(
      {
        reservationId: `res-${Date.now()}`,
        productId: body.productId,
        units: body.units,
        status: 'RESERVED',
        expiresAt: Date.now() + 600000,
      },
      { status: 200 }
    );
  }),

  http.post('/api/inventory/confirm', async ({ request }) => {
    const body = await request.json() as { reservationId: string };
    return HttpResponse.json({
      reservationId: body.reservationId,
      productId: 'prod-1',
      units: 2,
      status: 'CONFIRMED',
      expiresAt: Date.now() + 600000,
    });
  }),

  http.post('/api/inventory/release', async ({ request }) => {
    const body = await request.json() as { reservationId: string };
    return HttpResponse.json({
      reservationId: body.reservationId,
      productId: 'prod-1',
      units: 2,
      status: 'RELEASED',
      expiresAt: Date.now() + 600000,
    });
  }),
];
