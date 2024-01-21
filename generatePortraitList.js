import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir, writeFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const portraitsDir = join(__dirname, 'public', 'Portraits');
const outputFilePath = join(__dirname, 'src', 'portraitsList.ts'); // Output file as TypeScript

try {
    const entries = await readdir(portraitsDir, { withFileTypes: true });

    const directoryNames = entries
        .filter(entry => entry.isDirectory())
        .map(dir => dir.name);

    // Optionally create a type for the portrait list
    const typeDefinition = `export type PortraitName = '${directoryNames.join("' | '")}';\n`;
    const content = `${typeDefinition}export const portraitsList: PortraitName[] = ${JSON.stringify(directoryNames, null, 2)};\n`;

    await writeFile(outputFilePath, content, 'utf-8');
    console.log('Portraits list generated:', outputFilePath);
} catch (err) {
    console.error('Error reading Portraits directory:', err);
}
