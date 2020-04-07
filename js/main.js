$(document).ready(
  function() {

    function resetChatBar (){            //questa funzione resetta il campo input della .chatbar
      $('.chat_bar > input').val('');
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

    //questo blocco di codice gestisce l'invio dei messaggi
    $('form.chat_bar').submit(
      function (event) {
          var msg = $('.chat_bar > input').val();      //estraggo la stringa inserita nel campo input della chatbar
          $('.messages').append("<div class='message sent'>" + msg + "</div>");   //inietto un div dotato di classi .message e .sent in .messages
          resetChatBar();                                                       //resetto il campo input
          event.preventDefault();                                              //impedisco il refresh della pagina
        }
    );


  }
);
