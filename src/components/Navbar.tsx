import React from 'react';
import { NavLink } from 'react-router-dom';
// 1. Importa los 4 iconos
import { FaCalendarAlt, FaUsers, FaTable, FaChartBar } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        <FaCalendarAlt />
        Reservas
      </NavLink>

      <NavLink
        to="/mesas"
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        <FaTable />
        Gestión de Mesas
      </NavLink>

      <NavLink
        to="/clientes"
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        <FaUsers />
        Gestión de Clientes
      </NavLink>

      {/* 2. Este es el nuevo enlace a Reportes */}
      <NavLink
        to="/reportes"
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        <FaChartBar />
        Reportes
      </NavLink>
    </nav>
  );
}