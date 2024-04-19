/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comibs/forgotpasswd/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
