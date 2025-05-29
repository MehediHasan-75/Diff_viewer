import { diff_match_patch as DiffMatchPatch } from "diff-match-patch";
import { DiffResult, DiffLine, DiffBlock } from "../types";

export class DiffEngine {
  private dmp: InstanceType<typeof DiffMatchPatch>;

  constructor() {
    this.dmp = new DiffMatchPatch();
  }

  public computeDiff(oldText: string, newText: string): DiffResult {
    const diffs = this.dmp.diff_main(oldText, newText);
    this.dmp.diff_cleanupSemantic(diffs);

    const blocks: DiffBlock[] = [];
    let currentBlock: DiffLine[] = [];
    let oldLineNumber = 1;
    let newLineNumber = 1;
    let additions = 0;
    let deletions = 0;

    diffs.forEach(([type, text]: [number, string]) => {
      const lines = text.split("\n");
      lines.forEach((line: string, index: number) => {
        if (index < lines.length - 1 || line.length > 0) {
          let diffLine: DiffLine;

          switch (type) {
            case -1: // Deletion
              diffLine = {
                type: "remove",
                content: line,
                lineNumber: {
                  old: oldLineNumber++,
                  new: null,
                },
              };
              deletions++;
              break;
            case 1: // Addition
              diffLine = {
                type: "add",
                content: line,
                lineNumber: {
                  old: null,
                  new: newLineNumber++,
                },
              };
              additions++;
              break;
            default: // Context
              diffLine = {
                type: "context",
                content: line,
                lineNumber: {
                  old: oldLineNumber++,
                  new: newLineNumber++,
                },
              };
          }

          currentBlock.push(diffLine);
        }
      });

      if (currentBlock.length >= 7) {
        blocks.push({
          header: `@@ -${oldLineNumber},${currentBlock.length} +${newLineNumber},${currentBlock.length} @@`,
          lines: [...currentBlock],
        });
        currentBlock = [];
      }
    });

    if (currentBlock.length > 0) {
      blocks.push({
        header: `@@ -${oldLineNumber},${currentBlock.length} +${newLineNumber},${currentBlock.length} @@`,
        lines: currentBlock,
      });
    }

    return {
      blocks,
      stats: {
        additions,
        deletions,
      },
    };
  }
}
