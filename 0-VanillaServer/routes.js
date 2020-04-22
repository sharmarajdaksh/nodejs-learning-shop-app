const fs = require('fs');

const routeHandler = (req, res) => {
    if (req.url === '/') {
        res.setHeader('Content-type', 'text/html');
        res.write(fs.readFileSync('./button.html'));
        return res.end();
    }
    if (req.url === '/message' && req.method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[0];
            fs.writeFile('text.txt', message, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    res.statusCode = 302;
                    res.setHeader('Location', '/');
                    return res.end();
                }
            });
        });
    }
}

module.exports = { routeHandler };