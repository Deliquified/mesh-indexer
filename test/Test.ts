import assert from "assert";
import { 
  TestHelpers,
  Mesh_DataChanged
} from "generated";
const { MockDb, Mesh } = TestHelpers;

describe("Mesh contract DataChanged event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for Mesh contract DataChanged event
  const event = Mesh.DataChanged.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("Mesh_DataChanged is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await Mesh.DataChanged.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualMeshDataChanged = mockDbUpdated.entities.Mesh_DataChanged.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedMeshDataChanged: Mesh_DataChanged = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      dataKey: event.params.dataKey,
      dataValue: event.params.dataValue,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualMeshDataChanged, expectedMeshDataChanged, "Actual MeshDataChanged should be the same as the expectedMeshDataChanged");
  });
});
