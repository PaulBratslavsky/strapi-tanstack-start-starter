import * as fs from 'fs';
import * as path from 'path';

async function copyEnvFile(targetDir) {
  try {
    // Ensure targetDir is trimmed
    targetDir = targetDir.trim();

    const examplePath = path.join(targetDir, ".env.example");
    const envPath = path.join(targetDir, ".env");

    console.log("Attempting to copy from:", examplePath);
    console.log("To:", envPath);
    
    // Check if .env.example exists
    try {
      await fs.promises.access(examplePath, fs.constants.F_OK);
    } catch {
      console.log(`.env.example file does not exist in ${targetDir}, skipping env setup.`);
      return;
    }

    // .env.example exists, now check for .env
    try {
      await fs.promises.access(envPath, fs.constants.F_OK);
      // .env file exists, no action needed
      console.log(`.env file already exists in ${targetDir}, no action taken.`);
    } catch {
      // .env file does not exist, copy .env.example to .env
      try {
        await fs.promises.copyFile(examplePath, envPath);
        console.log(`.env.example has been copied to ${envPath}`);
      } catch (copyErr) {
        console.error("Error occurred copying file:", copyErr.message);
        process.exit(1);
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    process.exit(1);
  }
}

// Get the directory path from the command line argument and trim whitespace
const directoryPath = process.argv[2]?.trim();

if (directoryPath) {
  copyEnvFile(directoryPath).catch(error => {
    console.error("Failed to copy env file:", error);
    process.exit(1);
  });
} else {
  console.error("Please provide a directory path as an argument.");
  process.exit(1);
}