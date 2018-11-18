import './scss/main.scss';

console.log('Hello!');
console.log(`The time is ${new Date()}`);

var selectedCategory = 1;

var categoryDescription=[];

var cart={};

var cartVisible = false;

$( document ).ready(function() {
    //console.log( "ready!" );
    loadCategories();
    loadGoods(1);
    cartCheck();
    console.log(cart);
    $('#cart').on('click', function(){
    	if(!cartVisible){
    		showCartItems();
    		$('#dropdown').addClass('drop');
    		$('.dd').addClass('dd-active');
    		cartVisible=true;
    	}else{
    		$('#dropdown').removeClass('drop');
    		$('.dd').removeClass('dd-active');
    		cartVisible=false;
    	}
    	
    });

});


function loadGoods(id){
	var link = 'http://nit.tron.net.ua/api/product/list/category/'+id;
	$.getJSON(link, function(data) {
        //console.log(data);
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
        	
        	out+='<button class="my-button" data-art="'+data[key]['id']+'"> В корзину </button>'
        	out+='</div>';

        	out+='</div>';

        }
        $('#goods').html(out);
        $('button.my-button').on('click', function(){
        	var id = $(this).attr('data-art');
        	$( "#cart" ).effect( "shake" );
        	if(cart[id]!=undefined){
        		cart[id].quantity++;
        	}
        	else{
        		//cart[id].quantity=1;
        		cart[id]={};
        		cart[id].name=data[id-1]['name'];
        		cart[id].image=data[id-1]['image_url'];
        		cart[id].quantity=1;
        	}
        	localStorage.setItem('cart',JSON.stringify(cart));
        	
        	if(!cartVisible){
    		$('#dropdown').addClass('drop');
    		$('.dd').addClass('dd-active');
    		cartVisible=true;
    		showCartItems();
    	    }
    	    else{
    	    	showCartItems();
    	    }
        });
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
	        //console.log(id);
	        loadGoods(id);
	        $('#ghead').html(categoryDescription[id-1]);
	        $('.load:eq('+(selectedCategory-1)+')').removeClass('highlight');
	        $('.load:eq('+(id-1)+')').addClass('highlight');
	        selectedCategory=id;
        });
	});
}

function cartCheck(){
	if(localStorage.getItem('cart')!=null){
		cart=JSON.parse(localStorage.getItem('cart'));
	}
}

function showCartItems(){
	console.log(cart);
	if(!isEmpty(cart)){
	var out='';
	for(var item in cart){
		out+='<div id="cart-dd">';
		out+='<div class="cart-item">';
		out+='<img data-art="'+item+'" class="cross" src="http://simpleicon.com/wp-content/uploads/cross.png">';
		out+='<p class="good">'+cart[item].name+'</p>';
		out+='<div class="quantity">';
		out+='<img data-art="'+item+'" class="left-img" src="http://pngimg.com/uploads/plus/plus_PNG31.png">';
		out+='<p class="cart-p">'+cart[item].quantity+'</p>';
		out+='<img data-art="'+item+'" class="right-img" src="http://pngimg.com/uploads/minus/minus_PNG55.png">';
		out+='</div>';
		out+='</div>';
		out+='</div>';
	}
	$('#dropdown').html(out);

	$('img.cross').on('click', function(){
		var id = $(this).attr('data-art');
		delete cart[id];
		showCartItems();
		localStorage.setItem('cart',JSON.stringify(cart));
	});

	$('img.left-img').on('click', function(){
		var id = $(this).attr('data-art');
		cart[id].quantity++;
		showCartItems();
		localStorage.setItem('cart',JSON.stringify(cart));
	});

	$('img.right-img').on('click', function(){
		var id = $(this).attr('data-art');
		if(cart[id].quantity>1){
			cart[id].quantity--;
		}
		showCartItems();
		localStorage.setItem('cart',JSON.stringify(cart));
	});
	}else{
		var out='<p>Нічого не додано</p>';
		$('#dropdown').html(out);
	}
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}
