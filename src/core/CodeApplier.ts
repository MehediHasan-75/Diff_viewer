import { DiffResult, DiffBlock } from "../types";

export class CodeApplier {
  public applyChanges(oldCode: string, diff: DiffResult): string {
    const lines = oldCode.split("\n");
    let result = [...lines];

    // Apply changes in reverse order to maintain line numbers
    const sortedBlocks = [...diff.blocks].reverse();

    sortedBlocks.forEach((block) => {
      const changes = this.getBlockChanges(block);
      const startLine = this.getBlockStartLine(block);

      // Remove lines first
      if (changes.removals.length > 0) {
        result.splice(startLine, changes.removals.length);
      }

      // Then add new lines
      if (changes.additions.length > 0) {
        result.splice(startLine, 0, ...changes.additions);
      }
    });

    return result.join("\n");
  }

  public rejectChanges(newCode: string, diff: DiffResult): string {
    const lines = newCode.split("\n");
    let result = [...lines];

    // Apply changes in reverse order to maintain line numbers
    const sortedBlocks = [...diff.blocks].reverse();

    sortedBlocks.forEach((block) => {
      const changes = this.getBlockChanges(block);
      const startLine = this.getBlockStartLine(block);

      // Remove additions first
      if (changes.additions.length > 0) {
        result.splice(startLine, changes.additions.length);
      }

      // Then restore removals
      if (changes.removals.length > 0) {
        result.splice(startLine, 0, ...changes.removals);
      }
    });

    return result.join("\n");
  }

  private getBlockChanges(block: DiffBlock): {
    additions: string[];
    removals: string[];
  } {
    const additions: string[] = [];
    const removals: string[] = [];

    block.lines.forEach((line) => {
      if (line.type === "add") {
        additions.push(line.content);
      } else if (line.type === "remove") {
        removals.push(line.content);
      }
    });

    return { additions, removals };
  }

  private getBlockStartLine(block: DiffBlock): number {
    const firstLine = block.lines.find((line) => line.lineNumber.old !== null);
    return firstLine?.lineNumber.old ?? 0;
  }
}
