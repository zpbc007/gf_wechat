import { Wechaty } from 'wechaty';
import * as QrTerm from 'qrcode-terminal';

const bot = new Wechaty();

bot
.on('logout', handleLogout)
.on('login', handleLogin)
.on('scan', handleScan)
.on('error', handleError)
.on('message', handleMessage)

function handleLogout(user) {
    console.log(`用户 ${user.name()} 登出`)
}

function handleLogin(user) {
    console.log(`用户 ${user.name()} 登入`)
    bot.say('微信登入')
}

function handleScan(qrcode, status) {
    const qrcodePic = QrTerm.generate(qrcode, {small: true})

    console.log(`${status} 扫描二维码登录 ${qrcodePic} \n`)
}

function handleError(e) {
    console.log('出错了', e)
}

async function handleMessage(msg) {
    const contact = msg.from()
    const text = msg.text()
    const room = msg.room()
    if (room) {
      const topic = await room.topic()
      console.log(`收到来自群: ${topic} 下: ${contact.name()} 的消息: ${text}`)
    } else {
      console.log(`收到来自: ${contact.name()} 的消息: ${text}`)
    }
    console.log(`收到信息 ${msg.text()} ${msg.from()}`)
}

export function start() {
    bot
    .start()
    .catch(async e => {
        console.error('Bot start() fail:', e)
        await bot.stop()
        process.exit(-1)
    })
}