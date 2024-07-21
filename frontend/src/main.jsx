import ReactDOM from 'react-dom/client';
import { mode } from '@chakra-ui/theme-tools';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { extendTheme } from "@chakra-ui/theme-utils";
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { RecoilRoot } from 'recoil';
import ErrorBoundary from './errorBoundary/ErrorBoundary.jsx'; 
import { SocketContextProvider } from './context/socketContext.jsx';

const styles = {
    global: (props) => ({
        body: {
            color: mode("gray.800", "whiteAlpha.900")(props),
            background: 'url(https://wallpapercave.com/wp/wp10478294.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
        },
    }),
};

// https://images6.alphacoders.com/132/thumb-1920-1323940.jpeg

const config = {
    initialColorMode: "dark",
    useSystemColorMode: true
};

const colors = {
    gray: {
        light: "#1e1e1e",
        dark: "#1e1e1e"
    }
};

const theme = extendTheme({ config, styles, colors });

ReactDOM.createRoot(document.getElementById('root')).render(
    <RecoilRoot>
        <BrowserRouter>
            <ChakraProvider theme={theme}>
                <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                <SocketContextProvider>
                    <ErrorBoundary>
                        <App />
                    </ErrorBoundary>
                </SocketContextProvider>
            </ChakraProvider>
        </BrowserRouter>
    </RecoilRoot>
);
