const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Original App Server ka Base URL[cite: 2]
const TARGET_SERVER = process.env.TARGET_SERVER || 'https://api.storytv.asia';

// Premium Headers & Token jo inject karne hain (Step 5 of Readme.txt)[cite: 1, 2]
const CUSTOM_HEADERS = {
  'appVersion': '69',
  'platform': '0',
  'deviceId': '2808d49b7e08b716',
  'os': 'Android 10 (API 29)',
  'network_type': 'WIFI',
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVkRGF0ZSI6IkZyaSBKdW4gMTIgMDc6MDQ6MTAgVVRDIDIwMjYiLCJzZXNzaW9uSWQiOiIxNTI0MDExNDMiLCJkZXZpY2VJZCI6IjI4MDhkNDliN2UwOGI3MTYiLCJzdWIiOiIxMTYwMDQ2NDciLCJleHAiOjE3ODE1MDcwNTB9._GKqF_5WtYkgAIJVhkt3L27t9fvgLkFtfgaOLSPsrOA',
  'Accept': 'application/json',
  'User-Agent': 'ktor-client',
  'Content-Type': 'application/json'
};

// Proxy Middleware Setup
app.use('/', createProxyMiddleware({
  target: TARGET_SERVER,
  changeOrigin: true,
  // Console mein dikhane ke liye ki kaunsi request aayi hai
  logLevel: 'info', 
  on: {
    proxyReq: (proxyReq, req, res) => {
      // Step 2 & Step 5: Request intercept ho rahi hai
      console.log(`[Proxy] Intercepted Request to: ${req.url}`);

      // Modded App client se aane wali request mein Premium Headers inject karna[cite: 1, 2]
      Object.entries(CUSTOM_HEADERS).forEach(([key, value]) => {
        proxyReq.setHeader(key, value);
      });
      
      console.log('[Proxy] Premium Token and Headers Injected! Forwarding to Original Server...');
    },
    proxyRes: (proxyRes, req, res) => {
      // Step 3 & Step 7: Original server se response wapas aana[cite: 1]
      console.log(`[Proxy] Response received from Original Server with status: ${proxyRes.statusCode}`);
    },
    error: (err, req, res) => {
      console.error('[Proxy Error]', err.message);
      res.status(500).send('Proxy Server Error');
    }
  }
}));

// Server start karna[cite: 2]
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[Fake API Server] Proxy server listening on port ${PORT}`);
  console.log(`[Fake API Server] Forwarding requests to ${TARGET_SERVER}`);
});