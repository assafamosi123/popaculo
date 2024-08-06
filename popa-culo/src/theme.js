import { createTheme } from '@mui/material/styles';


// ייבוא הפונט דרך Google Fonts
const theme = createTheme({
    typography: {
        fontFamily: "'Julius Sans One', sans-serif",
        h6: {
            fontSize: '1.25rem',
        },
        body1: {
            fontSize: '1rem',
        },
    },
    palette: {
        primary: {
            main: 'rgba(200, 160, 130, 0.6)',
        },
        secondary: {
            main: '#FAEBD7',
        },
    },
});

export default theme;