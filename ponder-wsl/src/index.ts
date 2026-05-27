import { on } from "@ponder/core";

// Handle MomentumChanged events
on("FanXPulseHook:MomentumChanged", async ({ event, context }) => {
  const { Team, MomentumChange } = context.db;
  const { team, oldMomentum, newMomentum, timestamp } = event.args;
  const teamId = team.toLowerCase();

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
      lastUpdated: timestamp,
      createdAt: timestamp,
    },
    update: {
      currentMomentum: Number(newMomentum),
      lastUpdated: timestamp,
    },
  });

  // Record momentum change
  await MomentumChange.create({
    id: `${event.transactionHash}-${event.logIndex}`,
    teamAddress: team,
    oldMomentum: Number(oldMomentum),
    newMomentum: Number(newMomentum),
    momentumDelta: Number(newMomentum) - Number(oldMomentum),
    timestamp,
    blockNumber: event.blockNumber,
    transactionHash: event.transactionHash,
  });
});

// Handle SupporterPointsAwarded events
on("FanXPulseHook:SupporterPointsAwarded", async ({ event, context }) => {
  const { Supporter, SupporterPoints, Team } = context.db;
  const { supporter, team, points, timestamp } = event.args;
  const supporterId = supporter.toLowerCase();

  // Update supporter
  const existingSupporter = await Supporter.findUnique({ id: supporterId });
  const newTotalPoints = existingSupporter
    ? existingSupporter.totalPoints + points
    : points;

  await Supporter.upsert({
    id: supporterId,
    create: {
      address: supporter,
      totalPoints: points,
      favoriteTeamAddress: team,
      swapCount: 0,
      lastSwapTime: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    update: {
      totalPoints: newTotalPoints,
      favoriteTeamAddress: team,
      updatedAt: timestamp,
    },
  });

  // Increment team supporter count if new
  if (!existingSupporter) {
    const teamRecord = await Team.findUnique({ id: team.toLowerCase() });
    if (teamRecord) {
      await Team.update({
        id: team.toLowerCase(),
        data: { totalSupporters: teamRecord.totalSupporters + 1 },
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
on("FanXPulseHook:SwapExecuted", async ({ event, context }) => {
  const { Team, Swap } = context.db;
  const { teamA, teamB, amount0In, amount1In, amount0Out, amount1Out, timestamp } = event.args;

  // Update both teams
  const updateTeam = async (teamAddress: string, volumeIn: bigint) => {
    const teamId = teamAddress.toLowerCase();
    const team = await Team.findUnique({ id: teamId });
    if (team) {
      await Team.update({
        id: teamId,
        data: {
          totalSwaps: team.totalSwaps + 1n,
          totalVolume24h: team.totalVolume24h + volumeIn,
          lastUpdated: timestamp,
        },
      });
    }
  };

  await updateTeam(teamA, amount0In);
  await updateTeam(teamB, amount1In);

  // Record swap
  await Swap.create({
    id: `${event.transactionHash}-${event.logIndex}`,
    teamAAddress: teamA,
    teamBAddress: teamB,
    amount0In,
    amount1In,
    amount0Out,
    amount1Out,
    totalValue: amount0In >= amount1In ? amount0In : amount1In,
    timestamp,
    blockNumber: event.blockNumber,
    transactionHash: event.transactionHash,
  });
});
