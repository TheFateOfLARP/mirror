let ws;

function connect() {
    let HOST = location.origin.replace(/^http/, 'ws');
    ws = new WebSocket(HOST);
    ws.onclose = () => {
        setTimeout(() => {
            console.log('PANIC WebSocket died! Reconecting...');
            connect()
        }, 3000);
    }
}

connect();

sendMsg = (item) => {
    const text = item.parentElement.children[0].innerHTML.trim();
    prepMsg(text);
}

wsSend = (text) => {
    ws.send(JSON.stringify(text));
}

sendCustomMsg = (item) => {
    const text = item.parentElement.children[0].value.trim();
    words = text.split(' ').filter((n) => n != '');
    i = 0;
    words.forEach(w => {
        if (!(i%20) && i != 0) {
            words.splice(i, 0, '{NEWLINE}');
        }
        i++
    });
    
    prepMsg(words.join(' '));
}

prepMsg = (text) => {
    const array = text.split(/{NEWLINE}/gi);
    i = 0;
    wsSend(array[i]);
    next = () => {
        if( ++i < array.length) {
            setTimeout(() => {
                wsSend(array[i]);
                next();
            }, array[i-1].length*100 + 3000);
        }
    }
    next();
}