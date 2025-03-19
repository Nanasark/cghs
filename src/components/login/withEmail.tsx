"use client"
import {client} from "@/app/client"
import { ConnectButton } from "thirdweb/react";
import {inAppWallet} from "thirdweb/wallets"
import {chain, chainId} from "@/app/chain"
interface Email{
    label:string
}
export default function EmailLogin({label}: Email) {
  return (
    <div className="flex items-center">
          <ConnectButton
              client={client} 
                wallets={[inAppWallet({
                    auth:{options:["email"]}
                })]}
                  chain={chain}
        supportedTokens={{
          [chainId]: [
            {
              name: "GHS Coin",
              address: "0xf85aab5cd1029c8b3f765e4d3e5c871843e25740",
              symbol: "CGHS",
             icon:""
            },
          ],
        }}
              theme={"light"}
              connectButton={{
                  className: "email-wallet",
                  label: label,
                  style: {
                      background: "#059669",
                      alignItems: "center",
                      position: "relative",
                      height: "38px",
                     width:"106.4px"
                  }
              }}
          />
    </div>
  );
}
