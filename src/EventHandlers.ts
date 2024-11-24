/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  Mesh,
  Mesh_DataChanged,
  Mesh_OperatorAuthorizationChanged,
  Mesh_OperatorRevoked,
  Mesh_OwnershipTransferred,
  Mesh_Transfer,
  MintTracking,
} from "generated";

Mesh.DataChanged.handler(async ({ event, context }) => {
  const entity: Mesh_DataChanged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    dataKey: event.params.dataKey,
    dataValue: event.params.dataValue,
  };

  context.Mesh_DataChanged.set(entity);
});


Mesh.OperatorAuthorizationChanged.handler(async ({ event, context }) => {
  const entity: Mesh_OperatorAuthorizationChanged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`, 
    operator: event.params.operator,
    tokenOwner: event.params.tokenOwner,
    amount: event.params.amount,
    operatorNotificationData: event.params.operatorNotificationData,
  };
 
  context.Mesh_OperatorAuthorizationChanged.set(entity);
});


Mesh.OperatorRevoked.handler(async ({ event, context }) => {
  const entity: Mesh_OperatorRevoked = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    operator: event.params.operator,
    tokenOwner: event.params.tokenOwner,
    notified: event.params.notified,
    operatorNotificationData: event.params.operatorNotificationData,
  };

  context.Mesh_OperatorRevoked.set(entity);
});


Mesh.OwnershipTransferred.handler(async ({ event, context }) => {
  const entity: Mesh_OwnershipTransferred = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    previousOwner: event.params.previousOwner,
    newOwner: event.params.newOwner,
  };

  context.Mesh_OwnershipTransferred.set(entity);
});


Mesh.Transfer.handler(async ({ event, context }) => {
  const entity: Mesh_Transfer = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    operator: event.params.operator,
    from: event.params.from,
    to: event.params.to,
    amount: event.params.amount,
    force: event.params.force,
    data: event.params.data,
  };
   // Track minting specifically - when from is zero address
  if (event.params.from === '0x0000000000000000000000000000000000000000') {
    const mintEntity = {
      id: event.params.to,
      mintCount: 1,
      lastMintTime: event.block.timestamp,
      totalMinted: event.params.amount
    };
     // Get existing mint data if any
    const existingMintData = await context.MintTracking.get(event.params.to);
    if (existingMintData) {
      mintEntity.mintCount = existingMintData.mintCount + 1;
      mintEntity.totalMinted = existingMintData.totalMinted + event.params.amount;
    }
     context.MintTracking.set(mintEntity);
  }
  context.Mesh_Transfer.set(entity);
});

