/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.12
 *
 * Requires: jQuery 1.2.2+
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});

/**
 * Created by Ekaterina Radakina on 17.02.2015.
 * SectionScroll is a simple JQuery plugin for sites consisting of multiple full screen sections
 * These sections responds to scroll by mouse wheel or by navigation links
 * It depends on the Jquery Mousewheel plugin by Brandon Aaron https://github.com/jquery/jquery-mousewheel
 * Supports all modern browsers (ie 8+) and touch devices
 */

;(function ($) {
    /**
     * Create SectionScroll
     * @param elem {object} section's wrapper object
     * @param params {object} set of parameters
     * @constructor
     */
    var SectionScroll = function (elem, params) {
        this.$elem = $(elem);
        this.params = params;
        this.init();
    };

    /**
     * Plugin initialization
     */
    SectionScroll.prototype.init = function () {
        this.$sections = this.$elem.find('.' + this.params.sectionClass);
        this.activeSectionIndex = 0;
        //true if sections are sliding
        this.isSliding = false;

        if (this.params.nav) this.$nav = $('.' + this.params.navClass);

        //For touch events
        this.isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints > 0));
        this.isLongTouch = false;

        this.attachEvents();

        if (this.params.anchors) {
            if (window.location.hash.replace('#!/', '').length > 0) {
                this.changeAnchor();
            } else {
                window.location.hash = '#!/' + this.$sections.eq(this.activeSectionIndex).attr('id');
            }
        } else {
            this.toSlide(this.activeSectionIndex);
        }
    };

    /**
     * All events
     */
    SectionScroll.prototype.attachEvents = function() {
        var _this = this;

        _this.$elem.on('mousewheel', function (e) {
            if (!_this.isSliding) {
                _this.letSlide(e.deltaY);
            }
        });

        if (_this.params.anchors) {
            $(window).on('hashchange', function () {
                if (!_this.isSliding) {
                    _this.changeAnchor();
                }
            });
        }

        if (_this.params.nav) {
            _this.$nav.on('click', function(e) {
                e.preventDefault();
                var newSectionId = $(this).attr('href');
                if (!_this.isSliding && _this.$sections.filter(newSectionId).length) {
                    window.location.hash = '#!/' + newSectionId.replace('#', '');
                }
            })
        }

        if (_this.isTouch) {
            _this.$elem.on('touchstart', function (e) {
                if (!_this.isSliding) {
                    _this.touchStart(e);
                }
            })
                .on('touchmove', function (e) {
                    _this.touchMove(e);
                })
                .on('touchend', function (e) {
                    _this.touchEnd(e);
                })
        }
    };

    /**
     * Method to detect next section
     * @param deltaY {number} - scroll direction (positive for up or negative for down)
     * @returns {boolean}
     */
    SectionScroll.prototype.letSlide = function(deltaY) {
        var _this = this,
            activeSection = _this.$sections.eq(_this.activeSectionIndex),
            nextSectionIndex;

        if (deltaY < 0 && activeSection.next().length) {
            nextSectionIndex = _this.activeSectionIndex + 1;
        } else if (deltaY > 0 && activeSection.prev().length) {
            nextSectionIndex = _this.activeSectionIndex - 1;
        } else {
            return false
        }

        if (_this.params.anchors) {
            window.location.hash = '#!/' + _this.$sections.eq(nextSectionIndex).attr('id');
        } else {
            _this.toSlide(nextSectionIndex);
        }
    };

    /**
     * Sliding to necessary section
     * @param nextSectionIndex {number} - index of necessary section
     */
    SectionScroll.prototype.toSlide = function(nextSectionIndex) {
        var _this = this;

        _this.isSliding = true;
        _this.$elem.css('top', - nextSectionIndex * 100 + '%');

        _this.$sections.eq(_this.activeSectionIndex).removeClass(_this.params.sectionClass + '_active');
        _this.$sections.eq(nextSectionIndex).addClass(_this.params.sectionClass + '_active');
        _this.activeSectionIndex = nextSectionIndex;

        if (_this.params.nav) {
            _this.$nav.filter('.' + _this.params.navClass + '_active').removeClass(_this.params.navClass + '_active');
            _this.$nav.filter('[href=#' + _this.$sections.eq(nextSectionIndex).attr('id') + ']').addClass(_this.params.navClass + '_active');
        }

        if ($.isFunction(_this.params.afterSlide)) {
            _this.params.afterSlide(_this.activeSectionIndex);
        }

        setTimeout(function () {
            _this.isSliding = false;
        }, _this.params.speed);
    };

    SectionScroll.prototype.changeAnchor = function() {
        var _this = this,
            hashMass = window.location.hash.replace('#!/', '')
                .split('/'),
            nextSectionIndex;
        if (_this.$sections.filter('#' + hashMass[0]).length) {
            nextSectionIndex = _this.$sections.filter('#' + hashMass[0]).index();
            _this.toSlide(nextSectionIndex);
        }
    };

    /**
     * Touch events
     */
    SectionScroll.prototype.touchStart = function(e) {
        var _this = this;

        _this.isLongTouch = false;
        setTimeout(function () {
            _this.isLongTouch = true;
        }, 250);

        _this.touchStartY = e.originalEvent.touches[0].pageY;
    };

    SectionScroll.prototype.touchMove = function(e) {
        var _this = this;
        _this.touchMoveY = e.originalEvent.touches[0].pageY;
    };

    SectionScroll.prototype.touchEnd = function(e) {
        var _this = this;

        if (!(_this.isLongTouch || _this.isSliding)) {
            _this.letSlide(_this.touchMoveY - _this.touchStartY);
        }
    };

    $.fn.sectionScroll = function (params) {
        params = $.extend({
            //values
            speed: 700,     //time for one slide action
            anchors: true,  //need or not to change hashes # (new hash = active section id  =>  all sections must have ids!)
            nav: true,      //need or not use navigation

            //elements
            sectionClass: 'sections-item', //"class" attribute for section. Active class will be sectionClass + '_active'
            navClass: 'sections-navigation__link',  //"class" attribute for navigation element

            //callbacks
            afterSlide: null //will be performed when the sliding had ended
        }, params);

        return this.each(function () {
           new SectionScroll(this, params);
        });
    }
})(jQuery, undefined, document);
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
