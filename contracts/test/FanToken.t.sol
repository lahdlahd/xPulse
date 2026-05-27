// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/FanToken.sol";

contract FanTokenTest is Test {
    FanToken fanToken;
    address owner = address(0x1);
    address user = address(0x2);

    function setUp() public {
        vm.prank(owner);
        fanToken = new FanToken("Argentina Fans", "ARG", "ARG", 1_000_000);
    }

    function testInitialSupply() public {
        assertEq(fanToken.totalSupply(), 1_000_000 ether);
    }

    function testOwnerBalance() public {
        assertEq(fanToken.balanceOf(owner), 1_000_000 ether);
    }

    function testTransfer() public {
        vm.prank(owner);
        fanToken.transfer(user, 100 ether);
        assertEq(fanToken.balanceOf(user), 100 ether);
        assertEq(fanToken.balanceOf(owner), 1_000_000 ether - 100 ether);
    }
}
