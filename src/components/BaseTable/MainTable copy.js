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
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [tableData, setTableData] = React.useState([]);

    const [filters, setFilters] = React.useState({
        customer_name: '',
        invoice_number: '',
        supplier_name: '',
        fromDate: null,
        toDate: null,
        clearance_status: ''
    });

    const API_URL2 = `http://130.61.209.11:8080/ords/zatca/zatca_prod/InvoiceInformation?CUSTOMERNAME=${filters.customer_name ? filters.customer_name : 'undefined'}&ENDDATE=undefined&INVOICENO=${filters.invoice_number ? filters.invoice_number : 'undefined'}&STARTDATE=undefined&STATUS=${filters.clearance_status ? filters.clearance_status : 'ALL'}&SUPPLIERNAME=${filters.supplier_name ? filters.supplier_name : 'undefined'}`;

    console.log("filters", filters)
    React.useEffect(() => {
        fetchData();
    }, []);


    // const fetchData = async () => {
    //     try {
    //         const response = await axios.get(API_URL2);
    //         setTableData(response.data.items || []);
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //     }
    // };


    const [loading, setLoading] = React.useState(false);
    const [isPending, startTransition] = React.useTransition();

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

    const handleFilterChange = (name, value) => {
        setFilters({ ...filters, [name]: value });
    };

    const handleSearch = () => {
        console.log('Search filters:', filters);
        fetchData();
    };

    const handleReset = () => {
        setFilters({ customer_name: '', invoice_number: '', supplier_name: '', fromDate: null, toDate: null, clearance_status: '' });
    };

    console.log("tableData", tableData)
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
                            <Button variant="contained" color="success" sx={{ mx: 1 }}>
                                Export
                            </Button>
                            <Button variant="contained" color="error" sx={{ mx: 1 }}>
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
                                        <TableRow key={index}>
                                            {Object.values(row).map((cell, cellIndex) => (
                                                <TableCell className='!py-2--' key={cellIndex}>{cell}</TableCell>
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
                    <DetailTable />
                </Box>
            </Box>
        </MyContainer>
    );
}
