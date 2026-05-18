/*
	Twenty by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$banner = $('#banner');

	// Breakpoints.
		breakpoints({
			wide:      [ '1281px',  '1680px' ],
			normal:    [ '981px',   '1280px' ],
			narrow:    [ '841px',   '980px'  ],
			narrower:  [ '737px',   '840px'  ],
			mobile:    [ null,      '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000,
			offset: function() { return $header.height() + 10; }
		});

	// Submenu desktop: clique em "Serviços" mantém o menu aberto para escolher a opção
		if (!browser.mobile) {
			var	$navSubmenus = $('#header #nav > ul > li.submenu');

			$navSubmenus.children('a').on('click', function(event) {
				event.preventDefault();
				var	$li = $(this).parent();

				$navSubmenus.not($li).removeClass('submenu-open');
				$li.toggleClass('submenu-open');
			});

			$(document).on('click', function(event) {
				if (!$(event.target).closest('#header #nav > ul > li.submenu').length) {
					$navSubmenus.removeClass('submenu-open');
				}
			});
		}

	// Nav Panel.

		// Button.
			$(
				'<div id="navButton">' +
					'<a href="#navPanel" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'navPanel-visible'
				});

		// Fix: Remove navPanel transitions on WP<10 (poor/buggy performance).
			if (browser.os == 'wp' && browser.osVersion < 10)
				$('#navButton, #navPanel, #page-wrapper')
					.css('transition', 'none');

	// Header.
		if (!browser.mobile
		&&	$header.hasClass('alt')
		&&	$banner.length > 0) {

			$window.on('load', function() {

				$banner.scrollex({
					bottom:		$header.outerHeight(),
					terminate:	function() { $header.removeClass('alt'); },
					enter:		function() { $header.addClass('alt reveal'); },
					leave:		function() { $header.removeClass('alt'); }
				});

			});

		}

	// Logo: fallback se images/logo.png não carregar
		document.querySelectorAll('.logo-img').forEach(function(img) {
			img.addEventListener('error', function() {
				var link = img.parentElement;
				if (!link || !link.classList.contains('logo-link')) {
					return;
				}
				img.remove();
				link.classList.add('logo-text-fallback');
				link.textContent = 'Biblioteca Padre Euclides';
				link.setAttribute('aria-label', 'Biblioteca Padre Euclides — início');
			});
		});

})(jQuery);