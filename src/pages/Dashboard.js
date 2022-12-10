import * as React from 'react';
import { CardHeader } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, Stack } from '@mui/system';
import POOL_ABI from '../constants/pool.json';
import ERC20_ABI from '../constants/erc20.json';
import ConnectWalletButton from "../wallet/ConnectWalletButton";

import { useAccount, useContract, useStarknetCall } from '@starknet-react/core'
import { uint256ToBN } from 'starknet/dist/utils/uint256';


const pool_address = "0x03a9c165ed3a1253202c2102f1a88e25142d3ba4649f85d73ac03ae8e6d64cca";
const pi_token_address = "0x78fb14cdcfed40c2472fb83043889abda8d3152dd7bd5deb84f46dd75d99cf2";
const min_liquidity = 1000000


function TotalSupplied({ ChangeTotalSupplied }) {
    const { contract } = useContract({
        address: pool_address,
        abi: POOL_ABI
      })
      const { data, loading, error } = useStarknetCall({
        contract,
        method: 'get_total_usdc_deposit',
        args: [],
        options: {
          watch: false
        }
      })
    if (loading) return <span>Loading...</span>
    if (error) return <span>Error: {error}</span>
    const bal = parseFloat(uint256ToBN(data[0]).toString())
    const dec = parseFloat("1000000")
    const final = bal/dec
    ChangeTotalSupplied(final)
    return (
        <p>{final}</p>
    )
}


function CurrentAPR({ current_rate, total_borrow, total_supply }) {
    const apr = current_rate*total_borrow/total_supply
    return (
        <p>{apr}</p>
    )
}


function TotalBorrowed({ ChangeTotalBorrow }) {
    const { contract } = useContract({
        address: pool_address,
        abi: POOL_ABI
      })
      const { data, loading, error } = useStarknetCall({
        contract,
        method: 'get_total_usdc_due',
        args: [],
        options: {
          watch: false
        }
      })
    if (loading) return <span>Loading...</span>
    if (error) return <span>Error: {error}</span>
    const bal = parseFloat(uint256ToBN(data[0]).toString())
    const dec = parseFloat("1000000")
    const final = bal/dec
    ChangeTotalBorrow(final)
    return (
        <p>{final}</p>
    )
}

function CurrentRate({ ChangeCurrentRate }) {
    const { contract } = useContract({
        address: pool_address,
        abi: POOL_ABI
      })
      const { data, loading, error } = useStarknetCall({
        contract,
        method: 'get_current_rate',
        args: [],
        options: {
          watch: false
        }
      })
    if (loading) return <span>Loading...</span>
    if (error) return <span>Error: {error}</span>
    const bal = parseFloat(uint256ToBN(data[0]).toString())
    const final = bal/min_liquidity
    ChangeCurrentRate(final)
    return (
        <p>{final}</p>
    )
}

function ReserveUsage() {
  const { contract } = useContract({
      address: pool_address,
      abi: POOL_ABI
    })
    const { data, loading, error } = useStarknetCall({
      contract,
      method: 'get_reserve_usage',
      args: [],
      options: {
        watch: false
      }
    })
  if (loading) return <span>Loading...</span>
  if (error) return <span>Error: {error}</span>
  const bal = parseFloat(uint256ToBN(data[0]).toString())
  const final = bal/min_liquidity*100
  return (
      <p>{final}%</p>
  )
}

function CurrentDeposit() {
    const { contract } = useContract({
        address: pool_address,
        abi: POOL_ABI
      })
      const { address } = useAccount()
      const { data, loading, error } = useStarknetCall({
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
    const { contract } = useContract({
        address: pi_token_address,
        abi: ERC20_ABI
      })
      const { address } = useAccount()
      const { data, loading, error } = useStarknetCall({
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



function CurrentCollateral() {
    const { contract } = useContract({
        address: pool_address,
        abi: POOL_ABI
      })
      const { address } = useAccount()
      const { data, loading, error } = useStarknetCall({
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
    return (
        <p>{final}</p>
    )
}


function CurrentDebt() {
    const { contract } = useContract({
        address: pool_address,
        abi: POOL_ABI
      })
      const { address } = useAccount()
      const { data, loading, error } = useStarknetCall({
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
    return (
        <p>{final}</p>
    )
}


function CurrentRatio() {
    const { contract } = useContract({
        address: pool_address,
        abi: POOL_ABI
      })
      const { address, status } = useAccount()
      const { data, loading, error } = useStarknetCall({
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


export default function Dashboard() {
    const title_style = {
        fontSize: "1.4rem",
        fontFamily: "Georgia",
    }

    const { status } = useAccount()


    const [current_rate, set_current_rate] = React.useState('0')
    const [total_borrow, set_total_borrow] = React.useState('0')
    const [total_supply, set_total_supply] = React.useState('0')


    return (
        <Box sx={{ display: 'flex' , justifyContent: 'center', flexDirection: 'column'}}>
            <Box sx={{ display: 'flex' , justifyContent: 'center', flexDirection: 'row', paddingTop: "150px", minWidth: "100%", minHeight: "200px" }}>
                <Card sx={{ margin: '25px', backgroundColor: "rgba(129, 115, 255, 0.5)", minWidth: "700px", maxWidth: "50%"}}>
                    <CardHeader titleTypographyProps = { title_style } title={"Reserve status "}/>
                    <CardContent>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                <h3>Supply info </h3>
                            </Box>
                            <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                <h4>Total supplied: </h4>
                                <TotalSupplied ChangeTotalSupplied={set_total_supply}/>
                            </Box>
                            <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                <h4>Current APR: </h4>
                                <CurrentAPR current_rate={current_rate} total_borrow={total_borrow} total_supply={total_supply}/>
                            </Box>
                            <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                <h3>Borrow info </h3>
                            </Box>
                            <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                <h4>Total Borrowed: </h4>
                                <TotalBorrowed ChangeTotalBorrow={set_total_borrow}/>
                            </Box>
                            <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                <h4>Current rate: </h4>
                                <CurrentRate ChangeCurrentRate={set_current_rate}/>
                            </Box>
                            <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                <h4>Reserve usage: </h4>
                                <ReserveUsage />
                            </Box>
                        </Stack>
                </CardContent>
            </Card>
            <Card sx={{ margin: '25px', backgroundColor: "rgba(129, 115, 255, 0.5)", minWidth: "700px", maxWidth: "50%"}}>
                    <CardHeader titleTypographyProps = { title_style } title={"Your info"}/>
                    <CardContent>
                        {
                            status === 'disconnected' ? 
                            <ConnectWalletButton sx= {{length: '1000px'}}/> :
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h3>Supply info </h3>
                                </Box>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Already deposit: </h4>
                                    <CurrentDeposit/>
                                </Box>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>pi balance: </h4>
                                    <PiBalance/>
                                </Box>

                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h3>Borrow info </h3>
                                </Box>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Collateral amount: </h4>
                                    <CurrentCollateral />
                                </Box>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Current debt: </h4>
                                    <CurrentDebt/>
                                </Box>
                                <Box sx={{ display: 'flex' , justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <h4>Current ratio: </h4>
                                    <CurrentRatio/>
                                </Box>
                            </Stack>
                        }
                    </CardContent>
                </Card>
            </Box>
        </Box>
    )


}