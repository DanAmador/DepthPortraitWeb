import { readdirSync, statSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert file URL to path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicFolderPath = path.join(__dirname, '..', 'public');
const outputPath = path.join(__dirname, '..', 'src', 'imagePaths.ts');

function generateImportPath(filePath) {
    return `./${path.relative(path.join(__dirname, '..', 'src'), filePath)}`;
}

let imageDict = {
    Portraits: {}
};

function processDirectory(directory, parentFolderName = '') {
    const files = readdirSync(directory);
    files.forEach(file => {
        const filePath = path.join(directory, file);
        const stat = statSync(filePath);
        if (stat.isDirectory()) {
            processDirectory(filePath, path.basename(directory));
        } else {
            if (parentFolderName === 'Portraits') {
                const imageType = file.includes('depth') ? 'depth' : 'rgb';
                const importPath = generateImportPath(filePath);

                if (!imageDict.Portraits) {
                    imageDict.Portraits = {};
                }
                const portraitKey = path.basename(directory);
                if (!imageDict.Portraits[portraitKey]) {
                    imageDict.Portraits[portraitKey] = {};
                }
                imageDict.Portraits[portraitKey][imageType] = importPath;
            }
        }
    });
}

const portraitsFolderPath = path.join(publicFolderPath, 'Portraits');
processDirectory(portraitsFolderPath);
processDirectory(publicFolderPath);

// Generate the file content
const fileContent = `export async function loadImagePaths() {
    const imagePaths = ${JSON.stringify(imageDict, null, 2)};
    const loadedImages = {};

    for (const category in imagePaths) {
        loadedImages[category] = {};
        for (const item in imagePaths[category]) {
            loadedImages[category][item] = {};
            for (const imageType in imagePaths[category][item]) {
                loadedImages[category][item][imageType] = await import(imagePaths[category][item][imageType]);
            }
        }
    }

    return loadedImages;
}
`;

writeFileSync(outputPath, fileContent);
