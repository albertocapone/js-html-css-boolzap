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
    var chatInputDefaultaValue = "Scrivi un messaggio...";
    var searchInputDefaultaValue = "Cerca o inizia una nuova chat";
    var firstMsg = true;
    var submittedMsg = false;
    var winSize = $(window).width();

    function resetForm (form, standard){            //questa funzione resetta il campo input della .chatbar
      if (form.val() == standard || submittedMsg){  //se il campo contiene il messaggio di default oppure è appena stato inviato un nuovo messaggio
      form.val('');                                //resettalo
      submittedMsg = false;                       //è necessario risettarla su false affinchè il campo non si resetti ogni volta che viene chiamata la funzione
    }
      else {      //se il campo non contiene nulla (ma non se contiene stringhe di spazi vuoti)
      form.val(standard);                   //riportalo sul messaggio di default
    }
    }

    function sendMsg (){
      var template = Handlebars.compile($('#template_msg').html());
      var msg = chatInput.val();      //estraggo la stringa inserita nel campo input della chatbar
      var time = new Date().toLocaleTimeString().split(':').slice(0, -1).join(':');
      messageBox().append(template({ "class": "sent", "msg": msg, "time": time}));   //inietto un div dotato di classi .message e .sent in .messages
      submittedMsg = true;         //questa variabile fa in modo che si resetti il campo input dopo l'invio del messaggio
    }

    function receiveMsg (){

      var msg = (firstMsg) ? "Scrivimi!" : "ok!";

      var dataChat = messageBox().data('chat');

      /* sta scrivendo...*/
      $('.now_chatting').each(function () {
        if ($(this).data('chat') == dataChat || firstMsg) {
          $(this).find('.last-access').html("sta scrivendo...");
        }
      });
      $('.contact').each(function () {
        if ($(this).data('chat') == dataChat || firstMsg) {
          $(this).find('.last-msg').html("sta scrivendo...");
        }
      });
      /* */

      var template = Handlebars.compile($('#template_msg').html());

      var time = new Date().toLocaleTimeString().split(':').slice(0, -1).join(':');  

      setTimeout(function () {
        $('.now_chatting').each(function() {
          if ($(this).data('chat') == dataChat || firstMsg) {
            $(this).find('.last-access').html('Ultimo accesso alle ' + time);
          }  
        });
        $('.contact').each(function () {
          if ($(this).data('chat') == dataChat || firstMsg) {
            $(this).find('.last-access').html(time);
            $(this).find('.last-msg').html(msg);
          }
        });
        
        if (firstMsg) {
          $('.messages').each(function() {
            $(this).append(template({ "class": "received", "msg": msg, "time": time })); 
          });
        } else {
          messageBox().append(template({ "class": "received", "msg": msg, "time": time })); 
        }
        firstMsg = false; 
      },
      1000); 
        
    }

    function filterContacts (){
      var srch = searchInput.val().toLowerCase();    //estraggo stringa di ricerca inserita da utente
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
    
      if(winSize <= 639) {
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
      },
      focusout: function () {                          //al focus out
        setTimeout(                                   //ritarda cambiamento dei bottoni: è necessario affinchè il bottone di invio sia cliccabile prima del toggle
          function () {
            chatMicrophoneButton.show();            //mostra bottone microfono
            chatSubmitButton.hide();               //e al contempo nascondi bottone plane
            resetForm(chatInput, chatInputDefaultaValue);  //pulisci il form
          }, 280);
      },
      input: function () {   
        var input = $(this).val().trim();
        if (input) {                  
          chatMicrophoneButton.hide();                  //nascondi bottone microfono
          chatSubmitButton.show();                     //e al contempo mostra bottone plane
        } else {
          console.log(false, input);
          chatMicrophoneButton.show();                  //nascondi bottone microfono
          chatSubmitButton.hide();                     //e al contempo mostra bottone plane
        }
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
        $(this).find("#erase-msg-btn").toggle();                           //trova un i (freccetta a scomparsa) all'interno del .message bersaglio e mostralo o nascondilo a seconda dello stato

        $(this).find("#erase-msg-btn").click(                              //e per lo stesso i al click
          function (){
            $(this).siblings('#erase-msg-box').toggle();                //mostra o nascondi un fratello div (il div a scomparsa che contiene 'elimina messaggio')

            $(this).siblings('#erase-msg-box').click(                  //e per lo stesso div al click
              function() {
                $(this).siblings('p').html('Messaggio Eliminato');                  //elimina il .message che ha innescato la catena
                $(this).siblings('#erase-msg-btn').remove()
                var dataChat = messageBox().data('chat');
                var lastMsg = messageBox().find('.message').last();
                $('.contact').each(function () {
                  if ($(this).data('chat') == dataChat) {
                    $(this).find('.last-access').html(lastMsg.find('#sending-time').html());
                    $(this).find('.last-msg').html(lastMsg.find('p').html());
                  }
                });
              }
            )
          });
        $(this).find("#erase-msg-box").hide();                     //necessario per nascondere il div che contiene 'elimina messaggio' al mouseleave, qualora non lo si sia fatto direttamente
        }
    );

    //questo blocco di codice gestisce invio e ricezione dei messaggi utilizzando invio
    chatInputContainerForm.submit(
      function (event) {
        var input = chatInput.val().trim()
        if (input) {
          sendMsg();
          resetForm(chatInput);
          receiveMsg();
          chatInput.blur();
        }
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

    receiveMsg();
  }
);
