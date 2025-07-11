const { spawn } = require('child_process');

spawn('agent-win.exe', { 
    detached: true, 
    stdio: 'ignore' 
}).unref();