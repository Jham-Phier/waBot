const { isCommand, extractDataFromMessage } = require('./utils/index')
const { BOT_EMOJI } = require('./config')
const Actions = require('./actions')

async function midlewares(waBot) {
    waBot.ev.on('messages.upsert', async ({ messages }) => {
        const baileysMessage = messages[0]

        // Verificando se existe message
        if (!baileysMessage?.message || !isCommand(baileysMessage)) {
            return
        }

        const actions = new Actions(waBot, baileysMessage) // instanciando nossas acoes

        const { command, remoteJid,} = extractDataFromMessage(baileysMessage)

        switch(command.toLowerCase()) {
            case 'f':
                    await actions.sticker()
                break
            case 'ping':
                await waBot.sendMessage(remoteJid, { text: BOT_EMOJI + ' Pong!' })
                break
        }
    })
}

module.exports = midlewares