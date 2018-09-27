import { Wechaty, Message } from 'wechaty';
import * as QrTerm from 'qrcode-terminal';
import { MessageType } from 'wechaty-puppet';

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
    QrTerm.generate(qrcode, {small: true})

    console.log(`${status} 扫描二维码登录 \n`)
}

function handleError(e) {
    console.log('出错了', e)
}

async function handleMessage(msg: Message) {
    const contact = msg.from()
    const text = msg.text()
    const room = msg.room()
    const type = msg.type()

    if (!msg.self()) {
        switch(type) {
            case MessageType.Text || MessageType.Url: // 文字 自动回复
                msg.say(text);
                break;
            case MessageType.Image || MessageType.Video:
                const filebox = await msg.toFileBox();
                await msg.say(filebox);
                break;
            default:
                msg.say('还不能处理的类型， 别瞎发了');
                console.log(`不能处理的类型: ${type}`)
        }
    }

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