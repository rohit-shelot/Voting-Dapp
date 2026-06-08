# Decentralized Voting DApp (MST Testnet)

This project is a React + ethers.js voting dapp prepared for deployment on MST Testnet instead of Ethereum Sepolia.

## Network Details

- Network: `MST Testnet`
- Chain ID: `91562037`
- Chain ID (hex): `0x5752035`
- RPC URL: `https://testnetrpc.mstblockchain.com`
- Explorer: `https://testnet.mstscan.com`
- Faucet: `https://faucet.mstblockchain.com`

## Deploy In Remix IDE

1. Open [contracts/Voting.sol](/d:/Decentra%20Vote%20Final/Voting-Dapp/contracts/Voting.sol).
2. Compile it with Solidity `0.8.20`.
3. In MetaMask, add MST Testnet using the network details above.
4. Switch MetaMask to MST Testnet and get test tokens from the faucet.
5. In Remix, go to `Deploy & Run Transactions`.
6. Choose `Injected Provider - MetaMask`.
7. Deploy the `Voting` contract.
8. Copy the deployed contract address.
9. Replace `Your_MST_Testnet_Contract_Address` in [src/contract.js](/d:/Decentra%20Vote%20Final/Voting-Dapp/src/contract.js).
10. Start the frontend with `npm run dev`.

## Frontend Notes

- The app now asks MetaMask to switch to MST Testnet automatically.
- If MetaMask does not know the network yet, the app adds it with the correct RPC, explorer, and currency settings.
- You still need to deploy your own contract on MST Testnet and paste that deployed address into `src/contract.js`.
