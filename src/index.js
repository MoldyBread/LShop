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
        var k=0;
        for(var key in data){

        	//console.log(data[key].image_url);
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
        	
        	out+='<button class="my-button" data-art="'+data[key]['id']+'" data-art2="'+key+'"> В корзину </button>'
        	//console.log(data[key]['id']);
        	out+='</div>';

        	out+='</div>';

        	k++;
        }
        $('#goods').html(out);

        $('button.my-button').on('click', function(){
        	var id = $(this).attr('data-art');
        	var key = parseInt($(this).attr('data-art2'));
        	console.log(id);
        	console.log(data);
        	console.log(key);
        	$( "#cart" ).effect( "shake" );

        	if(cart[id-1]!=undefined){
        		cart[id-1].quantity++;
        	}
        	else{
        		//cart[id].quantity=1;
        		cart[id-1]={};
        		cart[id-1].name=data[key]['name'];
        		cart[id-1].image=data[key]['image_url'];
        		cart[id-1].quantity=1;
        		if(data[key]['special_price']!=null){
        			cart[id-1].price=data[key]['special_price'];
        		}else{
        			cart[id-1].price=data[key]['price'];
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
	        console.log(id);
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
	//console.log(cart);
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
	out+='<button class="my-button" id="checkout">До замовлення</button>';
	



	$('#dropdown').html(out);


	$('button#checkout').on('click', function(){
		cartDrop();
		showCheckoutDialog(currPrice);
	});

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

function showCheckoutDialog(price){

	$("#dialog").fadeIn();
	$('.main-content').addClass('blur');
	$('footer').addClass('fix');
	var out='';

	out+='<p style="text-transform:uppercase; font-weight: bold; ">Ваше замовлення</p>';
	out+='<div class="my-order">';
	for(var key in cart){
		out+='<p>'+cart[key].name+' ('+cart[key].quantity+' шт.)</p>';
		
	}
	out+='</div>';

    out+='<p class="fullprice">Разом: '+price+' грн.</p>';

	out+='<div style="margin-bottom:10px; border-top: 2px solid #000;">';

	out+='<form name="ordr" action="" method="post">';
	out+='<p>Як до вас звертатись?</p>';
	out+='<input name="name" id="n1" type="text"  placeholder="Ім\'я" required>';
	out+='<p>Ваш номер телефону</p>';
	out+='<input name="phone" id="p1" placeholder="Телефон" type="tel" required>';
    out+='<p>Ваш e-mail</p>';
	out+='<input name="email" id="e1" type="email" placeholder="Еmail" required>';
	
    
    out+='</form>';
    out+='</div>';
    out+='<button class="my-button" id="send">Замовити</button>';

	$('.dialog-content').html(out);

	

	$('button#send').on('click', function(){
		var formData = new FormData(document.forms.ordr);

        for(var key in cart){
        	formData.append("products["+key+"]",cart[key].quantity);
        }

        formData.append("token", "hB1oMwbykOkL9_4fRQeK");


        // отослать
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://nit.tron.net.ua/api/order/add");
        xhr.send(formData);

	    
	});

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
