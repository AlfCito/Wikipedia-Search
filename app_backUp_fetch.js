'use strict'

let searchFor = 'dog';
let results = [];
let imagesArr = {};
let searchWiki =  fetch("https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch="+searchFor+"&origin=*");

let firstQuery = data => {

	data.query.search.map((value, index) => {
		results.push({
			'id': index,
			'pageid' : value.pageid,
			'title' : value.title,
			'snippet' : value.snippet,
			'pageURL' : 'https://en.wikipedia.org/?curid='+ value.pageid
		});
	})
}

let getImages = data => {

	results.map((value, index) => {
		fetch("https://en.wikipedia.org/w/api.php?action=query&format=json&prop=images&titles="+results[index].title+"&format=json&origin=*")
			.then(res => {
				res.json().then((imagesData) => {

					let pageImageArr = [];
					//console.log(index);
					//console.log('====================');
					imagesData.query.pages[results[index].pageid].images.map((value, i) =>{
						
						pageImageArr.push({ 'imageName' : value.title.substring(5) });
						//imagesArr[index] = pageImageArr;

						/*
						pageImageArr.push(
							value.title.substring(5),
						);	*/												
					});
					imagesArr[results[index].pageid] = pageImageArr;
					//imagesArr.splice(index, 0,  { 'images': pageImageArr });
				});					
			})
			.catch((err) =>{
				console.log(err);
			});
	});

};

let getimagesUrl = () => {

	results.forEach(element =>{
		//console.log(element.pageid);
	})
	

	/*
	imagesArr.forEach( element => {
		console.log(element);
	});*/

	//console.log(imagesArr);
	/*for(var key in imagesArr) {
		if(imagesArr.hasOwnProperty(key)) {
	        console.log(imagesArr[key]);
	    }
	}*/

	//console.log(imagesArr);

}

searchWiki.then((res) => {
	res.json().then((data) => {
		firstQuery(data);
		return getImages(data);
	});
}).then(() =>{	
	//console.log(res);
	//console.log(results);
	//console.log(imagesArr);
	getimagesUrl();
	return populate();
});


let populate = () => {

		//console.log('results in populate');
		//console.log(results);

		//console.log('populate');
		//console.log(results.length);
		//console.log(results[0]);

		for(var i =0; i<results.length; i++){

			var imageData = "";
/*
			if(results[i].imageThumb && results[i].imageThumb !== ""){
				imageData = "<img class='card-img-top' src='"+results[i].imageThumb+"' alt='Card image cap'>";
			}else if (results[i].imageURL !== "" ){
				imageData = "<img class='card-img-top' src='"+results[i].imageURL+"' alt='Card image cap'>";
			}else{
				imageData = "<img class='card-img-top' src='https://en.wikipedia.org/wiki/Wikipedia#/media/File:Wikipedia-logo-v2.svg' alt='Card image cap'>";
			}	*/

			imageData = "<img class='card-img-top' src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png' alt='Card image cap'>";		

			document.getElementById("results").innerHTML += ""+
				"<div class='col-3 mx-2 my-2'>"+
				"<div class='card' style='width: 18rem;'>"+imageData+
				"<div class='card-body'>"+
				"<h5 class='card-title'>"+results[i].title+"</h5>"+
				"<p class='card-text'>"+results[i].snippet+"</p>"+
				"<a href='"+results[i].pageURL+"' target='_blank' class='btn btn-primary'>Read More</a>"+
				"</div></div></div>";

		}

	}



/*

	function getImageURL(index){		

		$.ajax({

  			type: "GET",
	        url: "https://en.wikipedia.org/w/api.php?action=query&format=json&titles=Image:"+results[index].imageName+"&prop=imageinfo&iiprop=url&callback=?",
	        contentType: "application/json; charset=utf-8",
	        async: false,
	        dataType: "json",
	        success: function (data, textStatus, jqXHR) {
	        	results[index].imageURL = data.query.pages[Object.keys(data.query.pages)[0]].imageinfo[0].url;
	        	getThumb(index);
	        },

  		});
	}

	function getThumb(index){		

		$.ajax({

  			type: "GET",
	        url: "https://en.wikipedia.org/w/api.php?action=query&titles="+results[index].title+"&prop=pageimages&format=json&pithumbsize=200&callback=?",
	        contentType: "application/json; charset=utf-8",
	        async: false,
	        dataType: "json",
	        success: function (data, textStatus, jqXHR) {
	        	if(data.query.pages[results[index].pageid].thumbnail){
	        		results[index].imageThumb = data.query.pages[results[index].pageid].thumbnail.source;
	        	}else{
	        		results[index].imageThumb = '';
	        	}
	        	counter++;

	        },

  		});

	}
*/