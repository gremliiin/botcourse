const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '6420404322:AAGm70YDI-zDyTGSfCFApAJpvDGw4ltqhs4'

const bot = new TelegramApi(token, {polling: true})

bot.setMyCommands([
    {command: '/start', description: 'welcome'},
    {command: '/info', description: 'information about user'},
    {command: '/game', description: 'start game'}
])

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'I guess number from 1 to 9, you should say this number')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'start guess: ', gameOptions)
}

const start = () => {
    bot.on('message', async (msg) => {
        const text = msg.text
        const chatId = msg.chat.id
    
        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://tgram.ru/wiki/stickers/img/octaviusvk/png/41.png')
            return bot.sendMessage(chatId, `You're welcome`)
        }
        
        if(text === '/info') {
           return bot.sendMessage(chatId, `Your name: ${msg.from.first_name} ${msg.from?.last_name ?? msg.from.username}`)
        }

        if(text === '/game') {
            return startGame(chatId)
        }

        bot.sendMessage(chatId, "i don't understand you")
    
    })

    bot.on('callback_query', async (msg) => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if(data === '/again') {
            return startGame(chatId)
        }

        if(Number(data) === chats[chatId]) {
            return await bot.sendMessage(chatId, `you win, it was: ${chats[chatId]}`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `you lose, it was: ${chats[chatId]}`, againOptions)
        }
    })
}

start()