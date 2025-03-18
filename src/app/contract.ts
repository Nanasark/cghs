import { tokenAbi } from "./abi";
import { getContract } from "thirdweb";
import {chain } from "./chain"
import {client} from "./client"


export const tokencontract = getContract({
    address: "0xf85aab5cd1029c8b3f765e4d3e5c871843e25740",
    chain: chain,
    client: client,
    abi: tokenAbi,
});