"use strict";

(function () {
    "use strict";

    function Carousel(setting) {
        var _this = this;

        if (document.querySelector(setting.wrap) === null) {
            console.error("Carousel not fount selector " + setting.wrap);
            return;
        }

        /* Scope privates methods and properties */
        var privates = {},
            xDown = void 0,
            yDown = void 0,
            xUp = void 0,
            yUp = void 0,
            xDiff = void 0,
            yDiff = void 0;

        /* Public methods */
        // Prev slide
        this.prev_slide = function () {
            --privates.opt.position;
		
            if (privates.opt.position <= 0) {
                privates.sel.wrap.classList.add('s-notransition');
                privates.sel.wrap.style["transform"] = "translateX(-" + privates.opt.position * privates.opt.width + "px)";
                privates.opt.position = privates.opt.max_position - 1;
            }
            
            privates.sel.wrap.style["transform"] = "translateX(-" + privates.opt.position * privates.opt.width + "px)";
			privates.sel.wrap.classList.remove('s-notransition');
        };

        // Next slide
        this.next_slide = function () {
            if (privates.opt.position < privates.opt.max_position) {
                ++privates.opt.position;
            }

            privates.sel.wrap.classList.remove('s-notransition');
            privates.sel.wrap.style["transform"] = "translateX(-" + privates.opt.position * privates.opt.width + "px)";

            privates.sel.wrap.addEventListener('transitionend', function () {
                if (privates.opt.position >= privates.opt.max_position) {
					privates.sel.wrap.classList.add('s-notransition');
                    privates.sel.wrap.style["transform"] = 'translateX(0)';
                    privates.opt.position = 0;
                }
            });
        };

        // Go to
        this.goto = function (index) {
            privates.opt.position = index - 1;
            _this.next_slide();
        };

        // Item
        this.index = function () {
            return privates.opt.position;
        };

        /* privates methods */
        privates.hts = function (e) {
            xDown = e.touches[0].clientX;
            yDown = e.touches[0].clientY;
        };

        privates.htm = function (e) {
            if (!xDown || !yDown) {
                return;
            }

            xUp = e.touches[0].clientX;
            yUp = e.touches[0].clientY;

            xDiff = xDown - xUp;
            yDiff = yDown - yUp;

            if (Math.abs(xDiff) > Math.abs(yDiff)) {
                if (xDiff > 0) {
                    _this.next_slide();
                } else {
                    _this.prev_slide();
                }
            }

            xDown = 0;
            yDown = 0;
        };

        /* privates properties */
        privates.default = {
            "touch": true,
            "autoplay": false,
            "autoplayDelay": 3000,
            "pauseOnFocus": true,
            "pauseOnHover": true
        };

        privates.setting = Object.assign(privates.default, setting);

        privates.isAnimationEnd = true;

        privates.sel = {
            "wrap": document.querySelector(privates.setting.wrap),
            "children": document.querySelector(privates.setting.wrap).children,
            "prev": document.querySelector(privates.setting.prev),
            "next": document.querySelector(privates.setting.next)
        };

        privates.opt = {
            "position": 0,
            "width": 340,
            "max_position": privates.sel.children.length
        };
        console.log(privates.opt.width);
        /* Constructor */
        // Clone first elem to end wrap
        privates.sel.wrap.appendChild(privates.sel.children[0].cloneNode(true));
        privates.sel.wrap.appendChild(privates.sel.children[1].cloneNode(true));
        privates.sel.wrap.appendChild(privates.sel.children[2].cloneNode(true));

        // Control
        if (privates.sel.prev !== null) {
            privates.sel.prev.addEventListener('click', function () {
                _this.prev_slide();
            });
        }

        if (privates.sel.next !== null) {
            privates.sel.next.addEventListener('click', function () {
                _this.next_slide();
            });
        }

        // Touch events
        if (privates.setting.touch === true) {
            privates.sel.wrap.addEventListener('touchstart', privates.hts, false);
            privates.sel.wrap.addEventListener('touchmove', privates.htm, false);
        }
    }

    var a = new Carousel({
        "wrap": ".js-testimonials__wrap",
        "prev": ".js-testiminials__prev",
        "next": ".js-testiminials__next",
        "touch": true,
        "autoplay": true,
        "autoplayDelay": 3000
    });
})();