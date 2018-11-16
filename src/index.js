import './scss/main.scss';

console.log('Hello!');
console.log(`The time is ${new Date()}`);

var selectedCategory = 1;


$( document ).ready(function() {
    console.log( "ready!" );
    loadCategories();
    loadGoods(1);
});


function loadGoods(id){
	var link = 'http://nit.tron.net.ua/api/product/list/category/'+id;
	$.getJSON(link, function(data) {
        console.log(data);
        var out ='';
        for(var key in data){
        	console.log(data[key].image_url);
        	out+='<div class="goods-grid">';

        	out+='<div class="goods-img">';
        	out+='<img src="'+data[key]['image_url']+'">';
        	out+='</div>';

        	out+='<div class="goods-text">';
        	out+='<p>'+data[key]['name']+'</h3>';
        	out+='<p>'+data[key]['price']+'</p>';
        	out+='</div>';

        	out+='</div>';
        }
        $('#goods').html(out);
    });
}

function loadCategories() {
	$.getJSON('http://nit.tron.net.ua/api/category/list', function(data) {
		var out='<ul>';
		 for(var key in data){
		 	out+='<li class="load" data-art="'+data[key]['id']+'">'+data[key]['name']+'</li>';
        }
        out+='</ul>'
        $('#categories').html(out);
        $('li.load').on('click', function(){
        	var id = $(this).attr('data-art');
	        console.log(id);
	        loadGoods(id);
	        $('.load:eq('+(selectedCategory-1)+')').removeClass('highlight');
	        $('.load:eq('+(id-1)+')').addClass('highlight');
	        selectedCategory=id;
        });
	});
}
