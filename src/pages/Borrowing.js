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
import ORACLE_ABI from '../constants/oracle.json'
import { useAccount, useContract, useStarknetCall, useNetwork, useStarknetExecute } from '@starknet-react/core'
import { uint256ToBN , bnToUint256} from 'starknet/dist/utils/uint256';
import { toBN } from 'starknet/utils/number';

const eth_address = "0x066497152ef23b354d36d6ccdc4079a91c31175d013253d9a5824acee4700223"
const usdc_address = "0x03bc367398a09d9841456f63c8ec1bdf665846281897bdebd785120ba6915ebe"
const pool_address = "0x0766f200a452ad2ddc094da5be2be6a809156cf4a20ba0b3f8ef7e4a863037bb"
const oracle_address = "0x7493c23e1dcc78425471687b4a7a768b3dd7949f8758a66251673938992284e";
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


  
function EthBalance({ changeEthBalance }) {
    const BN = require('bn.js');
    const { contract } = useContract({
        address: eth_address,
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
    const dec = parseFloat("1000000000000000000")
    const final = bal/dec
    changeEthBalance(final)
    return (
        <p>{ final }</p>
    )
}



function CurrentCollateral({ changeCollateral }) {
    const BN = require('bn.js');
    const { contract } = useContract({
        address: pool_address,
        abi: POOL_ABI
      })
      const { address } = useAccount()
      const { data, loading, error, refresh } = useStarknetCall({
        contract,
        method: 'get_user_collateral',
        args: [address],
        options: {
          watch: false
        }
      })
    if (loading) return <span>Loading...</span>
    if (error) return <span>Error: {error}</span>
    const bal = parseFloat(uint256ToBN(data[0]).toString())
    const dec = parseFloat("1000000000000000000")
    const final = bal/dec
    changeCollateral(final)
    return (
        <p>{final}</p>
    )
}


function CurrentDebt({changeDebt}) {
    const BN = require('bn.js');
    const { contract } = useContract({
        address: pool_address,
        abi: POOL_ABI
      })
      const { address } = useAccount()
      const { data, loading, error, refresh } = useStarknetCall({
        contract,
        method: 'get_user_debt_value',
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
    changeDebt(final)
    return (
        <p>{final}</p>
    )
}


function CurrentRatio() {
    const BN = require('bn.js');
    const { contract } = useContract({
        address: pool_address,
        abi: POOL_ABI
      })
      const { address } = useAccount()
      const { data, loading, error, refresh } = useStarknetCall({
        contract,
        method: 'get_user_ratio',
        args: [address],
        options: {
          watch: false
        }
      })
    if (loading) return <span>Loading...</span>
    if (error) return <span>Error: {error}</span>
    const ratio = parseFloat(uint256ToBN(data[0]).toString())
    const final = ratio/min_liquidity
    return(<p>{final}</p>)
}

function FinalRatio({current_debt, collateral_amount, new_borrow}) {

    const BN = require('bn.js');
    const { contract } = useContract({
        address: oracle_address,
        abi: ORACLE_ABI
      })
      const { address } = useAccount()
      const { data, loading, error, refresh } = useStarknetCall({
        contract,
        method: 'eth_usd',
        args: [],
        options: {
          watch: false
        }
      })
    if (loading) return <span>Loading...</span>
    if (error) return <span>Error: {error}</span>
    if (isNaN(current_debt + new_borrow) || current_debt + new_borrow <= 0) return <span>0</span>
    const price = parseFloat(uint256ToBN(data[0]).toString())
    const dec = parseFloat("100000000")

    const ratio = price * collateral_amount/((parseFloat(current_debt) + parseFloat(new_borrow))*dec)

    return(<p>{ratio}</p>)
}


function AddCollateralButton({add_collateral_amount}){
    const calls = React.useMemo(() => {
        let coll_amount = Math.floor( add_collateral_amount*parseFloat("1000000000000000000") )
        const tx = {
            contractAddress: eth_address,
            entrypoint: 'approve',
            calldata: [pool_address, coll_amount, 0]
        }
        const tx2 = {
            contractAddress: pool_address,
            entrypoint: 'addCollateral',
            calldata: [ coll_amount, 0]
        }
            return Array(tx, tx2)
    }, [eth_address, pool_address, add_collateral_amount])
        
    const { execute } = useStarknetExecute({ calls })
      
    return(
        <Button variant="outlined" sx={ btsx } onClick={execute}>
            Add
        </Button>
    )
}


function RemoveCollateralButton({remove_collateral_amount}){
    const calls = React.useMemo(() => {
        let coll_amount = Math.floor( remove_collateral_amount*parseFloat("1000000000000000000") )
        const tx = {
            contractAddress: pool_address,
            entrypoint: 'removeCollateral',
            calldata: [ coll_amount, 0]
        }
        return Array(tx)
    }, [ pool_address, remove_collateral_amount])
        
    const { execute } = useStarknetExecute({ calls })
      
    return(
        <Button variant="outlined" sx={ btsx } onClick={execute}>
            Remove
        </Button>
    )
}


function BorrowButton({borrow_amount}){
    const calls = React.useMemo(() => {
        let usdc_amount = Math.floor( borrow_amount*parseFloat("1000000") )
        const tx = {
            contractAddress: pool_address,
            entrypoint: 'borrow',
            calldata: [ usdc_amount, 0]
        }
        return Array(tx)
    }, [ pool_address, borrow_amount])
        
    const { execute } = useStarknetExecute({ calls })
      
    return(
        <Button variant="outlined" sx={ btsx } onClick={execute}>
            Borrow
        </Button>
    )
}



function RepayButton({repay_amount}){
    const calls = React.useMemo(() => {
        let usdc_amount = Math.floor( repay_amount*parseFloat("1000000") )
        const tx = {
            contractAddress: usdc_address,
            entrypoint: 'approve',
            calldata: [pool_address, usdc_amount, 0]
        }
        const tx2 = {
            contractAddress: pool_address,
            entrypoint: 'repay',
            calldata: [ usdc_amount, 0]
        }
        return Array(tx, tx2)
    }, [ pool_address, repay_amount])
        
    const { execute } = useStarknetExecute({ calls })
      
    return(
        <Button variant="outlined" sx={ btsx } onClick={execute}>
            Repay
        </Button>
    )
}

export default function Borrowing() {

    const [eth_balance, set_eth_balance] = React.useState('0')
    const [collateral_amount, set_collateral_amount] = React.useState('0')
    const [debt_value, set_debt_value] = React.useState('0')
    const { status } = useAccount()


    const [current_page, setCurrent_page] = React.useState('1')

    const handleChangeCurrent_page = (event, newValue) => {
        setCurrent_page(newValue);
    };

    const title_style = {
        fontSize: "1.4rem",
        fontFamily: "Georgia",
    }




    const [add_collateral_amount, set_add_collateral_amount] = React.useState('0');
    const handleChangeAddCollateral = (newValue) => {
        set_add_collateral_amount(newValue);
    };

    const [remove_collateral_amount, set_remove_collateral_amount] = React.useState('0');
    const handleChangeRemoveCollateral = (newValue) => {
        set_remove_collateral_amount(newValue);
    };

    const [borrow_amount, set_borrow_amount] = React.useState('0');
    const handleChangeBorrowAmount = (newValue) => {
        set_borrow_amount(newValue);
    };

    const [repay_amount, set_repay_amount] = React.useState('0');
    const handleChangeRepayAmount = (newValue) => {
        set_repay_amount(newValue);
    };


    return (
        <Box sx={{ display: 'flex' , justifyContent: 'center', flexDirection: 'row', paddingTop: "150px", minWidth: "100%", minHeight: "200px" }}>
            <Box sx={{ display: 'flex' , justifyContent: 'center', flexDirection: 'column'}}>
                <Card sx={{ backgroundColor: "rgba(129, 115, 255, 0.5)", minWidth: "700px", maxWidth: "50%"}}>
                    <CardHeader titleTypographyProps = { title_style } title={"Borrowing Management"}/>
                    <CardContent>
                        <TabContext value={current_page}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChangeCurrent_page} aria-label="lab API tabs example">
                                <Tab label="Add Collateral" value="1" />
                                <Tab label="Remove Collateral" value="2" />
                                <Tab label="Borrow" value="3" />
                                <Tab label="Repay" value="4" />
                                </TabList>
                            </Box>



                            <TabPanel value="1">
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Balance:</h4>
                                    <EthBalance changeEthBalance={set_eth_balance}/>
                                </Box>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Current collateral: </h4>
                                    <CurrentCollateral changeCollateral={set_collateral_amount}/>
                                </Box>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Add</h4>
                                    <div>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            type="number"
                                            step="any"
                                            value={add_collateral_amount}
                                            onChange={(e) => handleChangeAddCollateral(e.target.value)}
                                        />
                                    </div>
                                </Box>
                                <Box>
                                    {
                                        status === 'disconnected' ? 
                                        <ConnectWalletButton sx= {{length: '1000px'}}/> :
                                        <AddCollateralButton add_collateral_amount = {add_collateral_amount} />
                                    }
                                </Box>
                            </Stack>
                            </TabPanel>
                            
                            


                            <TabPanel value="2">
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Collateral amount: </h4>
                                    <CurrentCollateral changeCollateral={set_collateral_amount}/>
                                </Box>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Remove</h4>
                                    <div>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            type="number"
                                            step="any"
                                            value={remove_collateral_amount}
                                            onChange={(e) => handleChangeRemoveCollateral(e.target.value)}
                                        />
                                    </div>
                                </Box>
                                <Box>
                                    {
                                        status === 'disconnected' ? 
                                        <ConnectWalletButton sx= {{length: '1000px'}}/> :
                                        < RemoveCollateralButton remove_collateral_amount={remove_collateral_amount} />
                                    }
                                </Box>
                            </Stack>
                            </TabPanel>




                            <TabPanel value="3">
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Current debt: </h4>
                                    <CurrentDebt changeDebt={set_debt_value}/>
                                </Box>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Current ratio: </h4>
                                    <CurrentRatio/>
                                </Box>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Borrow</h4>
                                    <div>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            type="number"
                                            step="any"
                                            value={borrow_amount}
                                            onChange={(e) => handleChangeBorrowAmount(e.target.value)}
                                        />
                                    </div>
                                </Box>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Final ratio: </h4>
                                    <FinalRatio current_debt={debt_value} collateral_amount={collateral_amount} new_borrow={borrow_amount}/>
                                </Box>
                                <Box>
                                    {
                                        status === 'disconnected' ? 
                                        <ConnectWalletButton sx= {{length: '1000px'}}/> :
                                        < BorrowButton  borrow_amount = {borrow_amount} />
                                    }
                                </Box>
                            </Stack>
                            </TabPanel>




                            <TabPanel value="4">
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Current debt: </h4>
                                    <CurrentDebt changeDebt={set_debt_value}/>
                                </Box>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Current ratio: </h4>
                                    <CurrentRatio/>
                                </Box>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Repay</h4>
                                    <div>
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            type="number"
                                            step="any"
                                            value={repay_amount}
                                            onChange={(e) => handleChangeRepayAmount(e.target.value)}
                                        />
                                    </div>
                                </Box>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Final ratio: </h4>
                                    <FinalRatio current_debt={debt_value} collateral_amount={collateral_amount} new_borrow={borrow_amount}/>
                                </Box>
                                <Box>
                                    {
                                        status === 'disconnected' ? 
                                        <ConnectWalletButton sx= {{length: '1000px'}}/> :
                                        < RepayButton  repay_amount = {repay_amount} />
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