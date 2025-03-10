import fs from 'fs';
import path from 'path';
import os from 'os';
import fetch from 'node-fetch';
import gunzip from 'gunzip-maybe';
import { pipeline } from 'stream/promises';

export class ExtensionInstaller {
    private extensionsDir: string;

    constructor() {
        this.extensionsDir = path.join(os.homedir(), '.cursor', 'extensions');
        this.ensureExtensionsDir();
    }

    private ensureExtensionsDir() {
        if (!fs.existsSync(this.extensionsDir)) {
            fs.mkdirSync(this.extensionsDir, { recursive: true });
        }
    }

    public async installExtension(publisher: string, extensionName: string, version: string): Promise<string> {
        const vsixUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extensionName}/${version}/vspackage`;
        const vsixPath = path.join(this.extensionsDir, `${publisher}.${extensionName}-${version}.vsix`);
        
        try {
            const response = await fetch(vsixUrl);
            if (!response.ok) {
                throw new Error(`Failed to download extension: ${response.statusText}`);
            }

            const tempPath = `${vsixPath}.gz`;
            const writeStream = fs.createWriteStream(tempPath);
            
            if (!response.body) {
                throw new Error('No response body received');
            }

            await pipeline(response.body, writeStream);
            
            // Descomprimir el archivo
            const gzippedContent = fs.createReadStream(tempPath);
            const finalWriteStream = fs.createWriteStream(vsixPath);
            await pipeline(gzippedContent, gunzip(), finalWriteStream);
            
            // Limpiar archivo temporal
            fs.unlinkSync(tempPath);
            
            return vsixPath;
        } catch (error) {
            throw new Error(`Error installing extension: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async validateVsix(vsixPath: string): Promise<boolean> {
        try {
            const stats = await fs.promises.stat(vsixPath);
            return stats.size > 1000; // Asumimos que un archivo válido debe tener al menos 1KB
        } catch (error) {
            return false;
        }
    }
}
