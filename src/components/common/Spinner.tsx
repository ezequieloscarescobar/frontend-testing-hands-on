export default function Spinner() {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" role="status" aria-label="Cargando">
        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  );
}
