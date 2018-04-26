$(document).ready(function($){

	var results = [];
	var counter = 0;
	
	$( "#searchClick" ).on( "click", function(e){

		e.preventDefault();
		results = [];
		counter = 0;
		$("#results").empty();

		var promised = searchWiki($('#searchField').val());

		promised.done(function(data){

			//console.log('primera data');
			//console.log(data);

			$.each(data.query.search, function(key, value){

	  			results.push({
	  				'id': key,
	  				'pageid' : value.pageid,
	  				'title' : value.title,
	  				'snippet' : value.snippet,
	  				'pageURL' : 'https://en.wikipedia.org/?curid='+ value.pageid
	  			});

	  		});

			return getImages(data);
	  		

		}).done(function(y){
			return populate();
		})

	});


	function searchWiki(searchFor){	

		return $.ajax({
			url: '//en.wikipedia.org/w/api.php',
		  	data: {
			    action: 'query',
			    list: 'search',
			    srsearch: searchFor,
			    format: 'json',
			    formatversion: 2
		  	},
		  	dataType: 'jsonp',
		  	type: 'POST',
		    headers: { 'Api-User-Agent': 'eyMedia/1.0' }		
		});		

	}

	function getImages(queryResult){	

		$.each(queryResult.query.search, function(key, value){

			var getAllImages = allImages(key);

			getAllImages.done(function(imagesData){

				var selectedImage = '';

				if(imagesData.query.pages[Object.keys(imagesData.query.pages)[0]].images){
					selectedImage = imagesData.query.pages[Object.keys(imagesData.query.pages)[0]].images[0].title.substring(5);
				}

				return getImageURL(selectedImage, key);

			}).done(function(imageUrlData){

				return getThumb(key);

				//console.log(imageUrlData);

				/*
				var selectedImageUrl = '';

				if(imageUrlData.query.pages[Object.keys(imageUrlData.query.pages)[0]].imageinfo){
					selectedImageUrl = imageUrlData.query.pages[Object.keys(imageUrlData.query.pages)[0]].imageinfo[0].url;
				}

	        	results[key].imageURL = selectedImageUrl;   
	        	*/

			}).done(function(thumbData){

			});


			function allImages(key){
				return $.ajax({
		  			type: "GET",
			        url: "http://en.wikipedia.org/w/api.php?action=query&format=json&prop=images&titles="+queryResult.query.search[key].title+"&format=json&callback=?",
			        contentType: "application/json; charset=utf-8",
			        async: false,
			        dataType: "json"
				});
	  		};

	  		function getImageURL(selectedImage, key){	
				return $.ajax({
		  			type: "GET",
			        url: "https://en.wikipedia.org/w/api.php?action=query&format=json&titles=Image:"+selectedImage+"&prop=imageinfo&iiprop=url&callback=?",
			        contentType: "application/json; charset=utf-8",
			        async: false,
			        dataType: "json",
			        success: function (data, textStatus, jqXHR) {
			        	results[key].imageURL = data.query.pages[Object.keys(data.query.pages)[0]].imageinfo[0].url;
			        }
		  		});
			}

			function getThumb(key){		

				return $.ajax({
		  			type: "GET",
			        url: "https://en.wikipedia.org/w/api.php?action=query&titles="+results[key].title+"&prop=pageimages&format=json&pithumbsize=200&callback=?",
			        contentType: "application/json; charset=utf-8",
			        async: false,
			        dataType: "json",
			        success: function (data, textStatus, jqXHR) {
			        	if(data.query.pages[results[key].pageid].thumbnail){
			        		results[key].imageThumb = data.query.pages[results[key].pageid].thumbnail.source;
			        	}else{
			        		results[key].imageThumb = '';
			        	}
			        	//counter++;
			        }
		  		});
			}


		});
	}

	

	/*

	$( document ).ajaxComplete(function() {
		if(counter === 10 ){
			populate();
		}
		
	});*/

	function populate(){

		for(var i =0; i<results.length; i++){

			var imageData = "";

			if(results[i].imageThumb !== ""){
				imageData = "<img class='card-img-top' src='"+results[i].imageThumb+"' alt='Card image cap'>";
			}else if (results[i].imageURL !== "" ){
				imageData = "<img class='card-img-top' src='"+results[i].imageURL+"' alt='Card image cap'>";
			}else{
				imageData = "<img class='card-img-top' src='https://en.wikipedia.org/wiki/Wikipedia#/media/File:Wikipedia-logo-v2.svg' alt='Card image cap'>";
			}
			

			$("#results").append(""+
				"<div class='col-3 mx-2 my-2'>"+
				"<div class='card' style='width: 18rem;'>"+imageData+
				"<div class='card-body'>"+
				"<h5 class='card-title'>"+results[i].title+"</h5>"+
				"<p class='card-text'>"+results[i].snippet+"</p>"+
				"<a href='"+results[i].pageURL+"' target='_blank' class='btn btn-primary'>Read More</a>"+
				"</div></div></div>");

		}

	}

});


