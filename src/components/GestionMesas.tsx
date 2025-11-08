// src/components/GestionMesas.tsx

import { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';
import { type Mesa } from '../interfaces/models';
// !! 1. Importa el nuevo icono
import { FaPen, FaTrash, FaSave, FaUndo, FaTable } from 'react-icons/fa';

const API_URL = 'http://localhost:3000';

// !! 2. Componente simple para el Spinner
const Loader = () => (
  <div className="loader-container">
    <div className="loader"></div>
  </div>
);

// !! 3. Componente simple para el Estado Vacío
const EmptyState = () => (
  <div className="empty-state">
    <div className="empty-state-icon"><FaTable /></div>
    <h3>No hay mesas creadas</h3>
    <p>Empieza añadiendo una mesa en el formulario de la izquierda.</p>
  </div>
);


export default function GestionMesas() {
  // !! 4. Añade el estado de carga
  const [isLoading, setIsLoading] = useState(true); 
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Estados del formulario
  const [numero, setNumero] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  const fetchMesas = async () => {
    setIsLoading(true); // Pone el spinner
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/mesa`);
      setMesas(response.data);
    } catch (err) {
      setError('No se pudieron cargar las mesas');
    } finally {
      setIsLoading(false); // Quita el spinner
    }
  };

  useEffect(() => {
    fetchMesas();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const mesaData = {
      numero_mesa: parseInt(numero),
      capacidad: parseInt(capacidad),
      ubicacion: ubicacion,
    };

    try {
      if (editingId !== null) {
        await axios.patch(`${API_URL}/mesa/${editingId}`, mesaData);
        // Recarga la lista para que se vea el cambio
        fetchMesas(); 
      } else {
        await axios.post(`${API_URL}/mesa`, mesaData);
        // Recarga la lista para que se vea el cambio
        fetchMesas();
      }
      
      limpiarFormulario();

    } catch (err: any) {
      setError(`Error al guardar la mesa: ${err.response?.data?.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que quieres borrar esta mesa?')) {
      return;
    }
    
    try {
      await axios.delete(`${API_URL}/mesa/${id}`);
      // Recarga la lista
      fetchMesas(); 
    } catch (err: any) {
      setError(`Error al borrar la mesa: ${err.response?.data?.message}`);
    }
  };

  const handleEditClick = (mesa: Mesa) => {
    setEditingId(mesa.id);
    setNumero(String(mesa.numero_mesa));
    setCapacidad(String(mesa.capacidad));
    setUbicacion(mesa.ubicacion);
  };

  const limpiarFormulario = () => {
    setEditingId(null);
    setNumero('');
    setCapacidad('');
    setUbicacion('');
  };

  // !! 5. Nueva función para decidir qué mostrar en la tabla
  const renderTableContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    
    if (mesas.length === 0) {
      return <EmptyState />;
    }

    return (
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Número</th>
            <th>Capacidad</th>
            <th>Ubicación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mesas.map((mesa) => (
            <tr key={mesa.id}>
              <td>{mesa.id}</td>
              <td>{mesa.numero_mesa}</td>
              <td>{mesa.capacidad} personas</td>
              <td>{mesa.ubicacion}</td>
              <td>
                <button onClick={() => handleEditClick(mesa)} className="btn-edit">
                  <FaPen /> Editar
                </button>
                <button onClick={() => handleDelete(mesa.id)} className="btn-delete">
                  <FaTrash /> Borrar
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
      {/* Columna 1: Formulario */}
      <div style={{ flex: 1 }}>
        <h2>{editingId ? 'Editando Mesa' : 'Crear Nueva Mesa'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label>Número de Mesa: </label>
            <input
              type="number"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Capacidad (personas): </label>
            <input
              type="number"
              value={capacidad}
              onChange={(e) => setCapacidad(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Ubicación: </label>
            <input
              type="text"
              value={ubicacion}
              placeholder="Ej: Ventana, Terraza"
              onChange={(e) => setUbicacion(e.target.value)}
            />
          </div>
          <button type="submit" style={{ marginTop: '10px' }}>
            {editingId ? <><FaSave /> Actualizar Mesa</> : <><FaSave /> Guardar Mesa</>}
          </button>
          
          {editingId && (
            <button type="button" onClick={limpiarFormulario} style={{ marginLeft: '10px' }}>
              <FaUndo /> Cancelar Edición
            </button>
          )}
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* Columna 2: Lista de mesas */}
      <div style={{ flex: 2 }}>
        <h2>Gestión de Mesas</h2>
        {/* !! 6. Llama a la nueva función de renderizado !! */}
        {renderTableContent()}
      </div>
    </div>
  );
}