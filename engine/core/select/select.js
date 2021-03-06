WebVN.extend('select', function (exports, Class, util)
{
    var selectUtil = exports.util;

    /**
     * Create new select object.
     * @method create
     * @memberof select
     * @param {String} name Node name, div, canvas...
     * @return {Select}
     */
    exports.create = function (name)
    {
        var element = document.createElement(name);

        return new Select(element);
    };

    /**
     * Get select object by selector.
     * @method get
     * @memberof select
     * @param {String} selector
     * @return {Select}
     */
    exports.get = function (selector) { return new Select(selector) };

    var emptyArr = [],
        slice    = emptyArr.slice;

    /**
     * @name Select
     * @class
     * @memberof select
     */
    var Select = exports.Select = Class.create(
        /** @lends select.Select.prototype */
        {
            constructor: function Select(selector)
            {
                // Nothing is passed in, return empty Select instance
                if (!selector) return this;

                // No context specified
                if (util.isString(selector))
                {
                    return rootSelect.find(selector);
                } else if (selector.nodeType)
                {
                    // Handle: dom
                    this[0]     = selector;
                    this.length = 1;
                }
            },

            length: 0,

            /**
             * Get the descendants of each element in the current set
             * of matched elements, filtered by a selector.
             * @param {string} selector
             */
            find: function (selector)
            {
                var result = [];

                util.each(this, function (value)
                {
                    Select.merge(result, value.querySelectorAll(selector));
                });
                var select = new Select();

                return Select.merge(select, result);
            },

            /**
             * Iterate elements
             * @param {function} fn
             * @return {Select}
             */
            each: function (fn)
            {
                util.each(this, function (element, index)
                {
                    fn.call(element, index, element);
                });

                return this;
            },

            /**
                * Determine whether any of the matched elements are assigned the given class.
                * @method webvn.select.Select#hasClass
                * @param {string} name
                * @returns {boolean}
                */
            hasClass: function (name)
            {
                var regHasClass = new RegExp('(^|\\s)' + name + '(\\s|$)');

                return emptyArr.some.call(this, function (element)
                {
                    return regHasClass.test(element.className);
                });
            },

            /**
             * Adds the specified class(es) to each element in the set of matched elements.
             * @method webvn.select.Select#addClass
             * @param {string} name
             * @returns {Select}
             */
            addClass: function (name)
            {
                return this.each(function (index) {
                    var classList = [];
                    // Only add classes that do not exist
                    name.split(/\s+/g).forEach(function (value) {
                        var select = new Select(this);
                        if (!select.hasClass(value)) {
                            classList.push(value);
                        }
                    }, this);
                    // Add new classes
                    if (classList.length) {
                        var cn = this.className;
                        this.className += (cn ? ' ' : '') + classList.join(' ');
                    }
                });
            },

            /**
             * Removes class(es)
             * @method webvn.select.Select#removeClass
             * @param {string} name
             * @returns {Select}
             */
            rmClass: function (name)
            {
                return this.each(function () {
                    var classList = this.className;
                    name.split(/\s+/g).forEach(function (Class) {
                        classList = classList.replace(new RegExp('(^|\\s)' + Class + '(\\s|$)'), " ");
                    });
                    this.className = classList;
                });
            },

            visible: function (visiblity)
            {
                if (visiblity === undefined) {
                    return this.css('display') !== 'none';
                }
                if (visiblity) {
                    return this.show();
                } else {
                    return this.hide();
                }
            },

            /**
                * Display Element
                * @method webvn.select.Select#show
                * @returns {Select}
                */
            show: function ()
            {
                return this.each(function () {
                    if (getComputedStyle(this, '').getPropertyValue('display') === 'none') {
                        this.style.display = selectUtil.defaultDisplay(this.nodeName);
                    }
                });
            },

            /**
                * Get Style Value
                * @method webvn.select.Select#css
                * @param {string|Array} property
                * @returns {string|object}
                */
            /**
                * Set Style Value
                * @method webvn.select.Select#css
                * @param {object|string} property
                * @param {string=} value
                * @returns {Select}
                */
            css: function (property, value)
            {
                // Get style value
                if (value === undefined) {
                    var computedStyle, element = this[0];
                    computedStyle = getComputedStyle(element, '');
                    // Handle: String
                    if (util.isString(property)) {
                        return element.style[selectUtil.camelize(property)] || computedStyle.getPropertyValue(property);
                    } else if (util.isArray(property)) {
                        // Handle: Array
                        var props = {};
                        util.each(property, function (prop) {
                            props[prop] = element.style[camelize(prop)] || computedStyle.getPropertyValue(property);
                        });
                        return props;
                    }
                }
                var css = '';
                // Set style value
                if (util.isString(property)) {
                    css = selectUtil.dasherize(property) + ':' + selectUtil.addPx(property, value);
                } else {
                    // Handle: Object
                    util.each(property, function (value, key) {
                        css += selectUtil.dasherize(key) + ':' + selectUtil.addPx(key, value) + ';';
                    });
                }
                return this.each(function () {
                    this.style.cssText += ';' + css;
                });
            },

            cssComputed: function (property)
            {
                var computedStyle, element = this[0], ret;
                computedStyle = getComputedStyle(element, '');
                if (util.isString(property)) {
                    ret = computedStyle.getPropertyValue(property);
                    return selectUtil.removePx(property, ret);
                } else if (util.isArray(property)) {
                    // Handle: Array
                    var props = {};
                    util.each(property, function (prop) {
                        props[prop] = computedStyle.getPropertyValue(property);
                        props[prop] = removePx(prop, props[prop]);
                    });
                    return props;
                }
            },

            attr: function (name, value)
            {
                // Get attributes
                if (value === undefined && util.isString(name)) {
                    return this[0].getAttribute(name);
                }
                // Set attributes
                var self = this;
                return this.each(function () {
                    if (util.isObject(name)) {
                        util.each(name, function (value, key) {
                            selectUtil.setAttribute(self, key, value);
                        });
                    } else {
                        selectUtil.setAttribute(this, name, value);
                    }
                });
            },

            data: function (name, value)
            {
                if (util.isString(name)) {
                    name = 'data-' + name;
                } else if (util.isObject(name)) {
                    util.each(name, function (value, key) {
                        name[key] = 'data-' + value;
                    });
                }

                return this.attr(name, value);
            },

            rmAttr: function (name)
            {
                return this.each(function () {
                    if (this.nodeType === 1) {
                        name.split(' ').forEach(function (name) {
                            selectUtil.setAttribute(this, name);
                        }, this);
                    }
                });
            },

            /**
                * Get Raw Element <br>
                * If index is undefined, then returns all elements.
                * @method webvn.select.Select#get
                * @param {number=} index
                */
            get: function (index)
            {
                if (index === undefined) {
                    return slice.call(this);
                }
                return this[index];
            },

            /**
                * Hide Element
                * @method webvn.select.Select#hide
                */
            hide: function ()
            {
                return this.css('display', 'none');
            },

            /**
                * Change Select Into Array
                * @method webvn.select.Select#toArray
                * @returns {Array}
                */
            toArray: function ()
            {
                return this.get();
            }
        },
        /** @lends select.Select.prototype */
        {
            html: {
                get: function () { return this[0].innerHTML },
                set: function (val)
                {
                    this.each(function () { this.innerHTML = val });
                }
            },
            text: {
                get: function () { return this[0].textContent },
                set: function (val)
                {
                    this.each(function () { this.textContent = val });
                }
            },
            size: {
                get: function () { return this.length }
            },
            first: {
                get: function () { return new Select(this[0]) }
            },
            last: {
                get: function () { return new Select(this[this.length - 1]) }
            },
            val: {
                get: function () { return this[0] && this[0].value },
                set: function (val)
                {
                    this.each(function () { this.value = val });
                }
            },
            width: {
                get: function () { return this.cssComputed('width') }
            }
        },
        {
            /**
             * Merge Second Array Into First Array
             * @function webvn.select.Select.merge
             * @param {Array} first
             * @param {Array} second
             * @returns {Array}
             */
            merge: function (first, second) {
                var len = +second.length,
                    i = first.length;
                for (var j = 0; j < len; j++) {
                    first[i++] = second[j];
                }
                first.length = i;
                return first;
            },

            /**
                * Convert html string to actual dom element
                * @function webvn.select.Select.parseHTML
                * @param data
                * @returns {Array}
                */
            parseHTML: function (data) {
                // Div for creating nodes
                var div = document.createElement('div');
                if ( !data || !util.isString(data)) {
                    return null;
                }
                div.innerHTML = data;
                var elements = div.childNodes;
                return Select.merge([], elements);
            },

            /**
                * Whether a Node contains another node
                * @function webvn.select.Select.contains
                * @param parent
                * @param node
                * @returns {boolean}
                */
            contains: function (parent, node) {
                return parent !== node && parent.contains(node);
            }
        }
    );

    var rootSelect = new Select(document);

    /**
     * Whether is a Select element
     * @function webvn.select.isSelect
     * @param o
     * @returns {boolean}
     */
    var isSelect = exports.isSelect = function (o) {
        return o instanceof Select;
    };

    /* Generate 'after', 'prepend', 'before', 'append'
     * 'insertAfter', 'insertBefore', 'appendTo' and 'prependTo' methods
     */
    var fn = Select.prototype;
    [ 'after', 'prepend', 'before', 'append' ].forEach(function (operator, idx) {
        var inside = idx % 2; // prepend, append
        fn[operator] = function () {
            // Arguments can be nodes, arrays of nodes and Html strings
            var nodeArray = util.map(arguments, function (arg) {
                return util.isString(arg) ? Select.parseHTML(arg) : arg;
            });
            var nodes = [];
            for (var i = 0, len = nodeArray.length; i < len; i++) {
                if (util.isArray(nodeArray[i])) {
                    // Node array
                    nodes = nodes.concat(nodeArray[i]);
                } else if (isSelect(nodeArray[i])) {
                    // Select
                    nodes = nodes.concat(nodeArray[i].toArray());
                } else {
                    // Node
                    nodes.push(nodeArray[i]);
                }
            }
            var parent, copyByClone = this.length > 1;
            if (nodes.length < 1) {
                return this;
            }
            return this.each(function (_, target) {
                parent = inside ? target : target.parentNode;
                switch (idx) {
                    case 0:
                        target = target.nextSibling;
                        break;
                    case 1:
                        target = target.firstChild;
                        break;
                    case 2:
                        break;
                    default:
                        target = null;
                        break;
                }
                var parentInDocument = Select.contains(document.documentElement, parent);
                nodes.forEach(function(node){
                    if (copyByClone) {
                        node = node.cloneNode(true);
                    } else if (!parent) {
                        return select(node).remove();
                    }
                    parent.insertBefore(node, target);
                    if (parentInDocument) selectUtil.traverseNode(node, function(el){
                        if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
                            (!el.type || el.type === 'text/javascript') && !el.src) {
                            window['eval'].call(window, el.innerHTML);
                        }
                    });
                });
            });
        };
        fn[inside ? operator + 'To' : 'insert' + (idx ? 'Before' : 'After')] = function (html) {
            select(html)[operator](this);
            return this;
        }
    });

});