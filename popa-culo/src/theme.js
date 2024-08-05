import { createTheme } from '@mui/material/styles';


// ייבוא הפונט דרך Google Fonts
const theme = createTheme({
    typography: {
        fontFamily: 'Bodoni Moda, serif',
        h6: {
            fontSize: '1.25rem',
        },
        body1: {
            fontSize: '1.5rem',
        },
    },
    palette: {
        primary: {
            main: 'rgba(76,72,72,0.51)',
        },
        secondary: {
            main: '#FAEBD7',
        },
    },
});

export default theme;