

(function ($) {
	$.fn.countTo = function (options) {
		options = options || {};
		
		return $(this).each(function () {
			// set options for current element
			var settings = $.extend({}, $.fn.countTo.defaults, {
				from:            $(this).data('from'),
				to:              $(this).data('to'),
				speed:           $(this).data('speed'),
				refreshInterval: $(this).data('refresh-interval'),
				decimals:        $(this).data('decimals')
			}, options);
			
			// how many times to update the value, and how much to increment the value on each update
			var loops = Math.ceil(settings.speed / settings.refreshInterval),
				increment = (settings.to - settings.from) / loops;
			
			// references & variables that will change with each update
			var self = this,
				$self = $(this),
				loopCount = 0,
				value = settings.from,
				data = $self.data('countTo') || {};
			
			$self.data('countTo', data);
			
			// if an existing interval can be found, clear it first
			if (data.interval) {
				clearInterval(data.interval);
			}
			data.interval = setInterval(updateTimer, settings.refreshInterval);
			
			// initialize the element with the starting value
			render(value);
			
			function updateTimer() {
				value += increment;
				loopCount++;
				
				render(value);
				
				if (typeof(settings.onUpdate) == 'function') {
					settings.onUpdate.call(self, value);
				}
				
				if (loopCount >= loops) {
					// remove the interval
					$self.removeData('countTo');
					clearInterval(data.interval);
					value = settings.to;
					
					if (typeof(settings.onComplete) == 'function') {
						settings.onComplete.call(self, value);
					}
				}
			}
			
			function render(value) {
				var formattedValue = settings.formatter.call(self, value, settings);
				$self.html(formattedValue);
			}
		});
	};
	
	$.fn.countTo.defaults = {
		from: 0,               // the number the element should start at
		to: 0,                 // the number the element should end at
		speed: 1000,           // how long it should take to count between the target numbers
		refreshInterval: 100,  // how often the element should be updated
		decimals: 0,           // the number of decimal places to show
		formatter: formatter,  // handler for formatting the value before rendering
		onUpdate: null,        // callback method for every time the element is updated
		onComplete: null       // callback method for when the element finishes updating
	};
	
	function formatter(value, settings) {
		return value.toFixed(settings.decimals);
	}
}(jQuery));

jQuery(function ($) {
  // custom formatting example
  $('.count-number').data('countToOptions', {
	formatter: function (value, options) {
	  return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
	}
  });
  
  // start all the timers
  $('.timer').each(count);  
  
  function count(options) {
	var $this = $(this);
	options = $.extend({}, options || {}, $this.data('countToOptions') || {});
	$this.countTo(options);
  }
});

//sing up form

$("#signup-form").submit((e) => {
	e.preventDefault()
	$.ajax({
		url: '/signup',
		method: 'post',
		data: $('#signup-form').serialize(),
		success: (response) => {
			if (response == 'success') {
				alert('Registration Successfully Completed')
				location.href = '/'
			} else if ('username is invaild') {
				alert('username is alredy used')
			} else {
				alert('Passwords are diffrent, Try again')

			}
		}
	})
})

//login form

$("#login-form").submit((e) => {
	e.preventDefault()
	$.ajax({
		url: '/login',
		method: 'post',
		data: $('#login-form').serialize(),
		success: (response) => {
			if (response == 'success') {
				location.href = '/dashboard'
			} else {
				alert('Password or User name  are invalid, Try again')

			}
		}
	})
})

//profile-update form submition

$("#profileUpdate").submit((e) => {
	e.preventDefault()
	$.ajax({
		url: '/profileUpdate',
		method: 'post',
		data: $('#profileUpdate').serialize(),
		success: (response) => {
			if (response == 'success') {
				alert('Updation Successfully Completed')
			} else {
				alert('Something is missing, Try again')

			}
		}
	})
})

//password Update form submition

$("#passwordUpdate").submit((e) => {
	e.preventDefault()
	$.ajax({
		url: '/passwordUpdate',
		method: 'post',
		data: $('#passwordUpdate').serialize(),
		success: (response) => {
			if (response == 'success') {
				alert('Password Updation Successfully Completed')
			} else {
				alert('Passwords are diffrent, Try again')

			}
		}
	})
})


//contact form

$("#contact-form").submit((e) => {
	e.preventDefault()
	$.ajax({
		url: '/contact',
		method: 'post',
		data: $('#contact-form').serialize(),
		success: (response) => {
			if (response == 'success') {
				alert('Successfully Sented')
				document.getElementById("contact-form").reset(); 
			} else {
				alert('Something is missing, Try again')

			}
		}
	})
})

