export const CONTRACT_ADDRESS = "Your_Contract_Address";

export const SEPOLIA_CHAIN_ID = "0xaa36a7"; 

export const ABI = [
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },

  { "inputs": [{ "internalType": "address", "name": "_candidate", "type": "address" }], "name": "addCandidate", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "_voter",     "type": "address" }], "name": "addVoter",     "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "startVoting", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "endVoting",   "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "resetVoting", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "_candidate", "type": "address" }], "name": "vote", "outputs": [], "stateMutability": "nonpayable", "type": "function" },

  {
    "inputs": [], "name": "getWinner",
    "outputs": [
      { "internalType": "address", "name": "winnerAddress", "type": "address" },
      { "internalType": "uint256", "name": "votes",         "type": "uint256" },
      { "internalType": "bool",    "name": "tie",           "type": "bool"    }
    ],
    "stateMutability": "view", "type": "function"
  },
  { "inputs": [], "name": "getCandidates", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getVoters",     "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" },

  { "inputs": [], "name": "owner",        "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "votingState",  "outputs": [{ "internalType": "uint8",   "name": "", "type": "uint8"   }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "winner",       "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "highestVotes", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "isTie",        "outputs": [{ "internalType": "bool",    "name": "", "type": "bool"    }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "roundNumber",  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "candidates",
    "outputs": [
      { "internalType": "uint256", "name": "voteCount",    "type": "uint256" },
      { "internalType": "bool",    "name": "isRegistered", "type": "bool"    }
    ],
    "stateMutability": "view", "type": "function"
  },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "isVoterRegistered", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "hasVoted",          "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }
];