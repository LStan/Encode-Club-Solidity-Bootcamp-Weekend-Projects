import styles from "../styles/InstructionsComponent.module.css";
import { useSigner, useBlockNumber } from "wagmi";
import { useState, useEffect } from "react";
import contractJson from "../assets/Lottery.json";
import { ethers } from "ethers";

const contractAddress = "0x40d3989CF95885f6456aCe44beC69Ac198Eb06F9";
const tokenAddress = "0x2545A4069DE81cd1f20569946B6023998Cf4A7DA";

export default function InstructionsComponent() {
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <h1>Lottery dApp</h1>
      </header>
      <div className={styles.buttons_container}>
        <PageBody></PageBody>
      </div>
      <div className={styles.footer}>Footer</div>
    </div>
  );
}

function PageBody() {
  return (
    <>
      <ContractAddress></ContractAddress>
      <CheckState></CheckState>
      <OpenBets></OpenBets>
    </>
  );
}

function ContractAddress() {
  const { data: signer } = useSigner();
  return (
    <>
      <h1>This contract is on Goerli Testnet</h1>
      <p>Ballot contract address: {contractAddress}</p>
      <p>Token contract address: {tokenAddress}</p>
      {console.log(signer)}
    </>
  );
}

function CheckState() {
  const [currentBlockDate, setCurrentBlockDate] = useState();
  const [closingTimeDate, setClosingTimeDate] = useState();
  const [check, setCheck] = useState();
  const [contract, setContract] = useState();
  const [isLoading, setLoading] = useState();
  const { data: signer } = useSigner();

  useEffect(() => {
    if (signer) {
      const contract = new ethers.Contract(contractAddress, contractJson.abi, signer.provider);
      setContract(contract);
    }
  }, [signer]);

  async function getCheckState() {
    setLoading(true);
    const state = await contract.connect(signer).betsOpen();
    setCheck(state);
    const provider = contract.provider;
    const currentBlock = await provider.getBlock("latest");
    const currentBlockDate = new Date(currentBlock.timestamp * 1000);
    setCurrentBlockDate(currentBlockDate);
    const closingTime = await contract.connect(signer).betsClosingTime();
    const closingTimeDate = new Date(closingTime.toNumber() * 1000);
    setClosingTimeDate(closingTimeDate);
    setLoading(false);
  }

  return (
    <>
      <h3>Query State</h3>
      {!signer ? (
        <p style={{ color: "red", fontWeight: "bold" }}> Please connect wallet</p>
      ) : (
        <button onClick={() => { getCheckState(); }}>
          {isLoading ? `Checking status...` : `Check`}
        </button>
      )}
      {isLoading}
      {check === undefined ? null : (
        <>
          {check ? (
            <>
              <h1>The lottery is open!!!</h1>
              <h1>The last block was mined at{" "}
                {currentBlockDate.toLocaleDateString()} :{" "} {currentBlockDate.toLocaleTimeString()}
              </h1>
              <h1>Lottery should close at{" "} 
                {closingTimeDate.toLocaleDateString()} :{" "} {closingTimeDate.toLocaleTimeString()}
              </h1>
            </>
          ) : (
            <h1>The lottery is closed !!!</h1>
          )}
        </>
      )}
    </>
  );
}

function OpenBets() {
  const [txData, setTxData] = useState();
  const [contract, setContract] = useState();
  const [isLoading, setLoading] = useState();
  const [duration, setDuration] = useState();
  const { data: signer } = useSigner();
  const handleChange = (event) => {
	  setDuration(event.target.value);
	};

  useEffect(() => {
    if (signer) {
      const contract = new ethers.Contract(contractAddress, contractJson.abi, signer.provider);
      setContract(contract);
    }
  }, [signer]);

  async function setOpenBets() {
    setLoading(true);
    const provider = contract.provider;
    const currentBlock = await provider.getBlock("latest");
    const tx = await contract.connect(signer).openBets(currentBlock.timestamp + Number(duration));
    const data = await tx.wait();
    setTxData(data);
    setLoading(false);
  }

  return (
    <>
      <h3>Open Bets</h3>
      {!signer ? (
        <p style={{ color: "red", fontWeight: "bold" }}> Please connect wallet</p>
      ) : (
        <>
          <p>Enter duration:</p>
          <input type="text" id="address" name="address" onChange={handleChange} value={duration} />
          <button onClick={() => { setOpenBets(); } }>
            {isLoading ? `Wait till the transaction to be completed` : `Open`}
          </button>
        </>
      )}
      {isLoading}
      {txData === undefined ? null : (
        <>
          <div>
            <p>Transaction completed!</p>
            <a href={"https://goerli.etherscan.io/tx/" + txData.transactionHash} target="_blank"> 
              {txData.transactionHash}
            </a>
          </div>
        </>
      )}
    </>
  );  
}
