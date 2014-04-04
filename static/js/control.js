/**
 * This script take the form question send it on the web socket
 * and then wait for a answer to update the view.
 *
 *  Author: Francois Legare (flegare@gmail.com)
 */
$(document).ready(function() {

  //Hide the list of question sent
  $( "#question-list" ).hide();

    //Make connection with the mighty socket
  var socket = io.connect();

  ////////////////////////////////////////////////////////////////
  // Bind submit button to send the precious question
  ////////////////////////////////////////////////////////////////
  $('#send').bind('click', function() {

      //TODO Validate the form

      //Gather form content
      var qid = generateUUID(); //Will use this to update answer from the list of questions sent
      var name = $("#name").val();
      var question = $("#question").val();

      //Append list
      $('#question-row').append('<tr><td>'+question+'</td><td>'+name+'</td><td id="'+qid+'"></td></tr>');

      //Create a json string for better packaging
      var msg = JSON.stringify({ "type": 'question', "name": name, "question": question ,"qid": qid});

      //Send away the question, no postage required!
      socket.emit('message', msg);

  });

  ////////////////////////////////////////////////////////////////
  // Receive socket message, we just want to care about answers
  ////////////////////////////////////////////////////////////////
  socket.on('server_message', function(data){

    try{
        var msg = JSON.parse(data);
            if(msg['type']=='answer'){
                var qid = msg['qid'];
                //Might not be the most efficient way of doing this but for now i'll leave with it...
                $('#'+qid).append(msg['answer']);
            }
        }catch(e) {
            console.error("Can't parse json message :" + e);
        }
    });


  ////////////////////////////////////////////////////////////////
  // On form submission
  ////////////////////////////////////////////////////////////////
  var $form = $("#question-form");
  $form.submit(function(){
      $( "#question-list" ).show();

     return false;
  });

});


/**
 * Generate a unique id
 * @returns {string}
 */
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};