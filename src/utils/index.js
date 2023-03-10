const { PREFIX, TEMP_FOLDER } = require('../config')
const { downloadContentFromMessage } = require('@adiwajshing/baileys')
const path = require('path')
const { writeFile } = require('fs/promises')

function extractDataFromMessage(baileysMessage) {
    const textMessage = baileysMessage.message?.conversation
    const extendedTextMessage = baileysMessage.message?.extendedTextMessage?.text
    const imageTextMessage = baileysMessage.message?.imageMessage?.caption //imageMessage?.caption
    const fullMessage = textMessage || extendedTextMessage || imageTextMessage

    // caso nao tenha menssagens
    if (!fullMessage) {
        return {
            remoteJid: '',
            fullMessage: '',
            command: '',
            args: '',
            isImage: false
        }
    }

    // ! - Nega, !! - Boleano // verificando se e imagem
    const isImage = !!baileysMessage.message?.imageMessage || 
        !!baileysMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage

    //separando o comando dos argumentos
    const [command, ...args] = fullMessage.trim().split(' ')

    const arg = args.reduce((acc, arg) => acc + ' ' + arg, '').trim()
    return {
        remoteJid: baileysMessage.key.remoteJid,
        fullMessage,
        command: command.replace(PREFIX, '').trim(),
        args: arg.trim(),
        isImage
    }
}

function isCommand(baileysMessage) {
    const { fullMessage } = extractDataFromMessage(baileysMessage)
    return fullMessage && fullMessage.startsWith(PREFIX)
}

async function downloadImage(baileysMessage, fileName) {
    const content = baileysMessage.message?.imageMessage || 
        baileysMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage
    // se nao tiver conteudo
    if (!content) {
        return null
    }

    //baixa a imagem
    const stream = await downloadContentFromMessage(content, 'image')

    let buffer = Buffer.from([])

    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }

    const filePath = path.resolve(TEMP_FOLDER, fileName + '.png') //caminho da imagem

    await writeFile(filePath, buffer)
    return filePath
}

module.exports = {
    downloadImage,
    extractDataFromMessage,
    isCommand
}