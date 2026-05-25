import type { ProductWithName } from '../../services/types';

interface ProductListProps {
  products: ProductWithName[];
}

export default function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return <p className="empty-state">No hay productos disponibles.</p>;
  }

  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Producto</th>
          <th>Disponible</th>
          <th>Reservado</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.productId} data-product-id={product.productId}>
            <td>{product.productId}</td>
            <td>{product.name}</td>
            {/* BUG F6: acceso sin null-check; si available/reserved son undefined, crashea */}
            <td className="stock-available">{product.available.toLocaleString()}</td>
            <td className="stock-reserved">{product.reserved.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
