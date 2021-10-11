let allSelectedTag = [];
let allFilters = [];
let allFullDescriptions = [];
let userSearch = null;

window.onload = function(){
	init();
};

function init(){

	/* Recipes cards DOM */

	const recipesResults = document.querySelector(".recipes-results");
	const card = document.createElement("div");
	card.classList = "card display-recipe";
	const cardImg = document.createElement("div");
	cardImg.classList = "card__img";
	const cardBody = document.createElement("div");
	cardBody.classList = "card__body";
	const cardTitle = document.createElement("div");
	cardTitle.classList = "card__body-title";
	const cardTime = document.createElement("div");
	cardTime.classList = "card__body-time";
	const cardIngredientsList = document.createElement('div');
	cardIngredientsList.classList = "card__body-list-ingredients";
	const cardIngredients = document.createElement("div");
	cardIngredients.classList = "card__body-ingredients";
	const cardDescription = document.createElement("div");
	cardDescription.classList = "card__body-description";
	let allIngredients = [];
	let allAppliances = [];
	let allUstensils = [];

	for(let i=0; i<recipes.length; i++){
			card.id = "recipe-" + recipes[i].id;
			card.innerHTML = "";
			card.tabIndex = "0";
			card.appendChild(cardImg);
			card.appendChild(cardBody);
			cardBody.appendChild(cardTitle);
			cardTitle.innerText = recipes[i].name;
			cardBody.appendChild(cardTime);
			cardTime.innerHTML = "<img src='./images/clock.svg' alt='time-logo' aria-hidden='true' class='card__body-time--logo'></img>" + recipes[i].time + " min";
			cardBody.appendChild(cardIngredientsList);
			cardIngredientsList.innerHTML = "";
			for(let j=0; j<recipes[i].ingredients.length; j++){
					if(recipes[i].ingredients[j].quantity == null && recipes[i].ingredients[j].unit == null){
							cardIngredients.innerHTML = "<span class='card__body-ingredients--bold'>" + recipes[i].ingredients[j].ingredient;
					} else if (recipes[i].ingredients[j].unit == null){
							cardIngredients.innerHTML = "<span class='card__body-ingredients--bold'>" + recipes[i].ingredients[j].ingredient + ":</span>" + " " + recipes[i].ingredients[j].quantity;
					} else {                
							cardIngredients.innerHTML = "<span class='card__body-ingredients--bold'>" + recipes[i].ingredients[j].ingredient + ":</span>" + " " + recipes[i].ingredients[j].quantity + " " + recipes[i].ingredients[j].unit;
					}
					cardIngredientsList.appendChild(cardIngredients.cloneNode(true))
			}
			cardBody.appendChild(cardDescription);
			cardDescription.innerText = recipes[i].description;
			allFullDescriptions.push(cardDescription.innerText);    
			recipesResults.appendChild(card.cloneNode(true));
	}

	window.setTimeout(cropDescriptions, 100);

	/* Get all filters (ingredients, appliances and ustensils) with the first letter in uppercase and others in lowercase ... */

	for(let i=0; i<recipes.length; i++){
		allAppliances.push(recipes[i].appliance[0].toUpperCase() + recipes[i].appliance.slice(1));  // Appliances 
		for(let j=0; j<recipes[i].ingredients.length; j++){                                         // Ingredients
				allIngredients.push(recipes[i].ingredients[j].ingredient[0].toUpperCase() +  
				recipes[i].ingredients[j].ingredient.slice(1));
		}
		for(let j=0; j<recipes[i].ustensils.length; j++){                                           // Ustensils
				allUstensils.push(recipes[i].ustensils[j][0].toUpperCase() +  
				recipes[i].ustensils[j].slice(1));
		}
	}

	/* ... sort them by alphabetical order */

	let allUniqueIngredients = [...new Set(allIngredients)].sort();
	let allUniqueAppliances = [...new Set(allAppliances)].sort();
	let allUniqueUstensils = [...new Set(allUstensils)].sort();

	/* Filters DOM*/

	function createFilter(menuElt, menuStyle, filterStyle, data){ // Create all filters for the dropdowns
		const p = document.createElement("p");
		p.classList = menuStyle + " dropdown__menu-filter";
		const filter = document.createElement("a");
		filter.classList = filterStyle + " filter filter-displayed";
		
		data.forEach(elt => {
			filter.innerHTML = elt;
			filter.href = elt;
			p.appendChild(filter);
			menuElt.appendChild(p.cloneNode(true));			
		});
	}
	
	createFilter(document.querySelector(".dropdown__menu-ingredients"),"dropdown__menu-ingredient", "dropdown__menu-ingredient-filter", allUniqueIngredients);	
	createFilter(document.querySelector(".dropdown__menu-appliances"),"dropdown__menu-appliance", "dropdown__menu-appliance-filter", allUniqueAppliances);
	createFilter(document.querySelector(".dropdown__menu-ustensils"), "dropdown__menu-ustensil", "dropdown__menu-ustensil-filter", allUniqueUstensils);

	/* Tags */

	const allFilters = document.querySelectorAll(".filter");
	allFilters.forEach(filter => filter.addEventListener('click', createTag)); // Create tag
	allFilters.forEach(filter => filter.addEventListener('click', recipesByTags)); // Show recipes who match with selected tag

	/* Dropdown open/close */

	document.querySelectorAll('.dropdown__btn').forEach(btn => btn.addEventListener('click', filterListBtn));	

	/* Main search */

	document.querySelector(".search__input").addEventListener('input', mainSearch);

	function mainSearch(e){
		let allCardsDisplayed = document.querySelectorAll(".card.display-recipe");
		let nbResult = allCardsDisplayed.length;                                                   	// Number of filter found by search
		document.querySelectorAll(".dropdown__input").forEach(elt => { // Remove characters of dropdowns input when the user search with the main input
			elt.value = "";
		});
		userSearch = e.currentTarget.value.toUpperCase();
		recipesByTags(); // Show selected recipes based on selected tag & show filters based on recipes displayed
		searchWithFilter(document.querySelectorAll(".dropdown__menu-ingredient")); // Show ingredients who match with user search
		searchWithFilter(document.querySelectorAll(".dropdown__menu-appliance")); // Show appliances who match with user search
		searchWithFilter(document.querySelectorAll(".dropdown__menu-ustensil")); // Show ustensils who match with user search		
		
		// ANCIENNE VERSION AVEC LE INNERTEXT :

		/* for(let i=0; i<allCardsDisplayed.length; i++){
			if(userSearch.length > 2){
				if(allCardsDisplayed[i].innerText.toUpperCase().includes(userSearch)){      // The user search match with one displayed card or more ...
						allCardsDisplayed[i].style.display = "block";            			// ... display cards who match ...
						nbResult ++;
				} else {
						allCardsDisplayed[i].style.display = "none";             			// ... hide others
						nbResult --;  
				}
		} */

		// SOLUTION QUI FONCTIONNE (version non optimisée):

		/* for(let i=0; i<recipes.length; i++){
			let ingredients = [];
			if(userSearch.length > 2){
				for(let j=0; j<recipes[i].ingredients.length; j++){
					ingredients.push(recipes[i].ingredients[j].ingredient.toUpperCase());
				}
				if(recipes[i].name.toUpperCase().includes(userSearch) || recipes[i].description.toUpperCase().includes(userSearch) || recipes[i].appliance.toUpperCase().includes(userSearch) || ingredients.join().includes(userSearch) || recipes[i].ustensils.join().toUpperCase().includes(userSearch)){      // The user search match with one displayed card or more ...
						document.getElementById("recipe-" + recipes[i].id).style.display = "block";            			// ... display cards who match ...
						nbResult ++;
				} else {
					document.getElementById("recipe-" + recipes[i].id).style.display = "none";             			// ... hide others
						nbResult --;  
				}
			}
			if(nbResult == 0){	// No recipe match ...
				document.querySelector(".no-result").style.display = "block";	// ... show message "no result" to user
			}  else {	// At least 1 recipe match ...
				document.querySelector(".no-result").style.display = "none";	// ... hide message "no result"
			}
		} */


		// VERSION OPTIMISEE
		
		if(userSearch.length > 2){
			let filters = recipes.filter(recipe => recipe.name.toUpperCase().includes(userSearch) || recipe.description.toUpperCase().includes(userSearch) || recipe.ingredients.forEach(ing => ing.ingredient.toUpperCase().includes(userSearch)) || recipe.ustensils.forEach(ust => ust.toUpperCase().includes(userSearch)));
			document.querySelectorAll(".card").forEach(card => card.style.display = "none");
			filters.forEach(filter => document.getElementById("recipe-" + filter.id).style.display = "block");
			if(filters.length == 0){
				document.querySelector(".no-result").style.display = "block";
			} else {
				document.querySelector(".no-result").style.display = "none";
			}			
		}
	}

	/* Search with filter */

	function searchWithFilter(menuElt){

		/* menuElt.forEach(elt => {
			elt.parentElement.previousElementSibling.previousElementSibling.classList.add('hide');
			elt.parentElement.firstElementChild.classList.add('hide');
			if(userSearch.length > 2){
				if(elt.innerText.toUpperCase().includes(userSearch) && elt.firstChild.classList.contains('filter-displayed') && !elt.firstChild.classList.contains('tag-selected')){
					elt.style.display = "block";
				} else {
					elt.style.display = "none";
				}				
				if(menuElt.length > 0 && userSearch.length != 0){                                     // 1 or more filter match ...
					elt.parentElement.parentElement.classList.add('show-all'); 	// ... open the dropdown and show them ...
					elt.parentElement.previousElementSibling.previousElementSibling.classList.add('hide');
					elt.parentElement.firstElementChild.classList.add('hide');
				} else {                                                                     // No filter match ... 
					elt.parentElement.parentElement.classList.remove('show-all'); // ... close dropdown
					elt.parentElement.previousElementSibling.previousElementSibling.classList.remove('hide'); // ... hide dropdown title
					elt.parentElement.firstElementChild.classList.remove('hide');
				}
			} else {																		// Less than 3 characterd typed ...     
				elt.parentElement.parentElement.classList.remove('show-all');		// ... hide dropdown ...
				elt.parentElement.previousElementSibling.previousElementSibling.classList.remove('hide'); // ... show dropdown title
				if(elt.firstChild.classList.contains('filter-displayed')){					 
					elt.style.display = "block";
				}
			}
		}) */


		let nbFilter = 0;                                                   	// Number of filter found by search
		for(let i=0; i<menuElt.length; i++){
			menuElt[i].parentElement.previousElementSibling.previousElementSibling.classList.add('hide');
			menuElt[i].parentElement.firstElementChild.classList.add('hide');
			if(userSearch.length > 2){
				if(menuElt[i].innerText.toUpperCase().includes(userSearch) && menuElt[i].firstChild.classList.contains('filter-displayed') && !menuElt[i].firstChild.classList.contains('tag-selected')){    	// Typed characters match with some displayed filter ...
					menuElt[i].style.display = "block";                         	// ... display them ...
					nbFilter ++;                                                	// ... increment the number of filter
				} else {                                                        	// No match ...
					menuElt[i].style.display = "none";                          // ... hide the filter
				}
				if(nbFilter > 0 && userSearch.length != 0){                                     // 1 or more filter match ...
						menuElt[i].parentElement.parentElement.classList.add('show-all'); 	// ... open the dropdown and show them ...
						menuElt[i].parentElement.previousElementSibling.previousElementSibling.classList.add('hide');
						menuElt[i].parentElement.firstElementChild.classList.add('hide');
				} else {                                                                     // No filter match ... 
						menuElt[i].parentElement.parentElement.classList.remove('show-all'); // ... close dropdown
						menuElt[i].parentElement.previousElementSibling.previousElementSibling.classList.remove('hide'); // ... hide dropdown title
						menuElt[i].parentElement.firstElementChild.classList.remove('hide');
				}
			} else {																		// Less than 3 characterd typed ...     
				menuElt[i].parentElement.parentElement.classList.remove('show-all');		// ... hide dropdown ...
				menuElt[i].parentElement.previousElementSibling.previousElementSibling.classList.remove('hide'); // ... show dropdown title
				if(menuElt[i].firstChild.classList.contains('filter-displayed')){					 
					menuElt[i].style.display = "block";
				}
			}	
		}
	}

	function ingredientSearch(e){
		userSearch = e.currentTarget.value.toUpperCase();
		recipesByTags(); // Show selected recipes based on selected tag
		searchWithFilter(document.querySelectorAll(".dropdown__menu-ingredient"));	
		resetDropdown(e);
	}

	function applianceSearch(e){
		userSearch = e.currentTarget.value.toUpperCase();
		recipesByTags();
		searchWithFilter(document.querySelectorAll(".dropdown__menu-appliance"));
		resetDropdown(e);
	}

	function ustensilSearch(e){
		userSearch = e.currentTarget.value.toUpperCase();
		recipesByTags();
		searchWithFilter(document.querySelectorAll(".dropdown__menu-ustensil"));
		resetDropdown(e);
	}

	document.querySelectorAll(".dropdown__input-title").forEach(element => element.addEventListener('click', (e) => {
		e.currentTarget.previousElementSibling.focus();
	}));
	document.querySelectorAll(".dropdown__input").forEach(element => element.addEventListener('focus', (e) => {
		if(e.target == element){
			e.currentTarget.nextElementSibling.classList.add('hide');
		}
	}));
	document.querySelectorAll(".dropdown__input").forEach(element => element.addEventListener('focusout', () => {
		if(!element.parentElement.classList.contains('show-all') && element.value == ""){
			element.nextElementSibling.classList.remove('hide');
		}
	}));
	document.querySelector(".dropdown__input.color1").addEventListener('input', ingredientSearch);
	document.querySelector(".dropdown__input.color2").addEventListener('input', applianceSearch);
	document.querySelector(".dropdown__input.color3").addEventListener('input', ustensilSearch);
}