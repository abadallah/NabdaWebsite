jQuery(document).ready(function() {
	
	/*
	    Sidebar
	*/
	$('.dismiss, .overlay').on('click', function() {
        $('.sidebar').removeClass('active');
        $('.overlay').removeClass('active');
    });

    $('.open-menu').on('click', function(e) {
    	e.preventDefault();
        $('.sidebar').addClass('active');
        $('.overlay').addClass('active');
        // close opened sub-menus
        $('.collapse.show').toggleClass('show');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
});


  // DataTable
//   $(document).ready( function () {
// 	var table = $('#myTable').DataTable({
// 	//delete ordering table
// 	ordering:false,
// 	//delete dynamic entries and make it static
// 	dom: 'rtip',
// 	pageLength: 20
// 	});
// 	// reAd the search 
// 	$('#search').keyup( function() {
// 	table.search($('#search').val()).draw();
// 	} );

// 	$('#myTable tbody tr').hover(function() {
//         $(this).css('cursor','pointer');
//     });

// } );

	//Form Modal validation 
	// (function () {
	// 'use strict'
	// var forms = document.querySelectorAll('.needs-validation')
	// // Loop over them and prevent submission
	// Array.prototype.slice.call(forms)
	// 	.forEach(function (form) {
	// 	form.addEventListener('submit', function (event) {
	// 		if (!form.checkValidity()) {
	// 		event.preventDefault()
	// 		event.stopPropagation()
	// 		}

	// 		form.classList.add('was-validated')
	// 	}, false)
	// 	})
	// })()



/************************************************************* Animation ******************************************************************/
	AOS.init();
	AOS.init({
		// Global settings:
		disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
		startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
		initClassName: 'aos-init', // class applied after initialization
		animatedClassName: 'aos-animate', // class applied on animation
		useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
		disableMutationObserver: false, // disables automatic mutations' detections (advanced)
		debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
		throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
		
	  
		// Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
		offset: 100, // offset (in px) from the original trigger point
		delay: 0, // values from 0 to 3000, with step 50ms
		duration: 1000, // values from 0 to 3000, with step 50ms
		easing: 'ease', // default easing for AOS animations
		once: false, // whether animation should happen only once - while scrolling down
		mirror: false, // whether elements should animate out while scrolling past them
		anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
	  
	  });