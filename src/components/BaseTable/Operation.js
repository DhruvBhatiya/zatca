// Export PDF 

export const exportToPDF = () => {
    if (tableData.length === 0) {
        alert("No data to export");
        return;
    }

    // Extract table headers
    const headers = [Object.keys(tableData[0])];

    // Extract table rows
    const rows = tableData.map(row => Object.values(row));

    // Determine if landscape mode is needed based on column count
    const columnCount = headers[0].length;
    const orientation = columnCount > 6 ? "landscape" : "portrait";

    const doc = new jsPDF({
        orientation: orientation,
        unit: "mm",
        format: "a4"
    });

    doc.text("Invoice Data", 14, 15);

    // Calculate column widths dynamically
    const columnWidths = headers[0].map(header => {
        const maxLength = Math.max(
            header.length,
            ...rows.map(row => row[headers[0].indexOf(header)]?.toString().length || 0)
        );
        return maxLength * 3; // Adjust multiplier for better spacing
    });

    // Add table to PDF
    doc.autoTable({
        head: headers,
        body: rows,
        startY: 20,
        theme: "grid",
        styles: { overflow: "linebreak" },
        columnStyles: headers[0].reduce((acc, header, index) => {
            acc[index] = { cellWidth: columnWidths[index] > 50 ? "auto" : columnWidths[index] };
            return acc;
        }, {}),
        margin: { top: 20 },
    });

    doc.save("Invoice_Information.pdf");
};
