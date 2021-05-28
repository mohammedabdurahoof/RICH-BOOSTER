//sing up form

$("#singup-form").submit((e) => {
	e.preventDefault()
	$.ajax({
		url: '/singup',
		method: 'post',
		data: $('#singup-form').serialize(),
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
				location.reload()
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

//razorpay Payment


$("#paymentDetails").submit((e) => {
	e.preventDefault()
	$.ajax({
		url: '/pay',
		method: 'post',
		data: $('#paymentDetails').serialize(),
		success: (response) => {
			razorpayPayment(response)
			console.log(response)
		}
	})
})


