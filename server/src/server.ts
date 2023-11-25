// src/server.ts
import { app } from './app';
import { WebSocket } from 'ws';

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

const wss = new WebSocket.Server({ host: 'localhost', port: 3002 }, () => console.log('Websocket server listening'));

wss.on('connection', (socket: WebSocket) => {
    console.log('New client connected', JSON.stringify(socket));
    socket.on('error', console.error);
    socket.on('message', (data) => {
        const v = JSON.parse(data.toString());
        console.log('received data', v);
        wss.clients.forEach((client) => client.send(JSON.stringify(v)));
    });
    socket.on('close', (code: number, reason: Buffer) => {
        console.log('client disconnected', code, reason);
    });
});
