import { ponder } from "@ponder/core";

// Handle MomentumChanged events
ponder.on("FanXPulseHook:MomentumChanged", async ({ event, context }) => {
  const { Team, MomentumChange } = context.db;

  const { team, oldMomentum, newMomentum, timestamp } = event.args;

  // Create or update team record
  const teamId = team.toLowerCase();
  const existingTeam = await Team.findUnique({
    id: teamId,
  });

  const momentumDelta = Number(newMomentum) - Number(oldMomentum);

  // Update team momentum
  await Team.upsert({
    id: teamId,
    create: {
      address: team,
      currentMomentum: Number(newMomentum),
      momentumHistory: JSON.stringify([Number(newMomentum)]),
      totalSwaps: 0n,
      totalVolume24h: 0n,
      totalSupporters: 0,
      priceChange24h: 0,
      lastUpdated: timestamp,
      createdAt: timestamp,
    },
    update: {
      currentMomentum: Number(newMomentum),
      // Add to momentum history
      momentumHistory: existingTeam
        ? JSON.stringify([
            Number(newMomentum),
            ...JSON.parse(existingTeam.momentumHistory || "[]").slice(0, 99),
          ])
        : JSON.stringify([Number(newMomentum)]),
      lastUpdated: timestamp,
    },
  });

  // Record momentum change event
  await MomentumChange.create({
    id: `${event.transactionHash}-${event.logIndex}`,
    teamAddress: team,
    oldMomentum: Number(oldMomentum),
    newMomentum: Number(newMomentum),
    momentumDelta,
    timestamp,
    blockNumber: event.blockNumber,
    transactionHash: event.transactionHash,
  });
});

// Handle SupporterPointsAwarded events
ponder.on("FanXPulseHook:SupporterPointsAwarded", async ({ event, context }) => {
  const { Supporter, SupporterPoints, Team } = context.db;

  const { supporter, team, points, timestamp } = event.args;

  // Update or create supporter
  const supporterId = supporter.toLowerCase();
  const existingSupporter = await Supporter.findUnique({
    id: supporterId,
  });

  const newTotalPoints = existingSupporter
    ? existingSupporter.totalPoints + points
    : points;

  await Supporter.upsert({
    id: supporterId,
    create: {
      address: supporter,
      totalPoints: points,
      favoriteTeam: "", // Will be set based on most points
      favoriteTeamAddress: team,
      swapCount: 0,
      lastSwapTime: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    update: {
      totalPoints: newTotalPoints,
      favoriteTeamAddress: team, // Update to most recent team
      updatedAt: timestamp,
    },
  });

  // Increment team supporter count if new supporter
  if (!existingSupporter) {
    const teamRecord = await Team.findUnique({
      id: team.toLowerCase(),
    });

    if (teamRecord) {
      await Team.update({
        id: team.toLowerCase(),
        data: {
          totalSupporters: teamRecord.totalSupporters + 1,
        },
      });
    }
  }

  // Record points event
  await SupporterPoints.create({
    id: `${event.transactionHash}-${event.logIndex}`,
    supporterAddress: supporter,
    teamAddress: team,
    pointsAwarded: points,
    totalPoints: newTotalPoints,
    timestamp,
    blockNumber: event.blockNumber,
    transactionHash: event.transactionHash,
  });
});

// Handle SwapExecuted events
ponder.on("FanXPulseHook:SwapExecuted", async ({ event, context }) => {
  const { Team, Swap } = context.db;

  const {
    teamA,
    teamB,
    amount0In,
    amount1In,
    amount0Out,
    amount1Out,
    timestamp,
  } = event.args;

  // Update both teams' swap counts and volumes
  const updateTeam = async (teamAddress: string, volumeIn: bigint) => {
    const teamId = teamAddress.toLowerCase();
    const team = await Team.findUnique({ id: teamId });

    if (team) {
      const newVolume = team.totalVolume24h + volumeIn;

      await Team.update({
        id: teamId,
        data: {
          totalSwaps: team.totalSwaps + 1n,
          totalVolume24h: newVolume,
          lastUpdated: timestamp,
        },
      });
    }
  };

  await updateTeam(teamA, amount0In);
  await updateTeam(teamB, amount1In);

  // Record swap event
  const totalValue = amount0In >= amount1In ? amount0In : amount1In;

  await Swap.create({
    id: `${event.transactionHash}-${event.logIndex}`,
    teamAAddress: teamA,
    teamACode: "", // Will be matched via team mapping
    teamBAddress: teamB,
    teamBCode: "", // Will be matched via team mapping
    amount0In,
    amount1In,
    amount0Out,
    amount1Out,
    totalValue,
    timestamp,
    blockNumber: event.blockNumber,
    transactionHash: event.transactionHash,
  });
});
