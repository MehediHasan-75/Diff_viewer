import { ActionButtonsProps } from "../types";

export class ActionButtons {
  private container: HTMLElement;
  private acceptButton: HTMLButtonElement;
  private rejectButton: HTMLButtonElement;

  constructor(props: ActionButtonsProps) {
    this.container = document.getElementById("action-buttons") as HTMLElement;

    this.acceptButton = document.createElement("button");
    this.acceptButton.className = "action-button action-button--accept";
    this.acceptButton.textContent = "Accept Changes";
    this.acceptButton.onclick = props.onAccept;

    this.rejectButton = document.createElement("button");
    this.rejectButton.className = "action-button action-button--reject";
    this.rejectButton.textContent = "Reject Changes";
    this.rejectButton.onclick = props.onReject;

    this.setDisabled(props.disabled || false);
    this.render();
  }

  private render(): void {
    this.container.innerHTML = "";
    this.container.appendChild(this.acceptButton);
    this.container.appendChild(this.rejectButton);
  }

  public setDisabled(disabled: boolean): void {
    this.acceptButton.disabled = disabled;
    this.rejectButton.disabled = disabled;
  }

  public dispose(): void {
    this.acceptButton.onclick = null;
    this.rejectButton.onclick = null;
  }
}
