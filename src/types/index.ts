export interface DiffLine {
  type: "add" | "remove" | "context";
  content: string;
  lineNumber: {
    old: number | null;
    new: number | null;
  };
}

export interface DiffBlock {
  lines: DiffLine[];
  header: string;
}

export interface DiffResult {
  blocks: DiffBlock[];
  stats: {
    additions: number;
    deletions: number;
  };
}

export interface DiffViewerProps {
  oldCode: string;
  newCode: string;
  language?: string;
}

export interface ActionButtonsProps {
  onAccept: () => void;
  onReject: () => void;
  disabled?: boolean;
}
