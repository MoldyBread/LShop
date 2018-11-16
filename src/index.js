import './scss/main.scss';

console.log('Hello!');
console.log(`The time is ${new Date()}`);

var selectedCategory = 1;

var categoryDescription=[];

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
        	if(data[key]['special_price']===null){
        		out+='<p class="reg-price">'+data[key]['price']+' грн. </p>';
        	}
        	else{
        		out+='<p class="sales">'+data[key]['price']+' грн. </p>';
        		out+='<p class="price">'+data[key]['special_price']+' грн. </p>';
        	}
        	
        	out+='<button class="my-button"> В корзину </button>'
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
		 	categoryDescription.push(data[key]['description']);
        }
        out+='</ul>'

        $('#categories').html(out);
        $('#ghead').html(categoryDescription[0]);
        $('.load:eq(0)').addClass('highlight');
        $('li.load').on('click', function(){
        	var id = $(this).attr('data-art');
	        console.log(id);
	        loadGoods(id);
	        $('#ghead').html(categoryDescription[id-1]);
	        $('.load:eq('+(selectedCategory-1)+')').removeClass('highlight');
	        $('.load:eq('+(id-1)+')').addClass('highlight');
	        selectedCategory=id;
        });
	});
}
