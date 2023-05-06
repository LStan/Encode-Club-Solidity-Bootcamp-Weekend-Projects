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
