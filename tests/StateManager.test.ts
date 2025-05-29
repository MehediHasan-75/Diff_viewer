import { StateManager } from "../src/core/StateManager";
import { DiffResult } from "../src/types";

describe("StateManager", () => {
  let stateManager: StateManager;

  beforeEach(() => {
    stateManager = new StateManager();
  });

  test("should initialize with empty state", () => {
    expect(stateManager.getOldCode()).toBe("");
    expect(stateManager.getNewCode()).toBe("");
    expect(stateManager.getDiff()).toBeNull();
  });

  test("should set and get code", () => {
    const oldCode = "old code";
    const newCode = "new code";

    stateManager.setCode(oldCode, newCode);

    expect(stateManager.getOldCode()).toBe(oldCode);
    expect(stateManager.getNewCode()).toBe(newCode);
  });

  test("should set and get diff", () => {
    const mockDiff: DiffResult = {
      blocks: [],
      stats: {
        additions: 0,
        deletions: 0,
      },
    };

    stateManager.setDiff(mockDiff);
    expect(stateManager.getDiff()).toBe(mockDiff);
  });

  test("should notify subscribers when diff changes", () => {
    const mockDiff: DiffResult = {
      blocks: [],
      stats: {
        additions: 0,
        deletions: 0,
      },
    };

    const mockCallback = jest.fn();
    stateManager.subscribe(mockCallback);

    stateManager.setDiff(mockDiff);
    expect(mockCallback).toHaveBeenCalledWith(mockDiff);
  });

  test("should unsubscribe correctly", () => {
    const mockDiff: DiffResult = {
      blocks: [],
      stats: {
        additions: 0,
        deletions: 0,
      },
    };

    const mockCallback = jest.fn();
    const unsubscribe = stateManager.subscribe(mockCallback);

    unsubscribe();
    stateManager.setDiff(mockDiff);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test("should reset state correctly", () => {
    const oldCode = "old code";
    const newCode = "new code";
    const mockDiff: DiffResult = {
      blocks: [],
      stats: {
        additions: 0,
        deletions: 0,
      },
    };

    stateManager.setCode(oldCode, newCode);
    stateManager.setDiff(mockDiff);

    stateManager.reset();

    expect(stateManager.getOldCode()).toBe("");
    expect(stateManager.getNewCode()).toBe("");
    expect(stateManager.getDiff()).toBeNull();
  });
});
