$(document).ready(function() {

	// fancybox init
	$(".fancybox").fancybox({closeClick: true});

	// Replace e-mails with human readable
	var spt = $('span.mailme');
	var at = / at /;
	var dot = / dot /g;
	$(spt).each(function(i) {
		var addr = $(this).text().replace(at,"@").replace(dot,".");
		$(this).after('<a href="mailto:'+addr+'" title="Send an email" class="mail">'+ addr +'</a>')
		.hover(function(){window.status="Send a letter!";}, function(){window.status="";});
		$(this).remove();
	});
	
	// Unsubscribed/removed from sign-up list
	$(window).load(function() {
		if (location.pathname == '/removed/') {
			signUpResponse('<span class="message"><img src="/static/images/icon-exclamation.gif" alt="Advarsel" />Du er er blevet slettet fra tilmeldingslisten.</span>');
			_gaq.push(['_trackEvent', 'Subscribers', 'Unsubscribe']);
		}
	});

	// Initialize paths
	var path = window.location.hash;
	if (path && path !== '#forside') {
		changeContent(path.slice(1));
	} else {
		window.location.hash = "forside";
	}

	// Listens for has changes to change page
	$(window).hashchange( function(){
		changeContent(location.hash.substring(1));
	})


	// Navigation
	// $('.button').click(function() {
	// 	changeContent($(this).attr('rel'));
	// });

	// Change content when navigation is clicked
	function changeContent(id) {
		$('.content.visible').fadeOut(function() {
			$(this).removeClass('visible');
			$('.content[rel=' + id + ']').fadeIn().addClass('visible');
			$('.selected').removeClass('selected');
			$('.button[rel=' + id + ']').addClass('selected');
			_gaq.push(['_trackPageview', id]); // track analytics async call
		});
		if (id == 'forside') {
			$('.coming-soon-badge').fadeIn();
		} else {
			$('.coming-soon-badge').fadeOut();
		}
	}

	// Prepare sign up inputs
	$('form#signup input.input-email').focus(function() {
		var input = $(this);
		if (input.val() == input.attr('placeholder')) {
			input.val('');
			input.removeClass('placeholder');
		}
	}).blur(function() {
		var input = $(this);
		if (input.val() === '' || input.val() == input.attr('placeholder')) {
			input.addClass('placeholder');
			input.val(input.attr('placeholder'));
		}
	}).blur();

	// Video embed on frontpage
	$('#front-videoplay').click(function(e) {
		if (!jQuery.browser.mobile) {
			e.preventDefault();
			// Lets Flash from another domain call JavaScript
			var params = { allowScriptAccess: "always" };
			// The element id of the Flash embed
			var atts = { id: "ytPlayer" };
			// All of the magic handled by SWFObject (http://code.google.com/p/swfobject/)
			swfobject.embedSWF("http://www.youtube.com/v/1QhyhtAAskY?modestbranding=1&showinfo=0&theme=light&version=3&enablejsapi=1&playerapiid=player1&autoplay=1",
				"front-videoembed-replacer", "560", "315", "9", null, null, params, atts);
		}
	});

	// Sign up form submit
	$('#signup').submit(function() {
		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		var emailInput = $("form#signup input.input-email").val();
		if(!emailReg.test(emailInput) || emailInput === "") {
			$('.validation-error').css('display', 'block');
		} else {
			$('.validation-error').hide();
			$('.input-submit').attr('disabled', 'disabled');
			var input = $('.input-submit');
			if (input.val() == input.attr('placeholder')) { input.val(''); }
			$.ajax({
				type: 'POST',
				url: '/signup/',
				data: $("form#signup").serialize(),
				success: function(data){
					if (data.message == "Success") {
						signUpResponse('<span class="message"><img src="/static/images/icon-checkmark.gif" alt="OK" />Tak for din tilmelding!</span>');
						_gaq.push(['_trackEvent', 'Subscribers', 'Quick Form']); // track sign-up in Google Analytics
					} else if (data.message == "Email already signed up") {
						signUpResponse('<span class="message"><img src="/static/images/icon-exclamation.gif" alt="Advarsel" />E-mailen er allerede tilmeldt.</span>');
					} else {
						signUpResponse('<span class="message"><img src="/static/images/icon-cross.gif" alt="Fejl" />Der gik noget galt, forsøg igen!</span>');
					}
				},
				error: function() {
					signUpResponse('<span class="message"><img src="/static/images/icon-cross.gif" alt="Fejl" />Der gik noget galt, forsøg igen!</span>');
				},
				dataType: 'json'
			});
		}
		return false;
	});

	// Sign up response
	function signUpResponse(message){
		$('form#signup').fadeOut(function() {
			$('form#signup').html(message);
			$('form#signup').fadeIn();
		});
	}
});

// Mobile browser detection using jQuery
// jQuery.browser.mobile will be true if the browser is a mobile device
(function(a){jQuery.browser.mobile=/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);