# inventory-web

> **Repo de onboarding** — Este repositorio se utiliza como proyecto de práctica durante el proceso de incorporación de nuevos desarrolladores al equipo. No corresponde a un servicio productivo.

Módulo web de inventario para operadores internos. Permite visualizar disponibilidad de productos y gestionar reservas de stock.

## Stack

| Aspecto | Valor |
|---|---|
| Lenguaje | TypeScript |
| UI | React 18 |
| Build/dev | Vite |
| HTTP | fetch nativo |
| Unit + Integration | Jest + React Testing Library + MSW |
| E2E | Cypress |

## Endpoints consumidos

| Acción | Método / Endpoint | Respuesta |
|---|---|---|
| Disponibilidad | `GET /api/inventory/availability/{productId}` | `{ productId, available, reserved }` |
| Listar reservas | `GET /api/inventory/reservations` | `Reservation[]` |
| Reservar | `POST /api/inventory/reserve` | `201` + `ReservationResponse` |
| Confirmar | `POST /api/inventory/confirm` | `200` + `status: CONFIRMED` |
| Liberar | `POST /api/inventory/release` | `200` + `status: RELEASED` |

### Tipos del contrato

```typescript
interface Product {
  productId: string;
  available: number;
  reserved: number;
}

interface Reservation {
  reservationId: string;
  productId: string;
  units: number;
  status: 'RESERVED' | 'CONFIRMED' | 'RELEASED' | 'EXPIRED';
  expiresAt: string;
}
```

## Cómo correr

### Instalar dependencias

```bash
npm install
```

### Desarrollo

Requiere el `inventory-service` corriendo en `http://localhost:8080`, o MSW para tests.

```bash
npm run dev
```

### Tests unitarios e integración

Los tests usan MSW para interceptar requests — no requieren el backend corriendo.

```bash
npm test
npm run test:watch
npm run test:coverage
```

### Tests E2E

Requiere la app corriendo (`npm run dev`) y el backend (o stubs de Cypress).

```bash
npm run e2e
npm run e2e:open
```

### Lint

```bash
npm run lint
```
