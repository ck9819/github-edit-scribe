
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Change directory to frontend
const frontendPath = path.join(__dirname, 'frontend');
console.log(`Working directory: ${frontendPath}`);
process.chdir(frontendPath);

// Function to ensure file has write permissions
function ensureWritePermissions(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.chmodSync(filePath, 0o666); // Set read-write permissions
      console.log(`Updated permissions for ${filePath}`);
    }
  } catch (error) {
    console.warn(`Could not update permissions for ${filePath}: ${error.message}`);
  }
}

// Update permissions for key JSON files
const jsonFiles = [
  path.join(__dirname, 'backend/src/lastNumber.json'),
  path.join(__dirname, 'backend/src/lastOCNumber.json'),
  path.join(__dirname, 'backend/src/lastSENumber.json'),
  path.join(__dirname, 'backend/src/lastItemNumber.json'),
  path.join(__dirname, 'frontend/package.json')
];

jsonFiles.forEach(ensureWritePermissions);

console.log('Installing frontend dependencies...');

// Install dependencies in the frontend directory
const installProcess = spawn('npm', ['install'], { 
  stdio: 'inherit', 
  shell: true,
  cwd: frontendPath
});

installProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`npm install exited with code ${code}`);
    process.exit(1);
  }
  
  console.log('Starting the development server...');
  runDevServer();
});

function runDevServer() {
  // Run npm run dev from the frontend directory
  const devProcess = spawn('npm', ['run', 'dev'], { 
    stdio: 'inherit', 
    shell: true,
    cwd: frontendPath
  });

  devProcess.on('error', (error) => {
    console.error(`Error when running npm run dev: ${error.message}`);
    process.exit(1);
  });

  devProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`npm run dev exited with code ${code}`);
      process.exit(1);
    }
  });
}
