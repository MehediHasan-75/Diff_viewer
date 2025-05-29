# Diff Viewer App

A GitHub-style diff viewer with accept/reject functionality, built with TypeScript and Monaco Editor.

## Features

- Side-by-side diff view using Monaco Editor
- Line-by-line diff highlighting
- Accept/Reject changes functionality
- TypeScript support
- Modern UI with GitHub-like styling

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/diff-viewer-app.git
cd diff-viewer-app
```

2. Install dependencies:

```bash
npm install
```

## Development

To start the development server:

```bash
npm run dev
```

This will start the webpack dev server at `http://localhost:3000`.

## Building

To build the project for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Testing

To run the tests:

```bash
npm test
```

## Project Structure

```
diff-viewer-app/
├── package.json
├── tsconfig.json
├── webpack.config.js
├── src/
│   ├── index.ts
│   ├── components/
│   │   ├── DiffViewer.ts
│   │   ├── DiffLine.ts
│   │   └── ActionButtons.ts
│   ├── core/
│   │   ├── DiffEngine.ts
│   │   ├── StateManager.ts
│   │   └── CodeApplier.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── helpers.ts
│   └── styles/
│       └── main.css
├── public/
│   └── index.html
└── tests/
    ├── DiffEngine.test.ts
    └── StateManager.test.ts
```

## License

MIT
