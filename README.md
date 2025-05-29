## 🧠 Full Flow Walkthrough with Example

### ✅ Initial Example

```ts
// oldCode
function hello() {
  console.log("Hello");
}

// newCode
function hello() {
  console.log("Hello, World!");
  return "Hello";
}
```

---

### 🔄 Step-by-Step Flow

#### 1. `App.ts` initializes:

```ts
const oldCode = `function hello() {\n  console.log("Hello");\n}`;
const newCode = `function hello() {\n  console.log("Hello, World!");\n  return "Hello";\n}`;
```

* `DiffViewer` is created and initialized.
* `StateManager` stores both versions.
* `DiffEngine.computeDiff()` runs.

---

#### 2. `DiffEngine.computeDiff()`

This computes line-level differences and returns a structured `DiffResult`.

```ts
{
  blocks: [
    {
      header: "@@ -1,2 +1,3 @@",
      lines: [
        { type: "context", content: "function hello() {", lineNumber: { old: 1, new: 1 } },
        { type: "remove", content: "  console.log(\"Hello\");", lineNumber: { old: 2, new: null } },
        { type: "add", content: "  console.log(\"Hello, World!\");", lineNumber: { old: null, new: 2 } },
        { type: "add", content: "  return \"Hello\";", lineNumber: { old: null, new: 3 } },
        { type: "context", content: "}", lineNumber: { old: 3, new: 4 } },
      ]
    }
  ],
  stats: {
    additions: 2,
    deletions: 1
  }
}
```

---

#### 3. `DiffViewer.renderDiff()`

Renders:

* Block headers
* Line numbers (`old`, `new`)
* Symbols:

  * `" "` for unchanged
  * `"+"` for additions
  * `"-"` for deletions

With Monaco, `createDiffEditor()` shows side-by-side comparison.

---

#### 4. `ActionButtons`

Two buttons:

* ✅ Accept → `handleAccept()`
* ❌ Reject → `handleReject()`

---

### ✅ Accept Flow

#### Triggered by `handleAccept()` in `App.ts`:

```ts
const newCode = this.codeApplier.applyChanges(
  this.diffViewer.getOldCode(),
  diff
);
```

---

#### How `CodeApplier.applyChanges()` works:

1. `split()` old code into lines.
2. Reverse the blocks (to avoid index shifting issues).
3. For each block:

   * Remove all `"remove"` lines.
   * Add all `"add"` lines at the same starting index.

---

#### Example Execution

* Original:

  ```ts
  function hello() {
    console.log("Hello");
  }
  ```

* Apply:

  * Remove: `console.log("Hello");`
  * Add:

    ```ts
    console.log("Hello, World!");
    return "Hello";
    ```

* Final Result:

  ```ts
  function hello() {
    console.log("Hello, World!");
    return "Hello";
  }
  ```

---

### ❌ Reject Flow

#### Triggered by `handleReject()`:

```ts
const oldCode = this.codeApplier.rejectChanges(
  this.diffViewer.getNewCode(),
  diff
);
```

---

#### `rejectChanges()` Logic:

* Remove all `"add"` lines.
* Re-insert `"remove"` lines at original index.

It restores the original version of the code.

---

## 🧬 Type Breakdown (Advanced)

### 🔹 `DiffLine`

```ts
type: "add" | "remove" | "context";
content: string;
lineNumber: {
  old: number | null;
  new: number | null;
}
```

**Examples:**

| Type    | Meaning          | Example Content                 |
| ------- | ---------------- | ------------------------------- |
| context | No change        | `function hello() {`            |
| remove  | Removed from old | `console.log("Hello");`         |
| add     | Added in new     | `console.log("Hello, World!");` |

---

### 🔹 `DiffBlock`

```ts
{
  header: "@@ -1,2 +1,3 @@",
  lines: [DiffLine, DiffLine, ...]
}
```

The `header` tells which lines were affected:

* `-1,2` → old version had lines 1–2
* `+1,3` → new version has lines 1–3

---

### 🔹 `DiffResult`

```ts
{
  blocks: DiffBlock[],
  stats: {
    additions: number,
    deletions: number
  }
}
```

Tracks all changes and their counts.

---

## 🔄 StateManager Explained

This manages **global state** of code + diff:

* `setCode()` → stores old/new code
* `setDiff()` → stores diff
* `subscribe()` → allows UI components to react to changes (useful for future React/Signal support)

---

## 🧪 Testing

`DiffEngine.test.ts`

```ts
test("should compute diff between Hello and Hello, World", () => {
  const old = "Hello\nWorld";
  const newT = "Hello\nWorld!\nGoodbye";

  const result = diffEngine.computeDiff(old, newT);

  expect(result.stats.additions).toBe(1);
  expect(result.stats.deletions).toBe(0);
});
```

---

## 🧰 Utilities Used

| Function             | Description                                   |
| -------------------- | --------------------------------------------- |
| `debounce()`         | Prevents frequent triggering (e.g. on typing) |
| `formatLineNumber()` | Ensures line numbers align visually           |
| `sanitizeHtml()`     | Prevents XSS from code preview                |
| `isInViewport()`     | Checks visibility (e.g. for lazy rendering)   |

---

## 🖼️ Final Output Snapshot (Rendered)

```plaintext
@@ -1,2 +1,3 @@
 function hello() {
-  console.log("Hello");
+  console.log("Hello, World!");
+  return "Hello";
 }
```

---

## 🔚 Summary

| Component       | Responsibility                                 |
| --------------- | ---------------------------------------------- |
| `DiffViewer`    | UI + Monaco + render all diffs                 |
| `CodeApplier`   | Apply/reject logic with `splice()`             |
| `StateManager`  | Global state and diff tracking                 |
| `DiffEngine`    | Computes line-level diff blocks                |
| `ActionButtons` | User interaction for accepting/rejecting diffs |
| `DiffLine`      | Renders single diff line with prefix/symbols   |

