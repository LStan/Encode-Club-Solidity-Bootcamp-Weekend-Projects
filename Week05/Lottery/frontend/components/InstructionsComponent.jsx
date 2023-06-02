import styles from "../styles/InstructionsComponent.module.css";
import { useSigner, useNetwork } from "wagmi";
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
  const { data: signer } = useSigner();
  const [lotteryContract, setLotteryContract] = useState();
  const [tokenContract, setTokenContract] = useState();
  const [walletAddress, setWalletAddress] = useState();

  useEffect(() => {
    if (signer) {
      let lotteryContract = new ethers.Contract(
        contractAddress,
        contractJson.abi,
        signer.provider
      );
      lotteryContract = lotteryContract.connect(signer);
      setLotteryContract(lotteryContract);
      let tokenContract = new ethers.Contract(
        tokenAddress,
        tokenJson.abi,
        signer.provider
      );
      tokenContract = tokenContract.connect(signer);
      setTokenContract(tokenContract);
      (async () => {
        const walletAddress = await signer.getAddress();
        setWalletAddress(walletAddress);
      })();
    }
  }, [signer]);

  if (!walletAddress)
    return (
      <p style={{ color: "red", fontWeight: "bold" }}> Please connect wallet</p>
    );
  return (
    <>
      <CheckState lotteryContract={lotteryContract}></CheckState>
      <OpenBets lotteryContract={lotteryContract}></OpenBets>
      <BuyTokens lotteryContract={lotteryContract}></BuyTokens>
      <TokenBalance
        tokenContract={tokenContract}
        walletAddress={walletAddress}
      ></TokenBalance>
      <Bet
        lotteryContract={lotteryContract}
        tokenContract={tokenContract}
      ></Bet>
      <CloseLottery lotteryContract={lotteryContract}></CloseLottery>
      <Prize
        lotteryContract={lotteryContract}
        walletAddress={walletAddress}
      ></Prize>
      <Claim lotteryContract={lotteryContract}></Claim>
      <Pool lotteryContract={lotteryContract}></Pool>
      <Withdraw lotteryContract={lotteryContract}></Withdraw>
      <Burn
        lotteryContract={lotteryContract}
        tokenContract={tokenContract}
      ></Burn>
    </>
  );
}

