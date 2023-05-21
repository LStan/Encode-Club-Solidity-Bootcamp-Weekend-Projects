import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
import {
  useSigner,
  useNetwork,
  useBalance,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useState, useEffect } from "react";
import ballotJson from "../assets/TokenizedBallot.json";
import { ethers } from "ethers";

let ballotAddress, setBallotAddress;
let proposalsList, setProposalsList;
let proposalNum, setProposalNum;

export default function InstructionsComponent() {
  const router = useRouter();
  [ballotAddress, setBallotAddress] = useState(
    "0x76b3DcF1F09b7844e700a690Dd4Ceb43C9b69C65"
  );
  [proposalsList, setProposalsList] = useState([]);
  [proposalNum, setProposalNum] = useState(0);
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <h1>My dApp</h1>
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
      <WalletInfo></WalletInfo>
      {/* <Profile></Profile> */}
      <RequestTokens></RequestTokens>
      <BallotContractAddress></BallotContractAddress>
      <Proposals></Proposals>
    </>
  );
}

function WalletInfo() {
  const { data: signer, isError, isLoading } = useSigner();
  const { chain, chains } = useNetwork();
  if (signer)
    return (
      <>
        <p>Your account address is {signer._address}</p>
        <p>Connected to the {chain.name} network</p>
        <button onClick={() => signMessage(signer, "Message")}>Sign</button>
        <WalletBalance></WalletBalance>
      </>
    );
  if (isLoading)
    return (
      <>
        <p>Wait a while, the wallet is loading</p>
      </>
    );
  return (
    <>
      <p>Connect a wallet</p>
    </>
  );
}

function WalletBalance() {
  const { data: signer } = useSigner();
  const { data, isError, isLoading } = useBalance({
    address: signer._address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div>
      Balance: {data?.formatted} {data?.symbol}
    </div>
  );
}

function signMessage(signer, message) {
  signer
    .signMessage(message)
    .then((signature) => {
      console.log(signature);
    })
    .catch((error) => {
      console.error(error);
    });
}

function Profile() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("https://random-data-api.com/api/v2/users")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div>
      <h1>{data.username}</h1>
      <p>{data.email}</p>
    </div>
  );
}

function RequestTokens() {
  const { data: signer } = useSigner();
  const [txData, setTxData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  if (txData)
    return (
      <div>
        <p>Transaction completed!</p>
        <a
          href={"https://sepolia.etherscan.io/tx/" + txData.hash}
          target="_blank"
        >
          {txData.hash}
        </a>
      </div>
    );
  if (isLoading) return <p>Requesting tokens to be minted...</p>;
  return (
    <div>
      <button
        onClick={() => {
          requestTokens(signer, "signature", setLoading, setTxData);
        }}
      >
        Request Tokens
      </button>
    </div>
  );
}

function requestTokens(signer, signature, setLoading, setTxData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address: signer._address, signature: signature }),
  };
  fetch("http://localhost:3001/request-tokens", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      setTxData(data);
      setLoading(false);
    });
}

function BallotContractAddress() {
  const handleChange = (event) => {
    setBallotAddress(event.target.value);
  };

  return (
    <>
      <p>Enter ballot contract address:</p>
      <input
        type="text"
        id="address"
        name="address"
        onChange={handleChange}
        value={ballotAddress}
      />
    </>
  );
}

function Proposals() {
  // const { data :useContractReadData } = useContractRead({
  // 	address: ballotAddress,
  // 	abi: ballotJson.abi,
  // 	functionName: 'listProposal'
  //   });

  //   useEffect(() => {
  // 	console.log(useContractReadData);
  //   }, [useContractReadData]);
  const { data: signer } = useSigner();
  const handleChange = (event) => {
    setProposalNum(event.target.value);
  };
  return (
    <>
      <button
        onClick={() => {
          getProposals(signer);
        }}
      >
        Get proposals
      </button>
      <label>
        Proposals:
        <select value={proposalNum} onChange={handleChange}>
          {proposalsList.map((proposal, index) => (
            <option value={index}>{proposal}</option>
          ))}
        </select>
      </label>
    </>
  );
}

function getProposals(signer) {
  const ballotContract = new ethers.Contract(
    ballotAddress,
    ballotJson.abi,
    signer.provider
  );
  // console.log(signer);
  ballotContract
    .connect(signer)
    .listProposal()
    .then((response) => {
      const proposals = response.map((element) =>
        ethers.utils.parseBytes32String(element)
      );
      console.log(proposals);
      setProposalsList(proposals);
    });
  // setProposalsList(["test", "test2", "test3"])
}
