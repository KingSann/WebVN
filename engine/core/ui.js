// Manager of ui component

webvn.add('ui', ['class', 'selector'], function (s, kclass, $) {

var ui = {},
	uiContainer = {}, // Store all the ui components
	$container = $('body');

// Add ui component
ui.add = function (name, type) {

	var newUi;

	switch (type) {
		case 'canvas':
			newUi = new CanvasUi;
			break;
		case 'svg':
			newUi = new SvgUi;
			break;
		default:
			newUi = new DivUi;
			break;
	}

	uiContainer[name] = newUi;

	return newUi;

};

// Get ui component for manipulation
ui.get = function (name) {

	return uiContainer[name];

};

// Base class for all ui class
var BaseUi = kclass.create({
    constructor: function BaseUI(name) {},
    remove: function () {



    }
});

// Div element
var DivUi = BaseUi.extend({
    constructor: function DivUI() {

    	this.callSuper();

    }
});

// Canvas element
var CanvasUi = BaseUi.extend({
	constructor: function CanvasUi() {

		this.callSuper();

	}
});

// Svg element
var SvgUi = BaseUi.extend({

	constructor: function SvgUi() {

		this.callSuper();

	}

});

return ui;

});