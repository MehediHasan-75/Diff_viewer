import { editor } from "monaco-editor";
import { DiffViewerProps, DiffResult } from "../types";
import { DiffEngine } from "../core/DiffEngine";
import { StateManager } from "../core/StateManager";
import { DiffLine } from "./DiffLine";

export class DiffViewer {
  private container: HTMLElement;
  private diffEngine: DiffEngine;
  private stateManager: StateManager;
  private editor: editor.IStandaloneDiffEditor | null;

  constructor(props: DiffViewerProps) {
    this.container = document.getElementById("diff-container") as HTMLElement;
    this.diffEngine = new DiffEngine();
    this.stateManager = new StateManager();
    this.editor = null;

    this.initialize(props);
  }

  private async initialize(props: DiffViewerProps): Promise<void> {
    this.editor = editor.createDiffEditor(this.container, {
      automaticLayout: true,
      readOnly: true,
      renderSideBySide: true,
      enableSplitViewResizing: true,
      originalEditable: false,
    });

    const originalModel = editor.createModel(props.oldCode, props.language);
    const modifiedModel = editor.createModel(props.newCode, props.language);

    this.editor.setModel({
      original: originalModel,
      modified: modifiedModel,
    });

    this.stateManager.setCode(props.oldCode, props.newCode);
    const diff = this.diffEngine.computeDiff(props.oldCode, props.newCode);
    this.stateManager.setDiff(diff);

    this.renderDiff(diff);
  }

  public getDiff(): DiffResult | null {
    return this.stateManager.getDiff();
  }

  public getOldCode(): string {
    return this.stateManager.getOldCode();
  }

  public getNewCode(): string {
    return this.stateManager.getNewCode();
  }

  private renderDiff(diff: DiffResult): void {
    const diffContainer = document.createElement("div");
    diffContainer.className = "diff-container";

    diff.blocks.forEach((block) => {
      const blockElement = document.createElement("div");
      blockElement.className = "diff-block";

      const header = document.createElement("div");
      header.className = "diff-block__header";
      header.textContent = block.header;
      blockElement.appendChild(header);

      block.lines.forEach((line) => {
        const diffLine = new DiffLine(line);
        blockElement.appendChild(diffLine.getElement());
      });

      diffContainer.appendChild(blockElement);
    });

    // Clear previous content and append new diff
    this.container.innerHTML = "";
    this.container.appendChild(diffContainer);
  }

  public updateDiff(oldCode: string, newCode: string): void {
    this.stateManager.setCode(oldCode, newCode);
    const diff = this.diffEngine.computeDiff(oldCode, newCode);
    this.stateManager.setDiff(diff);
    this.renderDiff(diff);

    if (this.editor) {
      const originalModel = editor.createModel(oldCode, "plaintext");
      const modifiedModel = editor.createModel(newCode, "plaintext");

      this.editor.setModel({
        original: originalModel,
        modified: modifiedModel,
      });
    }
  }

  public dispose(): void {
    if (this.editor) {
      this.editor.dispose();
    }
  }
}
