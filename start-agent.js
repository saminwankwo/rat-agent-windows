const { spawn } = require('child_process');
const path = require('path');

const agentName = `agent-win-${process.arch === 'x64' ? 'x64' : 'x86'}.exe`;

const agentPath = path.join(__dirname, agentName);

exec(`powershell Start-Process -FilePath "${agentPath}" -Verb RunAs`, (error) => {
  if (error) {
    console.error(`Error starting agent: ${error.message}`);
    return;
  }
});

spawn(agentName, { 
    detached: true, 
    stdio: 'ignore' 
}).unref();