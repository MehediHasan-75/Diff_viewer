import { DiffViewer } from "./components/DiffViewer";
import { ActionButtons } from "./components/ActionButtons";
import { CodeApplier } from "./core/CodeApplier";
import "./styles/main.css";

class App {
  private diffViewer: DiffViewer;
  private actionButtons: ActionButtons;
  private codeApplier: CodeApplier;

  constructor() {
    // Example code for demonstration
    const oldCode = `function hello() {
    console.log("Hello");
}`;
    const newCode = `function hello() {
    console.log("Hello, World!");
    return "Hello";
}`;

    this.codeApplier = new CodeApplier();

    this.diffViewer = new DiffViewer({
      oldCode,
      newCode,
      language: "typescript",
    });

    this.actionButtons = new ActionButtons({
      onAccept: this.handleAccept.bind(this),
      onReject: this.handleReject.bind(this),
    });
  }

  private handleAccept(): void {
    const diff = this.diffViewer.getDiff();
    if (!diff) return;

    const newCode = this.codeApplier.applyChanges(
      this.diffViewer.getOldCode(),
      diff
    );
    this.diffViewer.updateDiff(newCode, newCode);
    this.actionButtons.setDisabled(true);
  }

  private handleReject(): void {
    const diff = this.diffViewer.getDiff();
    if (!diff) return;

    const oldCode = this.codeApplier.rejectChanges(
      this.diffViewer.getNewCode(),
      diff
    );
    this.diffViewer.updateDiff(oldCode, oldCode);
    this.actionButtons.setDisabled(true);
  }

  public dispose(): void {
    this.diffViewer.dispose();
    this.actionButtons.dispose();
  }
}

// Initialize the app when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
