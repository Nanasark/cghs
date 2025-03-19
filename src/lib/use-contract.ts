"use client"
// import { useSendTransaction } from "thirdweb/react"
// import {  transfer } from "thirdweb/extensions/erc20"
import { tokencontract } from "@/app/contract"
import { PreparedTransaction, prepareContractCall, toWei} from "thirdweb"
import { useSendAndConfirmTransaction } from "thirdweb/react";




// export function useLandContract() {


//   const { mutateAsync: sendAndConfirmTx, data: transactionReceipt, } =
//   useSendAndConfirmTransaction();
// // isError:isApprovalError, isSuccess:isApprovalSuccess ,status: approvalStatus
//   // const {mutateAsync:transferrall, data,failureReason,context,variables} = useSendTransaction()
//   const TransferERC = async ( amount:number): Promise<string | boolean> => {
//     try {
//         //     const transaction = transfer({


//         //   contract:tokencontract,
//         //   to: "0x4d5b32865fa866bb3aee61c8da61e80e2d1f25c7",
//         //   amount: amount,
//         // });

        

//         const transaction = prepareContractCall({
//           contract:tokencontract,
//           method:"transfer",
//           params:["0x4d5b32865fa866bb3aee61c8da61e80e2d1f25c7", toWei(`${amount}`)]
//         }) as PreparedTransaction

//         const transferToken =await sendAndConfirmTx(transaction);
//         // const transferToken = await transferrall(transaction)
//         console.log(transferToken)
//         // console.log("data:",data?.transactionHash)
//         // console.log(context)
//         // console.log("failure reason", failureReason)
//         // console.log("inWei:",toWei(`${amount}`), "amount:", amount)
      
//       //   if (transferToken.transactionHash) {
//       //   return transferToken.transactionHash
//       // }

//       if (transactionReceipt) {
//         return transactionReceipt.transactionHash
//       }

//       console.log(transactionReceipt)



//       // return !!transferToken.transactionHash
//       return !!transferToken.transactionHash

//     } catch (error) {
//       console.error("Failed to transfer tokens:", error)
//       // console.log(failureReason)
//       // console.log(data)
//       return false
//     }
//     }
    


//   return {
//     TransferERC,

//   }
// }
export function useLandContract() {
  const { mutateAsync: sendAndConfirmTx } = useSendAndConfirmTransaction();

  const TransferERC = async (amount: number): Promise<string | false> => {
    try {
      const transaction = prepareContractCall({
        contract: tokencontract, 
        method: "transfer",
        params: ["0x4d5b32865fa866bb3aee61c8da61e80e2d1f25c7", toWei(`${amount}`)],
      }) as PreparedTransaction;

      const transferToken = await sendAndConfirmTx(transaction);

      console.log("Transfer Response:", transferToken);

      if (transferToken?.transactionHash) {
        return transferToken.transactionHash;
      }

      console.warn("Transaction did not return a hash.");
      return false;
    } catch (error) {
      console.error("Failed to transfer tokens:", JSON.stringify(error, null, 2));
      return false;
    }
  };

  return { TransferERC };
}
