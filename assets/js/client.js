function connect() {
  let HOST = location.origin.replace(/^http/, "ws");
  let ws = new WebSocket(HOST);
  ws.onclose = () => {
    setTimeout(() => {
      console.log("PANIC WebSocket died! Reconecting...");
      connect();
    }, 3000);
  };

  ws.onmessage = (msg) => {
    const type = typeof msg.data;
    if (type === "object") {
      // если приходит картинка
      var image = new Image();
      image.src = URL.createObjectURL(msg.data);
      $("#image").attr("src", image.src).animate_Img();
    } else {
      // если приходит текст
      payload = JSON.parse(msg.data);
      $("h3").text(payload);

      $("#fittext").animate_Text();
    }

    // document.body.appendChild(image);

    // image.src = message.data;
    // var urlObject = URL.createObjectURL(message.data);
    // image.src = urlObject;
    // console.log(msg)
    // console.log(type)

    // payload = JSON.parse(msg.data)
    // $("h3").text( payload );

    // $('#fittext').animate_Text();
  };
}

$(document).ready(function () {
  connect();
  $.fn.animate_Text = function () {
    var string = this.text();
    return this.each(function () {
      var $this = $(this);
      $this.html(string.replace(/./g, '<span class="new">$&</span>'));
      $this.find("span.new").each(function (i, el) {
        setTimeout(function () {
          $(el).addClass("div_opacity");
        }, 100 * i);
      });
    });
  };

  $("#fittext").animate_Text();

  $.fn.animate_Img = function () {
    $( "#image" ).animate({
      width: "60%",
      opacity: 0.8,
    }, 4000, function() {
      $( "#image" ).animate({
        opacity: 0,
      }, 9000, function() {
        $( "#image" ).animate({
          
          width: "0%",
        })

      });
    });
    
  };
});
