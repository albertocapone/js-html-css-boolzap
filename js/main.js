$(document).ready(
  function() {
    var chatInputContainerForm = $('form.chat_bar');
    var chatInput = $('.chat_bar > input');
    var messageBox = $('.messages');

    function resetChatBar (){            //questa funzione resetta il campo input della .chatbar
      chatInput.val('');
    }

    function sendMsg (){
      var msg = chatInput.val();      //estraggo la stringa inserita nel campo input della chatbar
      messageBox.append("<div class='message sent'>" + msg + "</div>");   //inietto un div dotato di classi .message e .sent in .messages
    }

    function receiveMsg (){
      setTimeout(function () { messageBox.append("<div class='message received'>ok</div>"); }, 1000); //imposto risposta on time out 1s
    }


    //questo blocco di codice pulisce la chatbar al primo click
    var firstClick = true;
    chatInput.click(
      function (){
        if(firstClick){
        resetChatBar();
        firstClick = false;
      }
      }
    );

    //questo blocco di codice gestisce invio e ricezione dei messaggi
    chatInputContainerForm.submit(
      function (event) {
          sendMsg();
          resetChatBar();
          receiveMsg();
          event.preventDefault();    //impedisco il refresh della pagina
        }
    );


  }
);
