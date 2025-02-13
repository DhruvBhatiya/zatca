import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const BasicPie = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  // Extract labels and values
  const labels = data.map((item) => item.customer_name);
  const values = data.map((item) => Number(item.invoice_total_amt));

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#b91d47", "#00aba9", "#2b5797", "#e8c3b9", "#1e7145"],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          textAlign: "left",
          boxWidth: 15, // Square size
          boxHeight: 15, // Ensures square shape
          usePointStyle: false, // Keeps squares instead of circles
          padding: 10,
        },
      },
      title: {
        display: true,
        // text: "Invoice Total Amount by Customer",
        font: { size: 18 },
      },
    },
  };

  return (
    <div style={{ width: "350px", height: "350px", margin: '0 auto' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default BasicPie;






// import * as React from "react";
// import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

// export default function BasicPie({ db }) {
//   // Check if data is available
  
//   if (!db || db.length === 0) {
//     return <p>No data available</p>;
//   }

//   // Calculate total value
//   const totalValue = db.reduce((sum, item) => sum + item.value, 0);

  
//   // Transform data for PieChart
//   const pieChartData = db.map((item) => ({
//     id: item.id,
//     value: item.invoice_total_amt,
//     label: item.customer_name,
//   }));


//   return (
//     <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
//       <PieChart
//         series={[
//           {
//             data: pieChartData,
//             arcLabel: (item) =>
//               totalValue > 0 ? `${((item.value / totalValue) * 100).toFixed(2)}%` : "0%",
//             arcLabelMinAngle: 10, // Reduce this for better visibility
//             arcLabelRadius: "60%",
//             innerRadius: 50, // Optional: Makes it a donut chart
//             outerRadius: 100,
//           },
//         ]}
//         sx={{
//           [`& .${pieArcLabelClasses.root}`]: {
//             fontWeight: "bold",
//           },
//         }}
//         width={400}
//         height={300}
//       />
//     </div>
//   );
// }






