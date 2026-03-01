import * as nodemailer from 'nodemailer';
import * as net from 'net';

// Test 1: Conexión TCP directa al puerto 587
const socket = net.createConnection(587, 'smtp-relay.brevo.com');
socket.on('connect', () => {
    console.log('TCP 587: CONECTADO');
    socket.destroy();
});
socket.on('error', (err) => {
    console.log('TCP 587: BLOQUEADO -', err.message);
});

// Test 2: Conexión TCP al puerto 465
const socket2 = net.createConnection(465, 'smtp-relay.brevo.com');
socket2.on('connect', () => {
    console.log('TCP 465: CONECTADO');
    socket2.destroy();
});
socket2.on('error', (err) => {
    console.log('TCP 465: BLOQUEADO -', err.message);
});

// Test 3: Conexión TCP al puerto 2525
const socket3 = net.createConnection(2525, 'smtp-relay.brevo.com');
socket3.on('connect', () => {
    console.log('TCP 2525: CONECTADO');
    socket3.destroy();
});
socket3.on('error', (err) => {
    console.log('TCP 2525: BLOQUEADO -', err.message);
});
