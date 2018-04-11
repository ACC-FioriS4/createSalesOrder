sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/Dialog",
	"sap/m/Label",
	"sap/m/Input",
	"sap/m/Button",
	"sap/m/TextArea",
	"sap/m/Text",
	"sap/m/ObjectStatus",
	"sap/m/ObjectAttribute"
], function(Controller, MessageBox, MessageToast, Dialog, Label, Input, Button, TextArea, Text, ObjectStatus, ObjectAttribute) {
	"use strict";
	return Controller.extend("create.sales.ordercreateSalesOrder2.controller.main", {
		onInit: function() {
			
			this.locationInit = location;
			this.langSystem = sap.ui.getCore().getConfiguration().getLanguage();

			jQuery.sap.require("sap.ui.core.format.NumberFormat");
			this.numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 2,
				groupingEnabled: false,
				groupingSeparator: "",
				decimalSeparator: "."
			});

			this.gasStationList = this.getView().byId("gasStationList");
			this.stepBtn1 = this.getView().byId("stepBtn1");
			this.materialList = this.getView().byId("materialList");
			//this.matBtns = this.getView().byId("matBtns");
			this.stepBtn2 = this.getView().byId("stepBtn2");
			this.calendarPanel = this.getView().byId("calendarPanel");

			this.oFormatYyyymmdd = sap.ui.core.format.DateFormat.getInstance({
				pattern: "YYYYMMdd",
				calendarType: sap.ui.core.CalendarType.Gregorian
			});
			this.oFormatDateDetail = sap.ui.core.format.DateFormat.getInstance({
				pattern: "EEEE d MMM, yyyy",
				calendarType: sap.ui.core.CalendarType.Gregorian
			});
			//get client ID
			var sServiceUrl = "/sap/opu/odata/sap/ZSDGW_SO_CREATE_SRV_01/CustomerSet('')?$format=json";
			this.oModelId = new sap.ui.model.json.JSONModel();
			this.oModelId.loadData(sServiceUrl);

			var that = this;

			/*	this.globalId = null;
				this.Name1 = null;
				this.Name2 = null;*/
			this.oModelGasStation = new sap.ui.model.json.JSONModel();
			/*this.addressGas = null;
			this.deliveryDays = null;
			this.supportEmail = null;
			this.supportPhone = null;*/
			this.control = "init";

			this.oModelId.attachRequestCompleted(function() {
				that.globalId = that.oModelId.getProperty("/d/BillTo");
				that.Name1 = that.oModelId.getProperty("/d/Name1");
				that.Name2 = that.oModelId.getProperty("/d/Name2");
				that.supportEmail = that.oModelId.getProperty("/d/Email");
				that.supportPhone = that.oModelId.getProperty("/d/Phone");

				//Bring DocType
				var that2 = that;
				var sServiceUrl = "/sap/opu/odata/sap/ZSDGW_SO_CREATE_SRV_01/Sold_ToSet('" + that.globalId + "')?$format=json";
				that.oModelSP = new sap.ui.model.json.JSONModel();
				that.oModelSP.loadData(sServiceUrl);
				
				that.oModelSP.attachRequestCompleted(function(){
					
				that2.DocType = that2.oModelSP.getProperty("/d/DocType");
				console.log("Ver DocType = " + that2.DocType);	
				
					});
				
				var sServiceUrl = "/sap/opu/odata/sap/ZSDGW_SO_CREATE_SRV_01/Bill_ToSet('" + that.globalId + "')/SHIP_TOSet?$format=json";
				that.oModelGasStation.loadData(sServiceUrl);
				that.oModelGasStation.refresh(true);
				that.gasStationList.setModel(that.oModelGasStation, "modelGasStation");
				that.addressGas = that.oModelGasStation.getProperty("/d/Street") + ", " + that.oModelGasStation.getProperty("/d/City") + ", " +
				that.oModelGasStation.getProperty("/d/PostalCode");

			});
			
				
		},

		onPriceNull: function(item,AoF) {
			if (AoF === "L"){
			var popTitle = this.getView().getModel("i18n").getResourceBundle().getText("popTitleF");
			}else {
			var popTitle = this.getView().getModel("i18n").getResourceBundle().getText("popTitleA");	
			}
			var mailBtn = this.getView().getModel("i18n").getResourceBundle().getText("mailSend");
			var endBtn = this.getView().getModel("i18n").getResourceBundle().getText("endBtn");
			var placeHolderCommentMail = this.getView().getModel("i18n").getResourceBundle().getText("phCommentMail");
			var _supportMail = this.supportEmail;
			var _Material = item.data("Material");
			var _Description = item.data("Description");
			var _shipTo = item.data("ShipTo");
			var matDesc = _Material + " - " + _Description;
		//	console.log("aquí");
			var _fullNameUser = sap.ushell.Container.getService("UserInfo").getUser().getFullName();
		//	console.log("fullnameuser");
		//	console.log(_fullNameUser);
			var msgPopHeader = this.getView().getModel("i18n").getResourceBundle().getText("msgPopHeader") + " " + _fullNameUser + ";\n\n";
		//	var msgActual = this.getView().getModel("i18n").getResourceBundle().getText("msgPopBody_1") + " " + _supportMail;
			var msgPopBody = msgPopBody + " " + this.getView().getModel("i18n").getResourceBundle().getText("msgPopBody_2") + "\n\n";
			 msgPopBody = this.getView().getModel("i18n").getResourceBundle().getText("msgPopBody_1") + " ";
			msgPopBody = msgPopBody + " " + this.getView().getModel("i18n").getResourceBundle().getText("msgPopBody_2") + "\n\n";
			//msgPopBody = msgPopBody + this.getView().getModel("i18n").getResourceBundle().getText("material") + " : " + _Material + "\n";
		//	msgPopBody = msgPopBody + this.getView().getModel("i18n").getResourceBundle().getText("client") + " : " + _shipTo + "\n\n";
			msgPopBody = msgPopBody + this.getView().getModel("i18n").getResourceBundle().getText("msgPopBody_3");
			msgPopBody = msgPopBody + _supportMail + " " + this.getView().getModel("i18n").getResourceBundle().getText("msgPopBody_4") + this.supportPhone;
			var msgMail = msgPopHeader + msgPopBody;
			//alert(msgMail)
			var dialog = new Dialog({
				title: popTitle,
				type: "Message",
				content: new Text({
					text: msgMail
				}),
				beginButton: new Button({
					text: endBtn,
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		},

		handleSelectGasStation: function() {
			this.stepBtn1.setEnabled(true);
			this.stepBtn1.setType("Emphasized");
			this.stepBtn2.setEnabled(false);
			this.stepBtn2.setType("Default");
			//this.auxControl=true;
			this.control = "createList";
			this.deliveryDays = this.gasStationList.getSelectedItem().data("deliveryDays");
			this.maxDays = this.gasStationList.getSelectedItem().data("maxDays");
			//console.log(this.deliveryDays);
			//console.log(this.maxDays);
		},

		handleSelectMaterial: function(oEvent) {
			if (this.materialList.getSelectedItem().data("NetValue") > 0) {
				this.calendarPanel.setVisible(true);
				this.items = this.materialList.getItems();
				this.prefixView = this.getView().createId("").replace("--", "");
				this.inputId = "input-" + this.prefixView + "--materialList-";
				var value;
				var auxInputId = "";
				var regex = /^[0-9]*$|,/gi;
				for (var i = 0; i < this.items.length; i++) {
					if (this.items[i].getProperty("selected")) {
						auxInputId = this.inputId + i;
						this.getView().byId(auxInputId).setEnabled(true);
						value = this.getView().byId(auxInputId).getValue();
						if (this.controlSelect) {
							value = value.replace(regex, "");
						}
						this.orderQty = value;
						if (value > 0) {
							this.stepBtn2.setEnabled(true);
							this.stepBtn2.setType("Emphasized");
						} else {
							this.stepBtn2.setEnabled(false);
							this.stepBtn2.setType("Default");
						}
						auxInputId = this.inputId;
					} else {
						auxInputId = this.inputId + i;
						this.getView().byId(auxInputId).setEnabled(false);
						this.getView().byId(auxInputId).setValue(null);
						auxInputId = this.inputId;
					}
				}
			} else {
				this.onPriceNull(this.materialList.getSelectedItem(),this.materialList.getSelectedItem().data("UnitSales"));
				this.calendarPanel.setVisible(false);
			}

		},
	
		handleNav: function(evt) {
			this.navCon = this.getView().byId("navCon");
			var target = evt.getSource().data("target");
			this.animation = "flip";
			if (target) {
				if (target === "reviewPage") {
					this.verifypurchase(evt);
				} else if (target === "materialSelection") {
					this.gasStationId = this.gasStationList.getSelectedItem().data("shipTo");
					this.deliveryDays = this.gasStationList.getSelectedItem().data("deliveryDays");
					this.gasPlant = this.gasStationList.getSelectedItem().data("plant");
					this.salesOrg = this.gasStationList.getSelectedItem().data("salesOrg");
					this.distrChan = this.gasStationList.getSelectedItem().data("distrChan");
					this.soldTo = this.gasStationList.getSelectedItem().data("soldTo");
					if (this.control === "createList") {
						this.materialList.setVisible(false);
						this.calendarPanel.setVisible(false);
						this.control = "init";
					}
					this.assignMaterialList();
					this.navCon.to(this.getView().byId(target), this.animation);
				} else if (target === "purchasePage") {
					this.onSubmit();
				} else {
					this.navCon.to(this.getView().byId(target), this.animation);
				}
			} else {
				this.navCon.back();
			}

		},
		
		handleNewDate: function(CoA){
			
			var defaultDate = new Date();
			var maxDate = new Date();
			this.calendarPanel.setVisible(false);
			var MinDate = defaultDate.getDate();
			var MaxDate = maxDate.getDate();	
				switch (CoA){
			
			case "C":
				
				MinDate = MinDate + +this.deliveryDays;
				defaultDate.setDate(MinDate);
			//	this.getView().byId("calendar").setMinDate(this.defaultDate);
				sap.ui.getCore().byId(this.createId("calendar")).setMinDate(defaultDate);
				MaxDate = MaxDate + +this.maxDays;
				maxDate.setDate(MaxDate);
			//	this.getView().byId("calendar").setMaxDate(this.maxDate);
				sap.ui.getCore().byId(this.createId("calendar")).setMaxDate(maxDate);
			break;
			
			case "A":
				
				MinDate = MinDate + +this.deliveryDays + 1;
				defaultDate.setDate(MinDate);
			//	this.getView().byId("calendar").setMinDate(this.defaultDate);
				sap.ui.getCore().byId(this.createId("calendar")).setMinDate(defaultDate);
				MaxDate = MaxDate + +this.maxDays + 1;
				maxDate.setDate(MaxDate);
			//	this.getView().byId("calendar").setMaxDate(this.maxDate);
				sap.ui.getCore().byId(this.createId("calendar")).setMaxDate(maxDate);
				
			break;
			}
		},
		_changeInputStatus: function() {
			this.oCalendar = this.getView().byId("calendar");
			var auxInputId = null;
			for (var i = 0; i < this.items.length; i++) {
				if (this.items[i].getProperty("selected")) {
					auxInputId = this.inputId + i;
					this.getView().byId(auxInputId).setValueState("Error");
					this.oCalendar.removeAllSelectedDates();
					break;
				}
			}
		},
		/*enableRefer: function(oEvent) {
			if (this.getView().byId("checkBoxRefer").getSelected()) {
				this.getView().byId("referenceNo").setEnabled(true);
			} else {
				this.getView().byId("referenceNo").setEnabled(false);
			}
		},*/

		reload: function() {
			this.locationInit.reload();
		},

		_handleMessageBoxOpen: function(sMessage, sMessageBoxType, sInd) {
			switch (sInd) {
				case "REFER":
					var _NoReference = this.getView().getModel("i18n").getResourceBundle().getText("NoReference");
					sap.m.MessageBox[sMessageBoxType](sMessage, {
						title: _NoReference,
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								//this.onReferDialog();
							} else {
								//goto REVIEW
							}
						}.bind(this)
					});
					break;
				case "QUANTITY":
					var _wrongQty = this.getView().getModel("i18n").getResourceBundle().getText("wrongQty");
					sap.m.MessageBox[sMessageBoxType](sMessage, {
						title: _wrongQty,
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								this._changeInputStatus();
							}
						}.bind(this)
					});
					break;
				case "CALENDAR":
					var _wrongCale = this.getView().getModel("i18n").getResourceBundle().getText("wrongCale");
					sap.m.MessageBox[sMessageBoxType](sMessage, {
						title: _wrongCale,
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								//
							}
						}.bind(this)
					});
					break;

				case "CANCEL":
					sap.m.MessageBox[sMessageBoxType](sMessage, {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						onClose: function(oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								this.handleRefresh();
							}
						}.bind(this)
					});
					break;
				case "SUBMIT":
					sap.m.MessageBox[sMessageBoxType](sMessage, {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						onClose: function(oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								this.showBusyIndicator(1000, 0);
								this._submitResponse();
							}
						}.bind(this)
					});
					break;
				case "MISMATCH":
					sap.m.MessageBox[sMessageBoxType](sMessage, {
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								//Somenthing when OK
							}
						}.bind(this)
					});
					break;
				case "NOPRICE":
					sap.m.MessageBox[sMessageBoxType](sMessage, {
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								//DO NOTHING YET
							}
						}.bind(this)
					});
					break;
				case "ERROR":
					sap.m.MessageBox[sMessageBoxType](sMessage, {
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								//DO NOTHING YET
							}
						}.bind(this)
					});
					break;

			}

		},

		onSubmit: function() {
			//console.log(this.data);
			var msgConfrm = this.getView().getModel("i18n").getResourceBundle().getText("msgConfrm");
			this._handleMessageBoxOpen(msgConfrm, "confirm", "SUBMIT");
		},

		_submitResponse: function() {
			var oModelRequest = new sap.ui.model.odata.v2.ODataModel(
				"/sap/opu/odata/sap/ZSDGW_SO_CREATE_SRV_01/", {
					json: true
				}, "", ""
			);
			// Set POST request header using the X-CSRF token
			oModelRequest.setHeaders({
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/json",
				"charset": "utf-8",
				"Accept": "application/atom+xml,application/atomsvc+xml,application/xml"
			});

			// Call the create request	
			var that = this;
			oModelRequest.create("/SOCreateSet/", this.data, {
				method: "POST",
				success: function(data) {
					//console.log("in post");
					//console.log(data);
					that._purchaseDone(data);
				},
				error: function() {
					var msgErrorPreOrd = this.getView().getModel("i18n").getResourceBundle().getText("msgErrorPreOrd");
					that._handleMessageBoxOpen(msgErrorPreOrd, "error", "ERROR");
					//alert(JSON.stringify(data));
				}
			});

		},

		_purchaseDone: function(data) {
			var msgE = "";
			var msgI = "";
			var msgW = "";
			console.log("sales order: " + data.SalesOrder);
			console.log(data);
			for (var i = 0; i < data.EtReturnSet.results.length; i++) {
				if (data.EtReturnSet.results[i].Type === "E") {
					msgE = data.EtReturnSet.results[i].Message;
					console.log("Mensaje de Errores:" + msgE);
					break;
				} else if (data.EtReturnSet.results[i].Type === "I") {
					msgI = data.EtReturnSet.results[i].Message;
					console.log("Mensaje de Errores:" + msgI);
					break;
				} else if (data.EtReturnSet.results[i].Type === "W") {
					msgW = msgW + " -- " + data.EtReturnSet.results[i].Message;
					console.log("Mensaje de Errores:" + msgW);
				}
			}
			
			var msgSuccess_1 =  this.getView().getModel("i18n").getResourceBundle().getText("msgSuccess_1");
			var msgSuccess_2 =  this.getView().getModel("i18n").getResourceBundle().getText("msgSuccess_2") + " " + "[" +
								this.getView().getModel("i18n").getResourceBundle().getText("remake") + "].";
			var msgSuccess_3 =  this.getView().getModel("i18n").getResourceBundle().getText("msgSuccess_3");
			var msgSuccess = msgI + "\n\n" + msgSuccess_1 + "\n\n";
			msgSuccess = msgSuccess + msgSuccess_2 + "\n\n";
			msgSuccess = msgSuccess + msgSuccess_3;
			//msgSuccess = msgSuccess + "\n\n" + msgI;
			//msgSuccess = msgSuccess + "\n\n" + msgW;
			
			
			var msgError_1 =  this.getView().getModel("i18n").getResourceBundle().getText("msgError_1");
			var msgError_2 =  this.getView().getModel("i18n").getResourceBundle().getText("msgError_2");
			var msgError_3 =  this.getView().getModel("i18n").getResourceBundle().getText("msgError_3");
			var msgError_4 =  this.getView().getModel("i18n").getResourceBundle().getText("msgError_4");
			var msgError = msgE;
			msgError = msgError + "\n\n" + msgError_1 + " " + this.supportPhone;
			msgError = msgError + " " + msgError_2 + " " + this.supportEmail + "\n\n";
			msgError = msgError + msgError_3 + "\n\n";
			msgError = msgError + msgError_4;
			
			var oops =  this.getView().getModel("i18n").getResourceBundle().getText("oops");
			if (!data.SalesOrder.length) {
				this.getView().byId("_purchasePage").setProperty("text", oops);
				this.getView().byId("_purchasePage").setProperty("icon", "sap-icon://message-error");
				this.getView().byId("_purchasePage").setProperty("description", msgError);
			} else {
				this.getView().byId("_purchasePage").setProperty("text", data.SalesOrder);
				this.getView().byId("_purchasePage").setProperty("showHeader", false);
				this.getView().byId("_purchasePage").setProperty("description", msgSuccess);
			}

			//nav to Purchase Pagethis.getView().byId("wizardNavContainer").to(this._oWizardPurchasePage);
			//console.log(this.getView().byId("wizardPurchasePage"));
			this.navCon.to(this.getView().byId("purchasePage"), "slide");

		},

		hideBusyIndicator: function() {
			jQuery.sap.require("sap.ui.core.BusyIndicator");
			sap.ui.core.BusyIndicator.hide();
		},

		showBusyIndicator: function(iDuration, iDelay) {
			jQuery.sap.require("sap.ui.core.BusyIndicator");
			sap.ui.core.BusyIndicator.show(iDelay);

			if (iDuration && iDuration > 0) {
				if (this._sTimeoutId) {
					jQuery.sap.clearDelayedCall(this._sTimeoutId);
					this._sTimeoutId = null;
				}

				this._sTimeoutId = jQuery.sap.delayedCall(iDuration, this, function() {
					this.hideBusyIndicator();
				});
			}
		},

		verifypurchase: function(evt) {
			this.items = this.materialList.getItems();
			this.prefixView = this.getView().createId("").replace("--", "");
			this.inputId = "input-" + this.prefixView + "--materialList-";
			if (this.materialList.getSelectedItem().data("UnitSales")==="L"){
			var _qtyMsg = this.getView().getModel("i18n").getResourceBundle().getText("qtyMsgf");
			}else{
			 _qtyMsg = this.getView().getModel("i18n").getResourceBundle().getText("qtyMsga");
			}
			var _caleMsg = this.getView().getModel("i18n").getResourceBundle().getText("caleMsg");
			var _refMsg = this.getView().getModel("i18n").getResourceBundle().getText("refMsg");
			var auxInputId = "";
			var referenceNo = this.getView().byId("referenceNo").getValue();
			for (var i = 0; i < this.items.length; i++) {
				if (this.items[i].getProperty("selected")) {
					auxInputId = this.inputId + i;
					this.getView().byId(auxInputId).setEnabled(true);
					//if (!(this.getView().byId(auxInputId).getValue() > 0)) {
					if (!(this.orderQty > 0)) {
						this._handleMessageBoxOpen(_qtyMsg, "warning", "QUANTITY");
					} else if (!this.oDateH) {
						this._handleMessageBoxOpen(_caleMsg, "warning", "CALENDAR");
					} else if (!referenceNo){
						this._handleMessageBoxOpen(_refMsg, "warning", "REFER");
					} 
					else {
						this.getView().byId(auxInputId).setValueState("None");
						this._fillReview();
						var target = evt.getSource().data("target");
						this.navCon.to(this.getView().byId(target), "slide");

				//		console.log(this.data);
					}
				}
			}
		},

		validateQty: function(oEvent) {
			var regex = /^[0-9]*$/gi;
			var value = oEvent.getParameter("value");
		    var newValue = this.numberFormat.format(+value);
		    value = newValue;
		    this.orderQty = newValue;
		  //console.log("this.orderQty " + this.orderQty);
		  //console.log("this.materialList.getSelectedItem().data(UnitSales) es:" + this.materialList.getSelectedItem().data("UnitSales"));
		  //+++++++Cantidades Maximas Combustibles y Aditivos
		  if (this.materialList.getSelectedItem().data("UnitSales") === "TAM")
		  {
		  	if (value <= 0) {
				this.stepBtn2.setEnabled(false);
				this.stepBtn2.setType("Default");
			} else if (value > 10){
				this.stepBtn2.setEnabled(false);
				this.stepBtn2.setType("Default");
			} 
			else {
				this.stepBtn2.setEnabled(true);
				this.stepBtn2.setType("Emphasized");
				}
		  } else {
			if (value <= 0) {
				this.stepBtn2.setEnabled(false);
				this.stepBtn2.setType("Default");
			} else if (value > 100000){
				this.stepBtn2.setEnabled(false);
				this.stepBtn2.setType("Default");
			} 
			else {
				this.stepBtn2.setEnabled(true);
				this.stepBtn2.setType("Emphasized");
			//	this.orderQty = value.replace(regex,"");
			//console.log("this.orderQty regex: " + this.orderQty);
				//this.formatQty(oEvent);
			}
		}
			/*	if (oEvent.getParameter("value") > 0) {
					this.stepBtn2.setEnabled(true);
					this.stepBtn2.setType("Emphasized");
					this.formatQty(oEvent);
				} else {
					this.stepBtn2.setEnabled(false);
					this.stepBtn2.setType("Default");
				}*/
		},

		/*	formatQty: function(oEvent) {

				this.orderQty = oEvent.getParameter("value");
				console.log("entra: " + this.orderQty);
				this.orderQty.replace(/^[0-9]*$/g, "");
				console.log("sale: " + this.orderQty);
				
				var newValue = this.numberFormatNoFrag.format(+this.orderQty);
				var auxInputId = null;
				console.log(newValue);
				for (var i = 0; i < this.items.length; i++) {
					if ((this.items[i].getProperty("selected")) && (newValue > 0)) {
						auxInputId = this.inputId + i;
						//this.oModelMaterial.setProperty("/d/results/" + i + "/Quantity", newValue);
						this.stepBtn2.setEnabled(true);
						this.stepBtn2.setType("Emphasized");
						this.getView().byId(auxInputId).setValue(newValue);
						this.oModelMaterial.refresh(true);
						console.log("asigno");
					}
				}
			},*/

		handleCalendarSelect: function(oEvent) {
			var oCalendar = oEvent.oSource;
			this._updateText(oCalendar);
		},

		_updateText: function(oCalendar) {
			//var oText = this.getView().byId("selectedDate");
			var aSelectedDates = oCalendar.getSelectedDates();

			if (aSelectedDates.length > 0) {
				this.oDateH = aSelectedDates[0].getStartDate();
				this.reqDateH = this.oFormatYyyymmdd.format(this.oDateH);
				//console.log("this.reqDateH:" + this.reqDateH);
				//console.log("this.oDateH:" + this.oDateH);
				//	oText.setText(this.oDateH);
				//	this.getView().byId("CreateProductWizard").validateStep(this.getView().byId("selectDate"));
			}
		},

		selectFuels: function(oEvent) {
			
			this.handleNewDate("C");
			this.controlSelect = true;
			this.materialList.setModel(this.oModelMatFuel, "modelMaterial");
			var _footerMaterial = this.getView().getModel("i18n").getResourceBundle().getText("footerMaterial");
			this.materialList.setVisible(true);
			this.materialList.setProperty("footerText", _footerMaterial);
			this.handleSelectMaterial(oEvent);
			this.getView().byId("fuelsBtn").setType("Emphasized");
			this.getView().byId("fuelsBtn").setEnabled(false);
			this.getView().byId("addsBtn").setEnabled(true);
			this.getView().byId("addsBtn").setType("Default");
			this.stepBtn2.setType("Default");
			this.stepBtn2.setEnabled(false);
		},

		selectAdds: function(oEvent) {
			this.handleNewDate("A");
			this.controlSelect = false;
			this.materialList.setModel(this.oModelMatAdds, "modelMaterial");
			var _footerMaterial = this.getView().getModel("i18n").getResourceBundle().getText("footerMateriala");
			this.materialList.setVisible(true);
			this.materialList.setProperty("footerText", _footerMaterial);
			this.handleSelectMaterial(oEvent);
			this.getView().byId("addsBtn").setType("Emphasized");
			this.getView().byId("addsBtn").setEnabled(false);
			this.getView().byId("fuelsBtn").setEnabled(true);
			this.getView().byId("fuelsBtn").setType("Default");
			this.stepBtn2.setType("Default");
			this.stepBtn2.setEnabled(false);
			
		},

		assignMaterialList: function() {
			var sServiceUrl = "/sap/opu/odata/sap/ZSDGW_SO_CREATE_SRV_01/Bill_ToSet('" + this.globalId + "')/SHIP_TOSet(SoldTo='" + this.soldTo +
				"',ShipTo='" + this.gasStationId + "',SalesOrg='" + this.salesOrg + "',DistrChan='" + this.distrChan + "',Plant='" + this.gasPlant +
				"')/MaterialsSet";

			this.oModelMaterial = new sap.ui.model.json.JSONModel();
			this.oModelMaterial.loadData(sServiceUrl);
			this.oModelMaterial.refresh(true);

			var that = this;

			this.fuelData = [];
			this.addsData = [];

			this.oModelMaterial.attachRequestCompleted(function() {

				var data = that.oModelMaterial.getData();
				var fuelsCode = "G001";
			    var unitG = null;
				for (var i = 0; i < data.d.results.length; i++) {
					if ((data.d.results[i].UnitSales <= 0) || !(data.d.results[i].UnitSales)) {
							data.d.results[i].UnitSales = data.d.results[i].UnitBase;
						}
					if (data.d.results[i].Group == fuelsCode) {
						that.fuelData.push({
							BillTo: data.d.results[i].BillTo,
							Currency: data.d.results[i].Currency,
							Description: data.d.results[i].Description,
							DistrChan: data.d.results[i].DistrChan,
							Group: data.d.results[i].Group,
							GroupDescr: data.d.results[i].GroupDescr,
							Material: data.d.results[i].Material,
							NetValue: data.d.results[i].NetValue,
							Plant: data.d.results[i].Plant,
							//Quantity: data.d.results[i].Quantity,
							Quantity: 20000,
							SalesOrg: data.d.results[i].SalesOrg,
							ShipTo: data.d.results[i].ShipTo,
							SoldTo: data.d.results[i].SoldTo,
							UnitBase: data.d.results[i].UnitBase,
							UnitDescription: data.d.results[i].UnitDescription,
							UnitSales: data.d.results[i].UnitSales
						});

					} else {
						that.addsData.push({
							BillTo: data.d.results[i].BillTo,
							Currency: data.d.results[i].Currency,
							Description: data.d.results[i].Description,
							DistrChan: data.d.results[i].DistrChan,
							Group: data.d.results[i].Group,
							GroupDescr: data.d.results[i].GroupDescr,
							Material: data.d.results[i].Material,
							NetValue: data.d.results[i].NetValue,
							Plant: data.d.results[i].Plant,
							//Quantity: data.d.results[i].Quantity,
							Quantity: 1,
							SalesOrg: data.d.results[i].SalesOrg,
							ShipTo: data.d.results[i].ShipTo,
							SoldTo: data.d.results[i].SoldTo,
							UnitBase: data.d.results[i].UnitBase,
							UnitDescription: data.d.results[i].UnitDescription,
							UnitSales: data.d.results[i].UnitSales
						});

					}
				}

				that.oModelMatFuel = new sap.ui.model.json.JSONModel();
				that.oModelMatFuel.setData(that.fuelData);

				if (that.addsData.length) {
					that.oModelMatAdds = new sap.ui.model.json.JSONModel();
					that.oModelMatAdds.setData(that.addsData);
					that.getView().byId("addsBtn").setVisible(true);
					that.getView().byId("fuelsBaseBtn").setVisible(true);
					that.getView().byId("fuelsBtn").setVisible(false);
					//Mostrar por Default la lista de Combustibles
					that.getView().byId("fuelsBtn").firePress();
				} else {
					that.getView().byId("addsBtn").setVisible(false);
					that.getView().byId("fuelsBaseBtn").setVisible(false);
					that.getView().byId("fuelsBtn").setVisible(true);
					//Mostrar por Default la lista de Combustibles
					that.getView().byId("fuelsBtn").firePress();
				}

			});

		},

		_fillReview: function() {
			var itemsList = this.materialList.getSelectedItems();
			var client = this.globalId;
			var gasStationName = this.gasStationList.getSelectedItem().getProperty("title");
			var salesOrg = this.gasStationList.getSelectedItem().data("salesOrg");
			var gasStreet = this.gasStationList.getSelectedItem().data("street");
			var gasCity = this.gasStationList.getSelectedItem().data("city");
			var gasShippment = this.gasStationList.getSelectedItem().data("shippment");

			var shipTo = this.gasStationList.getSelectedItem().data("shipTo");
			var soldTo = this.gasStationList.getSelectedItem().data("soldTo");
			var postalCode = this.gasStationList.getSelectedItem().data("postalCode");
			var distrChan = this.gasStationList.getSelectedItem().data("distrChan");
			var division = this.gasStationList.getSelectedItem().data("division");
			var shipCond = this.gasStationList.getSelectedItem().data("shipCond");
			var referenceNo = this.getView().byId("referenceNo").getValue();
			var selectedDate = this.reqDateH;
			var deliveryDate = this.oFormatDateDetail.format(this.oDateH);

			this.currency = this.materialList.getSelectedItem().data("Currency");

			var _deliveryLabel = this.getView().getModel("i18n").getResourceBundle().getText("deliveryLabel");
			var _referencelabel = this.getView().getModel("i18n").getResourceBundle().getText("referencelabel");

			var msgDelivery = "<p><strong>" + _deliveryLabel + "</strong> " + deliveryDate + "</p>";
			this.getView().byId("Delivery").setHtmlText(msgDelivery);

			if (referenceNo) {
				var msgReferred = "</br><p><strong>" + _referencelabel + "</strong> " + referenceNo + "</p>";
				this.getView().byId("Reference").setHtmlText(msgReferred);
			}

			var gasStation = this.gasStationList.getSelectedItem().data("shipTo");
			this.hostName = this.locationInit.origin; 
			var urlHeader = this.hostName + "/sap/opu/odata/sap/ZSDGW_SO_CREATE_SRV_01/SOCreateSet('1000')";
			this.data = {
				"d": {
					"__metadata": {
						"id": urlHeader,
						"uri": urlHeader,
						"type": "ZSDGW_SO_CREATE_SRV_01.SOCreate"
					},
					"Tmpid": "1000",
					"ReqDateH": selectedDate,
					"DocType": this.DocType,
					"SalesOrg": salesOrg,
					"DistrChan": distrChan,
					"Division": division,
					"Ref1": "",
					"PurchNoC": referenceNo,
					"Ref1S": "",
					"ShipCond": shipCond,
					"Currency": this.currency,
					"ShipTo": shipTo,
					"SoldTo": soldTo,
					"Testrun": "",
					"SalesOrder": "",
					"ItItemsSet": [],
					"EtReturnSet": []
				}
			};

			var dataReview = [];

			var totalPurchase = +0;

			var inItemNumber = "10";

			var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ",",
				decimalSeparator: "."
			});

			for (var i = 0; i < itemsList.length; i++) {

				//this.materialArray.push(items[i]); //debug
				var itemNumber = inItemNumber;
				//set Item characters
				while (itemNumber.length < 6) {
					itemNumber = "0" + itemNumber;
				}

				var url = this.hostName + "/sap/opu/odata/sap/ZSDGW_SO_CREATE_SRV_01/ItItemsSet('" + itemNumber + "')";
				var txtMaterialName = itemsList[i].getProperty("label");
				var txtMaterialPrice = itemsList[i].data("Price");
				var txtMaterial = itemsList[i].data("Material");
				var txtUnit = itemsList[i].data("UnitSales");
				var txtUnitDescription = itemsList[i].data("UnitDescription");
				//var txtQty = itemsList[i].data("MaterialQty");
				var txtQty = this.orderQty;
				if(txtQty > 1) {
				txtUnitDescription = txtUnitDescription + "s";  	
				}

				txtMaterial = txtMaterial.replace(/ /g, '');

				this.data.d.ItItemsSet.push({
					"__metadata": {
						"id": url,
						"uri": url,
						"type": "ZSDGW_SO_CREATE_SRV_01.ItItems"
					},
					"Tmpid": "1000",
					"ItmNumber": itemNumber,
					"HgLvItem": "000000",
					"Material": txtMaterial,
					"MaterialLong": txtMaterial,
					"Plant": this.gasPlant,
					"StoreLoc": "",
					"TargetQty": txtQty,
					"TargetQu": txtUnit,
					"ShortText": txtMaterialName
				});

				totalPurchase = totalPurchase + (+itemsList[i].data("Price") * + +txtQty);

				txtQty = oNumberFormat.format(txtQty);

				dataReview.push({
					materialName: txtMaterialName,
					material: txtMaterial,
					materialPrice: txtMaterialPrice,
					materialUnit: txtUnit,
					materialQu: txtQty,
					materialUnitDes: txtUnitDescription
				});

				itemNumber = "";
				inItemNumber = +inItemNumber + +10;
				inItemNumber = inItemNumber.toString();
				//console.log("al terminar un ciclo itemNumber:" + itemNumber + " inItemNumber:" + inItemNumber );
			}

			//jQuery.sap.require("sap.ui.core.format.NumberFormat");
			totalPurchase = oNumberFormat.format(totalPurchase);
			
			this.getView().byId("headerObj").setTitle(gasStationName);
			this.getView().byId("headerObj").setNumber(shipTo);
			var fullAddress = gasStreet + ", " + gasCity + ", " + postalCode;
			this.getView().byId("headerObj").setAggregation("firstStatus", new ObjectStatus({
				text: fullAddress,
				state: sap.ui.core.ValueState.Success
			}));

			this.getView().byId("headerObj").setNumberUnit(gasShippment); //sacar el currency code
			//var msg = "All the purchase will be <em>charged to the account</em> of <strong>" + this.Name1 + " " + this.Name2 + "</strong>.";
			//this.getView().byId("attributes").setModel(this.oModelId,"modelId");
			var fullName = this.Name1 + " " + this.Name2;
			var dataHeader = [];
			dataHeader.push({
				uClientId: client,
				uName: fullName,
				gasStation: gasStationName,
				street: gasStreet,
				city: gasCity,
				upostalCode: postalCode,
				shippment: gasShippment,
				shipTo: shipTo,
				soldTo: soldTo,
				estimatedTotal: totalPurchase,
				currency: this.currency
			});

			var oModelHeader = new sap.ui.model.json.JSONModel();
			oModelHeader.setData(dataHeader);
			this.getView().byId("headerObj").setModel(oModelHeader, "modelHeader");
			//Panel headerText="{i18n>reviewMat}"
			if (txtUnit==="L"){
			var _reviewMat = this.getView().getModel("i18n").getResourceBundle().getText("reviewMatf");
			this.getView().byId("reviewPan").setHeaderText(_reviewMat);
			} else {
			var _reviewMat = this.getView().getModel("i18n").getResourceBundle().getText("reviewMata");
			this.getView().byId("reviewPan").setHeaderText(_reviewMat);	
			}
			var reviewModel = new sap.ui.model.json.JSONModel();
			reviewModel.setData(dataReview);
			this.getView().byId("reviewList").setModel(reviewModel, "reviewMaterial");
			//console.log("***********");
			//console.log(reviewModel);
			//console.log("***********");

			//console.log(this.data);

		}

	});
});