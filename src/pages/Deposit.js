import * as React from 'react';
import { Button, CardHeader,  createStyles,  TextField } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box } from '@mui/system';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Stack } from '@mui/system';
import ConnectWalletButton from "../wallet/ConnectWalletButton";
import ERC20_ABI from '../constants/erc20.json'
import POOL_ABI from '../constants/pool.json'
import { useAccount, useContract, useStarknetCall, useNetwork, useStarknetExecute } from '@starknet-react/core'
import { uint256ToBN } from 'starknet/dist/utils/uint256';


const eth_address = "0x066497152ef23b354d36d6ccdc4079a91c31175d013253d9a5824acee4700223"
const usdc_address = "0x03bc367398a09d9841456f63c8ec1bdf665846281897bdebd785120ba6915ebe"
const pool_address = "0x0766f200a452ad2ddc094da5be2be6a809156cf4a20ba0b3f8ef7e4a863037bb"
const pi_token_address = "0x5d8746c4d01fd6fd48fff911d0deda77826398be65b8a08441895b71ad2a716"
const debt_token = "0x4a076394d2d4ebaf1ba2d18769a575f10dbebfb07b3d9eee58b526b4b9ce23a"
const oracle_address = "0x7493c23e1dcc78425471687b4a7a768b3dd7949f8758a66251673938992284e"
const min_liquidity = 1000000

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



function Balance() {
    const BN = require('bn.js');
    const { contract } = useContract({
        address: usdc_address,
        abi: ERC20_ABI
      })
      const { address } = useAccount()
      const { data, loading, error, refresh } = useStarknetCall({
        contract,
        method: 'balanceOf',
        args: [address],
        options: {
          watch: false
        }
      })
    if (loading) return <span>Loading...</span>
    if (error) return <span>Error: {error}</span>
    const bal = parseFloat(uint256ToBN(data[0]).toString())
    const dec = parseFloat("1000000")
    const final = bal/dec
    return (
        <p>{ final }</p>
    )
}

function CurrentDeposit() {
    const BN = require('bn.js');
    const { contract } = useContract({
        address: pool_address,
        abi: POOL_ABI
      })
      const { address } = useAccount()
      const { data, loading, error, refresh } = useStarknetCall({
        contract,
        method: 'get_user_deposit_value',
        args: [address],
        options: {
          watch: false
        }
      })
    if (loading) return <span>Loading...</span>
    if (error) return <span>Error: {error}</span>
    const bal = parseFloat(uint256ToBN(data[0]).toString())
    const dec = parseFloat("1000000")
    const final = bal/dec
    return (
        <p>{final}</p>
    )
}

function PiBalance() {
    const BN = require('bn.js');
    const { contract } = useContract({
        address: pi_token_address,
        abi: ERC20_ABI
      })
      const { address } = useAccount()
      const { data, loading, error, refresh } = useStarknetCall({
        contract,
        method: 'balanceOf',
        args: [address],
        options: {
          watch: false
        }
      })
    if (loading) return <span>Loading...</span>
    if (error) return <span>Error: {error}</span>
    const bal = parseFloat(uint256ToBN(data[0]).toString())
    const dec = parseFloat("100000000")
    const final = bal/dec
    return (
        <p>{final}</p>
    )
}




function DepositButton({deposit_amount}) {
    const calls = React.useMemo(() => {
        const tx = {
            contractAddress: usdc_address,
            entrypoint: 'approve',
            calldata: [pool_address, Math.floor( deposit_amount*1000000 ), 0]
        }
        const tx2 = {
            contractAddress: pool_address,
            entrypoint: 'deposit',
            calldata: [ Math.floor( deposit_amount*1000000 ), 0]
        }
            return [tx, tx2]
    }, [usdc_address, pool_address, deposit_amount])
    
    const { execute } = useStarknetExecute({ calls })
 
    return(
        <Button variant="outlined" sx={ btsx } onClick={execute}>
            Deposit
        </Button>
    )
}


function WithdrawButton({withdraw_amount}) {
    const calls = React.useMemo(() => {
        const tx = {
            contractAddress: pi_token_address,
            entrypoint: 'approve',
            calldata: [pool_address, Math.floor( withdraw_amount*100000000 ), 0]
        }
        const tx2 = {
            contractAddress: pool_address,
            entrypoint: 'withdraw',
            calldata: [ Math.floor( withdraw_amount*100000000 ), 0]
        }
            return Array(tx, tx2)
    }, [pi_token_address, pool_address, withdraw_amount])
        
    const { execute } = useStarknetExecute({ calls })
 
    return(
        <Button variant="outlined" sx={ btsx } onClick={execute}>
            Withdraw
        </Button>
    )
}




export default function Deposit() {

    const [value, setValue] = React.useState('1');
    const { status } = useAccount()

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const title_style = {
        fontSize: "1.4rem",
        fontFamily: "Georgia",
    }

    const [deposit_amount, set_deposit_amount] = React.useState('0');
    const handleChangeDeposit = (newValue) => {
        set_deposit_amount(newValue);
    };
   
      

    const [withdraw_amount, set_withdraw_amount] = React.useState('0');
    const handleChangeWithdraw = (newValue) => {
        set_withdraw_amount(newValue);
    };




    return (
        <Box sx={{ display: 'flex' , justifyContent: 'center', flexDirection: 'row', paddingTop: "150px", minWidth: "100%", minHeight: "150px" }}>
            <Box sx={{ display: 'flex' , justifyContent: 'center', flexDirection: 'column'}}>
                <Card sx={{ backgroundColor: "rgba(129, 115, 255, 0.5)", minWidth: "500px", maxWidth: "50%"}}>
                    <CardHeader titleTypographyProps = { title_style } title={"Deposit Management"}/>
                    <CardContent>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Deposit" value="1" />
                                <Tab label="Withdraw" value="2" />
                                </TabList>
                            </Box>






                            <TabPanel value="1">
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Balance:</h4>
                                    <Balance/>
                                </Box>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Already deposit: </h4>
                                    <CurrentDeposit/>
                                </Box>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Deposit</h4>
                                    <div>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            type="number"
                                            step="any"
                                            value={deposit_amount}
                                            onChange={(e) => handleChangeDeposit(e.target.value)}
                                        />
                                        {/* <Button sx = {{ height: '40px' }} variant="outlined"  onClick={handleChangeDeposit()}>
                                            Max
                                        </Button>                */}
                                    </div>
                                </Box>
                                <Box>
                                    {
                                        status === 'disconnected' ? 
                                        <ConnectWalletButton sx= {{length: '1000px'}}/> :
                                        <DepositButton deposit_amount = {deposit_amount}/>
                                    }
                                </Box>
                            </Stack>
                            </TabPanel>









                            <TabPanel value="2">
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Deposit value: </h4>
                                    <CurrentDeposit/>
                                </Box>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>pi balance: </h4>
                                    <PiBalance/>
                                </Box>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Withdraw</h4>
                                    <div>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            type="number"
                                            step="any"
                                            value={withdraw_amount}
                                            onChange={(e) => handleChangeWithdraw(e.target.value)}
                                        />
                                        {/* <Button sx = {{ height: '40px' }} variant="outlined"  onClick={handleChangeWithraw()}>
                                            Max
                                        </Button>                */}
                                    </div>
                                </Box>
                                <Box>
                                    {
                                        status === 'disconnected' ? 
                                        <ConnectWalletButton sx= {{length: '1000px'}}/> :
                                        <WithdrawButton withdraw_amount={withdraw_amount}/>
                                    }
                                </Box>
                            </Stack>
                            </TabPanel>



                        </TabContext>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    )
}