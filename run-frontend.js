
const { spawn } = require('child_process');
const path = require('path');

// Change directory to frontend
process.chdir(path.join(__dirname, 'frontend'));

// Run npm run dev in the frontend directory
const child = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });

child.on('error', (error) => {
  console.error(`Error executing npm run dev: ${error}`);
  process.exit(1);
});

child.on('close', (code) => {
  if (code !== 0) {
    console.log(`npm run dev process exited with code ${code}`);
    process.exit(code);
  }
});
