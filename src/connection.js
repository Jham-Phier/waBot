const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@adiwajshing/baileys')

async function connect() {

    const { state, saveCreds } = await useMultiFileAuthState('./assets/auth/baileys')
    
    // instancia do bot
    const waBot = makeWASocket({
        printQRInTerminal: true, //imprime o qrcode
        defaultQueryTimeoutMs: undefined,
        auth: state,
    })

    waBot.ev.on('connection.update', (update) => {
        const  { connection, lastDisconnect } = update

        // tentando se reconectar
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut

            if (shouldReconnect) {
                connect()
            }
        }else if (connection === 'open') {
            console.log('\n\nO bot está conectado...\n\n\n')
        }
        // toda vez que a conexao for atualizada salve os dados
        waBot.ev.on ('creds.update', saveCreds)
    })

    return waBot
}

module.exports = connect