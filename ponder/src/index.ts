import { ponder } from "@ponder/core";

// Handle SwapExecuted events
ponder.on("SwapRecorder:SwapExecuted", async ({ event, context }) => {
  const { Team, Swap } = context.db;

  const { trader, teamToken, teamCode, okbAmount, tokenAmount, timestamp } =
    event.args;

  const teamId = teamToken.toLowerCase();

  // Create team if doesn't exist, or update volume
  const existingTeam = await Team.findUnique({
    id: teamId,
  });

  if (existingTeam) {
    await Team.update({
      id: teamId,
      data: {
        totalSwaps: existingTeam.totalSwaps + 1n,
        totalVolume24h: existingTeam.totalVolume24h + BigInt(okbAmount),
        lastUpdated: timestamp,
      },
    });
  } else {
    await Team.create({
      id: teamId,
      data: {
        teamCode,
        address: teamToken,
        currentMomentum: 0,
        momentumHistory: "[]",
        totalSwaps: 1n,
        totalVolume24h: BigInt(okbAmount),
        totalSupporters: 0,
        priceChange24h: 0,
        lastUpdated: timestamp,
        createdAt: timestamp,
      },
    });
  }

  // Record swap
  await Swap.create({
    id: `${event.transactionHash}-${event.logIndex}`,
    teamAAddress: teamToken,
    teamACode: teamCode,
    teamBAddress: "0x0000000000000000000000000000000000000000",
    teamBCode: "OKB",
    amount0In: BigInt(okbAmount),
    amount1In: 0n,
    amount0Out: 0n,
    amount1Out: BigInt(tokenAmount),
    totalValue: BigInt(okbAmount),
    timestamp,
    blockNumber: event.blockNumber,
    transactionHash: event.transactionHash,
  });
});

// Handle MomentumChanged events
ponder.on("SwapRecorder:MomentumChanged", async ({ event, context }) => {
  const { Team, MomentumChange } = context.db;

  const { teamToken, teamCode, oldMomentum, newMomentum, timestamp } =
    event.args;

  const teamId = teamToken.toLowerCase();

  // Update team momentum
  const existingTeam = await Team.findUnique({
    id: teamId,
  });

  const momentumDelta = Number(newMomentum) - Number(oldMomentum);

  if (existingTeam) {
    await Team.update({
      id: teamId,
      data: {
        currentMomentum: Number(newMomentum),
        momentumHistory: JSON.stringify([
          Number(newMomentum),
          ...JSON.parse(existingTeam.momentumHistory || "[]").slice(0, 99),
        ]),
        lastUpdated: timestamp,
      },
    });
  } else {
    await Team.create({
      id: teamId,
      data: {
        teamCode,
        address: teamToken,
        currentMomentum: Number(newMomentum),
        momentumHistory: JSON.stringify([Number(newMomentum)]),
        totalSwaps: 0n,
        totalVolume24h: 0n,
        totalSupporters: 0,
        priceChange24h: 0,
        lastUpdated: timestamp,
        createdAt: timestamp,
      },
    });
  }

  // Record momentum change
  await MomentumChange.create({
    id: `${event.transactionHash}-${event.logIndex}`,
    teamAddress: teamToken,
    teamCode,
    oldMomentum: Number(oldMomentum),
    newMomentum: Number(newMomentum),
    momentumDelta,
    timestamp,
    blockNumber: event.blockNumber,
    transactionHash: event.transactionHash,
  });
});

// Handle SupporterPointsAwarded events
ponder.on(
  "SwapRecorder:SupporterPointsAwarded",
  async ({ event, context }) => {
    const { Team, SupporterPoints } = context.db;

    const { trader, teamToken, teamCode, points, timestamp } = event.args;

    const teamId = teamToken.toLowerCase();

    // Increment supporter count for team
    const existingTeam = await Team.findUnique({
      id: teamId,
    });

    if (existingTeam) {
      // Check if this is a new supporter (would need a Supporter table)
      // For now, just increment counter on first point award
      await Team.update({
        id: teamId,
        data: {
          lastUpdated: timestamp,
        },
      });
    }

    // Record points award
    await SupporterPoints.create({
      id: `${event.transactionHash}-${event.logIndex}`,
      supporterAddress: trader,
      teamAddress: teamToken,
      teamCode,
      pointsAwarded: BigInt(points),
      totalPoints: BigInt(points), // Would need to accumulate from DB
      timestamp,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
    });
  }
);
