import * as React from 'react';
import { BarChart } from '@mui/x-charts';

export default function BarChartCleared({ db }) {
// console.log("db",db)

const data = db ? db : []
  const chartData = {
    xLabels: data.map((item) => item.month_year),
    createdInvoices: data.map((item) => item.created_invoices_count),
    clearedInvoices: data.map((item) => item.cleared_invoices_count),
  };


  return (
    <>
      <BarChart
        width={450}
        height={250}
        xAxis={[
          {
            scaleType: "band",
            data: chartData.xLabels,
          },
        ]}
        series={[
          { data: chartData.createdInvoices, label: "Created Invoices", color: "blue" },
          { data: chartData.clearedInvoices, label: "Cleared Invoices", color: "green" },
        ]}
      />
      {/* <BarChart
        width={600}
        height={300}
        xAxis={[
          {
            scaleType: 'band',
            data: data.map((v, i) => i),
            zoom: true,
          },
        ]}
        series={series}
      /> */}
    </>
  );
}

const data = [
  {
    y1: 443.28,
    y2: 153.9,
  },
  {
    y1: 110.5,
    y2: 217.8,
  },
  {
    y1: 175.23,
    y2: 286.32,
  },
  {
    y1: 195.97,
    y2: 325.12,
  },
  {
    y1: 351.77,
    y2: 144.58,
  },
  {
    y1: 43.253,
    y2: 146.51,
  },
  {
    y1: 376.34,
    y2: 309.69,
  },
  {
    y1: 31.514,
    y2: 236.38,
  },
  {
    y1: 231.31,
    y2: 440.72,
  },
  {
    y1: 108.04,
    y2: 20.29,
  },
  {
    y1: 321.77,
    y2: 484.17,
  },
  {
    y1: 120.18,
    y2: 54.962,
  },
  {
    y1: 366.2,
    y2: 418.5,
  },
  {
    y1: 451.45,
    y2: 181.32,
  },
  {
    y1: 294.8,
    y2: 440.9,
  },
  {
    y1: 121.83,
    y2: 273.52,
  },
  {
    y1: 287.7,
    y2: 346.7,
  },
  {
    y1: 134.06,
    y2: 74.528,
  },
  {
    y1: 104.5,
    y2: 150.9,
  },
  {
    y1: 413.07,
    y2: 26.483,
  },
  {
    y1: 74.68,
    y2: 333.2,
  },
  {
    y1: 360.6,
    y2: 422.0,
  },
  {
    y1: 330.72,
    y2: 488.06,
  },
];

const series = [
  {
    label: 'Series A',
    data: data.map((v) => v.y1),
  },
  {
    label: 'Series B',
    data: data.map((v) => v.y2),
  },
];
