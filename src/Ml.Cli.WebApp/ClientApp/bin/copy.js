const path = require('path');
const fs = require('fs');

const applyCopy=(input) => {
    try {
        const destinationPath = path.join(__dirname, input);
        if (fs.existsSync(destinationPath)) {
            const envFilename = "environment.dev.json";
            const envCustomFilename = "environment.dev-custom.json";
            const destinationFilePath = path.join(destinationPath, `${envCustomFilename}`);
            if(!fs.existsSync(destinationPath)){
                fs.copyFileSync(path.join(__dirname, `..\\public\\${envFilename}`), destinationFilePath);
                console.log(`File copied successfully at ${destinationFilePath}`);
            }
        }
    } catch (ex) {
        console.error(ex);
    }
}

const args = process.argv;
if (args.length >= 3) {
    const input = args[2];
    applyCopy(input);
} else {
    applyCopy("../public");
}