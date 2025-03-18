"use client"
import { useSendTransaction } from "thirdweb/react"
import {  transfer } from "thirdweb/extensions/erc20"
import { tokencontract } from "@/app/contract"


export function useLandContract() {



// isError:isApprovalError, isSuccess:isApprovalSuccess ,status: approvalStatus
  const {mutateAsync:transferrall,} = useSendTransaction()
  const TransferERC = async ( amount:number): Promise<string | boolean> => {
    try {
     const transaction = transfer({


  contract:tokencontract,
  to: "0x4d5b32865fa866bb3aee61c8da61e80e2d1f25c7",
  amount: amount,
});

        const transferToken = await transferrall(transaction)
        console.log(transferToken)
      
        if (transferToken.transactionHash) {
        return transferToken.transactionHash
      }

      return !!transferToken.transactionHash

    } catch (error) {
      console.error("Failed to approve tokens:", error)
      return false
    }
    }
    


  return {
    TransferERC,

  }
}
