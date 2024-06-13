import fs from 'fs';
import path from 'path';
import zip from "cross-zip";
import { fileURLToPath } from 'url';

// get the current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Function to update the version number
function updateVersion(filePath) {
    // Read the file content
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading the file: ${err}`);
            return;
        }

        // Regular expression to match the version line
        const versionRegex = /Version:\s*([\d.]+)/;
        const match = data.match(versionRegex);

        if (match) {
            // Extract current version
            let currentVersion = match[1];
            let versionParts = currentVersion.split('.').map(Number);

            // Increment the last part of the version
            versionParts[versionParts.length - 1] += 1;
            let newVersion = versionParts.join('.');

            // Replace the old version with the new version
            const updatedData = data.replace(versionRegex, `Version: ${newVersion}`);

            // Write the updated content back to the file
            fs.writeFile(filePath, updatedData, 'utf8', (err) => {
                if (err) {
                    console.error(`Error writing the file: ${err}`);
                    return;
                }
                console.log(`Version updated from ${currentVersion} to ${newVersion}`);
            });
        } else {
            console.error('Version not found in the file');
        }
    });
}





(
    () => {

        // Define the PHP file path
        const filePath = path.join(__dirname, './squash-finder/index.php');

        // Update the version
        updateVersion(filePath);
        // copy build to wp_plugin folder
        fs.copyFileSync(
            path.resolve(__dirname, './dist/squash-search.umd.js'),
            path.resolve(__dirname, './squash-finder/squash-search.umd.js')
        );

        // zip wp_plugin folder
        zip.zipSync(
            path.resolve(__dirname, './squash-finder'),
            path.resolve(__dirname, './dist/squash-search-plugin.zip')
        );

        fs.rmSync(path.resolve(__dirname, './squash-finder/squash-search.umd.js'));
    }
)()