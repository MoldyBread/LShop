import './scss/main.scss';
console.log('Hello!');
console.log(`The time is ${new Date()}`);

$( document ).ready(function() {
    console.log( "ready!" );
});

$(function(){
    $.getJSON('http://nit.tron.net.ua/api/category/list', function(data) {
        console.log(data[0]['id']);
    });
});