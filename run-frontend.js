
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

console.log('Starting installation process...');

// Always ensure vite is installed locally to prevent "not found" errors
const installProcess = spawn('npm', ['install', '--save-dev', 'vite'], { 
  stdio: 'inherit', 
  shell: true 
});

installProcess.on('close', (code) => {
  if (code !== 0) {
    console.warn(`Warning: npm install for vite exited with code ${code}`);
  }
  
  console.log('Starting the development server...');
  runDevServer();
});

function runDevServer() {
  // Directly use npm run dev which should use the local vite
  const devProcess = spawn('npm', ['run', 'dev'], { 
    stdio: 'inherit', 
    shell: true 
  });

  devProcess.on('error', (error) => {
    console.error(`Error when running npm run dev: ${error.message}`);
    tryFallbackMethod();
  });

  devProcess.on('close', (code) => {
    if (code !== 0) {
      console.warn(`npm run dev exited with code ${code}, trying fallback...`);
      tryFallbackMethod();
    }
  });
}

function tryFallbackMethod() {
  console.log('Trying direct npx vite execution...');
  
  // Try using npx which should find the local vite
  const npxProcess = spawn('npx', ['vite'], { 
    stdio: 'inherit', 
    shell: true 
  });
  
  npxProcess.on('error', (error) => {
    console.error(`Error when running npx vite: ${error.message}`);
    console.error('All methods to start vite have failed.');
    process.exit(1);
  });
  
  npxProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`npx vite exited with code ${code}`);
      console.error('All methods to start vite have failed.');
      process.exit(1);
    }
  });
}
