import Navbar from "./Navbar";
import Borrowing from "./pages/Borrowing";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import { Route, Routes, Navigate } from "react-router-dom"
import { myTheme } from "./css/themes"
import { ThemeProvider } from "@emotion/react";
import { StarknetConfig, InjectedConnector } from '@starknet-react/core'


export default function App() {
  const connectors = [
    new InjectedConnector({ options: { id: 'braavos' }}),
    new InjectedConnector({ options: { id: 'argentX' }}),
  ]
  return (
    <StarknetConfig connectors={connectors}>
        <ThemeProvider theme = {myTheme}>
        <Navbar/>
        <Routes>
          <Route path='/' element={ <Navigate to="/dashboard" /> }/>
          <Route path = "/dashboard" element={<Dashboard/>}/>
          <Route path = "/deposit" element={<Deposit/>}/>
          <Route path = "/borrowing" element={<Borrowing/>}/>
        </Routes>
      </ThemeProvider>
    </StarknetConfig>
  )
}


