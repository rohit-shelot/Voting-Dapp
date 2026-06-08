import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { ABI, CONTRACT_ADDRESS, MST_CHAIN_ID } from "./contract";

export function useVoting() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [votingState, setVotingState] = useState(0); 
  const [candidates, setCandidates] = useState([]); 
  const [voters, setVoters] = useState([]);
  const [winner, setWinner] = useState(null); 
  const [roundNumber, setRoundNumber] = useState(1);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [myVoted, setMyVoted] = useState(false);
  const [myRegistered, setMyRegistered] = useState(false);

  const addLog = useCallback((msg, type = "info") => {
    const t = new Date().toLocaleTimeString();
    setLogs((prev) =>
      [{ msg, type, t, id: Date.now() + Math.random() }, ...prev].slice(0, 40),
    );
  }, []);

  const beginAction = useCallback((action) => {
    setActionLoading(action);
    setLoading(true);
  }, []);

  const endAction = useCallback(() => {
    setActionLoading("");
    setLoading(false);
  }, []);

  const loadAll = useCallback(
    async (_contract, _account) => {
      try {
        const owner = await _contract.owner();
        const _isOwner = owner.toLowerCase() === _account.toLowerCase();
        setIsOwner(_isOwner);

        const vs = await _contract.votingState();
        const state = parseInt(vs);
        setVotingState(state);

        try {
          const rn = await _contract.roundNumber();
          setRoundNumber(parseInt(rn));
        } catch {
        }

        let candAddrs = [];
        try {
          candAddrs = await _contract.getCandidates();
        } catch {
        }
        const candData = await Promise.all(
          candAddrs.map(async (addr) => {
            const d = await _contract.candidates(addr);
            return { addr, votes: parseInt(d.voteCount) };
          }),
        );
        setCandidates(candData);

        let voterAddrs = [];
        try {
          voterAddrs = await _contract.getVoters();
        } catch {
        }
        setVoters(voterAddrs.map((a) => a));

        const voted = await _contract.hasVoted(_account);
        setMyVoted(voted);
        const registered = await _contract.isVoterRegistered(_account);
        setMyRegistered(registered);

        if (state === 2) {
          try {
            const result = await _contract.getWinner();
            setWinner({
              addr: result.winnerAddress,
              votes: parseInt(result.votes),
              tie: result.tie,
            });
          } catch {
          }
        }

        addLog(
          `Loaded — Round #${parseInt(vs) === 0 ? 1 : "N"} | State: ${["Not Started", "Active", "Ended"][state]} | ${candData.length} candidates | ${voterAddrs.length} voters`,
          "info",
        );
      } catch (e) {
        addLog("Failed to load state: " + e.message, "err");
      }
    },
    [addLog],
  );

