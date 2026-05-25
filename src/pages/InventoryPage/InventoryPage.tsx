import { useState, useEffect, useCallback } from 'react';
import type { ProductWithName, ReserveRequest } from '../../services/types';
import { getAvailability } from '../../services/inventoryApi';
import { useReservations } from '../../hooks/useReservations';
import ProductList from '../../components/ProductList/ProductList';
import ReservationForm from '../../components/ReservationForm/ReservationForm';
import ReservationRow from '../../components/ReservationRow/ReservationRow';
import Spinner from '../../components/common/Spinner';
import ErrorBanner from '../../components/common/ErrorBanner';

const PRODUCTS_CATALOG = [
  { id: 'prod-1', name: 'Notebook Pro 15' },
  { id: 'prod-2', name: 'Mouse Inalámbrico' },
  { id: 'prod-3', name: 'Teclado Mecánico RGB' },
  { id: 'prod-4', name: 'Monitor 27 pulgadas' },
  { id: 'prod-5', name: 'Auriculares Bluetooth' },
];

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductWithName[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  // BUG F4: el error de productos muestra e.message (raw del backend),
  // pero el error de reserva usa un texto hardcodeado distinto
  const [productsError, setProductsError] = useState<string | null>(null);
  const [reserveError, setReserveError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { reservations, loading: resLoading, error: resError, reserve, confirm, release } =
    useReservations();

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const results = await Promise.all(
        PRODUCTS_CATALOG.map(async (p) => {
          const availability = await getAvailability(p.id);
          return { ...availability, name: p.name };
        })
      );
      setProducts(results);
      setProductsLoading(false);
    } catch (e) {
      // BUG F4: usa e.message directamente, wording diferente al error de reserva
      setProductsError(e instanceof Error ? e.message : 'Error al cargar productos');
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleReserve = async (req: ReserveRequest) => {
    setReserveError(null);
    setSubmitting(true);
    try {
      await reserve(req);
      // BUG F1: actualiza lista de reservas localmente pero NO refetchea
      // disponibilidad → la tabla de productos sigue mostrando stock desactualizado
    } catch {
      // BUG F4: texto hardcodeado, distinto al wording del error de productos
      setReserveError('No se pudo completar la reserva. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="inventory-page">
      <header className="page-header">
        <h1>Inventario de Productos</h1>
      </header>

      <section className="products-section">
        <h2>Disponibilidad</h2>
        {productsLoading && <Spinner />}
        {productsError && <ErrorBanner message={productsError} />}
        {!productsLoading && !productsError && (
          <ProductList products={products} />
        )}
      </section>

      <section className="reserve-section">
        <ReservationForm
          onSubmit={handleReserve}
          submitting={submitting}
          error={reserveError}
        />
      </section>

      <section className="reservations-section">
        <h2>Reservas activas</h2>
        {resLoading && <Spinner />}
        {resError && <ErrorBanner message={resError} />}
        {!resLoading && !resError && reservations.length === 0 && (
          <p className="empty-state">No hay reservas registradas.</p>
        )}
        {reservations.length > 0 && (
          <table className="reservations-table">
            <thead>
              <tr>
                <th>ID Reserva</th>
                <th>Producto</th>
                <th>Unidades</th>
                <th>Estado</th>
                <th>Vence</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <ReservationRow
                  key={r.reservationId}
                  reservation={r}
                  onConfirm={confirm}
                  onRelease={release}
                />
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
