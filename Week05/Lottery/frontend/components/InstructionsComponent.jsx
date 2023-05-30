import styles from "../styles/InstructionsComponent.module.css";
import { useSigner } from "wagmi";
import { useState, useEffect } from "react";
import contractJson from "../assets/Lottery.json";
import tokenJson from "../assets/LotteryToken.json";
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
      <div className={styles.footer}>Group 4</div>
    </div>
  );
}

function PageBody() {
  return (
    <>
      <CheckState></CheckState>
      <OpenBets></OpenBets>
      <BuyTokens></BuyTokens>
      <TokenBalance></TokenBalance>
      <Bet></Bet>
      <CloseLottery></CloseLottery>
      <Prize></Prize>
      <Claim></Claim>
      <Pool></Pool>
      <Withdraw></Withdraw>
      <Burn></Burn>
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
    console.log(state);
    setCheck(state);
    const provider = contract.provider;
    const currentBlock = await provider.getBlock("latest");
    const currentBlockDate = new Date(currentBlock.timestamp * 1000);
    console.log(currentBlockDate);
    setCurrentBlockDate(currentBlockDate);
    const closingTime = await contract.connect(signer).betsClosingTime();
    const closingTimeDate = new Date(closingTime.toNumber() * 1000);
    console.log(closingTimeDate);
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
          <input type="text" id="duration" name="duration" onChange={handleChange} value={duration} />
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

function BuyTokens() {
  const [txData, setTxData] = useState();
  const [contract, setContract] = useState();
  const [isLoading, setLoading] = useState();
  const [amount, setAmount] = useState();
  const { data: signer } = useSigner();
  const handleChange = (event) => {
	  setAmount(event.target.value);
	};

  useEffect(() => {
    if (signer) {
      const contract = new ethers.Contract(contractAddress, contractJson.abi, signer.provider);
      setContract(contract);
    }
  }, [signer]);

  async function _buyTokens() {
    setLoading(true);
    const tx = await contract.connect(signer).purchaseTokens({
      value: ethers.utils.parseEther(amount).div(1),
    });
    const data = await tx.wait();
    setTxData(data);
    setLoading(false);
  }

  return (
    <>
      <h3>Buy Tokens</h3>
      {!signer ? (
        <p style={{ color: "red", fontWeight: "bold" }}> Please connect wallet</p>
      ) : (
        <>
          <p>Enter amount:</p>
          <input type="text" id="amount" name="amount" onChange={handleChange} value={amount} />
          <button onClick={() => { _buyTokens(); } }>
            {isLoading ? `Wait till the transaction to be completed` : `Buy`}
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

function TokenBalance() {
  const [contract, setContract] = useState();
  const [isLoading, setLoading] = useState();
  const [balance, setBalance] = useState();
  const { data: signer } = useSigner();

  useEffect(() => {
    if (signer) {
      const contract = new ethers.Contract(tokenAddress, tokenJson.abi, signer.provider);
      setContract(contract);
    }
  }, [signer]);

  async function getTokenBalance() {
    setLoading(true);
    const balanceBN = await contract.connect(signer).balanceOf(signer._address);
    const balance = ethers.utils.formatEther(balanceBN);
    setBalance(balance);
    setLoading(false);
  }

  return (
    <>
      <h3>Token Balance</h3>
      {!signer ? (
        <p style={{ color: "red", fontWeight: "bold" }}> Please connect wallet</p>
      ) : (
        <>
          <button onClick={() => { getTokenBalance(); } }>
            {isLoading ? `Checking...` : `Check`}
          </button>
        </>
      )}
      {isLoading}
      {balance === undefined ? null : (
        <>
          <div>
            <h1>{balance}</h1>
          </div>
        </>
      )}
    </>
  );  
}

function Bet() {
  const [txData, setTxData] = useState();
  const [tx, setTx] = useState();
  const [contract, setContract] = useState();
  const [token, setToken] = useState();
  const [isLoading, setLoading] = useState();
  const [amount, setAmount] = useState();
  const { data: signer } = useSigner();
  const handleChange = (event) => {
	  setAmount(event.target.value);
	};

  useEffect(() => {
    if (signer) {
      const contract = new ethers.Contract(contractAddress, contractJson.abi, signer.provider);
      setContract(contract);
      const token = new ethers.Contract(tokenAddress, tokenJson.abi, signer.provider);
      setToken(token);
    }
  }, [signer]);

  async function setBet() {
    setLoading(true);
    const allowTx = await token.connect(signer).approve(contract.address, ethers.constants.MaxUint256);
    const allow = await allowTx.wait();
    setTx(allow);
    const tx = await contract.connect(signer).betMany(amount);
    const data = await tx.wait();
    setTxData(data);
    setLoading(false);
  }

  return (
    <>
      <h3>Bet</h3>
      {!signer ? (
        <p style={{ color: "red", fontWeight: "bold" }}> Please connect wallet</p>
      ) : (
        <>
          <p>Enter amount:</p>
          <input type="text" id="amount" name="amount" onChange={handleChange} value={amount} />
          <button onClick={() => { setBet(); } }>
            {isLoading ? `Wait till the transaction to be completed` : `Bet`}
          </button>
        </>
      )}
      {isLoading}
      {txData || tx === undefined ? null : (
        <>
          <div>
            <p>Transaction completed!</p>
            <a href={"https://goerli.etherscan.io/tx/" + tx.transactionHash} target="_blank"> 
              {tx.transactionHash}
            </a>
            <a href={"https://goerli.etherscan.io/tx/" + txData.transactionHash} target="_blank"> 
              {txData.transactionHash}
            </a>
          </div>
        </>
      )}
    </>
  );  
}

function CloseLottery() {
  const [txData, setTxData] = useState();
  const [contract, setContract] = useState();
  const [isLoading, setLoading] = useState();
  const { data: signer } = useSigner();

  useEffect(() => {
    if (signer) {
      const contract = new ethers.Contract(contractAddress, contractJson.abi, signer.provider);
      setContract(contract);
    }
  }, [signer]);

  async function setCloseLottery() {
    setLoading(true);
    const tx = await contract.connect(signer).closeLottery();
    const data = await tx.wait();
    setTxData(data);
    setLoading(false);
  }

  return (
    <>
      <h3>Close Lottery</h3>
      {!signer ? (
        <p style={{ color: "red", fontWeight: "bold" }}> Please connect wallet</p>
      ) : (
          <button onClick={() => { setCloseLottery(); } }>
            {isLoading ? `Wait till the transaction to be completed` : `Close`}
          </button>
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

function Prize() {
  const [contract, setContract] = useState();
  const [isLoading, setLoading] = useState();
  const [prize, setPrize] = useState();
  const { data: signer } = useSigner();

  useEffect(() => {
    if (signer) {
      const contract = new ethers.Contract(contractAddress, contractJson.abi, signer.provider);
      setContract(contract);
    }
  }, [signer]);

  async function getPrize() {
    setLoading(true);
    const prizeBN = await contract.connect(signer).prize(signer._address);
    const prize = ethers.utils.formatEther(prizeBN);
    setPrize(prize);
    setLoading(false);
  }

  return (
    <>
      <h3>Prize</h3>
      {!signer ? (
        <p style={{ color: "red", fontWeight: "bold" }}> Please connect wallet</p>
      ) : (
        <>
          <button onClick={() => { getPrize(); } }>
            {isLoading ? `Checking...` : `Check`}
          </button>
        </>
      )}
      {isLoading}
      {prize === undefined ? null : (
        <>
          <div>
            <h1>{prize}</h1>
          </div>
        </>
      )}
    </>
  );  
}

function Claim() {
  const [txData, setTxData] = useState();
  const [contract, setContract] = useState();
  const [isLoading, setLoading] = useState();
  const [amount, setAmount] = useState();
  const { data: signer } = useSigner();
  const handleChange = (event) => {
	  setAmount(event.target.value);
	};

  useEffect(() => {
    if (signer) {
      const contract = new ethers.Contract(contractAddress, contractJson.abi, signer.provider);
      setContract(contract);
    }
  }, [signer]);

  async function claimPrize() {
    setLoading(true);
    const tx = await contract.connect(signer).prizeWithdraw(ethers.utils.parseEther(amount));
    const data = await tx.wait();
    setTxData(data);
    setLoading(false);
  }

  return (
    <>
      <h3>Claim Prize</h3>
      {!signer ? (
        <p style={{ color: "red", fontWeight: "bold" }}> Please connect wallet</p>
      ) : (
        <>
          <p>Enter amount:</p>
          <input type="text" id="amount" name="amount" onChange={handleChange} value={amount} />
          <button onClick={() => { claimPrize(); } }>
            {isLoading ? `Wait till the transaction to be completed` : `Claim`}
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

function Pool() {
  const [contract, setContract] = useState();
  const [isLoading, setLoading] = useState();
  const [pool, setPool] = useState();
  const { data: signer } = useSigner();

  useEffect(() => {
    if (signer) {
      const contract = new ethers.Contract(contractAddress, contractJson.abi, signer.provider);
      setContract(contract);
    }
  }, [signer]);

  async function ownerPool() {
    setLoading(true);
    const balanceBN = await contract.connect(signer).ownerPool();
    const balance = ethers.utils.formatEther(balanceBN);
    setPool(balance);
    setLoading(false);
  }

  return (
    <>
      <h3>Owner Pool</h3>
      {!signer ? (
        <p style={{ color: "red", fontWeight: "bold" }}> Please connect wallet</p>
      ) : (
        <>
          <button onClick={() => { ownerPool(); } }>
            {isLoading ? `Checking...` : `Check`}
          </button>
        </>
      )}
      {isLoading}
      {pool === undefined ? null : (
        <>
          <div>
            <h1>{pool}</h1>
          </div>
        </>
      )}
    </>
  );  
}

function Withdraw() {
  const [txData, setTxData] = useState();
  const [contract, setContract] = useState();
  const [isLoading, setLoading] = useState();
  const [amount, setAmount] = useState();
  const { data: signer } = useSigner();
  const handleChange = (event) => {
	  setAmount(event.target.value);
	};

  useEffect(() => {
    if (signer) {
      const contract = new ethers.Contract(contractAddress, contractJson.abi, signer.provider);
      setContract(contract);
    }
  }, [signer]);

  async function withdrawTokens() {
    setLoading(true);
    const tx = await contract.connect(signer).ownerWithdraw(ethers.utils.parseEther(amount));
    const data = await tx.wait();
    setTxData(data);
    setLoading(false);
  }

  return (
    <>
      <h3>Withdraw Tokens</h3>
      {!signer ? (
        <p style={{ color: "red", fontWeight: "bold" }}> Please connect wallet</p>
      ) : (
        <>
          <p>Enter amount:</p>
          <input type="text" id="amount" name="amount" onChange={handleChange} value={amount} />
          <button onClick={() => { withdrawTokens(); } }>
            {isLoading ? `Wait till the transaction to be completed` : `Withdraw`}
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

function Burn() {
  const [txData, setTxData] = useState();
  const [tx, setTx] = useState();
  const [contract, setContract] = useState();
  const [token, setToken] = useState();
  const [isLoading, setLoading] = useState();
  const [amount, setAmount] = useState();
  const { data: signer } = useSigner();
  const handleChange = (event) => {
	  setAmount(event.target.value);
	};

  useEffect(() => {
    if (signer) {
      const contract = new ethers.Contract(contractAddress, contractJson.abi, signer.provider);
      setContract(contract);
      const token = new ethers.Contract(tokenAddress, tokenJson.abi, signer.provider);
      setToken(token);
    }
  }, [signer]);

  async function burnTokens() {
    setLoading(true);
    const allowTx = await token.connect(signer).approve(contract.address, ethers.constants.MaxUint256);
    const allow = await allowTx.wait();
    setTx(allow);
    const tx = await contract.connect(signer).returnTokens(ethers.utils.parseEther(amount));
    const data = await tx.wait();
    setTxData(data);
    setLoading(false);
  }

  return (
    <>
      <h3>Burn Tokens</h3>
      {!signer ? (
        <p style={{ color: "red", fontWeight: "bold" }}> Please connect wallet</p>
      ) : (
        <>
          <p>Enter amount:</p>
          <input type="text" id="amount" name="amount" onChange={handleChange} value={amount} />
          <button onClick={() => { burnTokens(); } }>
            {isLoading ? `Wait till the transaction to be completed` : `Burn`}
          </button>
        </>
      )}
      {isLoading}
      {txData || tx === undefined ? null : (
        <>
          <div>
            <p>Transaction completed!</p>
            <a href={"https://goerli.etherscan.io/tx/" + tx.transactionHash} target="_blank"> 
              {tx.transactionHash}
            </a>
            <a href={"https://goerli.etherscan.io/tx/" + txData.transactionHash} target="_blank"> 
              {txData.transactionHash}
            </a>
          </div>
        </>
      )}
    </>
  );  
}