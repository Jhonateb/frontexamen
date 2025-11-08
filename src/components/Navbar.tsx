// src/components/Navbar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
// 1. Importa los iconos que usaremos
import { FaCalendarAlt, FaUsers, FaTable } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        <FaCalendarAlt /> {/* 2. Añade el icono */}
        Reservas
      </NavLink>

      <NavLink
        to="/mesas"
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        <FaTable /> {/* 2. Añade el icono */}
        Gestión de Mesas
      </NavLink>

      <NavLink
        to="/clientes"
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        <FaUsers /> {/* 2. Añade el icono */}
        Gestión de Clientes
      </NavLink>
    </nav>
  );
}