$(document).ready(
  function() {

    function resetChatBar (){            //questa funzione resetta il campo input della .chatbar
      $('.chat_bar > input').val('');
    }

    function sendMsg (){
      var msg = $('.chat_bar > input').val();      //estraggo la stringa inserita nel campo input della chatbar
      $('.messages').append("<div class='message sent'>" + msg + "</div>");   //inietto un div dotato di classi .message e .sent in .messages
    }

    function receiveMsg (){
      setTimeout(function () { $('.messages').append("<div class='message received'>ok</div>"); }, 1000);
    }


    //questo blocco di codice pulisce la chatbar al primo click
    var firstClick = true;
    $('.chat_bar > input').click(
      function (){
        if(firstClick){
        resetChatBar();
        firstClick = false;
      }
      }
    );

    //questo blocco di codice gestisce invio e ricezione dei messaggi
    $('form.chat_bar').submit(
      function (event) {
          sendMsg();
          resetChatBar();
          receiveMsg();
          event.preventDefault();    //impedisco il refresh della pagina
        }
    );


  }
);
