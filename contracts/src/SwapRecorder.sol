// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/**
 * @title SwapRecorder
 * @dev Records OKB → Fan Token swaps on-chain
 * Emits events for Ponder indexer to track momentum
 */

interface IFanToken {
    function mint(address to, uint256 amount) external;
}

/**
 * @title SwapRecorder
 * @dev Simple contract to record fan token swaps on X Layer Testnet
 */
contract SwapRecorder {
    // Constants
    uint256 public constant SWAP_RATE = 15; // 1 OKB = 1.5 fan tokens (15 / 10)

    // State
    mapping(address => uint256) public teamMomentum; // team => momentum
    mapping(address => uint256) public supporters; // team => supporter count
    mapping(address => uint256) public volume24h; // team => 24h swap volume

    // Team configuration
    mapping(string => address) public teamCodeToToken; // "ARG" => token address
    mapping(address => string) public tokenToTeamCode; // token address => "ARG"
    mapping(address => bool) public registeredTeams;

    address public owner;

    // Events for Ponder indexer
    event SwapExecuted(
        address indexed trader,
        address indexed teamToken,
        string indexed teamCode,
        uint256 okbAmount,
        uint256 tokenAmount,
        uint256 timestamp
    );

    event MomentumChanged(
        address indexed teamToken,
        string indexed teamCode,
        uint256 oldMomentum,
        uint256 newMomentum,
        uint256 timestamp
    );

    event SupporterPointsAwarded(
        address indexed trader,
        address indexed teamToken,
        string indexed teamCode,
        uint256 points,
        uint256 timestamp
    );

    event TeamRegistered(
        address indexed teamToken,
        string indexed teamCode,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Register a fan token for swaps
     */
    function registerTeam(address teamToken, string calldata teamCode) external onlyOwner {
        require(teamToken != address(0), "Invalid token address");
        require(bytes(teamCode).length == 3, "Team code must be 3 chars");
        require(!registeredTeams[teamToken], "Team already registered");

        registeredTeams[teamToken] = true;
        teamCodeToToken[teamCode] = teamToken;
        tokenToTeamCode[teamToken] = teamCode;

        emit TeamRegistered(teamToken, teamCode, block.timestamp);
    }

    /**
     * @dev Execute a swap: send OKB, receive fan tokens
     * This is a payable function - user sends OKB in the transaction
     */
    function swap(address teamToken) external payable {
        require(registeredTeams[teamToken], "Team not registered");
        require(msg.value > 0, "Must send OKB");

        string memory teamCode = tokenToTeamCode[teamToken];

        // Calculate tokens to mint: 1 OKB = 1.5 tokens
        // msg.value is in wei, so we need to handle decimals
        // Assuming 18 decimals: 1 OKB = 1e18 wei
        uint256 tokenAmount = (msg.value * SWAP_RATE) / 10;

        // Mint tokens to trader
        IFanToken(teamToken).mint(msg.sender, tokenAmount);

        // Update momentum (1 OKB swap = 1 momentum point)
        uint256 oldMomentum = teamMomentum[teamToken];
        uint256 newMomentum = oldMomentum + (msg.value / 1e18);
        teamMomentum[teamToken] = newMomentum;

        // Track 24h volume
        volume24h[teamToken] += msg.value;

        // Update supporter count (first time buying this team)
        // Simplified: just track unique addresses per team
        supporters[teamToken] += 1; // This would need better logic in production

        // Emit events for Ponder indexer
        emit SwapExecuted(
            msg.sender,
            teamToken,
            teamCode,
            msg.value,
            tokenAmount,
            block.timestamp
        );

        emit MomentumChanged(
            teamToken,
            teamCode,
            oldMomentum,
            newMomentum,
            block.timestamp
        );

        emit SupporterPointsAwarded(
            msg.sender,
            teamToken,
            teamCode,
            10 + (msg.value / 1e18), // Base 10 points + 1 per OKB
            block.timestamp
        );
    }

    /**
     * @dev Get team momentum
     */
    function getMomentum(address teamToken) external view returns (uint256) {
        require(registeredTeams[teamToken], "Team not registered");
        return teamMomentum[teamToken];
    }

    /**
     * @dev Get team 24h volume
     */
    function getVolume24h(address teamToken) external view returns (uint256) {
        require(registeredTeams[teamToken], "Team not registered");
        return volume24h[teamToken];
    }

    /**
     * @dev Get supporter count for team
     */
    function getSupporters(address teamToken) external view returns (uint256) {
        require(registeredTeams[teamToken], "Team not registered");
        return supporters[teamToken];
    }

    /**
     * @dev Reset 24h volume (called by bot/cron job daily)
     */
    function reset24hVolume(address teamToken) external onlyOwner {
        require(registeredTeams[teamToken], "Team not registered");
        volume24h[teamToken] = 0;
    }

    /**
     * @dev Owner can withdraw collected OKB
     */
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    /**
     * @dev Allow contract to receive OKB
     */
    receive() external payable {}
}
