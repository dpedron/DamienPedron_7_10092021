let allSelectedTag = [];
let allFilters = [];
let allFullDescriptions = [];
let userSearch = null;

window.onload = function(){
	init();
};

function init(){
	
	/* 	let recipesData = [];
	function getRecipesData() {
		recipes.forEach(recipe => {
			recipesData.push({
				"id": recipe.id,
				"name": recipe.name.toUpperCase(),
				"description": recipe.description.toUpperCase(),
				"appliance": recipe.appliance.toUpperCase(),
				"ingredients": [...recipe.ingredients.map(ingredient => {return ingredient.ingredient.toUpperCase()})].join(),
				"ustensils": recipe.ustensils.join().toUpperCase(),
			})
		})
	 }

	 getRecipesData(); */

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

	recipes.forEach(recipe => {
			card.id = "recipe-" + recipe.id;
			card.innerHTML = "";
			card.tabIndex = "0";
			card.appendChild(cardImg);
			card.appendChild(cardBody);
			cardBody.appendChild(cardTitle);
			cardTitle.innerText = recipe.name;
			cardBody.appendChild(cardTime);
			cardTime.innerHTML = "<img src='./images/clock.svg' alt='time-logo' aria-hidden='true' class='card__body-time--logo'></img>" + recipe.time + " min";
			cardBody.appendChild(cardIngredientsList);
			cardIngredientsList.innerHTML = "";
			recipe.ingredients.forEach(ing =>{
					if(ing.quantity == null && ing.unit == null){
							cardIngredients.innerHTML = "<span class='card__body-ingredients--bold'>" + ing.ingredient;
					} else if (ing.unit == null){
							cardIngredients.innerHTML = "<span class='card__body-ingredients--bold'>" + ing.ingredient + ":</span>" + " " + ing.quantity;
					} else {
						if(ing.unit === "grammes"){
							cardIngredients.innerHTML = "<span class='card__body-ingredients--bold'>" + ing.ingredient + ":</span>" + " " + ing.quantity + " g";
						} else if (ing.unit === "cuillères à soupe"){
							cardIngredients.innerHTML = "<span class='card__body-ingredients--bold'>" + ing.ingredient + ":</span>" + " " + ing.quantity + " c. à s.";
						} else if (ing.unit === "cuillères à café"){							
							cardIngredients.innerHTML = "<span class='card__body-ingredients--bold'>" + ing.ingredient + ":</span>" + " " + ing.quantity + " c. à c.";
						} else {							
							cardIngredients.innerHTML = "<span class='card__body-ingredients--bold'>" + ing.ingredient + ":</span>" + " " + ing.quantity + " " + ing.unit;
						}
						               
							
					}
					cardIngredientsList.appendChild(cardIngredients.cloneNode(true))
			})
			cardBody.appendChild(cardDescription);
			cardDescription.innerText = recipe.description;
			allFullDescriptions.push(cardDescription.innerText);    
			recipesResults.appendChild(card.cloneNode(true));
	})

	/* window.setTimeout(cropDescriptions, 100); */

	/* Get all filters (ingredients, appliances and ustensils) with the first letter in uppercase and others in lowercase ... */

	recipes.forEach(recipe => {
		allAppliances.push(recipe.appliance[0].toUpperCase() + recipe.appliance.slice(1));  // Appliances 
		recipe.ingredients.forEach(ing => {                                         // Ingredients
				allIngredients.push(ing.ingredient[0].toUpperCase() +  
				ing.ingredient.slice(1));
		});
		recipe.ustensils.forEach(ust => {                                           // Ustensils
				allUstensils.push(ust[0].toUpperCase() +  
				ust.slice(1));
		});
	});

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
		document.querySelectorAll(".dropdown__input").forEach(elt => { // Remove characters of dropdowns input when the user search with the main input
			elt.value = "";
		});
		userSearch = e.currentTarget.value.toUpperCase();
		searchWithFilter(document.querySelectorAll(".dropdown__menu-ingredient")); // Show ingredients who match with user search
		searchWithFilter(document.querySelectorAll(".dropdown__menu-appliance")); // Show appliances who match with user search
		searchWithFilter(document.querySelectorAll(".dropdown__menu-ustensil")); // Show ustensils who match with user search

		// SOLUTION QUI FONCTIONNE (version non optimisée):

		
		/* if(userSearch.length > 2){
			for(let i=0; i<recipes.length; i++){
				let ingredients = [];
				for(let j=0; j<recipes[i].ingredients.length; j++){
					ingredients.push(recipes[i].ingredients[j].ingredient.toUpperCase());
				}
				if(recipes[i].name.toUpperCase().includes(userSearch) || recipes[i].description.toUpperCase().includes(userSearch) || recipes[i].appliance.toUpperCase().includes(userSearch) || ingredients.join().includes(userSearch) || recipes[i].ustensils.join().toUpperCase().includes(userSearch)){      // The user search match with one displayed card or more ...
					if(document.getElementById("recipe-" + recipes[i].id).classList.contains('display-recipe')){
						document.getElementById("recipe-" + recipes[i].id).style.display = "block";            			// ... display cards who match ...
					}
				} else {
					document.getElementById("recipe-" + recipes[i].id).style.display = "none";             			// ... hide others 
				}
			} 
		} else {
			recipesByTags(); // Show selected recipes based on selected tag & show filters based on recipes displayed
		} */


		// VERSION OPTIMISEE
		
		
		let filteredCards = recipes.filter(recipe => recipe.name.toUpperCase().includes(userSearch) || recipe.appliance.toUpperCase().includes(userSearch) || recipe.description.toUpperCase().includes(userSearch) || recipe.ingredients.some(ing => ing.ingredient.toUpperCase().includes(userSearch)) || recipe.ustensils.forEach(ust => ust.toUpperCase().includes(userSearch)));
		if(userSearch.length > 2){
			document.querySelectorAll(".card").forEach(card => card.style.display = "none");
			filteredCards.forEach(card =>{
				if(document.getElementById("recipe-" + card.id).classList.contains('display-recipe')){
					document.getElementById("recipe-" + card.id).style.display = "block";
				}
			});
		} else {
			recipesByTags(); // Show selected recipes based on selected tag & show filters based on recipes displayed
		}

		let displayedCards = [];
		document.querySelectorAll(".card").forEach(card => {
			if(card.style.display == "block"){
				displayedCards.push(card);
			}
		})
		document.querySelector(".no-result").style.display = displayedCards.length == 0? "block":"none";
	}

	/* Search with filter */

	function searchWithFilter(menuElt){                                                	// Number of filter found by search
		let activeFilters = [];
		menuElt.forEach(elt => {
			elt.parentElement.previousElementSibling.previousElementSibling.classList.add('hide');
			if(elt.innerText.toUpperCase().includes(userSearch) && elt.firstChild.classList.contains('filter-displayed') && !elt.firstChild.classList.contains('tag-selected')){    	// Typed characters match with some displayed filter ...
				elt.style.display = "block";                         	// ... display them ...
				activeFilters.push(elt);
			} else {                                                        	// No match ...
				elt.style.display = "none";                          // ... hide the filter
			}
			if(activeFilters.length == 0){
				elt.parentElement.firstElementChild.classList.remove('hide');
			} else {
				elt.parentElement.firstElementChild.classList.add('hide');
			}	
			if(userSearch.length > 2){
				if(activeFilters.length > 0){                                 // 1 or more filter match ...
						elt.parentElement.parentElement.classList.add('show-all'); 	// ... open the dropdown and show them ...
						elt.parentElement.previousElementSibling.previousElementSibling.classList.add('hide');
				} else {                                                                     // No filter match ... 
						elt.parentElement.parentElement.classList.remove('show-all'); // ... close dropdown
						elt.parentElement.previousElementSibling.previousElementSibling.classList.remove('hide'); // ... hide dropdown title
				}
			} else {																		// Less than 3 characterd typed ...     
				elt.parentElement.parentElement.classList.remove('show-all');		// ... hide dropdown ...
				elt.parentElement.previousElementSibling.previousElementSibling.classList.remove('hide'); // ... show dropdown title
				if(elt.firstChild.classList.contains('filter-displayed')){					 
					elt.style.display = "block";
				}
			}
		});
	}


	function ingredientSearch(e){
		userSearch = e.currentTarget.value.toUpperCase();
		searchWithFilter(document.querySelectorAll(".dropdown__menu-ingredient"));	
		resetDropdown(e);
	}

	function applianceSearch(e){
		userSearch = e.currentTarget.value.toUpperCase();
		searchWithFilter(document.querySelectorAll(".dropdown__menu-appliance"));
		resetDropdown(e);
	}

	function ustensilSearch(e){
		userSearch = e.currentTarget.value.toUpperCase();
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