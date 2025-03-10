# MCP Server: VS Code Extensions Installer

A Model Context Protocol (MCP) server for automatically installing VS Code extensions in Cursor IDE.

## Features

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

2. Use the MCP client to install extensions:

```typescript
const result = await mcpClient.call('install_extension', {
    publisher: 'vsls-contrib',
    extension: 'gistfs',
    version: '0.7.0'
});
```

## API

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