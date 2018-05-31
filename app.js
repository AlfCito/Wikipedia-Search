"use strict";
let results = [];
let imagesArr = [];
let searchFor = "";
let searchTerm;

window.onload = function() {

	let searchBtn = document.querySelector('#searchClick');
	searchBtn.addEventListener("click", (e) => {
		e.preventDefault();
		results = [];
		imagesArr = [];
		searchFor = document.querySelector('#searchField').value;

		if(searchFor !== ""){
			searchTerm = document.querySelector('#searchField').value;
			search(searchFor);
		}else{
			randomSearch();
		}

	});
}

let randomSearch = () => {

	let url = "https://en.wikipedia.org//w/api.php?action=query&format=json&list=random&rnlimit=1&origin=*";

	fetch(url).then((res) => {
		res.json().then((data) => {
			let searchFor = data.query.random[0].title;
			let n = searchFor.indexOf(":");

			if(n != -1){
				return randomSearch();
			}else{
				searchTerm = searchFor;
				return search(searchFor);
			}

		});
	});
}

let search = (searchFor) => {

	let url = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch="+searchFor+"&origin=*";

	fetch(url).then((res) => {
		res.json().then((data) => {
			firstQuery(data);
			return getImages(data);
		});
	});
}

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

let getImages = (data) =>{

	let urls = [];

	for(let i = 0; i < data.query.search.length; i++){

		let title = data.query.search[i].title;
		let urlConstructor = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=images&titles="+title+"&format=json&origin=*";
		urls.push(urlConstructor);
	}

	Promise.all(urls.map(url =>
	    fetch(url).then(resp => resp.json())
	)).then(imageData => {

	    imageData.map((info, i) =>{   	    
	
			let mainImage;			
			let query = info.query.pages[data.query.search[i].pageid].images;

			for (var key in query){

				if( query[key].title !== 'File:Disambig gray.svg'){

					if( query[key].title !== 'File:DAB list gray.svg'){

						if( query[key].title !== 'File:Ambox important.svg'){

							if( query[key].title !== 'File:Commons-logo.svg'){

								let type = query[key].title.substr(query[key].title.length - 3);

								if( type === 'jpg' || type === 'png' || type === 'svg'){
									mainImage = query[key].title.substring(5);		
									break;				
								}				
							}			
						}
					}											
				}

			};

			if ( !mainImage || mainImage == "" || mainImage == null ){
				mainImage = "Disambig gray.svg";
			}

			imagesArr.push(mainImage);

		})

	}).then(imageURL => {
		getimagesUrl(data);
	})
}


let getimagesUrl = (data) => {

	let urls = [];

	for(let i = 0; i < data.query.search.length; i++){
	
		let imageName = imagesArr[i];
		let urlConstructor = "https://en.wikipedia.org/w/api.php?action=query&format=json&titles=Image:"+imageName+"&prop=imageinfo&iiprop=url&origin=*";
		urls.push(urlConstructor);
		
	}

	Promise.all(urls.map(url =>
	    fetch(url).then(resp => resp.json())
	)).then(urlData => {

		urlData.map((value, index) => {
			results[index].imageURL = value.query.pages[Object.keys(value.query.pages)[0]].imageinfo[0].url;
		});

	}).then(getThumbs =>{
		getThumb(data);
	});

}

let getThumb = (data) => {	

	let urls = [];

	for(let i = 0; i < data.query.search.length; i++){
	
		let title = data.query.search[i].title;
		let urlConstructor = "https://en.wikipedia.org/w/api.php?action=query&titles="+title+"&prop=pageimages&format=json&pithumbsize=300&origin=*";
		urls.push(urlConstructor);
	}

	Promise.all(urls.map(url =>
	    fetch(url).then(resp => resp.json())
	)).then(thumbData => {

		thumbData.map((value, index) => {

			if(value.query.pages[results[index].pageid].thumbnail){
        		results[index].imageThumb = value.query.pages[results[index].pageid].thumbnail.source;
        	}else{
        		results[index].imageThumb = '';
        	}
			
		});

	}).then(populateAll =>{
		populate();
	});
}


let populate = () => {

	document.getElementById("results").innerHTML = "";
	document.getElementById("searchTerm").innerHTML = "<h3>Results for: "+searchTerm+"</h3>";


	for(var i =0; i<results.length; i++){

		var imageData = "";

		if(results[i].imageThumb && results[i].imageThumb !== ""){
			imageData = "<img class='card-img-top' src='"+results[i].imageThumb+"' alt='Card image cap'>";
		}else if (results[i].imageURL !== "" ){
			imageData = "<img class='card-img-top' src='"+results[i].imageURL+"' alt='Card image cap'>";
		}else{
			imageData = "<img class='card-img-top' src='https://upload.wikimedia.org/wikipedia/commons/d/de/Wikipedia_Logo_1.0.png' alt='Card image cap'>";
		}

		document.getElementById("results").innerHTML += ""+
			"<div class='col-12 col-md-6 col-lg-4 col-xl-3 my-2'>"+
				"<div class='card align-self-stretch'>"+imageData+
					"<div class='card-body'>"+
						"<h5 class='card-title'>"+results[i].title+"</h5>"+
						"<p class='card-text'>"+results[i].snippet+"</p>"+
						"<a href='"+results[i].pageURL+"' target='_blank' class='btn btn-primary'>Read More</a>"+
					"</div>"+
				"</div>"+
			"</div>";

	}

}
