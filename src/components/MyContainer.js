import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export default function MyContainer({children, className}) {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl" className={`py-20 ${className} `}>
        {children}
      </Container>
    </React.Fragment>
  );
}
