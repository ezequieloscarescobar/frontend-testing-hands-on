// E2E reducido: solo cubre el flujo feliz de reserva
// Sin escenarios de: error del backend, expiración, datos inválidos, stock negativo

describe('Flujo de reserva', () => {
  beforeEach(() => {
    // Stub de disponibilidad
    cy.intercept('GET', '/api/inventory/availability/*', (req) => {
      const productId = req.url.split('/').pop();
      req.reply({
        statusCode: 200,
        body: { productId, available: 20, reserved: 2 },
      });
    }).as('getAvailability');

    // Stub de reservas existentes
    cy.intercept('GET', '/api/inventory/reservations', {
      statusCode: 200,
      body: [],
    }).as('getReservations');

    // Stub de creación de reserva
    cy.intercept('POST', '/api/inventory/reserve', {
      statusCode: 201,
      body: {
        reservationId: 'res-cy-1',
        productId: 'prod-1',
        units: 3,
        status: 'RESERVED',
        expiresAt: '2026-12-31T10:00:00',
      },
    }).as('postReserve');

    cy.visit('/');
  });

  it('permite reservar stock y muestra la reserva creada', () => {
    // Espera que carguen los productos
    cy.wait('@getAvailability');
    cy.contains('Notebook Pro 15').should('be.visible');

    // Completa el formulario — solo flujo válido
    cy.get('input[placeholder*="producto"]').type('prod-1');
    cy.get('input[type="number"]').type('3');
    cy.get('button[type="submit"]').click();

    cy.wait('@postReserve');

    // Verifica que la reserva aparece en la tabla
    cy.contains('res-cy-1').should('be.visible');
    cy.contains('RESERVED').should('be.visible');
  });

  // Sin escenarios de:
  // - formulario con units = 0 (F3)
  // - error 409 del backend (stock insuficiente)
  // - reserva expirada (F5)
  // - loading infinito ante error (F2)
});
