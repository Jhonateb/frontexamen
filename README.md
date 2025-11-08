Examen Final - Sistema de Reservas (Frontend)

Frontend (Dashboard) de la aplicación de gestión de reservas de restaurante, desarrollado con React para el examen final de Desarrollo Web.

Autor: Jhonatan Emanuel Tebalán García

🚀 Tecnologías Utilizadas

React: Biblioteca principal para la UI.

Vite: Herramienta de compilación y servidor de desarrollo.

TypeScript: Lenguaje principal.

React Router DOM: Para la navegación y separación de vistas (SPA).

Axios: Para consumir la API REST del backend.

CSS Personalizado: Para los estilos responsivos (sin bibliotecas de UI).

React Icons: Para la iconografía.

🔧 Instalación y Ejecución

Sigue estos pasos para levantar el cliente localmente.

Prerrequisitos

Node.js (v18 o superior)

Importante: El servidor Backend debe estar instalado y corriendo en http://localhost:3000.

Pasos

Clonar el repositorio:

git clone [https://github.com/Jhonateb/frontexamen.git](https://github.com/Jhonateb/frontexamen.git)


Navegar a la carpeta:

cd frontexamen


Instalar dependencias:

npm install


Ejecutar el proyecto:
Corre el siguiente comando para iniciar el servidor de desarrollo:

npm run dev


El cliente se iniciará en http://localhost:5173 (o el puerto que indique Vite).

✨ Características

La aplicación es un Dashboard con 3 vistas principales:

Reservas:

Formulario de creación de reservas.

Consulta de disponibilidad en tiempo real (el desplegable de mesas se filtra).

Validación de capacidad, horario y duplicados (manejado por el backend).

Lista de reservas activas con botón de cancelación.

Gestión de Mesas:

CRUD completo (Crear, Leer, Actualizar y Borrar) para las mesas del restaurante.

Gestión de Clientes:

CRUD completo (Crear, Leer, Actualizar y Borrar) para los clientes.

Todo el diseño es responsivo y se adapta a pantallas móviles.