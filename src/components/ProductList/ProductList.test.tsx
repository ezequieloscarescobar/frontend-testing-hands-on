import { render } from '@testing-library/react';
import ProductList from './ProductList';

const mockProducts = [
  { productId: 'prod-1', name: 'Notebook Pro 15', available: 15, reserved: 0 },
  { productId: 'prod-2', name: 'Mouse Inalámbrico', available: 50, reserved: 2 },
];

describe('ProductList', () => {
  // Anti-patrón: snapshot del componente entero como único test
  // Se rompe ante cualquier cambio visual (clase CSS, texto, estructura HTML)
  // y no expresa qué comportamiento se está validando
  it('renders correctly', () => {
    const { container } = render(<ProductList products={mockProducts} />);
    expect(container).toMatchSnapshot();
  });

  // Anti-patrón: query por selector CSS de detalle interno en vez de roles accesibles
  it('shows available stock in second column', () => {
    const { container } = render(<ProductList products={mockProducts} />);
    // Acoplado a la estructura interna del DOM (nth-child, clase interna)
    const firstRow = container.querySelector('tbody tr:first-child');
    const availableCell = firstRow?.querySelector('td:nth-child(3)');
    expect(availableCell?.textContent).toBe('15');
  });

  it('shows product ids', () => {
    const { container } = render(<ProductList products={mockProducts} />);
    // Query por clase CSS interna — frágil ante renombrado de clases
    const availableCells = container.querySelectorAll('.stock-available');
    expect(availableCells.length).toBe(2);
  });

  // Sin test de estado vacío ni de error — escenarios no cubiertos
});
