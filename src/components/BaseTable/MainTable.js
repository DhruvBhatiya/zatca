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
import { exportToCSV, exportToPDF } from './Operation';


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
        let toDate1 = filters.toDate != null ? new Date(filters.toDate).toLocaleDateString("en-CA") : undefined;

        setFromDate(fromDate1)
        setToDate(toDate1)

        // console.log("fromDate1", fromDate1 + '   ' + toDate1)
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
    const [loadingDT, setLoadingDT] = React.useState(false);
    const [isPending, startTransition] = React.useTransition();
    const [selectedRow, setSelectedRow] = React.useState(null);

    const handleRowClick = (rowId) => {
        setRowId(rowId);
        setSelectedRow(rowId);
    };

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
        setLoadingDT(true);
        try {
            const response = await axios.get(getSingleRow);

            // Defer updating state to avoid UI freeze
            startTransition(() => {
                setTableDataSingle(response.data.items || []);
            });

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoadingDT(false);
        }
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

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        const sortedData = [...tableData].sort((a, b) => {
            return (isAsc ? a[property] > b[property] : a[property] < b[property]) ? 1 : -1;
        });
        setTableData(sortedData);
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
                                                <TableCell key={key} sx={{ fontWeight: 'bold', textTransform: 'capitalize', minWidth: 120, borderRight: '1px solid #ddd', padding: '8px' }}>
                                                    <TableSortLabel
                                                        active={orderBy === key}
                                                        direction={orderBy === key ? order : 'asc'}
                                                        onClick={() => handleRequestSort(null, key)}
                                                    >
                                                        {key.replace(/_/g, ' ')}
                                                    </TableSortLabel>
                                                </TableCell>
                                            ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                        <TableRow
                                            className='hover:bg-slate-200'
                                            key={index}
                                            onClick={() => handleRowClick(row.customer_trx_id)}
                                            sx={{
                                                cursor: 'pointer',
                                                backgroundColor: selectedRow === row.customer_trx_id ? '#d3d3d3' : 'transparent'
                                            }}
                                        >
                                            {Object.values(row).map((cell, cellIndex) => (
                                                <TableCell key={cellIndex}
                                                    sx={{ whiteSpace: 'nowrap', padding: '8px', fontWeight: 'bold', textTransform: 'uppercase', minWidth: 120, borderRight: '1px solid #ddd' }}
                                                >{cell}</TableCell>
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
                            onPageChange={(event, newPage) => setPage(newPage)}
                            onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
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
                            <DetailTable data={tableDataSingle} loading={loadingDT} />
                        </AccordionDetails>
                    </Accordion>

                </Box>
            </Box>
        </MyContainer>
    );
}
