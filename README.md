# Decentralized Voting DApp (MST Blockchain Testnet)

A React + ethers.js voting DApp deployed on **MST Blockchain Testnet**.

## Network Details

| Property        | Value                                  |
| --------------- | -------------------------------------- |
| Network Name    | MST Blockchain Testnet                 |
| Chain ID        | `91562037` (hex: `0x5752035`)          |
| RPC URL         | `https://testnetrpc.mstblockchain.com` |
| Block Explorer  | `https://testnet.mstscan.com`          |
| Faucet          | `https://faucet.mstblockchain.com`     |
| Native Currency | MST (18 decimals)                      |

## Environment Configuration

Contract address and chain ID are managed via a `.env` file at the project root.

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and set your deployed contract address:
   ```env
   VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
   VITE_CHAIN_ID=0x5752035
   ```

> **Note:** Only variables prefixed with `VITE_` are exposed to the frontend by Vite.

## Deploy via Remix IDE

1. Open [VotingContract.sol](contract/VotingContract.sol) in [Remix IDE](https://remix.ethereum.org).
2. Compile with Solidity **0.8.20**.
3. In MetaMask, add MST Blockchain Testnet using the network details above.
4. Switch MetaMask to MST Blockchain Testnet and get test MST tokens from the [faucet](https://faucet.mstblockchain.com).
5. In Remix → **Deploy & Run Transactions** → select **Injected Provider - MetaMask**.
6. Deploy the `Voting` contract.
7. Copy the deployed contract address.
8. Paste the address into the `.env` file as `VITE_CONTRACT_ADDRESS`.
9. Start the frontend:
   ```bash
   npm install
   npm run dev
   ```

## Frontend Notes

- The app automatically prompts MetaMask to switch to MST Blockchain Testnet.
- If MetaMask does not have the network, the app adds it automatically with the correct RPC, explorer, and currency settings.
- You must deploy your own contract on MST Blockchain Testnet and set the deployed address in the `.env` file.

## Deploy on Render (Docker)

This project includes a production-ready `Dockerfile` for deploying on [Render](https://render.com).

### Steps

1. Push this repo to GitHub (`.env`, `.env.example`, and `node_modules` are already excluded via `.gitignore`).
2. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   | Setting          | Value               |
   | ---------------- | ------------------- |
   | **Environment**  | Docker              |
   | **Dockerfile Path** | `./Dockerfile`   |
   | **Port**         | `10000`             |
5. Under **Environment → Build Args**, add:
   | Key                      | Value                              |
   | ------------------------ | ---------------------------------- |
   | `VITE_CONTRACT_ADDRESS`  | Your deployed MST Testnet contract |
   | `VITE_CHAIN_ID`          | `0x5752035`                        |
6. Click **Create Web Service** — Render will build and deploy automatically.

> **Important:** Since Vite injects env vars at **build time**, you must set them as Docker **build arguments** in Render (not runtime environment variables).

## Project Structure

```
Voting-Dapp/
├── .gitignore            # Excludes node_modules, .env, .env.example
├── .dockerignore         # Excludes unnecessary files from Docker build
├── Dockerfile            # Multi-stage build (Node → Nginx)
├── nginx.conf            # Nginx config for SPA routing
├── contract/
│   └── VotingContract.sol  # Solidity smart contract
├── src/
│   ├── contract.js       # ABI, contract address, and chain ID (reads from env)
│   ├── useVoting.js      # React hook for blockchain interactions
│   ├── App.jsx           # Main UI component
│   ├── index.css         # Styles
│   └── main.jsx          # Entry point
├── index.html
├── package.json
└── vite.config.js
```
