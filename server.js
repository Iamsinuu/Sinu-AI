const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();

app.use(express.json());

const TOKEN_FILE = path.join(__dirname, 'saved_token.json');
const SERVER_1_URL = "https://server-hijack.onrender.com/get-token-file";
const ORIGINAL_SERVER_URL = "https://api.storytv.asia";

// Server 1 se valid headers/token file download karne ka function
async function downloadTokenFromServer1() {
    try {
        console.log("[Server 2] Server 1 se headers file download kar rahe hain...");
        const response = await axios.get(SERVER_1_URL);
        fs.writeFileSync(TOKEN_FILE, JSON.stringify(response.data, null, 2));
        console.log("[Server 2] Headers file successfully download aur save ho gayi!");
    } catch (error) {
        console.error("[Server 2] Download fail:", error.message);
    }
}

// Server start hote hi pehli baar download hoga
downloadTokenFromServer1();

// Hardcoded Proxy Logic (App ka data rok kar, saved file ka data lagana)
app.all('*', async (req, res) => {
    try {
        console.log(`[Server 2] Request aayi: ${req.method} ${req.url}`);

        // Agar file nahi hai toh turant download karo
        if (!fs.existsSync(TOKEN_FILE)) {
            await downloadTokenFromServer1();
        }

        // Saved file se saare valid headers padho
        const data = fs.readFileSync(TOKEN_FILE, 'utf8');
        const savedHeaders = JSON.parse(data);

        if (!savedHeaders.authorization) {
            return res.status(403).json({ error: "Server 2 ke paas valid authorization nahi mila!" });
        }

        const targetUrl = `${ORIGINAL_SERVER_URL}${req.url}`;
        const currentTimestamp = Math.floor(Date.now() / 1000).toString();
        
        // App ke headers ko poori tarah ignore karke saved file wale headers replace karna
        const finalHeaders = {
            ...savedHeaders,
            'host': 'api.storytv.asia',
            'ts': currentTimestamp,
            'ep_session_id': `15544664_${currentTimestamp}` // Live timestamp ke sath update
        };

        // Original server ko request bhejna
        const response = await axios({
            method: req.method,
            url: targetUrl,
            headers: finalHeaders,
            data: req.body,
            validateStatus: () => true 
        });

        console.log(`[Server 2] Original server se status aaya: ${response.status}`);
        res.status(response.status).json(response.data);

    } catch (error) {
        console.error("[Server 2] Error:", error.message);
        res.status(500).json({ error: "Server 2 Proxy Error", details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server 2 port ${PORT} par chal raha hai!`);
});
