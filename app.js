const express = require("express"),
    path = require('path'),
    PORT = process.env.PORT || 3000,
    SocketServer = require('ws').Server;


const server = express()
    .use('/css',express.static( 'assets/css'))
    .use('/js',express.static( 'assets/js'))
    .use('/img',express.static( 'assets/img'))
    .get('/:name', (req, res) => {
        const fileName = req.params.name;
        if (fileName == 'favicon.ico') {
            return;
        };
        res.sendFile(path.join(__dirname, '/view/' + fileName));
    })
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const ws = new SocketServer({ server });

ws.broadcast = (data) => {
    ws.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(data);
        }
    })
}

ws.on('connection', (w, req) => {
    console.log('connection from => ', req.connection.remoteAddress);
    w.on('message', (msg) => {
        console.log('MSG SENT => ', new Date().toISOString(), msg);
        ws.clients.forEach((client) => {
            if (client !== w && client.readyState === client.OPEN) {
                client.send(msg);
            }
        })
    });
});

setInterval(() => {
    ws.clients.forEach((cl) => {
        cl.ping(() => {});
    })
}, 40000);
