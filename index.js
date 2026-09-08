const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Base URL configuration (Environment variable ya placeholder)
const TARGET_SERVER = process.env.TARGET_SERVER || 'https://api.storytv.asia';

// Header dictionary mapping standard request parameters
const CUSTOM_HEADERS = {
  'appVersion': '67',
  'platform': '0',
  'deviceId': '2eae044a0cd76543',
  'os': 'Android 10 (API 29)',
  'network_type': 'WIFI',
  'ep_session_id': '145041874_1788886683257',
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVkRGF0ZSI6IlR1ZSBTZXAgMDggMTY6NDI6MjcgVVRDIDIwMjYiLCJzZXNzaW9uSWQiOiIyMDIxOTI5NDEiLCJkZXZpY2VJZCI6IjJlYWUwNDRhMGNkNzY1NDMiLCJzdWIiOiIxNDUwNDE4NzQiLCJleHAiOjE3ODkxNDQ5NDd9.vaj-E1OxFwsRpyXyulcBPTvjvvfyDiA5kOf05lXK_vM',
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