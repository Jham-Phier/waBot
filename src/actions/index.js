const { extractDataFromMessage, downloadImage } = require('../utils')
const path = require('path')
const { TEMP_FOLDER, BOT_EMOJI } = require('../config')
const { exec } = require('child_process')
const fs = require('fs')

class Actions {
    constructor(waBot, baileysMessage) {
        const { remoteJid, args, isImage } = extractDataFromMessage(baileysMessage)

        this.waBot = waBot
        this.remoteJid = remoteJid
        this.args = args
        this.isImage = isImage
        this.baileysMessage = baileysMessage
    }
    
    async sticker() {

        if (!this.isImage) {
            await this.waBot.sendMessage(this.remoteJid, { text:  BOT_EMOJI + 'Marque uma imagem' })
            return
        }
        const inputPath = await downloadImage(this.baileysMessage, 'input')
        const outputPath = path.resolve(TEMP_FOLDER, 'output.webp')

        exec('ffmpeg -i ' + inputPath + ' -vf scale=512:512 ' + outputPath, async (error) => {
            if (error) {
                await this.waBot.sendMessage(this.remoteJid, { text:  BOT_EMOJI + 'Não foi possivel converter a figurinha' })
                console.log(error)
                return
            }

            await this.waBot.sendMessage(this.remoteJid, { 
                sticker: { url: outputPath }
             })

            fs.unlinkSync(inputPath)
            fs.unlinkSync(outputPath)
        })
    }
}

module.exports = Actions