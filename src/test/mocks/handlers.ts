import { rest } from 'msw';

// Inconsistencia intencional #1: expiresAt es timestamp numérico en vez de ISO string
// Inconsistencia intencional #2: POST /reserve responde 200 en vez de 201 (el contrato real es 201)
// Los tests actuales no validan el status code ni el formato de expiresAt, por eso pasan

export const handlers = [
  rest.get('/api/inventory/availability/:productId', (req, res, ctx) => {
    const { productId } = req.params;
    const stockMap: Record<string, { available: number; reserved: number }> = {
      'prod-1': { available: 15, reserved: 0 },
      'prod-2': { available: 50, reserved: 2 },
      'prod-3': { available: 0,  reserved: 0 },
      'prod-4': { available: 8,  reserved: 1 },
      'prod-5': { available: 23, reserved: 3 },
    };
    const stock = stockMap[productId as string] ?? { available: 10, reserved: 0 };
    return res(
      ctx.json({
        productId,
        available: stock.available,
        reserved: stock.reserved,
      })
    );
  }),

  rest.get('/api/inventory/reservations', (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          reservationId: 'res-mock-1',
          productId: 'prod-1',
          units: 2,
          status: 'RESERVED',
          // Inconsistencia: número Unix en vez de ISO string
          expiresAt: Date.now() + 600000,
        },
      ])
    );
  }),

  // Inconsistencia: devuelve 200 OK en vez del 201 Created del contrato real
  rest.post('/api/inventory/reserve', async (req, res, ctx) => {
    const body = await req.json() as { productId: string; units: number };
    return res(
      ctx.status(200),
      ctx.json({
        reservationId: `res-${Date.now()}`,
        productId: body.productId,
        units: body.units,
        status: 'RESERVED',
        expiresAt: Date.now() + 600000,
      })
    );
  }),

  rest.post('/api/inventory/confirm', async (req, res, ctx) => {
    const body = await req.json() as { reservationId: string };
    return res(
      ctx.json({
        reservationId: body.reservationId,
        productId: 'prod-1',
        units: 2,
        status: 'CONFIRMED',
        expiresAt: Date.now() + 600000,
      })
    );
  }),

  rest.post('/api/inventory/release', async (req, res, ctx) => {
    const body = await req.json() as { reservationId: string };
    return res(
      ctx.json({
        reservationId: body.reservationId,
        productId: 'prod-1',
        units: 2,
        status: 'RELEASED',
        expiresAt: Date.now() + 600000,
      })
    );
  }),
];
