// Main table Header 
// -----------------------------------
// Clearance Status
// Invoice Number
// Issue DateTime
// Net Amount
// Total Amount 
// Type
// Sub type 
// Invoice Note 
// Tax Currency
// Customer Number
// Customer Type
// Cust. Tax Payer Number 
// Customer Account Number 
// Customer Contract Number 
// Customer Site Number 
// Supplier Name 

export const headCellsMain = [
    { id: 'clearance-status', numeric: false, label: 'Clearance Status' },
    { id: 'invoice-number', numeric: false, label: 'Invoice Number' },
    { id: 'issue-datetime', numeric: false, label: 'Issue DateTime' },
    { id: 'net-amount', numeric: true, label: 'Net Amount' },
    { id: 'total-amount', numeric: true, label: 'Total Amount' },
    { id: 'type', numeric: false, label: 'Type' },
    { id: 'sub-type', numeric: false, label: 'Sub Type' },
    { id: 'invoice-note', numeric: false, label: 'Invoice Note' },
    { id: 'tax-currency', numeric: false, label: 'Tax Currency' },
    { id: 'customer-number', numeric: false, label: 'Customer Number' },
    { id: 'customer-type', numeric: false, label: 'Customer Type' },
    { id: 'cust-tax-payer-number', numeric: false, label: 'Cust. Tax Payer Number' },
    { id: 'customer-account-number', numeric: false, label: 'Customer Account Number' },
    { id: 'customer-contract-number', numeric: false, label: 'Customer Contract Number' },
    { id: 'customer-site-number', numeric: false, label: 'Customer Site Number' },
    { id: 'supplier-name', numeric: false, label: 'Supplier Name' },
];



function createDataMain(
    id,
    clearanceStatus,
    invoiceNumber,
    issueDateTime,
    netAmount,
    totalAmount,
    type,
    subType,
    invoiceNote,
    taxCurrency,
    customerNumber,
    customerType,
    custTaxPayerNumber,
    customerAccountNumber,
    customerContractNumber,
    customerSiteNumber,
    supplierName,
    supplierLocation,
    billingLocation,
    currency,
    contractNumber,
    additionalField1,
    additionalField2,
    field23,
    field24
) {
    return {
        id,
        clearanceStatus,
        invoiceNumber,
        issueDateTime,
        netAmount,
        totalAmount,
        type,
        subType,
        invoiceNote,
        taxCurrency,
        customerNumber,
        customerType,
        custTaxPayerNumber,
        customerAccountNumber,
        customerContractNumber,
        customerSiteNumber,
        supplierName,
        supplierLocation,
        billingLocation,
        currency,
        contractNumber,
        additionalField1,
        additionalField2,
        field23,
        field24,
    };
}


// export const rowsMainData = [
//     { id: 1, name: 'Cupcake', calories: 305, fat: 3.7, carbs: 67, protein: 4.3 },
//     { id: 2, name: 'Donut', calories: 452, fat: 25.0, carbs: 51, protein: 4.9 },
//     { id: 3, name: 'Eclair', calories: 262, fat: 16.0, carbs: 24, protein: 6.0 },
// ];

export const rowsMainData = [
    createDataMain(
        1,
        'CLEARED',              // Clearance Status
        '3559',                 // Invoice Number
        '06-Feb-2025',          // Issue DateTime
        435850,                 // Net Amount
        435850,                 // Total Amount
        '388',                  // Type
        '010000',               // Sub Type
        'INVOICE COMMENTS', // Invoice Note
        'SAR',                  // Tax Currency
        '2089',                 // Customer Number
        'TAV Construction',      // Customer Type
        'ORGANIZATION',         // Cust. Tax Payer Number
        '',                      // Customer Account Number
        'NEWFAB-00433',          // Customer Contract Number
        '',                      // Customer Site Number
        'Site-2089',             // Supplier Name

    ),
];




// Details page 
// ----------------------------------

function createDataDetail(
    id,
    clearanceStatus,
    processDate,
    errorType,
    errorStatus,
    errorCode,
    errorCategory
) {
    return {
        id,
        clearanceStatus,
        processDate,
        errorType,
        errorStatus,
        errorCode,
        errorCategory
    };
}
export const headCellsDetail = [
    { id: 'clearance-status', numeric: false, label: 'Clearance Status' },
    { id: 'process-date', numeric: false, label: 'Process Date' },
    { id: 'error-type', numeric: false, label: 'Error Type' },
    { id: 'error-status', numeric: false, label: 'Error Status' },
    { id: 'error-code', numeric: false, label: 'Error Code' },
    { id: 'error-category', numeric: false, label: 'Error Category' },
];

export const rowsDetailData = [
    createDataDetail(
        1,
        '07-FEB-2025',              // Clearance Status
        'Warning',                 // Process Date
        'Warning',          // Error Type
        'BR-S-09',                 // Error Status
        'EN_16931',                  // Error Code
        "The VAT category tax amount (BT-117) in a VAT breakdown (BG-23) where VAT category code (BT-118) is 'Standard rated' shall equal the VAT category taxable amount (BT-116) multiplied by the VAT category rate (BT-119).",                  // Error Category

    ),
];