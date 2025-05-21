
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Change directory to frontend
const frontendPath = path.join(__dirname, 'frontend');
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

// Check if node_modules exists in the frontend directory
if (!fs.existsSync(path.join(frontendPath, 'node_modules'))) {
  console.log('Installing frontend dependencies...');
  // Run npm install first if node_modules doesn't exist
  const install = spawn('npm', ['install'], { stdio: 'inherit', shell: true });
  
  install.on('close', (code) => {
    if (code !== 0) {
      console.error(`npm install failed with code ${code}`);
      process.exit(code);
    }
    startDevServer();
  });
} else {
  startDevServer();
}

function startDevServer() {
  console.log('Starting development server...');
  
  // Run npm run dev instead of directly calling vite
  const child = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });

  child.on('error', (error) => {
    console.error(`Error executing npm run dev: ${error}`);
    console.error('Falling back to npx vite...');
    
    // Fall back to npx vite as a second attempt
    const npxChild = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });
    
    npxChild.on('error', (npxError) => {
      console.error(`Error with fallback method: ${npxError}`);
      process.exit(1);
    });
    
    npxChild.on('close', (code) => {
      if (code !== 0) {
        console.log(`npx vite process exited with code ${code}`);
        process.exit(code);
      }
    });
  });

  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`npm run dev process exited with code ${code}`);
      process.exit(code);
    }
  });
}
