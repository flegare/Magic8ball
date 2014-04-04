/**
 * This script wait for question, generate an answer
 * and push back the answer on the socket. It also
 * update the magic 8 ball
 *
 * Author: Francois Legare (flegare@gmail.com)
 */

$(document).ready(function() {   

  //Make connection with the mighty socket
  var socket = io.connect();

  //Init view.
  $('#question-text').show();
  $('#question-text').css('opacity', 0);

   ////////////////////////////////////////////////////////////////
   // Receive socket message
   ////////////////////////////////////////////////////////////////
  socket.on('server_message', function(data){

    var type = "";
    var qid = "";
    var name = "Someone famous";
    var question = "Why no one have asked a valid question yet?";

    try{

       var msg = JSON.parse(data);

       if(msg['type']=='question'){

           name = msg['name'];
           question = msg['question'];
           qid = msg['qid'];

           var answer = getRandomAnswer();

           //Updating SVG graphic
           var elem = document.getElementById("wisdom"); // Assuming textElem is the id of text object in SVG.
           elem.firstChild.nodeValue = answer;
           $('#question-text').animate({ opacity: 1, top: "-100px" }, 'slow');
           $('#question-text').replaceWith('<p id="question-text">' + question + '</p>');
           $('#question-from').replaceWith('<footer id="question-from">' + name + '</footer>');

           //Send back the answer on the socket for fun and glory
           var msg = JSON.stringify({ "type": 'answer' ,"qid": qid, "answer": answer});
           //Send away the question, no postage required!
           socket.emit('message', msg);
       }

    }catch(e) {
        console.error("Can't parse json message :" + e);
    }
   });
});

/**
 * All the mystic power is packed in this epic method
 * @returns {a very truthful answer}
 */
function getRandomAnswer()
{

    var answers = new Array();
    answers[0] = "Without a doubt";
    answers[1] = "It is certain";
    answers[2] = "It is decidedly so";
    answers[3] = "Yes definitely";
    answers[4] = "You may rely on it";
    answers[5] = "As I see it, yes";
    answers[6] = "Most likely";
    answers[7] = "Outlook good";
    answers[8] = "Yes";
    answers[9] = "Signs point to yes";
    answers[10] = "Reply hazy try again";
    answers[11] = "Ask again later";
    answers[12] = "Better not tell you now";
    answers[13] = "Cannot predict now";
    answers[14] = "Meditate and ask again";
    answers[15] = "Don't count on it";
    answers[16] = "My reply is no";
    answers[17] = "Outlook not so good";
    answers[18] = "Very doubtful";

    return answers[Math.floor((Math.random()*answers.length))];

}