function filterList(e){
    if(e.currentTarget.nextElementSibling.classList.contains('show')){      // The menu is open...
        e.currentTarget.nextElementSibling.classList.remove('show');        // ... close him ...       
        e.currentTarget.parentElement.classList.remove('show-all');         // ... tighten the dropdown ...
        e.currentTarget.firstElementChild.classList.remove('open');         // ... the arrow point down ...
        e.currentTarget.previousElementSibling.classList.remove('search-filter'); // ... change placeholder color ...
        e.currentTarget.previousElementSibling.placeholder = e.currentTarget.previousElementSibling.placeholder.substr(13)[0].toUpperCase() + e.currentTarget.previousElementSibling.placeholder.substr(13).slice(1) + "s"; // ... change placeholder text ...
    } else {                                                                // The menu is close ...
        e.currentTarget.nextElementSibling.classList.add('show');           // ... scroll down the menu ...
        e.currentTarget.parentElement.classList.add('show-all');            // ... widen the dropdown ...
        e.currentTarget.firstElementChild.classList.add('open');            // ... the arrow point up ...
        e.currentTarget.previousElementSibling.classList.add('search-filter'); // ... change placeholder color ...
        e.currentTarget.previousElementSibling.placeholder = "Recherche un " + e.currentTarget.previousElementSibling.placeholder[0].toLowerCase() + e.currentTarget.previousElementSibling.placeholder.slice(1, -1);   // ... change placeholder text ...
    }
}

function createFilter(menuElt, menuStyle, tagStyle, data){ // Create all filters for the dropdowns
    const p = document.createElement("p");
    p.classList = menuStyle;
    const tag = document.createElement("a");
    tag.classList = tagStyle + " tag";

    for(let i=0; i<data.length; i++){
        tag.innerHTML = data[i];
        tag.href = data[i];
        p.appendChild(tag);
        menuElt.appendChild(p.cloneNode(true));
    }
}

export {filterList, createFilter};
