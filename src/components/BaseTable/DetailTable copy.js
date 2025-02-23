import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const columns = [
    { field: "process_date", headerName: "Process Date", width: 150 },
    { field: "error_type", headerName: "Error Type", width: 120 },
    { field: "error_code", headerName: "Error Code", width: 180 },
    { field: "error_category", headerName: "Error Category", width: 120 },
    { field: "error_message", headerName: "Error Message", width: 400 },
    { field: "error_status", headerName: "Error Status", width: 120 },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DetailTable({ data, loading }) {

    return (<>

        {loading ? <Paper sx={{ width: '100%', p: 2, textAlign: 'center' }}>Loading...</Paper> :
            <Paper sx={{ width: "100%" }}>
                {data.length > 0 ?
                    <DataGrid
                        rows={data.map((item, index) => ({ id: index + 1, ...item }))}
                        columns={columns}
                        // initialState={{ pagination: { paginationModel } }}
                        // pageSizeOptions={[5, 10]}
                        // checkboxSelection
                        sx={{ border: 0 }}
                    />
                    : <p className="p-3">No data to display.</p>
                }
            </Paper>
        }
    </>
    );
}
