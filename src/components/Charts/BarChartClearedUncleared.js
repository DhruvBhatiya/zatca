import * as React from 'react';
import { BarChart } from '@mui/x-charts';

export default function BarChartClearedUncleared({ db }) {
    // console.log("Raw Data:", db);

    // Ensure db is an array to prevent errors
    const data = Array.isArray(db) ? db : [];

    // Extract unique months
    const uniqueMonths = [...new Set(data.map(item => item.invoice_issue_datetime_group))].sort();

    // Aggregate data by month
    const aggregatedData = uniqueMonths.map(month => {
        const totalInvoices = data.find(item => item.invoice_issue_datetime_group === month && item.clearance_status_series === "Total Invoices")?.invoices_created_count_value || 0;
        const clearedInvoices = data.find(item => item.invoice_issue_datetime_group === month && item.clearance_status_series === "Cleared Invoices")?.invoices_created_count_value || 0;
        const unclearedInvoices = data.find(item => item.invoice_issue_datetime_group === month && item.clearance_status_series === "UnCleared Invoices")?.invoices_created_count_value || 0;
        const nullInvoices = data.find(item => item.invoice_issue_datetime_group === month && item.clearance_status_series === null)?.invoices_created_count_value || 0;

        return {
            month,
            totalInvoices,
            clearedInvoices,
            unclearedInvoices,
            nullInvoices
        };
    });

    return (
        <BarChart
            width={450}
            height={250}
            xAxis={[
                {
                    scaleType: "band",
                    data: aggregatedData.map(item => item.month),
                },
            ]}
            series={[
                { data: aggregatedData.map(item => item.totalInvoices), label: "Total Invoices", color: "blue" },
                { data: aggregatedData.map(item => item.clearedInvoices), label: "Cleared Invoices", color: "green" },
                { data: aggregatedData.map(item => item.unclearedInvoices), label: "UnCleared Invoices", color: "red" },
                { data: aggregatedData.map(item => item.nullInvoices), label: "Null Invoices", color: "gray" },
            ]}
        />
    );
}
