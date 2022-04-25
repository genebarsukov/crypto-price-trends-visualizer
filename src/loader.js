/**
 * Created by Gene on 1/16/2017.
 */



class Loader {
   /**
    * Constructor: Displays a selection of loading phrases while Angular 2 is loading
    */
   constructor() {
        var loading_phrases = [
           'Go hard or go home...',
           'Loading the madness...',
           'I got a fever and the only prescription is more bitcoin...',
           'Bitcoin is the new Bitcoin...',
           'Go hard or go home...'
        ];
        var phrase_index = parseInt(Math.random() * loading_phrases.length);
        var phrase = loading_phrases[phrase_index];
        var loading_text = document.getElementById('app-loading-text');

        loading_text.textContent = phrase;
    }
}
/**
 * Perform action on window load
 */
window.onload = function() {
    let loader = new Loader();
}
