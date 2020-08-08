$(document).ready(
  function() {
    var chatInputContainerForm = $('form.chat_bar');
    var chatInput = $('.chat_bar > input');
    var chatMicrophoneButton = $('i[class*="mic"]');
    var chatSubmitButton = $('i[class*="plane"]');
    var contacts = $('.contact');
    var messageBox = function () {return $('.messages.active');};  //creandola come valore funzione la posso reimpostare dinamicamente al bisogno
    var searchInputContainerForm = $('form.search');
    var searchInput = $('.search > input');
    var chatInputDefaultaValue = "Scrivi un messaggio";
    var searchInputDefaultaValue = "Cerca o inizia una nuova chat";

    var submittedMsg = false;
    var winSize = $(window).width();

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
      var template = Handlebars.compile($('#template_msg').html());
      var msg = chatInput.val();      //estraggo la stringa inserita nel campo input della chatbar
      messageBox().append(template({"class": "sent", "msg": msg}));   //inietto un div dotato di classi .message e .sent in .messages
      submittedMsg = true;         //questa variabile fa in modo che si resetti il campo input dopo l'invio del messaggio
    }

    function receiveMsg (){
      var template = Handlebars.compile($('#template_msg').html());
      setTimeout(function () {
        messageBox().append(template({"class": "received", "msg": "ok!"})); },
        1000); //imposto risposta on time out 1s
    }

    function filterContacts (){
      var srch = searchInput.val();    //estraggo stringa di ricerca inserita da utente
      contacts.each(              //ciclo su ogni elemento .contact
        function (){
          var cntStr = $(this).find('h3').text().toLowerCase();    //estraggo stringa contenuta nell'h3 del singolo .contact
          if (! ( cntStr.includes(srch) ) ){                       //la stringa del .contact contiene la stringa di ricerca?
            $(this).hide();                                        //no: nascondi contatto
          } else {
            $(this).show();                                       //sì: mostra contatto
          }
        });
    }

    function chatSwitch(clickedContact) {
      //per leggibilità esplicto con delle variabili i riferimenti di ciò che vado a modificare
      var currentlyActiveContact = $('.contact.active');          //contatto attivo
      var currentlyActiveChatHeader = $('.now_chatting.active');   //chat header attivo
      var currentlyActiveChatHistory = $('.messages.active')       //chat history attiva

      currentlyActiveContact.removeClass('active');          //disattivo contatto attivo
      currentlyActiveChatHeader.removeClass('active');      //disattivo chat header attivo
      currentlyActiveChatHistory.removeClass('active');    //disattivo chat history attiva

      var newActiveContactData = clickedContact.attr('data-chat');   //recupero valore del data attribute impostato sul contatto cliccato dall'utente
      clickedContact.addClass('active');                            //attivo contatto cliccato dall'utente
      $('.now_chatting[data-chat =' + newActiveContactData + ']').addClass('active');    //attraverso valore data attribute recuperato attivo nuovo header
      $('.messages[data-chat =' + newActiveContactData + ']').addClass('active');      //attraverso valore data attribute recuperato attivo nuova chat history
    
      if(winSize <= 599) {
        $('.chatbox').toggleClass('xs-active-tab');
        $('.contacts').toggleClass('xs-active-tab');
      }
    }

    $(window).on("resize", function() {
      winSize = $(window).width();
    });

    $('.now_chatting .fa-arrow-left').click(function() {
      $('.chatbox').toggleClass('xs-active-tab');
      $('.contacts').toggleClass('xs-active-tab');
    });


    //gestione del campo input di chat: toggle dei bottoni e reset del form
    chatInput.on({
      focusin: function () {                            //al focus in
        resetForm(chatInput, chatInputDefaultaValue);   //pulisci il form
        chatMicrophoneButton.toggle();                  //nascondi bottone microfono
        chatSubmitButton.toggle();                     //e al contempo mostra bottone plane
      },
      focusout: function () {                          //al focus out
        setTimeout(                                   //ritarda cambiamento dei bottoni: è necessario affinchè il bottone di invio sia cliccabile prima del toggle
          function () {
            chatMicrophoneButton.toggle();            //mostra bottone microfono
            chatSubmitButton.toggle();               //e al contempo nascondi bottone plane
            resetForm(chatInput, chatInputDefaultaValue);  //pulisci il form
          }, 110);
      }
    });

    //reset del form di ricerca
    searchInput.on("focusin focusout",
      function (){
        resetForm(searchInput, searchInputDefaultaValue);
      }
    );

    //questo blocco implementa la ricerca di un utente nella lista contatti
    searchInput.on('input',
    function (){
      filterContacts();
      }
    );

    //questo blocco implementa la navigazione tra chat
    contacts.on("click",
      function (){
        chatSwitch($(this));
      }
    );

    $('.chatbox').on("mouseenter mouseleave", ".message",     //per un evento mouseenter/mouseleave che avvenga su qualsiasi .message in .chatbox anche se successivo alla generazione della pagina
      function (){
        $(this).find("i").toggle();                           //trova un i (freccetta a scomparsa) all'interno del .message bersaglio e mostralo o nascondilo a seconda dello stato

        $(this).find("i").click(                              //e per lo stesso i al click
          function (){
            $(this).siblings('div').toggle();                //mostra o nascondi un fratello div (il div a scomparsa che contiene 'elimina messaggio')

            $(this).siblings('div').click(                  //e per lo stesso div al click
              function() {
                $(this).parent().remove();                  //elimina il .message che ha innescato la catena
              }
            )
          });
          $(this).find('div').hide();                     //necessario per nascondere il div che contiene 'elimina messaggio' al mouseleave, qualora non lo si sia fatto direttamente
        }
    );

    //questo blocco di codice gestisce invio e ricezione dei messaggi utilizzando invio
    chatInputContainerForm.submit(
      function (event) {
          sendMsg();
          resetForm(chatInput);
          receiveMsg();
          event.preventDefault();    //impedisco il refresh della pagina
        }
    );
    //questo blocco di codice gestisce invio e ricezione dei messaggi al click del bottone plane
    $('i[class*="plane"]').click(
      function () {
        sendMsg();
        resetForm(chatInput);
        receiveMsg();
      }
    );

  }
);
