
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Change directory to frontend
const frontendPath = path.join(__dirname, 'frontend');
process.chdir(frontendPath);

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
  // Use npx to ensure we're using the local vite installation
  const child = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });

  child.on('error', (error) => {
    console.error(`Error executing vite: ${error}`);
    process.exit(1);
  });

  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`Vite process exited with code ${code}`);
      process.exit(code);
    }
  });
}
