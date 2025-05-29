import { DiffLine as DiffLineType } from "../types";

export class DiffLine {
  private element: HTMLElement;

  constructor(line: DiffLineType) {
    this.element = document.createElement("div");
    this.element.className = "diff-line";
    this.render(line);
  }

  private render(line: DiffLineType): void {
    this.element.classList.add(`diff-line--${line.type}`);

    // Line numbers
    const lineNumbers = document.createElement("div");
    lineNumbers.className = "diff-line__numbers";
    lineNumbers.innerHTML = `
            <span class="diff-line__number diff-line__number--old">${
              line.lineNumber.old || " "
            }</span>
            <span class="diff-line__number diff-line__number--new">${
              line.lineNumber.new || " "
            }</span>
        `;

    // Line content
    const content = document.createElement("div");
    content.className = "diff-line__content";
    content.textContent = line.content;

    // Add prefix based on type
    const prefix = document.createElement("span");
    prefix.className = "diff-line__prefix";
    prefix.textContent = this.getPrefix(line.type);

    this.element.appendChild(lineNumbers);
    this.element.appendChild(prefix);
    this.element.appendChild(content);
  }

  private getPrefix(type: "add" | "remove" | "context"): string {
    switch (type) {
      case "add":
        return "+";
      case "remove":
        return "-";
      default:
        return " ";
    }
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