function CheckState({ lotteryContract }) {
  const [currentBlockDate, setCurrentBlockDate] = useState(new Date());
  const [closingTimeDate, setClosingTimeDate] = useState(new Date());
  const [check, setCheck] = useState();
  const [isLoading, setLoading] = useState(false);

  async function getCheckState() {
    setLoading(true);
    try {
      const state = await lotteryContract.betsOpen();
      console.log(state);
      const provider = lotteryContract.provider;
      const currentBlock = await provider.getBlock("latest");
      const currentBlockDate = new Date(currentBlock.timestamp * 1000);
      console.log(currentBlockDate);
      setCurrentBlockDate(currentBlockDate);
      const closingTime = await lotteryContract.betsClosingTime();
      const closingTimeDate = new Date(closingTime.toNumber() * 1000);
      console.log(closingTimeDate);
      setClosingTimeDate(closingTimeDate);
      setCheck(state);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <>
      <h3>Query State</h3>
      <button
        onClick={() => {
          getCheckState();
        }}
      >
        {isLoading ? `Checking status...` : `Check`}
      </button>
      {check === undefined ? null : (
        <>
          {check ? (
            <>
              <h1>The lottery is open!!!</h1>
              <h1>
                The last block was mined at{" "}
                {currentBlockDate.toLocaleDateString()} :{" "}
                {currentBlockDate.toLocaleTimeString()}
              </h1>
              <h1>
                Lottery should close at {closingTimeDate.toLocaleDateString()} :{" "}
                {closingTimeDate.toLocaleTimeString()}
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

function OpenBets({ lotteryContract }) {
  const [txData, setTxData] = useState();
  const [isLoading, setLoading] = useState();
  const [duration, setDuration] = useState();

  const handleChange = (event) => {
    setDuration(event.target.value);
  };

  async function setOpenBets() {
    setLoading(true);
    try {
      const provider = lotteryContract.provider;
      const currentBlock = await provider.getBlock("latest");
      const tx = await lotteryContract.openBets(
        currentBlock.timestamp + Number(duration)
      );
      const data = await tx.wait();
      setTxData(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <>
      <h3>Open Bets</h3>
      <p>Enter duration:</p>
      <input
        type="text"
        id="duration"
        name="duration"
        onChange={handleChange}
        value={duration}
      />
      <button
        onClick={() => {
          setOpenBets();
        }}
      >
        {isLoading ? `Wait till the transaction to be completed` : `Open`}
      </button>
      {txData === undefined ? null : (
        <>
          <div>
            <p>Transaction completed!</p>
            <a
              href={"https://goerli.etherscan.io/tx/" + txData.transactionHash}
              target="_blank"
            >
              {txData.transactionHash}
            </a>
          </div>
        </>
      )}
    </>
  );
}

function BuyTokens({ lotteryContract }) {
  const TOKEN_RATIO = 1;

  const [txData, setTxData] = useState();
  const [isLoading, setLoading] = useState();
  const [amount, setAmount] = useState(0);

  const handleChange = (event) => {
    setAmount(event.target.value);
  };

  async function _buyTokens() {
    setLoading(true);
    try {
      const tx = await lotteryContract.purchaseTokens({
        value: ethers.utils.parseEther(amount.toString()).div(TOKEN_RATIO),
      });
      const data = await tx.wait();
      setTxData(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <>
      <h3>Buy Tokens</h3>
      <p>Enter amount:</p>
      <input
        type="text"
        id="amount"
        name="amount"
        onChange={handleChange}
        value={amount}
      />
      <button
        onClick={() => {
          _buyTokens();
        }}
      >
        {isLoading ? `Wait till the transaction to be completed` : `Buy`}
      </button>
      {txData === undefined ? null : (
        <>
          <div>
            <p>Transaction completed!</p>
            <a
              href={"https://goerli.etherscan.io/tx/" + txData.transactionHash}
              target="_blank"
            >
              {txData.transactionHash}
            </a>
          </div>
        </>
      )}
    </>
  );
}

function TokenBalance({ tokenContract, walletAddress }) {
  const [isLoading, setLoading] = useState();
  const [balance, setBalance] = useState();

  async function getTokenBalance() {
    setLoading(true);
    try {
      const balanceBN = await tokenContract.balanceOf(walletAddress);
      const balance = ethers.utils.formatEther(balanceBN);
      setBalance(balance);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <>
      <h3>Token Balance</h3>
      <button
        onClick={() => {
          getTokenBalance();
        }}
      >
        {isLoading ? `Checking...` : `Check`}
      </button>
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

function Bet({ lotteryContract, tokenContract }) {
  const [txData, setTxData] = useState();
  const [tx, setTx] = useState();
  const [isLoading, setLoading] = useState();
  const [amount, setAmount] = useState(0);

  const handleChange = (event) => {
    setAmount(event.target.value);
  };

  async function setBet() {
    setLoading(true);
    try {
      const betPrice = await lotteryContract.betPrice();
      const betFee = await lotteryContract.betFee();
      const approveValue = betPrice.add(betFee).mul(amount);
      console.log(approveValue);
      const allowTx = await tokenContract.approve(
        lotteryContract.address,
        approveValue
      );
      const allow = await allowTx.wait();
      setTx(allow);
      const tx = await lotteryContract.betMany(amount);
      const data = await tx.wait();
      setTxData(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <>
      <h3>Bet</h3>
      <p>Enter amount:</p>
      <input
        type="text"
        id="amount"
        name="amount"
        onChange={handleChange}
        value={amount}
      />
      <button
        onClick={() => {
          setBet();
        }}
      >
        {isLoading ? `Wait till the transaction to be completed` : `Bet`}
      </button>
      {txData || tx === undefined ? null : (
        <>
          <div>
            <p>Transaction completed!</p>
            <a
              href={"https://goerli.etherscan.io/tx/" + tx.transactionHash}
              target="_blank"
            >
              {tx.transactionHash}
            </a>
            <a
              href={"https://goerli.etherscan.io/tx/" + txData.transactionHash}
              target="_blank"
            >
              {txData.transactionHash}
            </a>
          </div>
        </>
      )}
    </>
  );
}

function CloseLottery({ lotteryContract }) {
  const [txData, setTxData] = useState();
  const [isLoading, setLoading] = useState();

  async function setCloseLottery() {
    setLoading(true);
    try {
      const tx = await lotteryContract.closeLottery();
      const data = await tx.wait();
      setTxData(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <>
      <h3>Close Lottery</h3>
      <button
        onClick={() => {
          setCloseLottery();
        }}
      >
        {isLoading ? `Wait till the transaction to be completed` : `Close`}
      </button>
      {txData === undefined ? null : (
        <>
          <div>
            <p>Transaction completed!</p>
            <a
              href={"https://goerli.etherscan.io/tx/" + txData.transactionHash}
              target="_blank"
            >
              {txData.transactionHash}
            </a>
          </div>
        </>
      )}
    </>
  );
}

function Prize({ lotteryContract, walletAddress }) {
  const [isLoading, setLoading] = useState();
  const [prize, setPrize] = useState();

  async function getPrize() {
    setLoading(true);
    try {
      const prizeBN = await lotteryContract.prize(walletAddress);
      const prize = ethers.utils.formatEther(prizeBN);
      setPrize(prize);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <>
      <h3>Prize</h3>
      <button
        onClick={() => {
          getPrize();
        }}
      >
        {isLoading ? `Checking...` : `Check`}
      </button>
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

function Claim({ lotteryContract }) {
  const [txData, setTxData] = useState();
  const [isLoading, setLoading] = useState();
  const [amount, setAmount] = useState(0);

  const handleChange = (event) => {
    setAmount(event.target.value);
  };

  async function claimPrize() {
    setLoading(true);
    try {
      const tx = await lotteryContract.prizeWithdraw(
        ethers.utils.parseEther(amount.toString())
      );
      const data = await tx.wait();
      setTxData(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <>
      <h3>Claim Prize</h3>
      <p>Enter amount:</p>
      <input
        type="text"
        id="amount"
        name="amount"
        onChange={handleChange}
        value={amount}
      />
      <button
        onClick={() => {
          claimPrize();
        }}
      >
        {isLoading ? `Wait till the transaction to be completed` : `Claim`}
      </button>
      {txData === undefined ? null : (
        <>
          <div>
            <p>Transaction completed!</p>
            <a
              href={"https://goerli.etherscan.io/tx/" + txData.transactionHash}
              target="_blank"
            >
              {txData.transactionHash}
            </a>
          </div>
        </>
      )}
    </>
  );
}

function Pool({ lotteryContract }) {
  const [isLoading, setLoading] = useState();
  const [pool, setPool] = useState();

  async function ownerPool() {
    setLoading(true);
    try {
      const balanceBN = await lotteryContract.ownerPool();
      const balance = ethers.utils.formatEther(balanceBN);
      setPool(balance);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <>
      <h3>Owner Pool</h3>
      <button
        onClick={() => {
          ownerPool();
        }}
      >
        {isLoading ? `Checking...` : `Check`}
      </button>
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

function Withdraw({ lotteryContract }) {
  const [txData, setTxData] = useState();
  const [isLoading, setLoading] = useState();
  const [amount, setAmount] = useState(0);

  const handleChange = (event) => {
    setAmount(event.target.value);
  };

  async function withdrawTokens() {
    setLoading(true);
    try {
      const tx = await lotteryContract.ownerWithdraw(
        ethers.utils.parseEther(amount.toString())
      );
      const data = await tx.wait();
      setTxData(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <>
      <h3>Withdraw Tokens</h3>
      <p>Enter amount:</p>
      <input
        type="text"
        id="amount"
        name="amount"
        onChange={handleChange}
        value={amount}
      />
      <button
        onClick={() => {
          withdrawTokens();
        }}
      >
        {isLoading ? `Wait till the transaction to be completed` : `Withdraw`}
      </button>
      {txData === undefined ? null : (
        <>
          <div>
            <p>Transaction completed!</p>
            <a
              href={"https://goerli.etherscan.io/tx/" + txData.transactionHash}
              target="_blank"
            >
              {txData.transactionHash}
            </a>
          </div>
        </>
      )}
    </>
  );
}

function Burn({ lotteryContract, tokenContract }) {
  const [txData, setTxData] = useState();
  const [tx, setTx] = useState();
  const [isLoading, setLoading] = useState();
  const [amount, setAmount] = useState(0);

  const handleChange = (event) => {
    setAmount(event.target.value);
  };

  async function burnTokens() {
    setLoading(true);
    try {
      const allowTx = await tokenContract.approve(
        lotteryContract.address,
        ethers.constants.MaxUint256
      );
      const allow = await allowTx.wait();
      setTx(allow);
      const tx = await lotteryContract.returnTokens(
        ethers.utils.parseEther(amount.toString())
      );
      const data = await tx.wait();
      setTxData(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <>
      <h3>Burn Tokens</h3>
      <p>Enter amount:</p>
      <input
        type="text"
        id="amount"
        name="amount"
        onChange={handleChange}
        value={amount}
      />
      <button
        onClick={() => {
          burnTokens();
        }}
      >
        {isLoading ? `Wait till the transaction to be completed` : `Burn`}
      </button>
      {txData === undefined ? null : (
        <>
          <div>
            <p>Transaction completed!</p>
            <a
              href={"https://goerli.etherscan.io/tx/" + tx.transactionHash}
              target="_blank"
            >
              {tx.transactionHash}
            </a>
            <a
              href={"https://goerli.etherscan.io/tx/" + txData.transactionHash}
              target="_blank"
            >
              {txData.transactionHash}
            </a>
          </div>
        </>
      )}
    </>
  );
}
