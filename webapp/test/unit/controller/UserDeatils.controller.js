/*global QUnit*/

sap.ui.define([
	"comibs/forgotpasswd/controller/UserDeatils.controller"
], function (Controller) {
	"use strict";

	QUnit.module("UserDeatils Controller");

	QUnit.test("I should test the UserDeatils controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
