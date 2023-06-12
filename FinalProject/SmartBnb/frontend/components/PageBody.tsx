import { useSigner, useNetwork } from "wagmi";
import { useState, useEffect } from "react";
import { getSmartBnbContract } from "../assets/utils";
import Home from "../components/home";
import { ethers } from "ethers";

export default function PageBody() {
  const { data: signer } = useSigner();
  const [smartBnbContract, setSmartBnbContract] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const { chain, chains } = useNetwork();

  useEffect(() => {
    if (signer && chain) {
      const smartBnbContract = getSmartBnbContract(signer, chain);
      setSmartBnbContract(smartBnbContract);
      (async () => {
        const walletAddress = await signer.getAddress();
        setWalletAddress(walletAddress);
      })();
    }
  }, [signer, chain]);

  if (!walletAddress)
    return (
      <p style={{ color: "red", fontWeight: "bold" }}> Please connect wallet </p>
    );
  return (
    <>
      <Home></Home>
    </>
  );
}
