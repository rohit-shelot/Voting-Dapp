<<<<<<< HEAD
# 🗳️ Decentralized Voting DApp (Sepolia)

A full-stack **Blockchain-based Voting Application** built using **React + Ethereum (Sepolia Testnet)** that enables secure, transparent, and tamper-proof voting.

This project demonstrates how real-world voting systems can be implemented using **smart contracts**, ensuring fairness and removing reliance on centralized authorities.

---

## 🚀 Features

### 👤 User Features
- 🔐 Connect wallet using MetaMask  
- 👀 View all registered candidates  
- 🗳️ Vote for a candidate (**only once per round**)  
- 📡 See **live vote updates**  
- 📊 Track voting status *(Not Started / Active / Ended)*  
- 📈 View vote distribution via interactive chart  

### 🛠️ Admin (Owner) Features
- ➕ Add candidates *(before voting starts)*  
- 👥 Register voters  
- ▶️ Start voting session  
- ⏹️ End voting session  
- 🔄 Reset system for a new voting round  

---

## 🔐 Smart Contract Capabilities

- ✅ One vote per registered voter  
- 👑 Only owner controls voting lifecycle  
- 🔍 Transparent vote counting  
- 🏆 Automatic winner calculation  
- ⚖️ Tie detection logic  
- 🔁 Multiple voting rounds support  

---

## 📊 UI Highlights

- 🎨 Clean and modern dashboard  
- ⚡ Real-time vote tally  
- 🍩 Donut chart visualization  
- 📜 Transaction log viewer  
- 🏷️ Status badges for better UX  
- 📱 Fully responsive design  

---

## ⚙️ Tech Stack

### 🖥️ Frontend
- React.js  
- Custom Hooks (`useVoting`)  
- Inline CSS styling  

### ⛓️ Blockchain
- Solidity Smart Contract  
- Ethereum Sepolia Testnet  
- MetaMask Wallet Integration  
- Ethers.js / Web3  

---

## 🔗 Smart Contract Details

- 🌐 Network: **Sepolia Testnet**  
- 🆔 Chain ID: `0xaa36a7`  
- 📍 Contract Address: `Your_Contract_Address`  

---

## 🧠 How It Works

1. 🏗️ Owner deploys the smart contract  
2. 👥 Owner registers candidates and voters  
3. ▶️ Voting session is started  
4. 🗳️ Registered users cast their vote  
5. ⛓️ Votes are stored on blockchain  
6. ⏹️ Owner ends voting  
7. 🏆 System calculates winner automatically  
8. 🔄 New round can be started by resetting state  

---

## 📦 Core Smart Contract Functions

```solidity
addCandidate(address)
addVoter(address)
startVoting()
endVoting()
resetVoting()
vote(address)
getWinner()
getCandidates()
getVoters()