// src/App.tsx

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Importa tu nuevo menú
import GestionMesas from './components/GestionMesas';
import GestionClientes from './components/GestionClientes';
import GestionReservas from './components/GestionReservas';
import './App.css';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      {/* 1. El menú siempre estará visible */}
      <Navbar />

      {/* 2. El contenido principal que cambiará */}
      <main>
        {/* 'Routes' decide qué componente mostrar */}
        <Routes>
          {/* Ruta Raíz (/) */}
          <Route path="/" element={<GestionReservas />} />
          
          {/* Ruta para Mesas */}
          <Route path="/mesas" element={<GestionMesas />} />
          
          {/* Ruta para Clientes */}
          <Route path="/clientes" element={<GestionClientes />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;