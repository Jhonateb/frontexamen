// src/components/GestionReservas.tsx

import { useState, useEffect, type FormEvent, useRef } from 'react';
import axios from 'axios';
import {
  type Reserva,
  type Cliente,
  type Mesa,
} from '../interfaces/models';
// 1. Importa los iconos
import { FaSave, FaTimes, FaCalendarAlt } from 'react-icons/fa';

const API_URL = 'http://localhost:3000';

// 2. Componente simple para el Spinner
const Loader = () => (
  <div className="loader-container">
    <div className="loader"></div>
  </div>
);

// 3. Componente simple para el Estado Vacío
const EmptyState = () => (
  <div className="empty-state">
    <div className="empty-state-icon"><FaCalendarAlt /></div>
    <h3>No hay reservas activas</h3>
    <p>Crea una nueva reserva en el formulario de la izquierda.</p>
  </div>
);


export default function GestionReservas() {
  // 4. Añade el estado de carga
  const [isLoading, setIsLoading] = useState(true);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mesasDisponibles, setMesasDisponibles] = useState<Mesa[]>([]);

  // Estado del formulario
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [numeroPersonas, setNumeroPersonas] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [mesaId, setMesaId] = useState('');

  const [error, setError] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  // 5. Modifica fetchDatosIniciales para usar el loader
  const fetchDatosIniciales = async () => {
    setIsLoading(true);
    // Nota: El error de dropdowns se maneja separado del error principal
    try {
      const [resReservas, resClientes] = await Promise.all([
        axios.get(`${API_URL}/reserva`),
        axios.get(`${API_URL}/cliente`),
      ]);
      setReservas(resReservas.data);
      setClientes(resClientes.data);
    } catch (err) {
      setError('No se pudieron cargar los datos iniciales');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatosIniciales();
  }, []);

  // Lógica para buscar mesas disponibles (se mantiene igual)
  useEffect(() => {
    if (fecha && hora) {
      const fetchDisponibles = async () => {
        try {
          const response = await axios.get(`${API_URL}/mesa/disponibles`, {
            params: { fecha, hora },
          });
          setMesasDisponibles(response.data);
          setError(null);
        } catch (err) {
          setError('No se pudo consultar la disponibilidad');
          setMesasDisponibles([]);
        }
      };
      fetchDisponibles();
    } else {
      setMesasDisponibles([]);
    }
  }, [fecha, hora]);

  // 6. handleSubmit ya llama a fetchDatosIniciales, perfecto
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!clienteId || !mesaId) {
      setError('Debe seleccionar un cliente y una mesa.');
      return;
    }

    try {
      await axios.post(`${API_URL}/reserva`, {
        fecha,
        hora,
        numero_personas: parseInt(numeroPersonas),
        clienteId: parseInt(clienteId),
        mesaId: parseInt(mesaId),
      });

      fetchDatosIniciales(); 
      
      setFecha('');
      setHora('');
      setNumeroPersonas('');
      setClienteId('');
      setMesaId('');

    } catch (err: any) {
      setError(`Error al crear la reserva: ${err.response?.data?.message}`);
    }
  };

  // 7. Modifica handleCancelar para re-cargar la lista
  const handleCancelar = async (id: number) => {
    if (!window.confirm('¿Seguro que quieres cancelar esta reserva?')) return;
    
    try {
      await axios.patch(`${API_URL}/reserva/${id}/cancelar`);
      fetchDatosIniciales(); // Recarga la lista
    } catch (err: any) {
      setError(`Error al cancelar: ${err.response?.data?.message}`);
    }
  };
  
  const handleDateWrapperClick = () => {
    dateInputRef.current?.showPicker();
  };

  const handleTimeWrapperClick = () => {
    timeInputRef.current?.showPicker();
  };

  // 8. Nueva función para decidir qué mostrar
  const renderTableContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    
    // Filtra las canceladas ANTES de contar
    const reservasActivas = reservas.filter(r => r.estado !== 'cancelada');

    if (reservasActivas.length === 0) {
      return <EmptyState />;
    }

    return (
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Mesa</th>
            <th>Fecha/Hora</th>
            <th>Personas</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservasActivas.map((reserva) => (
            <tr key={reserva.id}>
              <td>{reserva.cliente.nombre}</td>
              <td>Mesa #{reserva.mesa.numero_mesa}</td>
              <td>{reserva.fecha} @ {reserva.hora}</td>
              <td>{reserva.numero_personas}</td>
              <td>{reserva.estado}</td>
              <td>
                <button onClick={() => handleCancelar(reserva.id)} className="btn-cancel">
                  <FaTimes /> Cancelar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={{ display: 'flex', gap: '40px' }}>
      <div style={{ flex: 1 }}>
        <h2>Crear Nueva Reserva</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Cliente: </label>
            <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
              <option value="">Seleccione un cliente...</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre} (Tel: {cliente.telefono})
                </option>
              ))}
            </select>
          </div>
          
          <div onClick={handleDateWrapperClick} className="clickable-input-wrapper">
            <label>Fecha: </label>
            <input 
              type="date" 
              value={fecha} 
              onChange={(e) => setFecha(e.target.value)} 
              required 
              ref={dateInputRef}
              style={{ pointerEvents: 'none' }}
            />
          </div>

          <div onClick={handleTimeWrapperClick} className="clickable-input-wrapper">
            <label>Hora: </label>
            <input 
              type="time" 
              value={hora} 
              onChange={(e) => setHora(e.target.value)} 
              required 
              ref={timeInputRef}
              style={{ pointerEvents: 'none' }}
            />
          </div>

          <div>
            <label>Mesa: </label>
            <select value={mesaId} onChange={(e) => setMesaId(e.target.value)} required disabled={!fecha || !hora}>
              <option value="">{ (fecha && hora) ? "Seleccione una mesa disponible..." : "Primero elija fecha y hora..."}</option>
              {mesasDisponibles
                .filter(mesa => numeroPersonas ? mesa.capacidad >= parseInt(numeroPersonas) : true)
                .map((mesa) => (
                <option key={mesa.id} value={mesa.id}>
                  Mesa #{mesa.numero_mesa} (Cap: {mesa.capacidad} pers.)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Número de Personas: </label>
            <input type="number" value={numeroPersonas} onChange={(e) => setNumeroPersonas(e.target.value)} required />
          </div>

          <button type="submit" style={{ marginTop: '10px' }} disabled={!fecha || !hora}>
            <FaSave /> Guardar Reserva
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>

      <div style={{ flex: 2 }}>
        <h2>Reservas Activas</h2>
        {/* 9. Llama a la nueva función de renderizado */}
        {renderTableContent()}
      </div>
    </div>
  );
}