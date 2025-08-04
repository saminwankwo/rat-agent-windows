const http = require('http');
const WebSocket = require('ws');
const { spawn } = require('child_process');
const ngrok = require('ngrok');

const PORT = process.env.PORT || 8080;
const NGROK_AUTHTOKEN = '2zSB66d85OsbMBJrevaGfZ3CIbU_6Yy7hXf8ECrMEUqekSEQG';

(async () => {
  const server = http.createServer((req, res) => {
    // Simple health check endpoint
    if (req.url === '/health') {
      res.writeHead(200);
      return res.end('OK');
    }
    res.writeHead(404);
    res.end();
  });

  const wss = new WebSocket.Server({ server });
  let shell = null;
  const activeConnections = new Set();

  wss.on('connection', (ws) => {
    activeConnections.add(ws);
    console.log(`New connection (${activeConnections.size} active)`);

    ws.on('message', (msg) => {
      try {
        const { type, data } = JSON.parse(msg);
        
        if (type === 'connect' && !shell) {
          shell = spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', {
            stdio: ['pipe', 'pipe', 'pipe'],
            shell: true
          });

          shell.stdout.on('data', (d) => broadcast(d.toString()));
          shell.stderr.on('data', (d) => broadcast(d.toString()));
          shell.on('exit', () => {
            broadcast('> Shell process terminated\n');
            shell = null;
          });

          ws.send('> Shell connected\n');
        }
        else if (type === 'cmd' && shell) {
          shell.stdin.write(`${data}\n`);
        }
        else if (type === 'disconnect' && shell) {
          shell.kill();
          shell = null;
          ws.send('> Shell disconnected\n');
        }
      } catch (err) {
        console.error('Message handling error:', err);
        ws.send('> Invalid message format\n');
      }
    });

    ws.on('close', () => {
      activeConnections.delete(ws);
      if (activeConnections.size === 0 && shell) {
        shell.kill();
        shell = null;
      }
    });
  });

  function broadcast(message) {
    activeConnections.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  server.listen(PORT, () => {
    console.log(`Server running on ws://localhost:${PORT}`);
    
    // Start ngrok tunnel if token is provided
    if (NGROK_AUTHTOKEN) {
      ngrok.authtoken(NGROK_AUTHTOKEN);
      ngrok.connect(PORT).then(url => {
        console.log(`Public URL: ${url.replace('http', 'ws')}`);
      }).catch(err => {
        console.error('Ngrok error:', err.message);
      });
    }
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down...');
    if (shell) shell.kill();
    server.close(() => process.exit(0));
  });
})();