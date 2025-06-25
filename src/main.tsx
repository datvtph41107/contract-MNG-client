// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import GlobalStyles from "./components/GlobalStyles/GlobalStyles.tsx";
import { ContractProvider } from "./contexts/ContractContext.tsx";

createRoot(document.getElementById("root")!).render(
    // <StrictMode>
    <ContractProvider>
        <GlobalStyles>
            <App />
        </GlobalStyles>
    </ContractProvider>,
    // </StrictMode>,
);
