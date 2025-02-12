import * as React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

export default function BasicPie({ db }) {
  // Check if data is available
  
  if (!db || db.length === 0) {
    return <p>No data available</p>;
  }

  // Calculate total value
  const totalValue = db.reduce((sum, item) => sum + item.value, 0);

  
  // Transform data for PieChart
  const pieChartData = db.map((item) => ({
    id: item.id,
    value: item.invoice_total_amt,
    label: item.customer_name,
  }));


  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <PieChart
        series={[
          {
            data: pieChartData,
            arcLabel: (item) =>
              totalValue > 0 ? `${((item.value / totalValue) * 100).toFixed(2)}%` : "0%",
            arcLabelMinAngle: 10, // Reduce this for better visibility
            arcLabelRadius: "60%",
            innerRadius: 50, // Optional: Makes it a donut chart
            outerRadius: 100,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fontWeight: "bold",
          },
        }}
        width={400}
        height={300}
      />
    </div>
  );
}






// import * as React from 'react';
// import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';


// export default function BasicPie({ db }) {

// // Calculate total value
// const totalValue = db.reduce((sum, item) => sum + item.value, 0);

// // Transform data for PieChart
// const pieChartData = db.map((item) => ({
//   id: item.id,
//   value: item.value,
//   label: item.label,
// }));


//   console.log("pieChartData",pieChartData)
//   return (
//     <>
//       {/* <PieChart
//         series={[
//           {

//             data: pieChartData
//             // data: [
//             //   { id: 0, value: 10, label: 'series A' },
//             //   { id: 1, value: 15, label: 'series B' },
//             //   { id: 2, value: 20, label: 'series C', color: 'red' },
//             // ],
//           },
//         ]}

//         width={250}
//         height={250}
//       /> */}

//       {/* <PieChart
//         series={[
//           {
//             arcLabel: (item) => `${item.value}%`,
//             arcLabelMinAngle: 35,
//             arcLabelRadius: '60%',
//             ...data,
//           },
//         ]}
//         sx={{
//           [`& .${pieArcLabelClasses.root}`]: {
//             fontWeight: 'bold',
//           },
//         }}
//         {...size}
//       /> */}


// <PieChart
//       series={[
//         {
//           data: pieChartData,
//           arcLabel: (item) => `${((item.value / totalValue) * 100).toFixed(2)}%`,
//           arcLabelMinAngle: 35,
//           arcLabelRadius: "60%",
//         },
//       ]}
//       sx={{
//         [`& .${pieArcLabelClasses.root}`]: {
//           fontWeight: "bold",
//         },
//       }}
//       width={400}
//       height={300}
//     />
//     </>
//   );
// }
