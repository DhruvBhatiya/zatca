'use client'

import React from "react";
import CardTitle from "../CardTitle";
import MyContainer from "../MyContainer";
import BasicPie from "./BasicPie";

import axios from 'axios';
import BarChartCleared from "./BarChartCleared";
import BarChartClearedUncleared from "./BarChartClearedUncleared";


const TopFiveCustomers = "http://130.61.209.11:8080/ords/zatca/zatca_prod/TopFiveCustomers"; // TopFiveCustomers
const MonthClearedInvoices_URL = "http://130.61.209.11:8080/ords/zatca/zatca_prod/InvoicePerMonth"; // MonthClearedInvoices
const MonthClearedUnclearedInvoices_URL = "http://130.61.209.11:8080/ords/zatca/zatca_prod/MonthWiseTotalAndClearInvoices"; // Month Cleared and uncleared Invoices


export default function Charts() {
  const [top5Customer, setTop5Customer] = React.useState([]); 
  const [isMonthClearedInvoices, setMonthClearedInvoices] = React.useState([]); 
  const [isMonthClearedUnclearedInvoices, setMonthClearedUnclearedInvoices] = React.useState([]); // 



  React.useEffect(() => {
    fetchDataTop5Customer();
    fetchDataMonthClearedInvoices();
    fetchDataMonthClearedUnclearedInvoices();
  }, []);
  // Top 5 Customer
  const fetchDataTop5Customer = async () => {
    try {
      const response = await axios.get(TopFiveCustomers);
      setTop5Customer(response.data.items || []); // Adjust based on API response structure
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Month-wise Cleared Invoices Value
  const fetchDataMonthClearedInvoices = async () => {
    try {
      const response = await axios.get(MonthClearedInvoices_URL);
      setMonthClearedInvoices(response.data.items || []); // Adjust based on API response structure
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Month-wise Total, Cleared & UnCleared Invoices
  const fetchDataMonthClearedUnclearedInvoices = async () => {
    try {
      const response = await axios.get(MonthClearedUnclearedInvoices_URL);
      setMonthClearedUnclearedInvoices(response.data.items || []); // Adjust based on API response structure
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  return (
    <MyContainer className={'bg-[#ededed]'}>
      <div className="grid grid-cols-3 gap-4">
        <div><CardTitle content={<BarChartCleared db={isMonthClearedInvoices} />} title={'Month-wise Cleared Invoices Value'} /></div>
        <div><CardTitle content={<BarChartClearedUncleared db={isMonthClearedUnclearedInvoices} />} title={'Month-wise Total, Cleared & UnCleared Invoices'} /></div>
        <div><CardTitle content={<BasicPie data={top5Customer} />} title={'Top 5 customers'} /></div>
      </div>
    </MyContainer>
  );
}
