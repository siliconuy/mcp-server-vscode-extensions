import { createServer } from '@modelcontextprotocol/server';
import { ExtensionInstaller } from './extension-installer.js';

interface InstallParams {
    publisher: string;
    extension: string;
    version: string;
}

interface SearchParams {
    query: string;
}

const installer = new ExtensionInstaller();

const server = createServer({
    name: 'vscode-extensions',
    version: '1.0.0',
    functions: {
        search_extensions: {
            description: 'Search for VS Code extensions based on a natural language query',
            parameters: {
                type: 'object',
                properties: {
                    query: {
                        type: 'string',
                        description: 'Natural language query describing the type of extension needed'
                    }
                },
                required: ['query']
            },
            handler: async ({ query }: SearchParams) => {
                try {
                    const extensions = await installer.searchExtensions(query);
                    
                    // Ordenar por instalaciones y rating
                    const sortedExtensions = extensions.sort((a, b) => {
                        const scoreA = (a.installs * 0.7) + (a.rating * 0.3 * 100000);
                        const scoreB = (b.installs * 0.7) + (b.rating * 0.3 * 100000);
                        return scoreB - scoreA;
                    });

                    return {
                        success: true,
                        extensions: sortedExtensions.slice(0, 5).map(ext => ({
                            ...ext,
                            installCommand: {
                                publisher: ext.publisher,
                                extension: ext.extensionName,
                                version: ext.version
                            }
                        }))
                    };
                } catch (error) {
                    return {
                        success: false,
                        message: error instanceof Error ? error.message : 'Unknown error occurred',
                        extensions: []
                    };
                }
            }
        },
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
