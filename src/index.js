import './scss/main.scss';

console.log('Hello!');
console.log(`The time is ${new Date()}`);

var selectedCategory = 1;

var categoryDescription=[];

var cart={};

var cartVisible = false;

$( document ).ready(function() {
    $("#dialog").hide();
    $('.close-dialog').on('click', function(){
    	$("#dialog").fadeOut();
	    $('.main-content').removeClass('blur');
	    $('footer').removeClass('fix');
    });
    loadCategories();
    loadGoods(1);
    cartCheck();
    console.log(cart);
    $('#cart').on('click', function(){
    	cartDrop();
    	
    });

});

function cartDrop(){
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
}


function loadGoods(id){
	var link = 'https://nit.tron.net.ua/api/product/list/category/'+id;
	$.getJSON(link, function(data) {
        var out ='';
        for(var key in data){
        	console.log(data[key].image_url);
        	out+='<div class="goods-grid">';

        	out+='<div class="goods-img">';
        	out+='<img src="'+data[key]['image_url']+'">';
        	out+='</div>';

        	out+='<div class="goods-text">';
        	out+='<p class="getDescription" data-art="'+data[key]['id']+'">'+data[key]['name']+'</p>';
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
        		if(data[id-1]['special_price']!=null){
        			cart[id].price=data[id-1]['special_price'];
        		}else{
        			cart[id].price=data[id-1]['price'];
        		}
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

        $('p.getDescription').on('click', function(){
        	var id = $(this).attr('data-art');
        	showGoodDialog(id);
        });
    });
}

function loadCategories() {
	$.getJSON('https://nit.tron.net.ua/api/category/list', function(data) {
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
    var currPrice=0.00;

	var out='<p style="text-align: center;border-bottom: 1px dotted #4F677A;margin: 0px; padding-bottom: 4px;">Корзина</p>';
	out+='<div style="border-bottom: 1px dotted #4F677A;">';
	for(var item in cart){
		out+='<div id="cart-dd">';
		out+='<div class="cart-item">';
		out+='<img data-art="'+item+'" class="cross" src="./Pictures/cross.png">';
		out+='<p class="good" data-art="'+item+'">'+cart[item].name+'</p>';
		out+='<div class="quantity">';
		out+='<img data-art="'+item+'" class="left-img" src="./Pictures/plus.png">';
		out+='<p class="cart-p">'+cart[item].quantity+'</p>';
		out+='<img data-art="'+item+'" class="right-img" src="./Pictures/minus.png">';
		out+='</div>';
		out+='</div>';
		out+='</div>';
		currPrice+=parseFloat(cart[item].price)*cart[item].quantity;
	}
	out+='</div>';
	out+='<p>Разом: '+currPrice+' грн. </p>';
	out+='<button class="my-button">До оплати</button>'
	



	$('#dropdown').html(out);

	$('p.good').on('click', function(){
		var id = $(this).attr('data-art');
		cartDrop();
		showGoodDialog(id);
	});

	$('img.cross').on('click', function(){
		var id = $(this).attr('data-art');
		cart[id].quantity=0;
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
		var out='<p style="text-align: center;border-bottom: 1px dotted #4F677A;margin: 0px; padding-bottom: 4px;">Корзина</p>';out+='<p>Нічого не додано</p>';
		$('#dropdown').html(out);
	}
}

function showGoodDialog(id){
	$("#dialog").fadeIn();
	$('.main-content').addClass('blur');
	$('footer').addClass('fix');

	$.getJSON('https://nit.tron.net.ua/api/product/'+id, function(data) {
		var out='';

		out+='<img style="float:left;" src="'+data['image_url']+'">';

        out+='<div class="dialog-right">';
        out+='<h3>'+data['name']+'</h3>';
		out+='<div class="dialog-item-info">';
		
		out+='<p style="text-transform: uppercase; margin-bottom: 5px;">Опис товару</p>';
		out+='<p style="font: 88% Arial, sans-serif; margin-top: 5px;">'+data['description']+'</p>';
		out+='<div class="dialog-price">';
		out+='<p style="text-transform: uppercase; margin: 5px 10px;">Ціна</p>';

		if(data['special_price']===null){
        		out+='<p class="reg-price">'+data['price']+' грн. </p>';
        	}
        	else{
        		out+='<p class="sales">'+data['price']+' грн. </p>';
        		out+='<p class="price">'+data['special_price']+' грн. </p>';
        	}
		out+='</div>';
		out+='<button class="my-button" data-art="'+data['id']+'"> В корзину </button>';
		out+='</div>';
		out+='</div>';


		$('.dialog-content').html(out);
		$('button.my-button').on('click', function(){
        	var id = $(this).attr('data-art');
        	$( "#cart" ).effect( "shake" );
        	if(cart[id]!=undefined){
        		cart[id].quantity++;
        	}
        	else{
        		//cart[id].quantity=1;
        		cart[id]={};
        		cart[id].name=data['name'];
        		cart[id].image=data['image_url'];
        		cart[id].quantity=1;
        		if(data['special_price']!=null){
        			cart[id].price=data['special_price'];
        		}else{
        			cart[id].price=data['price'];
        		}
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

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}
