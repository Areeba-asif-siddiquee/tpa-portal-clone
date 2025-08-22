import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactApexChart from 'react-apexcharts';   // you forgot this import

const ApexChart = () => {
  const [state, setState] = React.useState({
    series: [
      {
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
      }
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Product Trends by Month',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
      }
    }
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart 
          options={state.options} 
          series={state.series} 
          type="line" 
          height={350} 
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ApexChart />);

export default ApexChart;
