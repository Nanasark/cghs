"use client"
import {client} from "@/app/client"
import { ConnectButton } from "thirdweb/react";
import {inAppWallet} from "thirdweb/wallets"
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
