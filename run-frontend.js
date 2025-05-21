
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
  
  // Try direct access to vite in node_modules/.bin
  const vitePath = path.join(frontendPath, 'node_modules', '.bin', 'vite');
  
  if (fs.existsSync(vitePath)) {
    console.log(`Found vite at: ${vitePath}`);
    const child = spawn(vitePath, [], { stdio: 'inherit', shell: true });
    
    child.on('error', (error) => {
      fallbackToNpx(error);
    });
    
    child.on('close', (code) => {
      if (code !== 0) {
        console.log(`Vite process exited with code ${code}`);
        process.exit(code);
      }
    });
  } else {
    console.log('Vite executable not found in node_modules/.bin, trying alternatives...');
    tryAlternativeApproaches();
  }
}

function tryAlternativeApproaches() {
  // Try npm run dev
  console.log('Trying npm run dev...');
  const npmChild = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });
  
  npmChild.on('error', (error) => {
    console.error(`Error executing npm run dev: ${error}`);
    fallbackToNpx(error);
  });
  
  npmChild.on('close', (code) => {
    if (code !== 0) {
      console.log(`npm run dev process exited with code ${code}`);
      fallbackToNpx(new Error('npm run dev failed'));
    }
  });
}

function fallbackToNpx(error) {
  console.error(`Error starting development server: ${error}`);
  console.log('Falling back to npx vite...');
  
  // Try installing vite globally if it doesn't exist
  console.log('Installing vite locally first...');
  const installVite = spawn('npm', ['install', '--save-dev', 'vite'], { stdio: 'inherit', shell: true });
  
  installVite.on('close', (code) => {
    if (code !== 0) {
      console.error(`Failed to install vite locally: ${code}`);
    }
    
    // Fall back to npx vite as a last resort
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
}
