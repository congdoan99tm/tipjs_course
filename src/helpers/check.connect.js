'use strict'
const mongoose = require('mongoose')
const os = require('os')
const process = require('process');
const { clearInterval } = require('timers');
const _SECONDS = 5000;

const countConnect = () => {
    const numConnection = mongoose.connections.length;
    return `Number of connections : ${numConnection}`;
}
let intervalId;
const checkOverloadDB = () => {
    intervalId = setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // Example maxium number of connections based on number of cores
        const maxConnections = numCores * 5;
        console.log(`Active connections: ${numConnection}`)
        console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`)
        if (numConnection > maxConnections) {
            console.log(`Connection overload detected!`)
        }

    }, _SECONDS); // Monitor every 5 seconds

}
const stopCheckOverloadDB = () => {
    clearInterval(intervalId);
    console.log('Stop Check OverloadDB');
};
module.exports = { countConnect, checkOverloadDB, stopCheckOverloadDB };