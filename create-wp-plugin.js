import fs from 'fs';
import path from 'path';
import zip from "cross-zip";
import { fileURLToPath } from 'url';

// get the current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));


(
    () => {
        // copy build to wp_plugin folder
        fs.copyFileSync(
            path.resolve(__dirname, './dist/squash-search.umd.js'),
            path.resolve(__dirname, './wp_plugin/squash-search.umd.js')
        );

        // zip wp_plugin folder
        zip.zipSync(
            path.resolve(__dirname, './wp_plugin'),
            path.resolve(__dirname, './dist/squash-search-plugin.zip')
        );

        fs.rmSync(path.resolve(__dirname, './wp_plugin/squash-search.umd.js'));
    }
)()