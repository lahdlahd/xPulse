/**
 * Team Token Addresses
 * Maps team codes to their deployed token contract addresses
 */

import type { TeamCode } from '@/types';

/**
 * Get token address for a team
 * Reads from environment variables
 */
export function getTeamTokenAddress(teamCode: TeamCode): `0x${string}` {
  const envKey = `NEXT_PUBLIC_${teamCode}_TOKEN_ADDRESS`;
  const address = process.env[envKey];

  if (!address || address === '0x') {
    console.warn(`Token address for ${teamCode} not configured`);
    return '0x' as `0x${string}`;
  }

  return address as `0x${string}`;
}

/**
 * Get all team token addresses
 */
export function getAllTeamTokenAddresses(): Record<TeamCode, `0x${string}`> {
  const teamCodes: TeamCode[] = [
    'ARG', 'AUS', 'BEL', 'BRA', 'CMR', 'CAN', 'CRC', 'CRO',
    'DEN', 'ECU', 'ENG', 'FRA', 'DEU', 'GHA', 'IRN', 'JPN',
    'MEX', 'MOR', 'NED', 'POL', 'POR', 'QAT', 'KOR', 'SAU',
    'SRB', 'SEN', 'ESP', 'SUI', 'TUN', 'USA', 'URY', 'WAL',
  ];

  const addresses: Record<TeamCode, `0x${string}`> = {} as Record<TeamCode, `0x${string}`>;
  
  teamCodes.forEach((code) => {
    addresses[code] = getTeamTokenAddress(code);
  });

  return addresses;
}