const connectWallet = useCallback(async () => {
  if (!window.ethereum) {
    alert("MetaMask not detected. Install it from metamask.io");
    return;
  }

  try {
    beginAction("connectWallet");

    await window.ethereum.request({ method: "eth_requestAccounts" });

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MST_CHAIN_ID }],
      });
    } catch (error) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: MST_CHAIN_ID,
              chainName: "MST Blockchain Testnet",
              rpcUrls: ["https://testnetrpc.mstblockchain.com"],
              nativeCurrency: {
                name: "MST",
                symbol: "MST",
                decimals: 18,
              },
              blockExplorerUrls: ["https://testnet.mstscan.com"],
            },
          ],
        });
      } else {
        throw error;
      }
    }

    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    const _signer = _provider.getSigner();
    const _account = await _signer.getAddress();
    const _contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, _signer);

    setAccount(_account);
    setContract(_contract);

    addLog("Wallet connected: " + shortAddr(_account), "ok");

    await loadAll(_contract, _account);

    window.ethereum.on("accountsChanged", () => window.location.reload());
    window.ethereum.on("chainChanged", () => window.location.reload());

  } catch (e) {
    addLog("Connection failed: " + (e.message || e), "err");
  } finally {
    endAction();
  }
}, [addLog, beginAction, endAction, loadAll]);

  const addCandidate = useCallback(
    async (addr) => {
      if (!ethers.utils.isAddress(addr)) {
        addLog("Invalid address", "err");
        return false;
      }
      try {
        beginAction("addCandidate");
        addLog("Adding candidate " + shortAddr(addr) + "…", "info");
        const tx = await contract.addCandidate(addr);
        addLog("Tx sent, waiting for confirmation…", "info");
        await tx.wait();
        setCandidates((prev) => [...prev, { addr, votes: 0 }]);
        addLog("✓ Candidate added: " + addr, "ok");
        return true;
      } catch (e) {
        addLog("Error: " + (e.reason || e.message), "err");
        return false;
      } finally {
        endAction();
      }
    },
    [contract, addLog, beginAction, endAction],
  );

  const addVoter = useCallback(
    async (addr) => {
      if (!ethers.utils.isAddress(addr)) {
        addLog("Invalid address", "err");
        return false;
      }
      try {
        beginAction("addVoter");
        addLog("Registering voter " + shortAddr(addr) + "…", "info");
        const tx = await contract.addVoter(addr);
        addLog("Tx sent, waiting for confirmation…", "info");
        await tx.wait();
        setVoters((prev) => [...prev, addr]);
        addLog("✓ Voter registered: " + addr, "ok");
        if (addr.toLowerCase() === account.toLowerCase()) setMyRegistered(true);
        return true;
      } catch (e) {
        addLog("Error: " + (e.reason || e.message), "err");
        return false;
      } finally {
        endAction();
      }
    },
    [contract, account, addLog, beginAction, endAction],
  );

  const startVoting = useCallback(async () => {
    try {
      beginAction("startVoting");
      addLog("Starting voting session…", "info");
      const tx = await contract.startVoting();
      await tx.wait();
      setVotingState(1);
      addLog("✓ Voting is now ACTIVE", "ok");
    } catch (e) {
      addLog("Error: " + (e.reason || e.message), "err");
    } finally {
      endAction();
    }
  }, [contract, addLog, beginAction, endAction]);

  const endVoting = useCallback(async () => {
    try {
      beginAction("endVoting");
      addLog("Ending voting session…", "info");
      const tx = await contract.endVoting();
      await tx.wait();
      setVotingState(2);
      addLog("✓ Voting ENDED — fetching winner…", "ok");
      try {
        const result = await contract.getWinner();
        const w = {
          addr: result.winnerAddress,
          votes: parseInt(result.votes),
          tie: result.tie,
        };
        setWinner(w);
        const candAddrs = await contract.getCandidates();
        const updated = await Promise.all(
          candAddrs.map(async (a) => {
            const d = await contract.candidates(a);
            return { addr: a, votes: parseInt(d.voteCount) };
          }),
        );
        setCandidates(updated);
        addLog(
          w.tie
            ? `⚖️ It's a tie! Highest: ${w.votes}`
            : `🏆 Winner: ${shortAddr(w.addr)} (${w.votes} votes)`,
          "ok",
        );
      } catch {
        addLog("Could not determine winner (no votes?)", "err");
      }
    } catch (e) {
      addLog("Error: " + (e.reason || e.message), "err");
    } finally {
      endAction();
    }
  }, [contract, addLog, beginAction, endAction]);

  const resetVoting = useCallback(async () => {
    try {
      beginAction("resetVoting");
      addLog("Resetting for new voting round…", "info");
      const tx = await contract.resetVoting();
      await tx.wait();
      setCandidates([]);
      setVoters([]);
      setWinner(null);
      setMyVoted(false);
      setMyRegistered(false);
      setVotingState(0);
      const rn = await contract.roundNumber();
      setRoundNumber(parseInt(rn));
      addLog(`✓ Round ${parseInt(rn)} ready — add candidates & voters`, "ok");
    } catch (e) {
      addLog("Error: " + (e.reason || e.message), "err");
    } finally {
      endAction();
    }
  }, [contract, addLog, beginAction, endAction]);

  const castVote = useCallback(
    async (candidateAddr) => {
      try {
        beginAction(`castVote:${candidateAddr.toLowerCase()}`);
        addLog("Casting vote for " + shortAddr(candidateAddr) + "…", "info");
        const tx = await contract.vote(candidateAddr);
        addLog("Tx sent, waiting for confirmation…", "info");
        await tx.wait();
        const data = await contract.candidates(candidateAddr);
        setCandidates((prev) =>
          prev.map((c) =>
            c.addr.toLowerCase() === candidateAddr.toLowerCase()
              ? { ...c, votes: parseInt(data.voteCount) }
              : c,
          ),
        );
        setMyVoted(true);
        addLog("✓ Vote cast successfully!", "ok");
      } catch (e) {
        addLog("Error: " + (e.reason || e.message), "err");
      } finally {
        endAction();
      }
    },
    [contract, addLog, beginAction, endAction],
  );

  const refreshVotes = useCallback(async () => {
    if (!contract) return;
    try {
      beginAction("refreshVotes");
      addLog("Refreshing vote counts…", "info");
      const candAddrs = await contract.getCandidates();
      const updated = await Promise.all(
        candAddrs.map(async (a) => {
          const d = await contract.candidates(a);
          return { addr: a, votes: parseInt(d.voteCount) };
        }),
      );
      setCandidates(updated);
      addLog("✓ Vote counts refreshed", "ok");
    } catch (e) {
      addLog("Refresh failed: " + e.message, "err");
    } finally {
      endAction();
    }
  }, [contract, addLog, beginAction, endAction]);

  return {
    account,
    isOwner,
    votingState,
    candidates,
    voters,
    winner,
    roundNumber,
    logs,
    loading,
    actionLoading,
    myVoted,
    myRegistered,
    connectWallet,
    addCandidate,
    addVoter,
    startVoting,
    endVoting,
    resetVoting,
    castVote,
    refreshVotes,
  };
}

export function shortAddr(a) {
  if (!a || a === ethers.constants.AddressZero) return "—";
  return a.slice(0, 6) + "…" + a.slice(-4);
}
