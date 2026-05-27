// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/**
 * @title FanXPulseHook
 * @dev Uniswap V4 Hook for FanXPulse momentum tracking
 * 
 * Every swap triggers this hook, which:
 * 1. Updates team momentum
 * 2. Tracks supporter points
 * 3. Updates leaderboard rankings
 * 4. Emits events for Ponder indexer
 *
 * This is the CORE product feature for the hackathon.
 */

interface IPoolManager {
    function lock(bytes calldata data) external;
}

interface IHook {
    function beforeSwap(
        address sender,
        address pool,
        uint256 amount0In,
        uint256 amount1In,
        uint256 amount0Out,
        uint256 amount1Out,
        bytes calldata data
    ) external returns (bytes4);

    function afterSwap(
        address sender,
        address pool,
        uint256 amount0In,
        uint256 amount1In,
        uint256 amount0Out,
        uint256 amount1Out,
        bytes calldata data
    ) external returns (bytes4);
}

/**
 * @dev Momentum calculation engine
 */
library MomentumEngine {
    // Configuration
    uint256 public constant BASE_SWAP_MOMENTUM = 1 ether;
    uint256 public constant CONSECUTIVE_BUY_MULTIPLIER = 150; // 1.5x = 150%
    uint256 public constant HIGH_VELOCITY_BOOST = 250; // 2.5x = 250%

    struct MomentumState {
        uint256 baseValue;
        uint256 consecutiveBuys;
        uint256 lastSwapTime;
        uint256 volumeInLastHour;
    }

    /**
     * @dev Calculate momentum increase for a swap
     */
    function calculateSwapMomentum(
        MomentumState memory state,
        uint256 swapAmount
    ) internal pure returns (uint256) {
        uint256 momentum = BASE_SWAP_MOMENTUM;

        // Consecutive buy bonus
        if (state.consecutiveBuys > 0) {
            momentum = momentum * state.consecutiveBuys * CONSECUTIVE_BUY_MULTIPLIER / 100;
        }

        // High velocity boost (multiple swaps in short time)
        if (state.volumeInLastHour > 10 ether) {
            momentum = momentum * HIGH_VELOCITY_BOOST / 100;
        }

        return momentum;
    }
}

/**
 * @dev Supporter points tracking (simplified)
 */
library SupporterPoints {
    uint256 public constant BASE_SWAP_POINTS = 10;

    function calculateSwapPoints(uint256 swapAmount) internal pure returns (uint256) {
        return BASE_SWAP_POINTS + (swapAmount / 1 ether);
    }
}

/**
 * @title FanXPulseHook
 * @dev Main hook implementation
 */
contract FanXPulseHook {
    // State tracking
    mapping(address => uint256) public teamMomentum; // team => momentum value
    mapping(address => uint256) public supporterPoints; // supporter => total points
    mapping(address => uint256) public lastSwapTime; // supporter => last swap timestamp
    mapping(address => bool) public isTeam; // verify if address is a valid team

    // Event emissions for Ponder indexer
    event HookInitialized(address indexed hookAddress, uint256 timestamp);
    event SwapExecuted(
        address indexed teamA,
        address indexed teamB,
        uint256 amount0In,
        uint256 amount1In,
        uint256 amount0Out,
        uint256 amount1Out,
        uint256 timestamp
    );
    event MomentumChanged(
        address indexed team,
        uint256 oldMomentum,
        uint256 newMomentum,
        uint256 timestamp
    );
    event SupporterPointsAwarded(
        address indexed supporter,
        address indexed team,
        uint256 points,
        uint256 timestamp
    );
    event StreakDetected(
        address indexed supporter,
        address indexed team,
        uint256 streakCount,
        uint256 multiplier
    );

    address public owner;
    IPoolManager public poolManager;

    // Team configuration
    address[] public registeredTeams;
    mapping(address => string) public teamCodes; // address => "ARG", "BRA", etc.

    constructor() {
        owner = msg.sender;
        emit HookInitialized(address(this), block.timestamp);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    /**
     * @dev Register a team token address
     */
    function registerTeam(address teamToken, string calldata code) external onlyOwner {
        require(!isTeam[teamToken], "Team already registered");
        
        isTeam[teamToken] = true;
        teamCodes[teamToken] = code;
        registeredTeams.push(teamToken);
    }

    /**
     * @dev Hook called BEFORE a swap
     * Returns the hook response bytes to signal success
     */
    function beforeSwap(
        address sender,
        address pool,
        uint256 amount0In,
        uint256 amount1In,
        uint256 amount0Out,
        uint256 amount1Out,
        bytes calldata data
    ) external returns (bytes4) {
        // Extract team addresses from pool (simplified for MVP)
        // Full implementation would decode pool configuration
        
        return this.beforeSwap.selector;
    }

    /**
     * @dev Hook called AFTER a swap - simplified version
     */
    function afterSwap(
        address sender,
        address team,
        uint256 amount0In,
        uint256 amount1In,
        uint256 amount0Out,
        uint256 amount1Out,
        bytes calldata data
    ) external returns (bytes4) {
        require(isTeam[team], "Invalid team");

        uint256 swapAmount = amount0In > 0 ? amount0In : amount1In;
        
        // Update momentum
        teamMomentum[team] += (swapAmount / 1 ether);
        
        // Award points
        uint256 points = SupporterPoints.calculateSwapPoints(swapAmount);
        supporterPoints[sender] += points;
        lastSwapTime[sender] = block.timestamp;
        
        // Emit events
        emit MomentumChanged(team, teamMomentum[team] - (swapAmount / 1 ether), teamMomentum[team], block.timestamp);
        emit SupporterPointsAwarded(sender, team, points, block.timestamp);

        return this.afterSwap.selector;
    }

    /**
     * @dev Get team momentum
     */
    function getMomentum(address team) external view returns (uint256) {
        require(isTeam[team], "Invalid team");
        return teamMomentum[team];
    }

    /**
     * @dev Get supporter points
     */
    function getSupporterPoints(address supporter) external view returns (uint256) {
        return supporterPoints[supporter];
    }

    /**
     * @dev Get all registered teams
     */
    function getTeams() external view returns (address[] memory) {
        return registeredTeams;
    }

    /**
     * @dev Get leaderboard (top 10 teams by momentum)
     * Simplified version - production would use proper sorting
     */
    function getLeaderboard() external view returns (address[] memory teams, uint256[] memory momentums) {
        teams = new address[](registeredTeams.length);
        momentums = new uint256[](registeredTeams.length);

        for (uint256 i = 0; i < registeredTeams.length; i++) {
            teams[i] = registeredTeams[i];
            momentums[i] = teamMomentum[registeredTeams[i]];
        }

        return (teams, momentums);
    }
}
