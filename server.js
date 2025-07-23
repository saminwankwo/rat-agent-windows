const http = require('http');
const WebSocket = require('ws');
const { spawn } = require('child_process');
const ngrok = require('ngrok');

const PORT = 8080;
const NGROK_AUTHTOKEN = "30ExAS9BnANFDjDz8bOiUGYfV99_2n6nBxnMa1S6dW2tr8Hxf";

(async () => {
  const server = http.createServer();
  const wss = new WebSocket.Server({ server });
  let shell;

  wss.on('connection', ws => {
    ws.on('message', msg => {
      let payload;
      try { payload = JSON.parse(msg); } catch { return ws.send('Invalid JSON'); }
      const { type, data } = payload;

      if (type === 'connect') {
        shell = spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash');
        ws.send('> Connected to shell\n');
        shell.stdout.on('data', d => ws.send(d.toString()));
        shell.stderr.on('data', d => ws.send(d.toString()));
      }
      if (type === 'cmd' && shell) shell.stdin.write(data + '\n');
      if (type === 'disconnect' && shell) {
        shell.kill();
        ws.send('> Disconnected\n');
      }
    });
    ws.on('close', () => shell && shell.kill());
  });

  server.listen(PORT, () => console.log(`▶︎ Local WS server on ws://127.0.0.1:${PORT}`));

  try {
    await ngrok.authtoken(NGROK_AUTHTOKEN);
    const url = await ngrok.connect({ proto: 'http', addr: PORT });
    const wsUrl = url.replace(/^http/, 'wss');
    console.log(`🔗 Public WSS tunnel: ${wsUrl}`);
  } catch (err) {
    console.error('⚠️ ngrok failed:', err.message);
    process.exit(1);
  }
})();