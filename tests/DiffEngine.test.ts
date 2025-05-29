import { DiffEngine } from "../src/core/DiffEngine";
import "@types/jest";

describe("DiffEngine", () => {
  let diffEngine: DiffEngine;

  beforeEach(() => {
    diffEngine = new DiffEngine();
  });

  test("should compute diff between two strings", () => {
    const oldText = "Hello\nWorld";
    const newText = "Hello\nWorld!\nGoodbye";

    const result = diffEngine.computeDiff(oldText, newText);

    expect(result.stats.additions).toBe(1);
    expect(result.stats.deletions).toBe(0);
    expect(result.blocks.length).toBe(1);

    const block = result.blocks[0];
    expect(block.lines.length).toBe(3);
    expect(block.lines[0].type).toBe("context");
    expect(block.lines[1].type).toBe("context");
    expect(block.lines[2].type).toBe("add");
  });

  test("should handle empty strings", () => {
    const result = diffEngine.computeDiff("", "");

    expect(result.stats.additions).toBe(0);
    expect(result.stats.deletions).toBe(0);
    expect(result.blocks.length).toBe(0);
  });

  test("should handle complete replacement", () => {
    const oldText = "Old content";
    const newText = "New content";

    const result = diffEngine.computeDiff(oldText, newText);

    expect(result.stats.additions).toBe(1);
    expect(result.stats.deletions).toBe(1);
    expect(result.blocks.length).toBe(1);

    const block = result.blocks[0];
    expect(block.lines.length).toBe(2);
    expect(block.lines[0].type).toBe("remove");
    expect(block.lines[1].type).toBe("add");
  });
});
