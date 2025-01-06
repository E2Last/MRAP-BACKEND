import React, { useState, useEffect } from 'react';
import './Grafico.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button, Select, InputNumber, message } from 'antd';
import { useUserStore } from '../../store/userStore';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const getAccessToken = () => {
    const { userInfo } = useUserStore.getState();
    const accessToken = userInfo?.accessToken;
    if (!accessToken) {
        throw new Error("Token de acceso no disponible");
    }
    return accessToken;
};

const Grafico = ({ selectedPoint }) => {
  const [selectedType, setSelectedType] = useState(3);
  const [selectedRange, setSelectedRange] = useState(6); // Limitar a 6 meses inicialmente
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedPoint !== null) {
      const fetchChartData = async () => {
        setIsLoading(true);
        try {
          const token = getAccessToken();

          const response = await fetch(`http://127.0.0.1:8000/MRAP/control/get-control-historico/${selectedPoint}/${selectedType}/${selectedRange}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) throw new Error('Error al obtener datos de la API');

          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Respuesta no es JSON');
          }

          const data = await response.json();

          const processedData = data[0].resultados.map(result => ({
            x: result.fecha,
            y: result.valor,
            label: result.parametro_codigo,
          }));

          setChartData(processedData);
        } catch (error) {
          console.error(error);
          message.error(`Error al cargar datos del gráfico: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
      };

      fetchChartData();
    }
  }, [selectedPoint, selectedType, selectedRange]);

  const parameterMap = {
    3: ["CON", "CLI"],
    2: ["ASP", "BME", "BCO", "ESC", "PAE"],
    1: ["OLO", "PH", "CON", "STO", "DUR", "CAL", "MAG", "SOD", "NIT", "SUL", "ALC", "CLO", "FLU", "ARS"]
  };
  
  // Mapa de colores para cada etiqueta
  const colorMap = {
    CON: "blue",
    CLI: "red",
    ASP: "purple",
    BME: "orange",
    BCO: "yellow",
    ESC: "GREEN",
    PAE: "brown",
    OLO: "cyan",
    PH: "magenta",
    STO: "lime",
    DUR: "teal",
    CAL: "navy",
    MAG: "olive",
    SOD: "gold",
    NIT: "silver",
    SUL: "maroon",
    ALC: "aqua",
    CLO: "black",
    FLU: "gray",
    ARS: "violet"
  };
  
  const filteredDatasets = chartData.reduce((acc, item) => {
    if (parameterMap[selectedType].includes(item.label)) {
      if (!acc[item.label]) {
        acc[item.label] = {
          label: item.label,
          data: [],
          borderColor: colorMap[item.label] || '#282828', // Usa el color del mapa o un valor por defecto
          borderWidth: 2,
          pointRadius: 3,
          fill: false,
        };
      }
      acc[item.label].data.push({ x: item.x, y: item.y });
    }
    return acc;
  }, {});
  

  const data = {
    labels: [...new Set(chartData.map(item => item.x))],
    datasets: Object.values(filteredDatasets),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
    },
    scales: {
      x: { title: { display: true, text: 'Fecha' } },
      y: { title: { display: true, text: 'Valores' }, beginAtZero: true },
    },
  };

  const saveChartAsPDF = () => {
    const chartElement = document.getElementById('chartContainer');
    if (chartElement) {
      html2canvas(chartElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('landscape');
        const imgWidth = 280;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(`Grafico-${formattedDate}.pdf`);
      });
    } else {
      console.error('No se encontró el elemento del gráfico.');
    }
  };

  return (
    <div>
      <Select
        value={selectedType}
        onChange={(value) => setSelectedType(value)}
        style={{ width: '15%' }}
        placeholder="Seleccione un tipo de control"
      >
        <Select.Option value={3}>Diario</Select.Option>
        <Select.Option value={2}>Bacteriológico</Select.Option>
        <Select.Option value={1}>Físico Químico</Select.Option>
      </Select>

      <InputNumber
        min={1}
        max={60}
        value={selectedRange}
        onChange={(value) => setSelectedRange(value)}
        placeholder="Rango de meses"
        style={{ marginLeft: '10px', width: '10%' }}
      />

      <div id="chartContainer" style={{ marginTop: '20px' }}>
        {isLoading ? (
          <p>Cargando datos...</p>
        ) : (
          <Line data={data} options={options} />
        )}
      </div>

      <Button
        type="primary"
        danger
        onClick={saveChartAsPDF}
        style={{ marginTop: '20px' }}
      >
        Guardar como PDF
      </Button>
    </div>
  );
};

export default Grafico;
