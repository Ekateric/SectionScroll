
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
                .replace('?', '/')
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