//admin sing up form

$("#adminsingupform").submit((e) => {
	e.preventDefault()
	$.ajax({
		url: '/admin/singup',
		method: 'POST',
		data: $('#adminsingupform').serialize(),
		success: (response) => {
			if (response == 'success') {
				alert('Registration Successfully Completed')
				location.href = '/admin'
			} else if ('username is invaild') {
				alert('username is alredy used')
			} else {
				alert('Passwords are diffrent, Try again')

			}
		}
	})
})


//login form

$("#admin-login-form").submit((e) => {
	e.preventDefault()
	$.ajax({
		url: '/admin/login',
		method: 'post',
		data: $('#admin-login-form').serialize(),
		success: (response) => {
			if (response == 'success') {
				location.href = '/admin/dashboard'
			} else {
				alert('Password or User name  are invalid, Try again')

			}
		}
	})
})

//popup for service

jQuery(document).ready(function ($) {
	//open popup
	$('.cd-popup-trigger').on('click', function (event) {
		event.preventDefault();
		$('.cd-popup').addClass('is-visible');
	});

	//close popup
	$('.cd-popup').on('click', function (event) {
		if ($(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup')) {
			event.preventDefault();
			$(this).removeClass('is-visible');
		}
	});
	//close popup when clicking the esc keyboard button
	$(document).keyup(function (event) {
		if (event.which == '27') {
			$('.cd-popup').removeClass('is-visible');
		}
	});
});

//sub service popup

jQuery(document).ready(function ($) {
	//open popup
	$('.cd-popup-trigger-sub').on('click', function (event) {
		event.preventDefault();
		$('.cd-popup-sub').addClass('is-visible');
		$('#id2').val($("input[type=radio]:checked").val())
	});

	//close popup
	$('.cd-popup-sub').on('click', function (event) {
		if ($(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup-sub')) {
			event.preventDefault();
			$(this).removeClass('is-visible');
		}
	});
	//close popup when clicking the esc keyboard button
	$(document).keyup(function (event) {
		if (event.which == '27') {
			$('.cd-popup-sub').removeClass('is-visible');
		}
	});
});

function viewImage(event) {
	document.getElementById('image').src = URL.createObjectURL(event.target.files[0])
	$('#icon').hide()
}

//plan poup

jQuery(document).ready(function ($) {
	//open popup
	$('.cd-popup-trigger-plan').on('click', function (event) {
		event.preventDefault();
		$('.cd-popup-plan').addClass('is-visible');
	});

	//close popup
	$('.cd-popup-plan').on('click', function (event) {
		if ($(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup-plan')) {
			event.preventDefault();
			$(this).removeClass('is-visible');
		}
	});
	//close popup when clicking the esc keyboard button
	$(document).keyup(function (event) {
		if (event.which == '27') {
			$('.cd-popup-plan').removeClass('is-visible');
		}
	});
});

//admin password Update form submition

$("#adminPasswordUpdate").submit((e) => {
	e.preventDefault()
	$.ajax({
		url: '/admin/passwordUpdate',
		method: 'post',
		data: $('#adminPasswordUpdate').serialize(),
		success: (response) => {
			if (response == 'success') {
				alert('Password Updation Successfully Completed')
			} else {
				alert('Passwords are diffrent, Try again')

			}
		}
	})
})


for (let i = 0; i < 20; i++) {
	jQuery(document).ready(function ($) {
		//open popup
		$('.cd-popup-trigger-sub-' + i).on('click', function (event) {
			event.preventDefault();
			$('.cd-popup-sub-' + i).addClass('is-visible');
		});

		//close popup
		$('.cd-popup-sub-' + i).on('click', function (event) {
			if ($(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup-sub-' + i)) {
				event.preventDefault();
				$(this).removeClass('is-visible');
			}
		});
		//close popup when clicking the esc keyboard button
		$(document).keyup(function (event) {
			if (event.which == '27') {
				$('.cd-popup-sub-' + i).removeClass('is-visible');
			}
		});
	});

}

$("#checkoutform").submit((e) => {
	e.preventDefault()
	$.ajax({
		url: '/place-order',
		method: 'post',
		data: $('#checkoutform').serialize(),
		success: (response) => {
			if (response.status == 'success') {
				location.href = '/order-details?id=' + response.id
			} else {
				alert('link is invalid')
			}
		}
	})
})

