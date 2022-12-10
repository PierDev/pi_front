import React from "react";
import Button from '@mui/material/Button';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAccount, useConnectors, } from '@starknet-react/core'
import { Stack } from '@mui/system';
import Box from '@mui/material/Box';


const btsx = {
  border: "2px solid white", 
  backgroundColor: "rgba(130, 120, 254, 0.8)",
  color: "white",
  "&:hover": {
    border: "1px solid white",
    color: 'white',
    backgroundColor: 'rgb(130, 120, 254)'
  },
  overflow: "hidden",
  maxWidth: "200px",
};

function shortenAddress(address) {
  return address.substring(0, 6).concat('...', address.substring(60))
}

export default function ConnectWalletButton() {


    const [open, setOpen] = React.useState(false);
    
    const handleClickToOpen = () => {
      setOpen(true);
    };
    
    const handleToClose = () => {
      setOpen(false);
    };
    
    const { address, status } = useAccount()
    if (status === 'disconnected') return (
        <>
            <Button variant="outlined" sx={ btsx } onClick={handleClickToOpen}>
                Connect Wallet
            </Button>
            <Dialog PaperProps={{ style: {backgroundColor: "rgb(129, 115, 255)"} }} open={open} onClose={handleToClose}>
                <DialogTitle>{"Connect to a wallet"}</DialogTitle>
                <DialogContent>
                    <ConnectWalletDialog></ConnectWalletDialog>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleToClose} 
                            color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
    return (
      <>
          <Button variant="outlined" sx={ btsx } onClick={handleClickToOpen}>
              {shortenAddress(address)}
          </Button>
          <Dialog PaperProps={{ style: {backgroundColor: "rgb(129, 115, 255)"} }} open={open} onClose={handleToClose}>
              <DialogTitle>{"Current Wallet"}</DialogTitle>
              <DialogContent>
                  <ConnectWalletDialog></ConnectWalletDialog>
              </DialogContent>
              <DialogActions>
                  <Button onClick={handleToClose} 
                          color="primary" autoFocus>
                      Close
                  </Button>
              </DialogActions>
          </Dialog>
      </>
  )
}



function ConnectWalletDialog() {
    const { connectors, connect, disconnect } = useConnectors()
    
    const { address, status } = useAccount()
    if (status === 'disconnected') return(
      <Stack spacing={2}>
        {connectors.map((connector) => (
          <Box key={connector.id()}>
            <Button variant="outlined" sx={ btsx } onClick={() => connect(connector)}>
              Connect {connector.id()}
            </Button>
          </Box>
        ))}
      </Stack>
    )
    return (
      <>
        <p>Account: {address}</p>
        <Button variant="outlined" sx={ btsx } onClick={() => disconnect(true) }>
            Disconnect
        </Button>
      </>
    )
}