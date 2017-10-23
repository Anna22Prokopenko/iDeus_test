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
            if (!privates.isAnimationEnd) {
                return;
            }

            privates.isAnimationEnd = false;

            --privates.opt.position;

            if (privates.opt.position < 0) {
                privates.sel.wrap.classList.add('s-notransition');
                privates.sel.wrap.style["transform"] = "translateX(-" + privates.opt.max_position + "00%)";
                initPrsentationProgress(0);
                changeBg(0);
                privates.opt.position = privates.opt.max_position - 1;
            }

            setTimeout(function () {
                privates.sel.wrap.classList.remove('s-notransition');
                privates.sel.wrap.style["transform"] = "translateX(-" + privates.opt.position + "00%)";
                initPrsentationProgress("" + privates.opt.position);
            }, 10);

            privates.sel.wrap.addEventListener('transitionend', function () {
                privates.isAnimationEnd = true;
            });

            if (privates.setting.autoplay === true) {
                privates.timer.become();
            }
        };

        // Next slide
        this.next_slide = function () {
            if (!privates.isAnimationEnd) {
                return;
            }

            privates.isAnimationEnd = false;

            if (privates.opt.position < privates.opt.max_position) {
                ++privates.opt.position;
            }
            changeBg(privates.opt.position);
            privates.sel.wrap.classList.remove('s-notransition');
            privates.sel.wrap.style["transform"] = "translateX(-" + privates.opt.position + "00%)";
            privates.sel.children["" + privates.opt.position].classList.add('active');
            privates.sel.children["" + privates.opt.position].classList.remove('active');

            initPrsentationProgress("" + privates.opt.position);

            privates.sel.wrap.addEventListener('transitionend', function () {
                if (privates.opt.position >= privates.opt.max_position) {
                    privates.sel.wrap.style["transform"] = 'translateX(0)';
                    privates.sel.wrap.classList.add('s-notransition');
                    privates.sel.children[0].classList.add('active');
                    initPrsentationProgress(0);
                    changeBg(0);
                    privates.opt.position = 0;
                }

                privates.isAnimationEnd = true;
            });

            if (privates.setting.autoplay === true) {
                privates.timer.become();
            }
        };

        // Pause timer carousel
        this.pause = function () {
            if (privates.setting.autoplay === true) {
                privates.timer.pause();
            }
        };

        // Become timer carousel
        this.become = function () {
            var autoplayDelay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : privates.setting.autoplayDelay;

            if (privates.setting.autoplay === true) {
                privates.setting.autoplayDelay = autoplayDelay;
                privates.timer.become();
            }
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
            "wrapProgress": document.querySelector(privates.setting.wrapProgress),
            "children": document.querySelector(privates.setting.wrap).children,
            "childrenProgress": document.querySelector(privates.setting.wrapProgress).children,
            "typeXS": document.querySelector(privates.setting.typeXS),
            "typeS": document.querySelector(privates.setting.typeS),
            "typeM": document.querySelector(privates.setting.typeM),
            "typeL": document.querySelector(privates.setting.typeL),
            "widthProgressBar": document.querySelector(privates.setting.widthProgressBar)
        };
        privates.opt = {
            "position": 0,
            "max_position": document.querySelector(privates.setting.wrap).children.length
        };

        /* Constructor */
        // Clone first elem to end wrap
        privates.sel.wrap.appendChild(privates.sel.children[0].cloneNode(true));

        // Autoplay
        if (privates.setting.autoplay === true) {
            privates.timer = new Timer(this.next_slide, privates.setting.autoplayDelay);
        }

        // Control
        if (privates.sel.typeXS !== null) {
            privates.sel.typeXS.addEventListener('click', function () {
                _this.goto(0);
            });
        }

        if (privates.sel.typeS !== null) {
            privates.sel.typeS.addEventListener('click', function () {
                _this.goto(1);
            });
        }

        if (privates.sel.typeM !== null) {
            privates.sel.typeM.addEventListener('click', function () {
                _this.goto(2);
            });
        }

        if (privates.sel.typeL !== null) {
            privates.sel.typeL.addEventListener('click', function () {
                _this.goto(3);
            });
        }

        // Touch events
        if (privates.setting.touch === true) {
            privates.sel.wrap.addEventListener('touchstart', privates.hts, false);
            privates.sel.wrap.addEventListener('touchmove', privates.htm, false);
        }

        // Pause on hover
        if (privates.setting.autoplay === true && privates.setting.pauseOnHover === true) {
            privates.sel.wrap.addEventListener('mouseenter', function () {
                privates.timer.pause();
            });

            privates.sel.wrap.addEventListener('mouseleave', function () {
                privates.timer.become();
            });
        }

        function initPrsentationProgress(element) {
            var progress = privates.sel.childrenProgress;
            var progressItem_width = progress[element].clientWidth;
            var progressPos = progress[element].offsetLeft + progressItem_width / 2;
            privates.sel.widthProgressBar.style["width"] = progressPos + 'px';
            privates.sel.widthProgressBar.style["backgroundColor"] = '#03b1af';
        }

        function changeBg(element) {
            switch (element) {
                case 0:
                    privates.sel.children[0].style["backgroundColor"] = 'orange';
                    break;
                case 1:
                    privates.sel.children[1].style["backgroundColor"] = 'deepskyblue';
                    break;
                case 2:
                    privates.sel.children[2].style["backgroundColor"] = 'blue';
                    break;
                case 3:
                    privates.sel.children[3].style["backgroundColor"] = 'pink';
            }
        }
    }

    function Timer(callback, delay) {
        var _this2 = this;

        /* privates properties */
        var timerId = void 0,
            start = void 0,
            remaining = delay;

        /* Public methods */
        this.resume = function () {
            start = new Date();
            timerId = setTimeout(function () {
                remaining = delay;
                _this2.resume();
                callback();
            }, remaining);
        };

        this.pause = function () {
            clearTimeout(timerId);
            remaining -= new Date() - start;
        };

        this.become = function () {
            clearTimeout(timerId);
            remaining = delay;

            _this2.resume();
        };

        /* Constructor */
        this.resume();
    }

    var a = new Carousel({
        "wrap": ".js-prsentationCarousel__wrap",
        "wrapProgress": ".js-presentationPager",
        "widthProgressBar": ".js-presentationProgressbar",
        "typeXS": ".js-presentation__xs",
        "typeS": ".js-presentation__s",
        "typeM": ".js-presentation__m",
        "typeL": ".js-presentation__l",
        "touch": true,
        "autoplay": true,
        "autoplayDelay": 3000
    });
})();