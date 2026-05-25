import InventoryPage from './pages/InventoryPage/InventoryPage';
import './styles.css';

export default function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">⚙ Inventory Web</div>
      </nav>
      <main className="main-content">
        <InventoryPage />
      </main>
    </div>
  );
}
