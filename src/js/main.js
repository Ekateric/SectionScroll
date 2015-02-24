/**
 * Main.js
 */
(function() {
	$('.sections-wrap').sectionScroll({
		anchors: true,
		navClass: 'navigation__link',
		afterSlide: function(activeSectionIndex) {
			console.log(activeSectionIndex);
		}
	});
})();
