const { minify } = require('terser');
const fs = require('fs');

const outputDir = './Compiled/';
const config = {
    compress: {
        dead_code: true,
        drop_console: ['log', 'info'],
        drop_debugger: true,
        keep_classnames: true,
        keep_fargs: false,
        keep_fnames: false,
        keep_infinity: false
    },
    mangle: false,
    module: false,
    output: {
        comments: 'some'
    }
};

const files = [
    "./src/LightDispersion.js",
    "./src/config.js",
    "./src/utils.js",
    "./src/Shape.js",
    "./src/Text.js",
    "./src/Rectangle.js",
    "./src/Circle.js",
    "./src/Triangle.js",
    "./src/Line.js",
    "./src/Ray.js",
    "./src/dragging.js",
];

// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    console.log('=== Starting Minification Process ===');
    await delay(200); // Initial pause

    try {
        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        let combinedCode = '';

        console.log('\nCombining main files...');
        await delay(200);

        for (const file of files) {
            combinedCode += `// ${file}\n`;
            combinedCode += fs.readFileSync(file, 'utf8') + '\n\n';
            console.log(`  Added: ${file}`);
            await delay(100); // Small delay for each file
        }

        console.log('\nSaving combined file...');
        await delay(300);
        const combinedFilePath = outputDir + 'PWS.js';
        fs.writeFileSync(combinedFilePath, combinedCode);
        console.log(`  Combined file saved: ${combinedFilePath}`);

        console.log('\nMinifying combined file...');
        await delay(300);
        const minifiedCombined = await minify(combinedCode, {
            ...config,
            sourceMap: {
                filename: 'PWS.min.js.map',
                url: 'PWS.min.js.map'
            }
        });
        fs.writeFileSync(outputDir + 'PWS.min.js', minifiedCombined.code);
        fs.writeFileSync(outputDir + 'PWS.min.js.map', minifiedCombined.map);
        console.log('  Minified combined file and source map saved.');
        await delay(300);

        console.log('\n=== Minification Process Completed Successfully ===');
    } catch (error) {
        console.error('Error during minification:', error);
    }
})();