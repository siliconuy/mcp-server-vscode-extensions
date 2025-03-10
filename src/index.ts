import { createServer } from '@microsoft/vscode-mcp';
import { ExtensionInstaller } from './extension-installer.js';

interface InstallParams {
    publisher: string;
    extension: string;
    version: string;
}

const installer = new ExtensionInstaller();

const server = createServer({
    name: 'vscode-extensions',
    version: '1.0.0',
    functions: {
        install_extension: {
            description: 'Install a VS Code extension in Cursor',
            parameters: {
                type: 'object',
                properties: {
                    publisher: {
                        type: 'string',
                        description: 'The publisher of the extension'
                    },
                    extension: {
                        type: 'string',
                        description: 'The name of the extension'
                    },
                    version: {
                        type: 'string',
                        description: 'The version of the extension'
                    }
                },
                required: ['publisher', 'extension', 'version']
            },
            handler: async ({ publisher, extension, version }: InstallParams) => {
                try {
                    const vsixPath = await installer.installExtension(publisher, extension, version);
                    const isValid = await installer.validateVsix(vsixPath);
                    
                    if (!isValid) {
                        throw new Error('Invalid VSIX file generated');
                    }
                    
                    return {
                        success: true,
                        message: `Extension ${publisher}.${extension}@${version} installed successfully at ${vsixPath}`,
                        path: vsixPath
                    };
                } catch (error) {
                    return {
                        success: false,
                        message: error instanceof Error ? error.message : 'Unknown error occurred',
                        path: null
                    };
                }
            }
        }
    }
});

server.listen();
