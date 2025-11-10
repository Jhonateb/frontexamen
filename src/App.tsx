import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import GestionMesas from './components/GestionMesas';
import GestionClientes from './components/GestionClientes';
import GestionReservas from './components/GestionReservas';
// 1. Importa el nuevo componente de Reportes
import Reportes from './components/Reportes';
import './App.css';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      {/* El menú siempre está visible */}
      <Navbar />

      {/* El contenido principal que cambiará */}
      <main>
        {/* 'Routes' decide qué componente mostrar */}
        <Routes>
          <Route path="/" element={<GestionReservas />} />
          <Route path="/mesas" element={<GestionMesas />} />
          <Route path="/clientes" element={<GestionClientes />} />
          
          {/* 2. Esta es la nueva ruta para Reportes */}
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;