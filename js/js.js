$(function () {
	var up = $(".up");
	$(window).scroll(function () {
		if ($(this).scrollTop() >= 200) {
			up.show(700);
		}
		else {
			up.hide(700);
		};
	});
	up.click(function () {
		$("html,body").animate({ scrollTop: 0 }, 1000);
	});
});

$(function () {
	$('.nevmenu .ulnavbar li a').click(function (e) {

		'use strict';

		e.preventDefault();

		$('html, body').animate({

			scrollTop: $('#' + $(this).data('scroll')).offset().top

		}, 1500);

	});
});

$(function () {
	$('.buttonnav .dropdown-menu li a').click(function (e) {

		'use strict';

		e.preventDefault();

		$('html, body').animate({

			scrollTop: $('#' + $(this).data('scroll')).offset().top

		}, 1500);

	});
});

$(function () {
	$('.up div a').click(function (e) {
		e.preventDefault();
	});
});

$(function () {
	$('.Register h1 a').click(function (e) {
		e.preventDefault();
	});
});


$(function () {
	$("#eye").click(function () {
		$(".eyeopen").toggleClass("eye");
	});
});
$(function () {
	$("#eye2").click(function () {
		$(".eyeopen2").toggleClass("eye");
	});
});


$(function () {
	$('#exit').click(function (e) {
		e.preventDefault();
	});
});
$(function () {
	$('#exiti').click(function (e) {
		e.preventDefault();
	});
});

$(function () {
	$('#exit-r').click(function (e) {
		e.preventDefault();
	});
});


/*   ---------------- exit popup  */
$(function () {
	$("#exit").click(function () {
		$(".popup").hide(1000);
	});
});

$(function () {
	$("#exiti").click(function () {
		var htmlData2 = ` 
			<form id="login_form" >
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div class="name">
					<li>
						<i class="fas fa-user"></i>
	
						<input class="inplog" type="text" name="username" placeholder="Email oR UserName" required="">
					</li>
				</div>
			</div>
	
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div class="password">
					<li>
						<i class="fas fa-unlock-alt"></i>
						<input type="password" name="password" placeholder="password" id="paslog" required="">
						<span class='glyphicon glyphicon-eye-open eyeopen2' id="eye2"></span>
					</li>
				</div>
			</div>
	
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	
				<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
					<li>
						<a class="forgta" id="passwodRecov" href="#">forget password?</a>
					</li>
				</div>
	
				<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
					<li>
						<input id="btnsub" type="submit" name="send" class="btn btn-primary btnsub1">
					</li>
				</div>
	
			</div>
	
		</form>
			`;
		$('#content').html(htmlData2);
		$(".popup2").hide(1000);
	});
});





/*------------------------- open signin -*/
$(function () {

	var pwd = document.getElementById("paslog");
	var eye = document.getElementById("eye2");

	eye.addEventListener('click', togglePass);

	function togglePass() {

		eye.classList.toggle('active');

		if (pwd.type == 'password') {
			pwd.type = 'text';
		} else {
			pwd.type = 'password';
		}

	}
});


$(function () {
	var pwd = document.getElementById("pwd");
	var eye = document.getElementById("eye");

	eye.addEventListener('click', togglePass);

	function togglePass() {

		eye.classList.toggle('active');

		if (pwd.type == 'password') {
			pwd.type = 'text';
		} else {
			pwd.type = 'password';
		}

	}
});

$(function () {
	var veer = document.getElementById("veer");
	var eye = document.getElementById("eye");

	eye.addEventListener('click', togglePass);

	function togglePass() {

		eye.classList.toggle('active');

		if (veer.type == 'password') {
			veer.type = 'text';
		} else {
			veer.type = 'password';
		}

	}
});