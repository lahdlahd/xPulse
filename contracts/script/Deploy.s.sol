// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/FanToken.sol";
import "../src/FanXPulseHook.sol";

/**
 * @title DeployScript
 * @dev Deployment script for PHASE 2 smart contracts
 * 
 * Deploy:
 * forge script script/Deploy.s.sol --rpc-url https://testrpc.xlayer.tech --private-key YOUR_KEY --broadcast
 */
contract DeployScript is Script {
    FanXPulseHook public hook;
    FanToken[] public teamTokens;

    function run() external {
        vm.startBroadcast();

        // Deploy the main hook
        hook = new FanXPulseHook();
        console.log("FanXPulseHook deployed at:", address(hook));

        // Deploy fan tokens for all 32 World Cup teams
        string[32] memory teamNames = [
            "Argentina Fans", "Australia Fans", "Belgium Fans", "Brazil Fans",
            "Cameroon Fans", "Canada Fans", "Costa Rica Fans", "Croatia Fans",
            "Denmark Fans", "Ecuador Fans", "England Fans", "France Fans",
            "Germany Fans", "Ghana Fans", "Iran Fans", "Japan Fans",
            "Mexico Fans", "Morocco Fans", "Netherlands Fans", "Poland Fans",
            "Portugal Fans", "Qatar Fans", "South Korea Fans", "Saudi Arabia Fans",
            "Serbia Fans", "Senegal Fans", "Spain Fans", "Switzerland Fans",
            "Tunisia Fans", "USA Fans", "Uruguay Fans", "Wales Fans"
        ];
        
        string[32] memory teamCodes = [
            "ARG", "AUS", "BEL", "BRA",
            "CMR", "CAN", "CRC", "CRO",
            "DEN", "ECU", "ENG", "FRA",
            "DEU", "GHA", "IRN", "JPN",
            "MEX", "MOR", "NED", "POL",
            "POR", "QAT", "KOR", "SAU",
            "SRB", "SEN", "ESP", "SUI",
            "TUN", "USA", "URY", "WAL"
        ];

        for (uint256 i = 0; i < 32; i++) {
            FanToken token = new FanToken(
                teamNames[i],
                teamCodes[i],
                teamCodes[i],
                1_000_000
            );
            teamTokens.push(token);
            hook.registerTeam(address(token), teamCodes[i]);
        }

        vm.stopBroadcast();

        console.log("Deployment complete! All 32 teams deployed.");
    }
}
