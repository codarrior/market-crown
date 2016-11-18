(function() {

	//back to homepage
	$(".mc-back").click(function() {
		$(".mc-login, .mc-signup, .mc-learnmore4,.mc-learnmore3,.mc-learnmore2,.mc-learnmore1").hide(500, function() {
			$(".mc-home").show(500);
		});
	});

	// show login screen
	$(".mc-loginbtn").click(function() {
		$(".mc-login").toggle(500);
	});

	// show signup screen,hide login
	$(".mc-smsignup").click(function() {

		$(".mc-login").hide(500, function() {
			$(".mc-signup").show(500);
		});
	});

	// show login screen, hide signup
	$(".mc-smlogin").click(function() {

		$(".mc-signup").hide(500, function() {
			$(".mc-login").show(500);
		});
	});

	//show signup screen
	$(".mc-signupbtn").click(function() {
		$(".mc-signup").show(500);

	});

	//learnmore functions
	$(".mc-btnlm1").click(function() {


		$(".mc-home").fadeOut(0, function() {
			$(".mc-learnmore1").fadeIn(1000);
		});
	});

	$(".mc-btnlm2").click(function() {
		$(".mc-home").fadeOut(0, function() {
			$(".mc-learnmore2").fadeIn(1000);
		});
	});

	$(".mc-btnlm3").click(function() {
		$(".mc-home").fadeOut(0, function() {
			$(".mc-learnmore3").fadeIn(1000);
		});
	});

	$(".mc-btnlm4").click(function() {
		$(".mc-home").fadeOut(0, function() {
			$(".mc-learnmore4").fadeIn(1000);
		});
	});


	$(".mc-learnmore4,.mc-learnmore3,.mc-learnmore2,.mc-learnmore1").click(function() {
		$(".mc-learnmore4,.mc-learnmore3,.mc-learnmore2,.mc-learnmore1").fadeOut(0, function() {
			$(".mc-home").fadeIn(500);

		});
	});

	//$('.mc-pd-submit').click(function(){
	//	console.log('ajaja')
	//	$.ajax({
	//		method: "POST",
	//		url:"api/v1/auth/finish"
	//	})
	//});

	//$('#finishForm')
	//	.ajaxForm({
	//		url : '/api/v1/auth/finish', // or whatever
	//		dataType : 'json',
	//		success : function (response) {
	//			console.log("The server says: " + response);
	//		}
	//	})
	//;


	//console.log('sad');
	 $.ajax({
		 method: "GET",
		 url:"/api/v1/personal/me"
		 })
		.done(function(a,b) {
			console.log( "success", a,b);
		})
		.fail(function() {
			console.log( "error" );
		})
		.always(function() {
			console.log( "complete" );
		});

	var btn = document.getElementById("myBtn")
	if(btn){btn.onclick = submitform;}

})();

$(".form-error-nick").hide();
$(".form-error-email").hide();
$(".form-error-common").hide();


function submitform(e){
	e.preventDefault();
	if(validateForm()) {
		$(".form-error").hide();
		$.ajax({
			url:"/api/v1/auth/finish",
			type: 'POST',
			data: $('#finishForm').serialize(),
			success: function (a) {
				console.log('form submitted.', a);
				if (a.error) {
					var msg = 'Server error, please try again';
					if(a && a.error && a.error.error){
						msg = a.error.error;
					};
					$(".form-error-common").show(500);
					$(".form-error-common").text(msg);
				} else {
					window.location.href = a.redirect;
				}
			},
			error: function (a) {
				console.log('form not submitted.', a);
				var msg = 'Server error, please try again';
				if(a && a.error && a.error.error){
					msg = a.error.error;
				};
				$(".form-error-common").show(500);
				$(".form-error-common").text(msg);
			}
		});
		return false;
	}
};

function validateForm(){

	var form = document.forms["finishForm"];
	var nick = form['username'].value;
	var email = form['email'].value;

	console.log('validation', email);
	var re = /^\w+$/;
	var remail = /^.+@.+\..+$/;
	var errors = false;

	if(!nick || nick=='' || nick.length<4 || nick=='admin' || nick=='all' || !re.test(nick)) {
		$(".form-error-nick").show(500);
		console.log('. nick');
		errors = true;
	}else{
		$(".form-error-nick").hide();
	}
	if(!email || email=='' || !remail.test(email)){
		$(".form-error-email").show(500);
		console.log('. mail');
		errors=true;
	}else{
		$(".form-error-email").hide();
	}
	console.log('+ ', errors);
	if(errors){
		return false;
	}else{
		$(".form-error").hide();
		return true;
	}
}