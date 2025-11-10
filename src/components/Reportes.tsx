import { useState, useEffect } from 'react';
import axios from 'axios';
// 1. Importaciones de Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// 2. Registra los componentes de Chart.js (¡OBLIGATORIO!)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = 'http://localhost:3000';

// Define la apariencia de los datos del backend
interface ReporteData {
  dia_semana: string; // Es string porque viene de SQL
  total_reservas: string; // Es string porque viene de SQL
}

// Define la apariencia de los datos que Chart.js necesita
interface ChartDataState {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

// Componentes de Carga y Error (opcional, pero recomendado)
const Loader = () => (
  <div className="loader-container">
    <div className="loader"></div>
  </div>
);

export default function Reportes() {
  const [chartData, setChartData] = useState<ChartDataState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3. Función para transformar los datos del backend
  const transformarDatos = (datos: ReporteData[]): ChartDataState => {
    // Nombres de los días de la semana (PostgreSQL: 0=Domingo)
    const labels = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    
    // Crea un array de 7 ceros
    const data = new Array(7).fill(0);

    // Rellena el array con los datos del backend
    datos.forEach(item => {
      const dia = parseInt(item.dia_semana, 10);
      const total = parseInt(item.total_reservas, 10);
      data[dia] = total; // Asigna el total al índice del día
    });

    // 4. Devuelve el objeto que Chart.js entiende
    return {
      labels: labels,
      datasets: [
        {
          label: 'Total de Reservas por Día',
          data: data,
          backgroundColor: '#009688', // El color turquesa de tu tema
        },
      ],
    };
  };

  useEffect(() => {
    const fetchReporte = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 5. Llama al nuevo endpoint del backend
        const response = await axios.get(`${API_URL}/reserva/reportes/ocupacion`);
        
        // 6. Transforma y guarda los datos
        const datosTransformados = transformarDatos(response.data);
        setChartData(datosTransformados);
        
      } catch (err) {
        setError('No se pudo cargar el reporte');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReporte();
  }, []); // Se ejecuta solo una vez

  // 7. Renderiza el contenido
  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (error) {
      return <p className="error-message">{error}</p>;
    }

    if (!chartData) {
      return <p>No hay datos para mostrar.</p>;
    }

    // 8. Opciones del gráfico (para el título)
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Reservas por Día de la Semana',
          font: { size: 18 },
          color: '#333' // Ajusta el color si usas tema oscuro
        },
      },
    };

    // 9. El componente del gráfico
    return <Bar options={options} data={chartData} />;
  };

  return (
    // 10. Contenedor para el gráfico
    <div className="report-container">
      <h2>Reporte de Ocupación</h2>
      {renderContent()}
    </div>
  );
}