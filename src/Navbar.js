import { Link, useMatch, useResolvedPath } from "react-router-dom"
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import { Toolbar } from "@mui/material";
import ConnectWalletButton from "./wallet/ConnectWalletButton";

const nav_style = {
    fontSize: "1.5rem",
    fontFamily: "Georgia",
    fontWeight: "bold",

}
const select_style = {
    textDecoration: "underline rgb(245, 245, 245)",
    textUnderlineOffset: "20%",
    textDecorationThickness: "20%",
    fontSize: "1.5rem",
    fontFamily: "Georgia",
    fontWeight: "bold",

}

export default function Navbar() {
  return (
    <AppBar position="static" color="transparent">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Button style = {nav_style} component={Link} to="/">
                PI Protocol
            </Button>
            <div>
                <CustomLink to="/dashboard">Dashboard</CustomLink>
                <CustomLink to="/deposit">Deposit</CustomLink>
                <CustomLink to="/borrowing">Borrowing</CustomLink>
            </div>
            <ConnectWalletButton/>

        </Toolbar>
    </AppBar>
  )
}

function CustomLink({ to, children}) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })

    
    return (
        <Button style={isActive ? select_style : nav_style} component={Link} to={to} >{children}</Button>
        
    )
}