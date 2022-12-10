import ERC20_ABI from '../constants/erc20.json'
import { useAccount, useContract, useStarknetCall } from '@starknet-react/core'


export default function useCallContract() {
    const { contract } = useContract({
      address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
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
  
    if (error) return ("rro")
    return (
    data, loading
    )
  }

