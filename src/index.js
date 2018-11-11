import './scss/main.scss';
console.log('Hello!');
console.log(`The time is ${new Date()}`);

$( document ).ready(function() {
    console.log( "ready!" );
});

$.get( "http://nit.tron.net.ua/api/category/list", function( data ) {
  $( ".result" ).html( data );
  $("#first").text(data);
});