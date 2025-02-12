import * as React from 'react';
import axios from 'axios';
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

const API_URL = "http://130.61.209.11:8080/ords/zatca/zatca_prod/InvoiceInformation?CUSTOMERNAME=undefined&ENDDATE=undefined&INVOICENO=undefined&STARTDATE=undefined&STATUS=ALL&SUPPLIERNAME=undefined";

export default function MainTable() {
    // State management
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [tableData, setTableData] = React.useState([]);
    const [allCustomers, setAllCustomers] = React.useState([]);
    const [allSuppliers, setAllSuppliers] = React.useState([]);
    const [allInvoiceNumbers, setAllInvoiceNumbers] = React.useState([]);

    const [filters, setFilters] = React.useState({
        customerName: '',
        invoiceNumber: '',
        supplier: '',
        fromDate: null,
        toDate: null,
        status: ''
    });

    // Fetch data and filter options
    React.useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const response = await axios.get(API_URL);
                const data = response.data.items || [];
                
                // Extract unique values for filters
                const customers = [...new Set(data.map(item => item.customerName).filter(Boolean))];
                const suppliers = [...new Set(data.map(item => item.supplierName).filter(Boolean))];
                const invoiceNumbers = [...new Set(data.map(item => item.invoiceNumber).filter(Boolean))];
                
                setAllCustomers(customers);
                setAllSuppliers(suppliers);
                setAllInvoiceNumbers(invoiceNumbers);
                setTableData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchFilterData();
    }, []);

    // Sorting handler
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Filter handlers
    const handleFilterChange = (name, value) => {
        setFilters({ ...filters, [name]: value });
    };

    const handleSearch = () => {
        console.log('Search filters:', filters);
    };

    const handleReset = () => {
        setFilters({ 
            customerName: '', 
            invoiceNumber: '', 
            supplier: '', 
            fromDate: null, 
            toDate: null, 
            status: '' 
        });
    };

    // Filter application logic
    const applyFilters = React.useCallback((data) => {
        return data.filter(row => {
            const matchesCustomer = !filters.customerName || row.customerName === filters.customerName;
            const matchesSupplier = !filters.supplier || row.supplierName === filters.supplier;
            const matchesInvoice = !filters.invoiceNumber || row.invoiceNumber === filters.invoiceNumber;
            
            // Add date filtering
            const fromDateMatch = !filters.fromDate || new Date(row.issueDate) >= filters.fromDate;
            const toDateMatch = !filters.toDate || new Date(row.issueDate) <= filters.toDate;
            
            return matchesCustomer && matchesSupplier && matchesInvoice && fromDateMatch && toDateMatch;
        });
    }, [filters]);

    // Memoized filtered data
    const filteredData = React.useMemo(() => {
        return applyFilters(tableData);
    }, [tableData, applyFilters]);

    return (
        <MyContainer className={'bg-[#000]'} >
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2}>
                        {/* Customer Name Dropdown */}
                        <Grid item xs={2}>
                            <Autocomplete
                                options={allCustomers}
                                value={filters.customerName || ""}
                                onChange={(event, newValue) => handleFilterChange('customerName', newValue || "")}
                                getOptionLabel={(option) => option ? String(option) : ""}
                                renderInput={(params) => <TextField {...params} label="Customer Name" fullWidth />}
                            />
                        </Grid>

                        {/* Invoice Number */}
                        <Grid item xs={2}>
                            <Autocomplete
                                options={allInvoiceNumbers}
                                value={filters.invoiceNumber || ""}
                                onChange={(event, newValue) => handleFilterChange('invoiceNumber', newValue || "")}
                                getOptionLabel={(option) => option ? String(option) : ""}
                                renderInput={(params) => <TextField {...params} label="Invoice No." fullWidth />}
                            />
                        </Grid>

                        {/* Supplier */}
                        <Grid item xs={2}>
                            <Autocomplete
                                options={allSuppliers}
                                value={filters.supplier || ""}
                                onChange={(event, newValue) => handleFilterChange('supplier', newValue || "")}
                                getOptionLabel={(option) => option ? String(option) : ""}
                                renderInput={(params) => <TextField {...params} label="Supplier" fullWidth />}
                            />
                        </Grid>

                        {/* From Date */}
                        <Grid item xs={2}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="From Issue Date"
                                    value={filters.fromDate}
                                    onChange={(newValue) => handleFilterChange('fromDate', newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>

                        {/* To Date */}
                        <Grid item xs={2}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="To Issue Date"
                                    value={filters.toDate}
                                    onChange={(newValue) => handleFilterChange('toDate', newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} textAlign="right">
                            <Button variant="contained" color="primary" onClick={handleSearch} sx={{ mx: 1 }}>
                                Search
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={handleReset} sx={{ mx: 1 }}>
                                Reset
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
                                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
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
                        count={filteredData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
        </MyContainer>
    );
}