import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { join } from 'path';

// Determine the environment based on the argument passed to the script
const environment = process.argv[2]; // "local" or "production"
const migrationsFolder = './migrations';

async function runSqlFiles() {
  try {
    // Read all files in the migrations folder
    const files = await fs.readdir(migrationsFolder);

    // Filter for .sql files
    const sqlFiles = files.filter(file => file.endsWith('.sql'));

    for (const file of sqlFiles) {
      const filePath = join(migrationsFolder, file);
      let command = `npx wrangler d1 execute dev-qr-test --file=${filePath}`;

      // Append --local if the environment is local
      if (environment === 'local') {
        command += ' --local';
      }

      // Execute the command without stopping on error
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing ${filePath}: ${error}`);
          // Don't return; continue with the next file
        }
        if (stdout) {
          console.log(`stdout for ${filePath}: ${stdout}`);
        }
        if (stderr) {
          console.error(`stderr for ${filePath}: ${stderr}`);
        }
      });
    }
  } catch (err) {
    console.error('Error reading migration files:', err);
  }
}

// Check if an environment argument is provided
if (!environment || (environment !== 'local' && environment !== 'production')) {
  console.error('Please specify the environment as either "local" or "production".');
} else {
  // Run the script
  runSqlFiles();
}
