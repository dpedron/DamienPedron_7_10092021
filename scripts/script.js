let allSelectedTag = [];
let allFilters = [];
let allFullDescriptions = [];

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
			card.innerHTML = "";
			card.tabIndex = "0";
			card.appendChild(cardImg);
			card.appendChild(cardBody);
			cardBody.appendChild(cardTitle);
			cardTitle.innerText = recipes[i].name;
			cardBody.appendChild(cardTime);
			cardTime.innerHTML = "<i class='far fa-clock'></i>" + recipes[i].time;
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
	allFilters.forEach(filter => filter.addEventListener('click', selectedRecipes)); // Show recipes who match with selected tag

	/* Dropdown open/close */

	let dropdownsBtn = document.querySelectorAll('.dropdown__btn');
	dropdownsBtn.forEach(btn => btn.addEventListener('click', filterListBtn));	

	/* Main search */

	document.querySelector(".search__input").addEventListener('input', mainSearch);

	function mainSearch(e){
		let allCardsDisplayed = document.querySelectorAll(".card.display-recipe");
		let nbResult = allCardsDisplayed.length;                                                   	// Number of filter found by search
		document.querySelectorAll(".dropdown__input").forEach(elt => { // Remove characters of dropdowns input when the user search with the main input
			elt.value = "";
		});
		userSearch = e.currentTarget.value.toUpperCase();
		selectedRecipes(); // Show selected recipes based on selected tag & show filters based on recipes displayed
		searchWithFilter(document.querySelectorAll(".dropdown__menu-ingredient"), allUniqueIngredients); // Show ingredients who match with user search
		searchWithFilter(document.querySelectorAll(".dropdown__menu-appliance"), allUniqueAppliances); // Show appliances who match with user search
		searchWithFilter(document.querySelectorAll(".dropdown__menu-ustensil"), allUniqueUstensils); // Show ustensils who match with user search
		
		for(let i=0; i<allCardsDisplayed.length; i++){
			if(userSearch.length > 2){
				if(allCardsDisplayed[i].innerText.toUpperCase().includes(userSearch)){      // The user search match with one displayed card or more ...
						allCardsDisplayed[i].style.display = "block";            			// ... display cards who match ...
						nbResult ++;
				} else {
						allCardsDisplayed[i].style.display = "none";             			// ... hide others
						nbResult --;  
				}
		}
			if(nbResult == 0){	// No recipe match ...
				document.querySelector(".no-result").style.display = "block";	// ... show message "no result" to user
			}  else {	// At least 1 recipe match ...
				document.querySelector(".no-result").style.display = "none";	// ... hide message "no result"
			}
		}
	}

	/* Search with filter */

	let userSearch = null;

	function searchWithFilter(menuElt, data){
		let nbFilter = 0;                                                   	// Number of filter found by search
		for(let i=0; i<data.length; i++){
			menuElt[i].parentElement.previousElementSibling.previousElementSibling.classList.add('hide');
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
				} else {                                                                     // No filter match ... 
						menuElt[i].parentElement.parentElement.classList.remove('show-all'); // ... close dropdown
						menuElt[i].parentElement.previousElementSibling.previousElementSibling.classList.remove('hide'); // ... hide dropdown title
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
		document.querySelector(".search__input").value = ""; // Remove characters of main input when the user search with the dropdown input
		userSearch = e.currentTarget.value.toUpperCase();
		selectedRecipes(); // Show selected recipes based on selected tag
		searchWithFilter(document.querySelectorAll(".dropdown__menu-ingredient"), allUniqueIngredients);
		e.currentTarget.nextElementSibling.classList.add('hide');	// Hide dropdown title
		document.querySelectorAll(".dropdown__input").forEach(elt => {
			if(elt != e.currentTarget){								// Input is not the selected input ...
				elt.value = "";										// ... empty him ...
				elt.parentElement.classList.remove('show-all');		// ... hide the dropdown ...
				elt.nextElementSibling.classList.remove('hide');	// ... show the dropdown title
			}
		})
	}

	function applianceSearch(e){
		document.querySelector(".search__input").value = "";
		userSearch = e.currentTarget.value.toUpperCase();
		selectedRecipes();
		searchWithFilter(document.querySelectorAll(".dropdown__menu-appliance"), allUniqueAppliances);
		e.currentTarget.nextElementSibling.classList.add('hide');
		document.querySelectorAll(".dropdown__input").forEach(elt => {
			if(elt != e.currentTarget){
				elt.value = "";
				elt.parentElement.classList.remove('show-all');
				elt.nextElementSibling.classList.remove('hide');
			}
		})
	}

	function ustensilSearch(e){
		document.querySelector(".search__input").value = "";
		userSearch = e.currentTarget.value.toUpperCase();
		selectedRecipes();
		searchWithFilter(document.querySelectorAll(".dropdown__menu-ustensil"), allUniqueUstensils);
		e.currentTarget.nextElementSibling.classList.add('hide');
		document.querySelectorAll(".dropdown__input").forEach(elt => {
			if(elt != e.currentTarget){
				elt.value = "";
				elt.parentElement.classList.remove('show-all');
				elt.nextElementSibling.classList.remove('hide');
			}
		})
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
		if(!element.parentElement.classList.contains('show-all')){
			element.nextElementSibling.classList.remove('hide');
		}
		element.value = "";
	}));
	document.querySelector(".dropdown__input.color1").addEventListener('input', ingredientSearch);
	document.querySelector(".dropdown__input.color2").addEventListener('input', applianceSearch);
	document.querySelector(".dropdown__input.color3").addEventListener('input', ustensilSearch);
}