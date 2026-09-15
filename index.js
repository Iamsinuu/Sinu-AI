const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Base URL configuration (Environment variable ya placeholder)
const TARGET_SERVER = process.env.TARGET_SERVER || 'https://api.storytv.asia';

// Header dictionary mapping standard request parameters
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

app.use('/', createProxyMiddleware({
  target: TARGET_SERVER,
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req, res) => {
      // Target server par request bhejte waqt saare required headers inject karein
      Object.entries(CUSTOM_HEADERS).forEach(([key, value]) => {
        proxyReq.setHeader(key, value);
      });
    }
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});