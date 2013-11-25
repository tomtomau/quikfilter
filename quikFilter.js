/**
*	quikFilter jQuery Filtering
*	- looks for an event data param called search which defines
*		the attribute it's going to search for
*	- bind this event to a search field with a value
*/

var quikFilter = function(event){
	// Retrieve the search term
	var search_value = $(this).val().toLowerCase();
	// For each DOM element with the HTML attribute specified
	$("["+event.data.search+"]").each(function(){
		// Get the value of the attribute
		var this_attribute = $(this).attr(event.data.search).toLowerCase();
		// If the search term appears in the attribute
		if(this_attribute.indexOf(search_value)>=0){
			$(this).show();
		}else{
			$(this).hide();
		}
	});
};

/**
*	Recursively filters
*/
var multiFilter = function(event){
	var search_value;
	// If the event.data.search_value is not set
	if(typeof(event.data.search_value) == "undefined"){
		// Retrieve search value from the input field
		search_value = $(this).val().toLowerCase();
	}else{
		// if it's been passed in event.data (such as recursively or from another event handler)
		search_value = event.data.search_value;
	}

	// Determine if it needs to drill down a level
	var nested = event.data.nested;
	if(typeof(nested) == "undefined"){
		nested = "";
	}

	// Base case (first time it's called)
	if(nested.length>0){
		$("."+event.data.nested).each(function(){
			// Recursively call this function but need to create a fake event to pass event.data
			var fake_event = jQuery.Event("click");
			// Assemble the data as necessary
			fake_event.data = {search_value:search_value, search:event.data.search, context:this};
			// Recur
			multiFilter(fake_event);
		});
	}else{
		// For each nest, or if not nested
		// Count the number of items in this nest that are shown
		var count_shown = 0;
		// Set the context correctly (required for nesting)
		var context;
		if(typeof(event.data.context) == "undefined"){
			// If not nested/recursive, just look in the entire DOM
			context = "*";
		}else{
			context = event.data.context;
		}
		// Foreach element with matching HTML attribute
		$(context).find('['+event.data.search+"]").each(function(){
			// Get the value of the attribute as a string
			var this_attribute = $(this).attr(event.data.search).toLowerCase();
			var attributes_array = this_attribute.split(",");
			// Variable counts how many times the search term is in any of the attributes
			var show = 0;
			// foreach attribute
			for(var i=0; i<attributes_array.length; i++){
				var attribute = attributes_array[i];
				// if the attribute matches the search term
				if(attribute.indexOf(search_value)>=0){
					show++;
				}
			}
			// if this element has matching attributes
			if(show){
				// then increase the count shown in this nest
				count_shown++;
				// and show the element
				$(this).show();
			}else{
				// otherwise hide the element
				$(this).hide();
			}
		});
		// if we are nesting, then hide the entire nest if none match!
		if(typeof(event.data.context) != "undefined"){
			if(count_shown==0){
				$(context).hide("fast");
			}else{
				$(context).show("fast");
			}
		}
	}
}