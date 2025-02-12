import * as React from 'react';
import axios from 'axios';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
    TableRow, TableSortLabel, TextField, MenuItem, Button, Grid
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DetailTable from './DetailTable';
import MyContainer from '../MyContainer';

const API_URL = "http://130.61.209.11:8080/ords/zatca/zatca_prod/InvoiceInformation?CUSTOMERNAME=undefined&ENDDATE=undefined&INVOICENO=undefined&STARTDATE=undefined&STATUS=ALL&SUPPLIERNAME=undefined";

export default function MainTable() {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [tableData, setTableData] = React.useState([]); // Store fetched data

    const [filters, setFilters] = React.useState({
        customerName: '',
        invoiceNumber: '',
        supplier: '',
        fromDate: null,
        toDate: null,
        status: ''
    });

    // Fetch data from API
    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(API_URL);
            setTableData(response.data.items || []); // Adjust based on API response structure
        } catch (error) {
            console.error("Error fetching data:", error);
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

    const handleFilterChange = (event) => {
        setFilters({ ...filters, [event.target.name]: event.target.value });
    };

    const handleDateChange = (name, value) => {
        setFilters({ ...filters, [name]: value });
    };

    const handleSearch = () => {
        console.log('Search filters:', filters);
    };

    const handleReset = () => {
        setFilters({ customerName: '', invoiceNumber: '', supplier: '', fromDate: null, toDate: null, status: '' });
    };

    return (
        <MyContainer className={'bg-[#000]'}>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <TextField
                                select
                                label="Customer Name"
                                name="customerName"
                                value={filters.customerName}
                                onChange={handleFilterChange}
                                fullWidth
                            >
                                <MenuItem value="">All</MenuItem>
                                {tableData.map((row) => (
                                    <MenuItem key={row.customerNumber} value={row.customerNumber}>
                                        {row.customerNumber}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                select
                                label="Invoice No."
                                name="invoiceNumber"
                                value={filters.invoiceNumber}
                                onChange={handleFilterChange}
                                fullWidth
                            >
                                <MenuItem value="">All</MenuItem>
                                {tableData.map((row) => (
                                    <MenuItem key={row.invoiceNumber} value={row.invoiceNumber}>
                                        {row.invoiceNumber}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                select
                                label="Supplier"
                                name="supplier"
                                value={filters.supplier}
                                onChange={handleFilterChange}
                                fullWidth
                            >
                                <MenuItem value="">All</MenuItem>
                                {tableData.map((row) => (
                                    <MenuItem key={row.supplierName} value={row.supplierName}>
                                        {row.supplierName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={2} sx={{ minWidth: 180 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="From Issue Date"
                                    value={filters.fromDate}
                                    onChange={(newValue) => handleDateChange('fromDate', newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={2} sx={{ minWidth: 180 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="To Issue Date"
                                    value={filters.toDate}
                                    onChange={(newValue) => handleDateChange('toDate', newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                select
                                label="Status"
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                fullWidth
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Approved">Approved</MenuItem>
                                <MenuItem value="Rejected">Rejected</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} textAlign="right">
                            <Button variant="contained" color="primary" onClick={handleSearch} sx={{ mx: 1 }}>
                                Search
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={handleReset} sx={{ mx: 1 }}>
                                Reset
                            </Button>
                            <Button variant="contained" color="success" sx={{ mx: 1 }}>
                                Export
                            </Button>
                            <Button variant="contained" color="error" sx={{ mx: 1 }}>
                                Download PDF
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

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
                                    <TableRow key={index}>
                                        {Object.values(row).map((cell, cellIndex) => (
                                            <TableCell key={cellIndex}>{cell}</TableCell>
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

                <Box className="mt-10">
                    <DetailTable />
                </Box>
            </Box>
        </MyContainer>
    );
}
