# Week 2 project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

## Local test:
```shell
yarn ts-node --files ./scripts/Ballot.ts <voter_address> Proposal1 Proposal2 Proposal3 ....
```

## On Sepolia testnet

Deploy:

```shell
yarn ts-node --files ./scripts/deploy.ts Proposal1 Proposal2 Proposal3 ....
```

Give a right to vote:

```shell
yarn ts-node --files ./scripts/giveRightToVote.ts <contract_address> <voter_address>
```

Get winner proposal name:

```shell
yarn ts-node --files ./scripts/getWinnerName.ts <contract_address>
```

## Introduction:
The given smart contract is a decentralized voting system with delegation functionality. It allows users to create a new ballot, give rights to vote, delegate votes to other users, and cast their votes on a proposal.

## Functions:

Constructor: Initializes the contract, sets the chairperson as the sender, and creates an array of proposals based on the given proposal names.

giveRightToVote: This function allows the chairperson to give the right to vote to an address.

delegate: Allows a voter to delegate their voting power to another voter.

vote: Allows a voter to cast their vote for a specific proposal.

winningProposal: Computes the winning proposal based on the accumulated votes.

winnerName: Returns the name of the winning proposal.

listProposal: Returns a list of all proposals.

## Transactions:

Contract creation: https://sepolia.etherscan.io/tx/0xbf7628ff37b2680038adc2f850cc869c429ae8303bd62e079cb46f7d9453a874

Giving the right to vote to 0xD6230D359064d1A7D77D0Cd3a54781fE5A4dB8D8: https://sepolia.etherscan.io/tx/0x8c4dc56a14042321ba378bf6667da0af033efb8cc46ff9ae8db12fe3e7849bb0

Vote by 0xD6230D359064d1A7D77D0Cd3a54781fE5A4dB8D8: https://sepolia.etherscan.io/tx/0x1dd3720b5f3a2c96a36424a1be5e32fbf57edb2ed6309de40f162c136840949c

Delegation of vote by 0xDA3AF9c51F6953988a46C21d43A5152AFC7f389d to 0xF98981628E50d9b80c7A769116609787f94770CA: https://sepolia.etherscan.io/tx/0xcf694666c7e8f759e58248e5aa27c7930a5f78a92b9cb1d2af591bee7e711959
