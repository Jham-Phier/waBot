const connect = require('./connection')
const midlewares = require('./midlewares')

async function start() {
    const waBot = await connect() 
    await midlewares(waBot)
    
}

//iniciando a execucao do bot
start()