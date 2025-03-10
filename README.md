# MCP Server: VS Code Extensions Installer

A Model Context Protocol (MCP) server for automatically installing VS Code extensions in Cursor IDE.

## Features

- Natural language search for VS Code extensions
- Smart ranking based on installs and ratings
- Automatically downloads and installs VS Code extensions from the official marketplace
- Handles gzipped VSIX files correctly
- Validates downloaded extensions before installation
- Installs extensions to the correct Cursor extensions directory

## Installation

```bash
npm install mcp-server-vscode-extensions
```

## Usage

1. Start the MCP server:

```bash
npm start
```

2. Search for extensions using natural language:

```typescript
const result = await mcpClient.call('search_extensions', {
    query: 'sqlite database viewer and editor'
});

// Result example:
{
    success: true,
    extensions: [
        {
            publisher: "qwtel",
            extensionName: "sqlite-viewer",
            displayName: "SQLite Viewer",
            version: "0.1.5",
            description: "SQLite Viewer and Editor",
            installs: 500000,
            rating: 4.8,
            installCommand: {
                publisher: "qwtel",
                extension: "sqlite-viewer",
                version: "0.1.5"
            }
        },
        // ... more extensions
    ]
}
```

3. Install a specific extension:

```typescript
const result = await mcpClient.call('install_extension', {
    publisher: 'vsls-contrib',
    extension: 'gistfs',
    version: '0.7.0'
});
```

## API

### search_extensions

Search for VS Code extensions using natural language queries.

Parameters:
- `query`: Natural language description of the extension you're looking for (e.g., 'sqlite database viewer')

Returns:
```typescript
{
    success: boolean;
    extensions?: Array<{
        publisher: string;
        extensionName: string;
        displayName: string;
        version: string;
        description: string;
        installs: number;
        rating: number;
        installCommand: {
            publisher: string;
            extension: string;
            version: string;
        }
    }>;
    message?: string;
}
```

### install_extension

Installs a VS Code extension in Cursor.

Parameters:
- `publisher`: The publisher of the extension (e.g., 'vsls-contrib')
- `extension`: The name of the extension (e.g., 'gistfs')
- `version`: The version of the extension (e.g., '0.7.0')

Returns:
```typescript
{
    success: boolean;
    message: string;
    path: string | null;
}
```

## Development

1. Clone the repository:
```bash
git clone https://github.com/siliconuy/mcp-server-vscode-extensions.git
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Start in development mode:
```bash
npm run dev
```

## License

MIT 