import { useSigner, useNetwork } from "wagmi";
import { useState, useEffect } from "react";
import { getSmartBnbContract } from "../assets/utils";
import Home from "../components/Home";

export default function PageBody() {
  const { data: signer } = useSigner();
  const [smartBnbContract, setSmartBnbContract] = useState();
  const [walletAddress, setWalletAddress] = useState();
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
