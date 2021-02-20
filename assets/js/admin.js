let ws;

function connect() {
  let HOST = location.origin.replace(/^http/, "ws");
  ws = new WebSocket(HOST);
  ws.onclose = () => {
    setTimeout(() => {
      console.log("PANIC WebSocket died! Reconecting...");
      connect();
    }, 3000);
  };
}

connect();

sendMsg = (item, type) => {
  if (type === "img") {
    sendFile();
  } else {
    const text = item.parentElement.children[0].innerHTML.trim();
    console.log(item.parentElement.innerHTML);
    prepMsg(text, type);
  }
  // console.log({item, type})
};

wsSend = (text, type) => {
    ws.send(JSON.stringify(text), type);
  
};

sendCustomMsg = (item) => {
  const text = item.parentElement.children[0].value.trim();
  words = text.split(" ").filter((n) => n != "");
  i = 0;
  words.forEach((w) => {
    if (!(i % 20) && i != 0) {
      words.splice(i, 0, "{NEWLINE}");
    }
    i++;
  });

  prepMsg(words.join(" "));
};

prepMsg = (text, type) => {
    const array = text.split(/{NEWLINE}/gi);
    i = 0;
    wsSend(array[i], type);
    next = () => {
      if (++i < array.length) {
        setTimeout(() => {
          wsSend(array[i]);
          next();
        }, array[i - 1].length * 100 + 3000);
      }
    };
    next();
  
};
function sendFile() {
    var file = document.getElementById("filename").files[0];

    var reader = new FileReader();

    var rawData = new ArrayBuffer();
    reader.onload = function (e) {
      rawData = e.target.result;
      console.log(rawData);

      ws.send(rawData);

      // alert("the File has been transferred.");
    };

    reader.readAsArrayBuffer(file);
  }


