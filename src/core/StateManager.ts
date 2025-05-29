import { DiffResult } from "../types";

export class StateManager {
  private oldCode: string;
  private newCode: string;
  private currentDiff: DiffResult | null;
  private subscribers: Array<(diff: DiffResult | null) => void>;

  constructor() {
    this.oldCode = "";
    this.newCode = "";
    this.currentDiff = null;
    this.subscribers = [];
  }

  public setCode(oldCode: string, newCode: string): void {
    this.oldCode = oldCode;
    this.newCode = newCode;
  }

  public setDiff(diff: DiffResult): void {
    this.currentDiff = diff;
    this.notifySubscribers();
  }

  public getDiff(): DiffResult | null {
    return this.currentDiff;
  }

  public getOldCode(): string {
    return this.oldCode;
  }

  public getNewCode(): string {
    return this.newCode;
  }

  public subscribe(callback: (diff: DiffResult | null) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback(this.currentDiff));
  }

  public reset(): void {
    this.oldCode = "";
    this.newCode = "";
    this.currentDiff = null;
    this.notifySubscribers();
  }
}
