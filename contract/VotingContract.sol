// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


contract Voting {
    address public immutable owner;

    enum VotingState { NotStarted, Started, Ended }
    VotingState public votingState;

    struct Candidate {
        uint256 voteCount;
        bool    isRegistered;
    }

    mapping(address => Candidate) public candidates;
    mapping(address => bool)      public isVoterRegistered;
    mapping(address => bool)      public hasVoted;

    address[] public candidateList;  
    address[] public voterList;      

    address  public winner;
    uint256  public highestVotes;
    bool     public isTie;
    uint256  public roundNumber;     

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    modifier onlyDuringVoting() {
        require(votingState == VotingState.Started, "Voting not active");
        _;
    }
    modifier onlyAfterVoting() {
        require(votingState == VotingState.Ended, "Voting not ended");
        _;
    }

    constructor() {
        owner       = msg.sender;
        votingState = VotingState.NotStarted;
        roundNumber = 1;
    }

    function addCandidate(address _candidate) external onlyOwner {
        require(votingState == VotingState.NotStarted, "Already started");
        require(!candidates[_candidate].isRegistered,  "Candidate exists");
        candidates[_candidate] = Candidate(0, true);
        candidateList.push(_candidate);
    }

    function addVoter(address _voter) external onlyOwner {
        require(votingState == VotingState.NotStarted, "Already started");
        require(!isVoterRegistered[_voter], "Voter exists");
        isVoterRegistered[_voter] = true;
        voterList.push(_voter);
    }

    function startVoting() external onlyOwner {
        require(votingState == VotingState.NotStarted, "Not in NotStarted state");
        votingState = VotingState.Started;
    }

    function endVoting() external onlyOwner {
        require(votingState == VotingState.Started, "Not started");
        votingState = VotingState.Ended;
    }

    function resetVoting() external onlyOwner {
        require(votingState == VotingState.Ended, "Must end first");

    
        for (uint i = 0; i < candidateList.length; i++) {
            delete candidates[candidateList[i]];
        }
        delete candidateList;

        for (uint i = 0; i < voterList.length; i++) {
            isVoterRegistered[voterList[i]] = false;
            hasVoted[voterList[i]] = false;
        }
        delete voterList;

        winner       = address(0);
        highestVotes = 0;
        isTie        = false;
        votingState  = VotingState.NotStarted;
        roundNumber += 1;
    }

    function vote(address _candidate) external onlyDuringVoting {
        require(isVoterRegistered[msg.sender],    "Not registered voter");
        require(!hasVoted[msg.sender],             "Already voted");
        require(candidates[_candidate].isRegistered, "Invalid candidate");

        hasVoted[msg.sender] = true;
        uint256 newVotes = ++candidates[_candidate].voteCount;

        if (newVotes > highestVotes) {
            highestVotes = newVotes;
            winner       = _candidate;
            isTie        = false;
        } else if (newVotes == highestVotes && _candidate != winner) {
            isTie = true;
        }
    }

    function getWinner() external view onlyAfterVoting
        returns (address winnerAddress, uint256 votes, bool tie)
    {
        return (winner, candidates[winner].voteCount, isTie);
    }

    function getCandidates() external view returns (address[] memory) {
        return candidateList;
    }

    function getVoters() external view returns (address[] memory) {
        return voterList;
    }
}
