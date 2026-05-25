import { render, screen, waitFor } from '@testing-library/react';
import InventoryPage from './InventoryPage';

describe('InventoryPage', () => {
  // Test feliz: pasa, pero el polling sigue corriendo después del test
  // → genera act() warnings porque setInterval dispara setState sobre
  //   componente ya desmontado por Jest
  it('muestra los productos cuando la carga termina', async () => {
    render(<InventoryPage />);
    expect(await screen.findByText('Notebook Pro 15')).toBeInTheDocument();
    expect(screen.getByText('Mouse Inalámbrico')).toBeInTheDocument();
    // Sin cleanup explícito del intervalo de polling
    // → act() warnings en consola, tests siguientes potencialmente afectados
  });

  // Flaky: depende de timers reales para verificar el polling
  // Sin jest.useFakeTimers(), el resultado varía según velocidad del entorno
  it('refresca las reservas periódicamente', async () => {
    render(<InventoryPage />);
    await screen.findByText('Notebook Pro 15');

    // Espera con timer real — no reproducible de forma determinista
    await new Promise((resolve) => setTimeout(resolve, 150));

    // El componente usa un intervalo de 30s; en 150ms raramente vuelve a fetchear
    // Este test falla casi siempre en CI pero puede pasar localmente por timing
    await waitFor(
      () => {
        const tables = screen.queryAllByRole('table');
        expect(tables.length).toBeGreaterThan(0);
      },
      { timeout: 300 }
    );
  });

  // Sin tests de:
  // - estado de error al fallar el fetch
  // - loading infinito cuando el fetch falla (F2)
  // - stock desactualizado tras reservar (F1)
  // - Confirmar habilitado en reserva EXPIRED (F5)
});
