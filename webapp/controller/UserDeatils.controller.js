sap.ui.define([
  "sap/ui/core/mvc/Controller",
  'sap/ui/model/json/JSONModel',
  'sap/m/MessageBox',
  'sap/m/MessageToast',
  'sap/ui/core/format/DateFormat',
  'sap/ui/model/resource/ResourceModel',
  'sap/ui/model/Filter',
  'sap/ui/model/ValidateException'
],
  /** nnn
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, MessageBox, MessageToast, DateFormat, ResourceModel, Filter, ValidateException,) {
    "use strict";
    var context = null;
    var oModel = null;
    var oUserName;
    var oData = null;
    var sValue;
    return Controller.extend("com.ibs.forgotpasswd.controller.UserDeatils", {
      handleValueHelp: function () {
        // create value help dialog
        if (!this._valueHelpDialog) {
          this._valueHelpDialog = sap.ui.xmlfragment("com.ibs.forgotpasswd.fragment.Dialog", this);
          this.getView().addDependent(this._valueHelpDialog);
        }
        context = this;
        context.getView().byId("_idUserId").setVisible(true);
        var oModel = this.getOwnerComponent().getModel();
        var oJsonModel = new JSONModel();
        oModel.read("/UserValueHelpSet", {
          success: function (oData, response) {
            //  console.log("user list : "+JSON.stringify(oData));
            oJsonModel.setData(oData);
            context.getView().setModel(oJsonModel, "oUserList");
          },
          error: function (error) {
            console.log(error);
          }
        });
        // open value help dialog
        this._valueHelpDialog.open();
      },
      _handleValueHelpSearch: function (evt) {
        var sValue = evt.getParameter("value");
        //console.log("svalue "+sValue);
        var oFilter = new Filter("Bname", sap.ui.model.FilterOperator.Contains, sValue);
        evt.getSource().getBinding("items").filter([oFilter]);
      },
      onInit: function () {

        var oData = {
          recipient: {
            name: ""
          }
        };
        var oModel1 = new JSONModel(oData);
        this.getView().setModel(oModel1);
        var i18nModel = new ResourceModel({
          bundleName: "forgotpasswd.i18n.i18n"
        });
        this.getView().setModel(i18nModel, "i18n");

        //							Calling Meta data
        //							*******************
        context = this;
        context.getView().byId("_idUserId").setVisible(true);
        var oModel = this.getOwnerComponent().getModel();
        var oJsonModel = new JSONModel();
        oModel.setHeaders({"X-Requested-With" : "X"});
        oModel.read("/UserValueHelpSet",
          {
            success: function (oData, response) {
              //console.log("user list : "+JSON.stringify(oData));
              oJsonModel.setData(oData);
              context.getView().setModel(oJsonModel, "oUserList");
            },
            error: function (error) {
              console.log(error);
            }
          });
      },
      _handleValueHelpClose: function (evt) {

        //console.log(" tab    "+evt.getSource());
        //console.log("Binding of tabselectdialog "+evt.getSource().getBinding());
        //console.log("items of tabselectdialog "+evt.getSource().getBinding("items"));
        var oSelectedItem = evt.getParameter("selectedItem");
        if (oSelectedItem) {
          var compCodeInput = this.byId("_idUserId");
          compCodeInput.setValue(oSelectedItem.getCells()[0].getText());
        }
        //console.log(compCodeInput);
        evt.getSource().getBinding("items").filter([]);
        //evt.getSource().close();
      },
      _OnReset: function (evt) {
        var that = this;
        that.getView().byId("_IDGenVBox1").setVisible(false);
        that.getView().byId("_IDGenVBox2").setVisible(false);
        that.getView().byId("_IDGenVBox3").setVisible(false);
        that.getView().byId("_IDStrip2").setVisible(false);
        that.getView().byId("_IDStrip3").setVisible(false);
        that.byId("_idinOTP1").setEnabled(false);
        that.byId("_idinOTP2").setEnabled(false);
        that.byId("_idinOTP3").setEnabled(false);
        that.byId("_idinOTP4").setEnabled(false);
        that.byId("_idinOTP1").setValue("");
        that.byId("_idinOTP2").setValue("");
        that.byId("_idinOTP3").setValue("");
        that.byId("_idinOTP4").setValue("");
        that.byId("_IDGenButton3").setEnabled(false);
        that.byId("_IDGenButton2").setEnabled(false);
        that.getView().byId("_IDGenVBox2").setVisible(false);
        that.getView().byId("_IDGenVBox3").setVisible(false);
        that.getView().byId("_IDGenVBox1").setVisible(false);
        that.getView().byId("_IDGenVBox4").setVisible(false);
        that.byId("_IDGenButton4").setEnabled(false);
        that.byId("_IDGenButton5").setEnabled(false);
        that.getView().byId("_IDGenVBox5").setVisible(false);
        that.byId("_odPass1").setValue("");
        that.byId("_odPass2").setValue("");

      },
      onSubmit: function () {

        var that = this;
        that._OnReset();
        sap.ui.core.BusyIndicator.show(0);
        try {
          var oModel = this.getOwnerComponent().getModel();
          var oJsonModel = new JSONModel();
          let selectedID = that.getView().byId("_idUserId").getValue();

          if (selectedID === undefined || selectedID === null || selectedID === "") {
            MessageBox.error("Please Eneter user ID");
            sap.ui.core.BusyIndicator.hide();
            return;
          }
          oModel.setHeaders({"X-Requested-With" : "X"});
          oModel.read("/UserDetailsSet('" + selectedID + "')",
            {
              success: function (oData, response) {


                oJsonModel.setData(oData);
                context.getView().setModel(oJsonModel, "OUserDetails");
                that.getView().byId("_IDGenVBox1").setVisible(true);

                that.getView().byId("_IDnameText1").setText(oData.Uname);
                that.getView().byId("_IDnameText").setText(oData.Bname);
                that.getView().byId("_IDGenText2").setText(oData.PrimaryEmail);
                that.getView().byId("_IDGenText22").setText(oData.MobileNo);
                that.getView().byId("_IDGenText3").setText(oData.Message);
                that.getView().byId("_IDGenText4").setText(oData.LCDB);
                that.getView().byId("_IDGenText5").setText(oData.LCDD);
                that.getView().byId("_IDGenText6").setText(oData.Dpartment);
                sap.ui.core.BusyIndicator.hide();

                if (oData.Unbti == 'X' && oData.PrimaryEmail != "") {
                  that.getView().byId("_IDGenVBox2").setVisible(true);
                  that.getView().byId("_IDGenVBox3").setVisible(true);
                  that.byId("_IDGenButton3").setEnabled(false);
                  that.byId("_IDGenButton2").setEnabled(true);

                } else if (oData.PrimaryEmail === "") {
                  that.getView().byId("_IDStrip2").setVisible(true);
                  that.getView().byId("_IDStrip2").setText("Primery Email ID is required for any Action, Please connect with support team");
                }
                if (oData.Unbti != 'X') {
                  that.getView().byId("_IDStrip3").setVisible(true);
                  that.getView().byId("_IDStrip3").setText("User is Locked By Admin, Please connect with support team");
                }
              },
              error: function (error) {
                sap.ui.core.BusyIndicator.hide();
                console.log(error);
              }

            });
        } catch (error) {
          debugger
          sap.ui.core.BusyIndicator.hide();
          console.log(error);
        }
      },
      _onGOTP: function () {

        var that = this;
        var oModel = this.getOwnerComponent().getModel();
        var oJsonModel = new JSONModel();

        let selectedID = that.byId("_IDnameText").getText();
        var oHeaders = {
          'X-Requested-With': 'X',
          'Accept' : 'application/json',
          };
        sap.ui.core.BusyIndicator.show(0);
        var josnBody = new sap.ui.model.json.JSONModel();
        josnBody.setData({
          "Bname": "" + selectedID + "",
          "Action": "GOTP"

        });
        var body = josnBody.oData;
        var entity = "/UserDetailsSet";
        oModel.create(entity, body, {
          filters: [],
          headers : oHeaders,
          success: function (data) {
            sap.ui.core.BusyIndicator.hide();
            let result = data.Message;
            MessageBox.success(result);

            that.byId("_idinOTP1").setEnabled(true);
            that.byId("_idinOTP2").setEnabled(true);
            that.byId("_idinOTP3").setEnabled(true);
            that.byId("_idinOTP4").setEnabled(true);
            that.byId("_IDGenButton3").setEnabled(true);
            that.byId("_IDGenButton2").setEnabled(false);


            var remainingTime = 120; // in seconds
            that.byId("_IDGenButton2").setText("Generate OTP in  (" + remainingTime + "s)");
            var timerInterval = setInterval(function () {
              remainingTime--;
              that.byId("_IDGenButton2").setText("Generate OTP in  (" + remainingTime + "s)");
              if (remainingTime <= 0) {
                clearInterval(timerInterval);
                that.byId("_IDGenButton2").setEnabled(true);
                that.byId("_IDGenButton2").setText("Generate OTP");
              }
            }, 1000); // Update every second

          },
          error: function (error) {
            sap.ui.core.BusyIndicator.hide();
            var res = JSON.parse(error.responseText);
            var msg = res.error.message.value;
            MessageBox.error(msg);
          }

        });
      },
      _onVOTP: function () {

        var that = this;
        var oModel = this.getOwnerComponent().getModel();
        var oJsonModel = new JSONModel();

        let lvOTP1 = that.byId("_idinOTP1").getValue();
        let lvOTP2 = that.byId("_idinOTP2").getValue();
        let lvOTP3 = that.byId("_idinOTP3").getValue();
        let lvOTP4 = that.byId("_idinOTP4").getValue();
        let lvOTP = lvOTP1 + lvOTP2 + lvOTP3 + lvOTP4;
        MessageToast.show(lvOTP);
        let selectedID = that.byId("_IDnameText").getText();
        if (lvOTP.length < 4 || lvOTP.length > 4) {
          MessageBox.error("Please enter Valid OTP");
          return;
        }
        sap.ui.core.BusyIndicator.show(0);
        var josnBody = new sap.ui.model.json.JSONModel();
        josnBody.setData({
          "Bname": "" + selectedID + "",
          "OTP": "" + lvOTP + "",
          "Action": "VOTP"

        });
        var body = josnBody.oData;
        var entity = "/UserDetailsSet";
        oModel.create(entity, body, {
          filters: [],
          success: function (data) {
            sap.ui.core.BusyIndicator.hide();
            let result = data.Message;
            MessageToast.show(result)

            that.getView().byId("_IDGenVBox2").setVisible(false);
            that.getView().byId("_IDGenVBox3").setVisible(false);
            that.byId("_IDGenButton3").setEnabled(false);
            that.byId("_IDGenButton2").setEnabled(false);
            that.getView().byId("_IDGenVBox4").setVisible(true);
            that.byId("_IDGenButton4").setEnabled(true);
            that.byId("_IDGenButton5").setEnabled(true);
            that.getView().byId("_IDGenVBox5").setVisible(true);

          },
          error: function (error) {
            sap.ui.core.BusyIndicator.hide();
            var res = JSON.parse(error.responseText);
            var msg = res.error.message.value;
            MessageBox.error(msg);
          }

        });
      },
      _onUnlock: function () {

        var that = this;
        var oModel = this.getOwnerComponent().getModel();
        var oJsonModel = new JSONModel();
        let selectedID = that.byId("_IDnameText").getText();
        sap.ui.core.BusyIndicator.show(0);

        var josnBody = new sap.ui.model.json.JSONModel();
        josnBody.setData({
          "Bname": "" + selectedID + "",
          "Action": "UNLOCK"

        });
        var body = josnBody.oData;
        var entity = "/UserDetailsSet";
        oModel.create(entity, body, {
          filters: [],
          success: function (data) {
            sap.ui.core.BusyIndicator.hide();
            let result = data.Message;
            MessageBox.success(result)
            oModel.read("/UserDetailsSet('" + selectedID + "')",
            {
              success: function (oData, response) {
                that.getView().byId("_IDGenText3").setText(oData.Message);
              }
            });
          },
          error: function (error) {
            sap.ui.core.BusyIndicator.hide();
            var res = JSON.parse(error.responseText);
            var msg = res.error.message.value;
            MessageBox.error(msg);
          }

        });
      },
      _ShowPress6: function (oEvent) {
        debugger;
        var bid = oEvent.getId();
        var that = this;
        var lv_type = that.getView().byId("_odPass1").getType();

        if (lv_type === "Password") {
          that.getView().byId("_odPass1").setType("Text");
          that.getView().byId("_IDGenButton6").setIcon("sap-icon://hide");
        } else {
          that.getView().byId("_odPass1").setType("Password");
          that.getView().byId("_IDGenButton6").setIcon("sap-icon://show");
        }

      },
      _ShowPress7: function (oEvent) {
        debugger;
        var bid = oEvent.getId();
        var that = this;
        var lv_type = that.getView().byId("_odPass2").getType();

        if (lv_type === "Password") {
          that.getView().byId("_odPass2").setType("Text");
          that.getView().byId("_IDGenButton7").setIcon("sap-icon://hide");
        } else {
          that.getView().byId("_odPass2").setType("Password");
          that.getView().byId("_IDGenButton7").setIcon("sap-icon://show");
        }

      },
      _onRestPass: function () {
        // PWDSET
        var that = this;

        var lv_pass1 = that.getView().byId("_odPass1").getValue();
        var lv_pass2 = that.getView().byId("_odPass2").getValue();
        if (!lv_pass1) {
          MessageBox.error("Please enter password")
          return;
        } else if (!lv_pass2) {
          MessageBox.error("Please enter password")
          return;
        }
        if (lv_pass1 === lv_pass2) {
          var oModel = this.getOwnerComponent().getModel();
          var oJsonModel = new JSONModel();
          let selectedID = that.byId("_IDnameText").getText();
          sap.ui.core.BusyIndicator.show(0);

          var josnBody = new sap.ui.model.json.JSONModel();
          josnBody.setData({
            "Bname": "" + selectedID + "",
            "Action": "PWDSET",
            "Password": lv_pass1

          });
          var body = josnBody.oData;
          var entity = "/UserDetailsSet";
          oModel.create(entity, body, {
            filters: [],
            success: function (data) {
              sap.ui.core.BusyIndicator.hide();
              let result = data.Message;
              MessageBox.success(result)
              that.byId("_odPass1").setValue("");
              that.byId("_odPass2").setValue("");
            },
            error: function (error) {
              sap.ui.core.BusyIndicator.hide();
              var res = JSON.parse(error.responseText);
              var msg = res.error.message.value;
              MessageBox.error(msg);
            }

          });

        } else {
          MessageBox.error("Password is not matched")
          return;
        }


      },
      onInputChange: function (oEvent) {
        var oInput = oEvent.getSource();
        var sValue = oInput.getValue();
        var sInputId = oInput.getId();

        // If input is not empty and has a single character, focus on the next input
        if (sValue && sValue.length === 1) {
          var iIndex = parseInt(sInputId.slice(-1));
          var oNextInput = this.getView().byId("_idinOTP" + (iIndex + 1));
          if (oNextInput) {
            oNextInput.focus();
          }
        }
      }
    });
  });
