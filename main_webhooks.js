// Webhooks (incoming HTTP notifications) support for Fluidsync service

const http = require('http');

    // web sockets client
const io = require('socket.io-client');

    // FluidSync host
    // to do use config or commandline arg... but, honestly, if where are other FluidSync providers?
const fluidsync = io('https://fluidsync2.herokuapp.com');  

var fluidsyncSocketId;

//-----------------------------

const httpServer = http.createServer((req, res) => {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Access-Control-Allow-Origin', '*');  
    res.end('WHOK');

    let incomingUrl = req.url;

    console.log(incomingUrl);

    if(fluidsyncSocketId && (incomingUrl !== '/'))
    {
        // extract path (substring between '/' and '?')
        // it is channel to publish into

        let indexOfQuestion = incomingUrl.indexOf('?');

        if(indexOfQuestion > 0)
        {
            let channel = incomingUrl.substring(1, indexOfQuestion);

            if(channel.length > 0)
            {                
                fluidsync.emit('publish', {
                    channel: channel, 
                    from: 'webhook', 
                    payload: {method: req.method, url: incomingUrl, headers: req.headers}
                });            
            }
        }
    }
});
  
//-----------------------------

fluidsync.on('connect', () => {

    fluidsyncSocketId = fluidsync.id;

    console.log('connected to FluidSync');
});

fluidsync.on('reconnect', () => {

    console.log('reconnect to FluidSync ...');        
});    

fluidsync.on('disconnect', () => {

    fluidsyncSocketId = undefined;

    console.log('disconnected from FluidSync');        
});    

//-----------------------------

const PERIOD = 15 * 60 * 1000; // 15 min
const pingTarget = 'fluidbridge.herokuapp.com';

const pingOptions = { hostname: pingTarget };

setInterval(() => {
    const pingRequest = http.request(pingOptions);    
    pingRequest.end();
}, PERIOD);

httpServer.listen(process.env.PORT, () => {
    console.log('Webhooks connector running...');  
});
