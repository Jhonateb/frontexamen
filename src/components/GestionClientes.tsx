// src/components/GestionClientes.tsx

import { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';
import { type Cliente } from '../interfaces/models';
// 1. Importa los iconos
import { FaPen, FaTrash, FaSave, FaUndo, FaUsers, FaStar } from 'react-icons/fa';

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
    <div className="empty-state-icon"><FaUsers /></div>
    <h3>No hay clientes registrados</h3>
    <p>Empieza añadiendo un cliente en el formulario de la izquierda.</p>
  </div>
);


export default function GestionClientes() {
  // 4. Añade el estado de carga
  const [isLoading, setIsLoading] = useState(true);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  // 5. Modifica fetchClientes para usar el loader
  const fetchClientes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/cliente`);
      setClientes(response.data);
    } catch (err) {
      setError('No se pudieron cargar los clientes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // 6. Modifica handleSubmit para re-cargar la lista
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const clienteData = { nombre, email, telefono };

    try {
      if (editingId !== null) {
        await axios.patch(`${API_URL}/cliente/${editingId}`, clienteData);
      } else {
        await axios.post(`${API_URL}/cliente`, clienteData);
      }
      
      limpiarFormulario();
      fetchClientes(); // Recarga la lista

    } catch (err: any) {
      setError(`Error al guardar el cliente: ${err.response?.data?.message}`);
    }
  };

  // 7. Modifica handleDelete para re-cargar la lista
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que quieres borrar este cliente?')) return;
    try {
      await axios.delete(`${API_URL}/cliente/${id}`);
      fetchClientes(); // Recarga la lista
    } catch (err: any) {
      setError(`Error al borrar el cliente: ${err.response?.data?.message}`);
    }
  };

  const handleEditClick = (cliente: Cliente) => {
    setEditingId(cliente.id);
    setNombre(cliente.nombre);
    setEmail(cliente.email);
    setTelefono(cliente.telefono);
  };

  const limpiarFormulario = () => {
    setEditingId(null);
    setNombre('');
    setEmail('');
    setTelefono('');
  };

  // 8. Nueva función para decidir qué mostrar
  const renderTableContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    
    if (clientes.length === 0) {
      return <EmptyState />;
    }

    return (
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th><FaStar /> Puntos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nombre}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefono}</td>
              <td>{cliente.puntos}</td>
              <td>
                <button onClick={() => handleEditClick(cliente)} className="btn-edit">
                  <FaPen /> Editar
                </button>
                <button onClick={() => handleDelete(cliente.id)} className="btn-delete">
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
        <h2>{editingId ? 'Editando Cliente' : 'Crear Nuevo Cliente'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre: </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email: </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Teléfono: </label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={{ marginTop: '10px' }}>
            {editingId ? <><FaSave /> Actualizar Cliente</> : <><FaSave /> Guardar Cliente</>}
          </button>
          
          {editingId && (
            <button type="button" onClick={limpiarFormulario} style={{ marginLeft: '10px' }}>
              <FaUndo /> Cancelar Edición
            </button>
          )}
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* Columna 2: Lista de clientes */}
      <div style={{ flex: 2 }}>
        <h2>Gestión de Clientes</h2>
        {/* 9. Llama a la nueva función de renderizado */}
        {renderTableContent()}
      </div>
    </div>
  );
}