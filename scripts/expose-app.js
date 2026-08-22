#!/usr/bin/env node

/**
 * Mediverse Application Internet Exposure Script
 * Supports:
 *   1. Cloudflare Quick Tunnels (Zero-config free SSL + WebSockets)
 *   2. Localtunnel (Zero-install npx)
 *   3. Ngrok (With web inspector)
 *   4. Local Network (LAN IP for same Wi-Fi testing)
 */

const { spawn } = require('child_process');
const os = require('os');
const readline = require('readline');

const FRONTEND_PORT = 3000;
const BACKEND_PORT = 8085;

function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push({ name, address: iface.address });
      }
    }
  }
  return addresses;
}

function printBanner() {
  console.clear();
  console.log('\x1b[36m%s\x1b[0m', '=============================================================');
  console.log('\x1b[1m\x1b[34m       🌐 MEDIVERSE — EXPOSE APPLICATION TO INTERNET 🌐     \x1b[0m');
  console.log('\x1b[36m%s\x1b[0m', '=============================================================');
  console.log(`\x1b[32mTarget Service:\x1b[0m Frontend UI @ http://localhost:${FRONTEND_PORT}`);
  console.log(`\x1b[32mTarget Backend:\x1b[0m Spring Boot API @ http://localhost:${BACKEND_PORT}`);
  console.log('-------------------------------------------------------------');
}

function startLocaltunnel(subdomain) {
  console.log('\n\x1b[33m🚀 Starting Localtunnel on port ' + FRONTEND_PORT + '...\x1b[0m');
  const args = ['localtunnel', '--port', String(FRONTEND_PORT)];
  if (subdomain) {
    args.push('--subdomain', subdomain);
  }
  
  const lt = spawn('npx', args, { shell: true, stdio: 'inherit' });
  lt.on('error', (err) => console.error('Localtunnel error:', err));
}

function startCloudflare() {
  console.log('\n\x1b[33m🚀 Starting Cloudflare Quick Tunnel (Free HTTPS + WebSockets)...\x1b[0m');
  
  const cf = spawn('npx', ['--yes', 'cloudflared', 'tunnel', '--url', `http://localhost:${FRONTEND_PORT}`], {
    shell: true,
    stdio: 'inherit'
  });
  
  cf.on('error', (err) => {
    console.log('Falling back to localtunnel...');
    startLocaltunnel();
  });
}

function startNgrok() {
  console.log('\n\x1b[33m🚀 Starting Ngrok on port ' + FRONTEND_PORT + '...\x1b[0m');
  const ng = spawn('npx', ['@ngrok/ngrok', 'http', String(FRONTEND_PORT)], {
    shell: true,
    stdio: 'inherit'
  });
  ng.on('error', (err) => console.error('Ngrok error:', err));
}

function showLocalNetwork() {
  console.log('\n\x1b[32m📱 Local Network (Wi-Fi) Access:\x1b[0m');
  console.log('Connect your mobile phone to the same Wi-Fi network and open:\n');
  const ips = getLocalIPs();
  if (ips.length === 0) {
    console.log(`  http://localhost:${FRONTEND_PORT}`);
  } else {
    ips.forEach(ip => {
      console.log(`  🔗 \x1b[1m\x1b[36mhttp://${ip.address}:${FRONTEND_PORT}\x1b[0m (${ip.name})`);
    });
  }
  console.log('\nPress any key to return to menu...');
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.once('data', () => {
    process.stdin.setRawMode(false);
    main();
  });
}

function main() {
  printBanner();
  console.log('\x1b[1mSelect a Tunnel / Devtool Provider:\x1b[0m\n');
  console.log('  [1] \x1b[32mCloudflare Quick Tunnel\x1b[0m (Recommended — Free HTTPS, WebRTC/WebSocket support, No signup)');
  console.log('  [2] \x1b[34mLocaltunnel\x1b[0m (Instant zero-install public URL via npx)');
  console.log('  [3] \x1b[35mNgrok\x1b[0m (With web inspector @ http://localhost:4040)');
  console.log('  [4] \x1b[33mLocal Network / Wi-Fi Sharing\x1b[0m (Access on physical phone on same Wi-Fi)');
  console.log('  [5] Exit\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('\x1b[1mEnter choice [1-5] (default 1): \x1b[0m', (choice) => {
    rl.close();
    const opt = choice.trim() || '1';
    switch (opt) {
      case '1':
        startCloudflare();
        break;
      case '2':
        startLocaltunnel();
        break;
      case '3':
        startNgrok();
        break;
      case '4':
        showLocalNetwork();
        break;
      case '5':
        console.log('Exiting.');
        process.exit(0);
      default:
        console.log('Invalid option. Defaulting to Cloudflare...');
        startCloudflare();
        break;
    }
  });
}

main();
