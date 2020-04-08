$(document).ready(
  function() {
    var chatInputContainerForm = $('form.chat_bar');
    var chatInput = $('.chat_bar > input');

    var messageBox = $('.messages');

    var searchInputContainerForm = $('form.search');
    var searchInput = $('.search > input');
    var chatInputDefaultaValue = "Scrivi un messaggio";
    var searchInputDefaultaValue = "Cerca o inizia una nuova chat";

    var submittedMsg = false;

    function resetForm (form, standard){            //questa funzione resetta il campo input della .chatbar
      if (form.val() == standard || submittedMsg){  //se il campo contiene il messaggio di default oppure è appena stato inviato un nuovo messaggio
      form.val('');                                //resettalo
      submittedMsg = false;                       //è necessario risettarla su false affinchè il campo non si resetti ogni volta che viene chiamata la funzione
    }
      else if (form.val().length == 0){      //se il campo non contiene nulla (ma non se contiene stringhe di spazi vuoti)
      form.val(standard);                   //riportalo sul messaggio di default
    }
    }

    function sendMsg (){
      var msg = chatInput.val();      //estraggo la stringa inserita nel campo input della chatbar
      messageBox.append("<div class='message sent'>" + msg + "</div>");   //inietto un div dotato di classi .message e .sent in .messages
      submittedMsg = true;         //questa variabile fa in modo che si resetti il campo input dopo l'invio del messaggio
    }

    function receiveMsg (){
      setTimeout(function () { messageBox.append("<div class='message received'>ok</div>"); }, 1000); //imposto risposta on time out 1s
    }

    //reset del campo imput di chat
    chatInput.on("focusin focusout",
      function (){
        resetForm(chatInput, chatInputDefaultaValue);
      }
    );

    //reset del form di ricerca
    searchInput.on("focusin focusout",
      function (){
        resetForm(searchInput, searchInputDefaultaValue);
      }
    );

    //questo blocco implementa la ricerca di un utente nella lista contatti
    searchInput.on('input',
    function() {
      var srch = searchInput.val();    //estraggo stringa di ricerca inserita da utente
      $('.contact').each(              //ciclo su ogni elemento .contact
        function (){
          var cntStr = $(this).find('h3').text().toLowerCase();    //estraggo stringa contenuta nell'h3 del singolo .contact
          if (! ( cntStr.includes(srch) ) ){                       //la stringa del .contact contiene la stringa di ricerca?
            $(this).hide();                                        //no: nascondi contatto
          } else {
            $(this).show();                                       //sì: mostra contatto
          }
        });
      }
    );

    //questo blocco di codice gestisce invio e ricezione dei messaggi
    chatInputContainerForm.submit(
      function (event) {
          sendMsg();
          resetForm(chatInput);
          receiveMsg();
          event.preventDefault();    //impedisco il refresh della pagina
        }
    );

  }
);
