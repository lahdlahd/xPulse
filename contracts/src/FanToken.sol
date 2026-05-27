// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/**
 * @title FanToken
 * @dev ERC20 token for World Cup fan tokens on X Layer
 * Each team (ARG, BRA, ENG, FRA, ESP) has its own fan token
 */

abstract contract ERC20 {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory _name, string memory _symbol, uint256 initialSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = initialSupply * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(to != address(0), "Invalid address");
        require(balanceOf[msg.sender] >= value, "Insufficient balance");

        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;

        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(to != address(0), "Invalid address");
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Allowance exceeded");

        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;

        emit Transfer(from, to, value);
        return true;
    }

    function mint(address to, uint256 amount) public virtual {
        revert("Not implemented");
    }

    function burn(uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");

        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;

        emit Transfer(msg.sender, address(0), amount);
        return true;
    }
}

/**
 * @title FanToken
 * @dev Specific fan token implementation for each World Cup team
 */
contract FanToken is ERC20 {
    address public owner;
    address public minter; // SwapRecorder or other authorized contract
    string public teamCode; // ARG, BRA, ENG, FRA, ESP
    uint256 public swapCount; // Tracks number of swaps
    uint256 public totalVolume; // Total swap volume in this token

    event SwapExecuted(address indexed trader, uint256 amountIn, uint256 amountOut);
    event MomentumUpdated(uint256 newMomentum, uint256 timestamp);

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _teamCode,
        uint256 initialSupply
    ) ERC20(_name, _symbol, initialSupply) {
        owner = msg.sender;
        teamCode = _teamCode;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyMinter() {
        require(msg.sender == minter || msg.sender == owner, "Only minter");
        _;
    }

    /**
     * @dev Set authorized minter (e.g., SwapRecorder contract)
     */
    function setMinter(address _minter) external onlyOwner {
        require(_minter != address(0), "Invalid minter address");
        minter = _minter;
    }

    /**
     * @dev Mint tokens (owner or authorized minter like SwapRecorder)
     */
    function mint(address to, uint256 amount) public override onlyMinter {
        require(to != address(0), "Invalid address");
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }

    /**
     * @dev Record a swap event (called by Hook or external swaps)
     * Updates momentum tracking for leaderboard
     */
    function recordSwap(address trader, uint256 amountIn, uint256 amountOut) external onlyOwner {
        swapCount += 1;
        totalVolume += amountIn;
        emit SwapExecuted(trader, amountIn, amountOut);
        emit MomentumUpdated(calculateMomentum(), block.timestamp);
    }

    /**
     * @dev Calculate current momentum based on swap activity
     * Base momentum: 1 per swap
     * Boost: 2x if >5 swaps in last block, 3x if >10
     */
    function calculateMomentum() public view returns (uint256) {
        if (swapCount == 0) return 0;
        
        uint256 momentum = swapCount;
        
        // Volume multiplier: additional 0.5x per 1000 tokens swapped
        momentum += (totalVolume / 1000 ether / 2);
        
        return momentum;
    }

    /**
     * @dev Get token statistics for dashboard
     */
    function getStats() external view returns (
        uint256 _totalSupply,
        uint256 _swapCount,
        uint256 _totalVolume,
        uint256 _momentum
    ) {
        return (totalSupply, swapCount, totalVolume, calculateMomentum());
    }
}
