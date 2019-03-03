function connect() {
    let HOST = location.origin.replace(/^http/, 'ws');
    let ws = new WebSocket(HOST);
    ws.onclose = () => {
        setTimeout(() => {
            console.log('PANIC WebSocket died! Reconecting...');
            connect()
        }, 3000);
    }

    ws.onmessage = (msg) => {
        payload = JSON.parse(msg.data)
        $("h3").text( payload );
        
        $('#fittext').animate_Text();
    };
}

$(document).ready(function(){
    connect();
    $.fn.animate_Text = function() {
        var string = this.text();
        return this.each(function(){
            var $this = $(this);
            $this.html(string.replace(/./g, '<span class="new">$&</span>'));
            $this.find('span.new').each(function(i, el){
                setTimeout(function(){ $(el).addClass('div_opacity'); }, 100 * i);
            });
        });
    };

    $('#fittext').animate_Text();
});