import * as React from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
    TableRow, TableSortLabel, Button, Grid, TextField
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Autocomplete } from '@mui/material';
import DetailTable from './DetailTable';
import MyContainer from '../MyContainer';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


export default function MainTable() {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [tableData, setTableData] = React.useState([]);
    const [tableDataSingle, setTableDataSingle] = React.useState([]);
    const [isRowId, setRowId] = React.useState('');
    const [isFromDate, setFromDate] = React.useState('undefined');
    const [isToDate, setToDate] = React.useState('undefined');



    const [filters, setFilters] = React.useState({
        customer_name: '',
        invoice_number: '',
        supplier_name: '',
        fromDate: null,
        toDate: null,
        clearance_status: ''
    });


    React.useEffect(() => {
        let fromDate1 = filters.fromDate != null ? new Date(filters.fromDate).toLocaleDateString("en-CA") : undefined;
        let toDate1 = filters.toDate !=null ? new Date(filters.toDate).toLocaleDateString("en-CA") : undefined;

        setFromDate(fromDate1)
        setToDate(toDate1)

        console.log("fromDate1", fromDate1 + '   ' + toDate1)
    }, [filters.fromDate, filters.toDate])

    const API_URL2 = `http://130.61.209.11:8080/ords/zatca/zatca_prod/InvoiceInformation?CUSTOMERNAME=${filters.customer_name || 'undefined'}&ENDDATE=${isToDate || 'undefined'}&INVOICENO=${filters.invoice_number || 'undefined'}&STARTDATE=${isFromDate || 'undefined'}&STATUS=${filters.clearance_status || 'ALL'}&SUPPLIERNAME=${filters.supplier_name || 'undefined'}&page=${page + 1}&size=${rowsPerPage}`;

    const getSingleRow = `http://130.61.209.11:8080/ords/zatca/zatca_prod/InvoiceClearanceErrors?customer_trx_id=${isRowId ? isRowId : 'undefined'}`


    console.log("isToDate", filters.toDate + ' --- ' + filters.fromDate)
    console.log("filters.fromDate", filters.fromDate)

    React.useEffect(() => {
        fetchData();
    }, []);
    React.useEffect(() => {
        fetchSingleRowData();
    }, [isRowId]);

    const [loading, setLoading] = React.useState(false);
    const [isPending, startTransition] = React.useTransition();

    // Main Table Data 
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL2);

            // Defer updating state to avoid UI freeze
            startTransition(() => {
                setTableData(response.data.items || []);
            });

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };


    // SELECT ROW TO FETCH DATA
    const fetchSingleRowData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(getSingleRow);

            // Defer updating state to avoid UI freeze
            startTransition(() => {
                setTableDataSingle(response.data.items || []);
            });

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Filters onChange 
    const handleFilterChange = (name, value) => {
        setFilters({ ...filters, [name]: value });
    };

    // SEARCH 
    const handleSearch = () => {
        console.log('Search filters:', filters);
        fetchData();
    };
    // RESET 
    const handleReset = () => {
        setFilters({ customer_name: '', invoice_number: '', supplier_name: '', fromDate: null, toDate: null, clearance_status: '' });
    };

    // Export CSV 
    const exportToCSV = () => {
        if (tableData.length === 0) {
            alert("No data to export");
            return;
        }

        const headers = Object.keys(tableData[0]).join(",") + "\n";
        const rows = tableData
            .map(row => Object.values(row).map(value => `"${value}"`).join(","))
            .join("\n");

        const csvContent = headers + rows;
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "InvoiceInformation.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Export PDF 
    const exportToPDF = () => {
        if (tableData.length === 0) {
            alert("No data to export");
            return;
        }

        const doc = new jsPDF();
        doc.text("Invoice Data", 14, 15);

        // Extract table headers
        const headers = [Object.keys(tableData[0])];

        // Extract table rows
        const rows = tableData.map(row => Object.values(row));

        // Add table to PDF
        doc.autoTable({
            head: headers,
            body: rows,
            startY: 20,
            theme: "grid",
        });

        doc.save("InvoiceInformation.pdf");
    };


    return (
        <MyContainer className={'bg-[#000]'}>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2}>
                        {/* Customer Name */}
                        <Grid item xs={2}>
                            <Autocomplete
                                options={[...new Set(tableData.map((row) => row.customer_name))] || []}
                                value={filters.customer_name || ""}
                                onChange={(event, newValue) => handleFilterChange('customer_name', newValue || "")}
                                getOptionLabel={(option) => option ? String(option) : ""}
                                renderInput={(params) => <TextField {...params} label="Customer Name" fullWidth />}
                            />
                        </Grid>

                        {/* Invoice Number */}
                        <Grid item xs={2}>
                            <Autocomplete
                                options={[...new Set(tableData.map((row) => row.invoice_number))] || []}
                                value={filters.invoice_number || ""}
                                onChange={(event, newValue) => handleFilterChange('invoice_number', newValue || "")}
                                getOptionLabel={(option) => option ? String(option) : ""}
                                renderInput={(params) => <TextField {...params} label="Invoice No." fullWidth />}
                            />
                        </Grid>

                        {/* Supplier */}
                        <Grid item xs={2}>
                            <Autocomplete
                                options={[...new Set(tableData.map((row) => row.supplier_name))] || []}
                                value={filters.supplier_name || ""}
                                onChange={(event, newValue) => handleFilterChange('supplier_name', newValue || "")}
                                getOptionLabel={(option) => option ? String(option) : ""}
                                renderInput={(params) => <TextField {...params} label="Supplier" fullWidth />}
                            />
                        </Grid>

                        {/* From Date */}
                        <Grid item xs={2} sx={{ minWidth: 180 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="From Issue Date"
                                    // format="dd/MM/YYYY"
                                    value={filters.fromDate}
                                    onChange={(newValue) => handleFilterChange('fromDate', newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>

                        {/* To Date */}
                        <Grid item xs={2} sx={{ minWidth: 180 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="To Issue Date"

                                    value={filters.toDate}
                                    onChange={(newValue) => handleFilterChange('toDate', newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>


                        {/* Status */}
                        <Grid item xs={2}>
                            <Autocomplete
                                // options={["Pending", "Approved", "Rejected"]}
                                options={[...new Set(tableData.map((row) => row.clearance_status))] || []}
                                value={filters.clearance_status || ""}
                                onChange={(event, newValue) => handleFilterChange('clearance_status', newValue || "")}
                                renderInput={(params) => <TextField {...params} label="Status" fullWidth />}
                            />
                        </Grid>

                        <Grid item xs={12} textAlign="right">
                            <Button variant="contained" color="primary" onClick={handleSearch} sx={{ mx: 1 }}>
                                Search
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={handleReset} sx={{ mx: 1 }}>
                                Reset
                            </Button>
                            <Button variant="contained" color="success" sx={{ mx: 1 }} onClick={exportToCSV}>
                                Export
                            </Button>
                            <Button variant="contained" color="error" sx={{ mx: 1 }} onClick={exportToPDF}>
                                Download PDF
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
                {loading ? <Paper sx={{ width: '100%', p: 2, textAlign: 'center' }}>Loading...</Paper> :
                    <Paper sx={{ width: '100%' }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {tableData.length > 0 &&
                                            Object.keys(tableData[0]).map((key) => (
                                                <TableCell key={key}>
                                                    <TableSortLabel
                                                        active={orderBy === key}
                                                        direction={orderBy === key ? order : 'asc'}
                                                        onClick={() => handleRequestSort(null, key)}
                                                    >
                                                        {key}
                                                    </TableSortLabel>
                                                </TableCell>
                                            ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                        <TableRow className='cursor-pointer hover:bg-slate-200' key={index} onClick={() => setRowId(row.customer_trx_id)}>
                                            {Object.values(row).map((cell, cellIndex) => (
                                                <TableCell className='!py-2--' key={cellIndex} >{cell}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={tableData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                }


                <Box className="mt-10">

                    <Accordion defaultExpanded >
                        <AccordionSummary
                            className='!bg-slate-200 '
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography className=' !font-medium !capitalize' component="span">Detailed Error Messages</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <DetailTable data={tableDataSingle} loading={loading} />
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                </Box>
            </Box>
        </MyContainer>
    );
}
