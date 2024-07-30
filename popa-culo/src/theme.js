import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: 'rgba(76,72,72,0.51)',
        },
        secondary: {
            main: '#a81c51',
        },
    },
    typography: {
        h6: {
            fontSize: '1.25rem',
        },
        body1: {
            fontSize: '1rem',
        },
    },
});

export default theme;