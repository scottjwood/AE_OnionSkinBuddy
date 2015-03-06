{
function scottPanel(thisObj) {
	var onionArray = []; // array to hold created layers
	var frameTime = .04; // float for a single frame
	var skinInput; // how many skins on each side
	var opacityInput; // starting opacity for skins
	var skinFrameInput; // stagger skins every x frames
	var onionBefore = true;
	var onionAfter = true;
	var colorBefore = [0, .93, .99]; // blue
	var colorAfter = [.98, 0, .99]; // purple

	function scottPanel_buildUI(thisObj) {
		var onionSkinnerPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Onion Skin Buddy", [100, 100, 300, 280]);//

		// add buttons
		var skinText = onionSkinnerPanel.add("statictext", [10,10,110,30], "# of skins");
		skinInput = onionSkinnerPanel.add("edittext", [70,10,110,30], "4");
		var opacityText = onionSkinnerPanel.add("statictext", [10,40,110,60], "Opacity of skins");
		opacityInput = onionSkinnerPanel.add("edittext", [100,40,130,60], "50");
		var skinFrameText = onionSkinnerPanel.add("statictext", [10,65,110,85], "Skin every x frames");
		skinFrameInput = onionSkinnerPanel.add("edittext", [120,65,150,85], "2");
		
		var buttonMakeOnion = onionSkinnerPanel.add("button", [10,90,180,110], "Make Onion");
		var buttonRemoveOnion = onionSkinnerPanel.add("button", [10,115,180,135], "Remove Onions");
		var buttonRefreshOnion = onionSkinnerPanel.add("button", [10,140,180,160], "Refresh Onions");
		
		buttonMakeOnion.onClick = makeOnionSkin;
		buttonRemoveOnion.onClick = removeOnionSkin;
		buttonRefreshOnion.onClick = refreshOnionSkin;

		return onionSkinnerPanel;
	} // End of panel creation

	function makeOnionSkin() {
		var activeItem = app.project.activeItem;   
		// make sure a Comp is currently active
		if (activeItem == null || !(activeItem instanceof CompItem)){
			alert("Select layer before running this script");
		} else {
			// make sure one layer is selected
			if (activeItem.selectedLayers.length != 1) {
				alert("Select layer before running this script");
			} else {         
				var theLayer = activeItem.selectedLayers[0];
				theLayer.selected = false; // deselect layer so no edits are made to it

				if (onionBefore) onionMaker(theLayer, true, colorBefore); // offset layers before
				
				if (onionAfter) onionMaker(theLayer, false, colorAfter); // offset layers after
                
                theLayer.selected = true; // reselect original layer after onions are created
		   }
		}
	}
	function onionMaker(startLayer, before, overlayColor) {
		var opacityStart = parseInt(opacityInput.text);
		var skinInputInt = parseInt(skinInput.text);
		var skinFrameInputInt = parseInt(skinFrameInput.text);
		// set opacity, the "-1" is to keep it from setting 0 opacity
		var opacityChange = (opacityStart/skinInputInt)-1;
		for (var i = 0; i < skinInputInt; i++){
			onionLayer = startLayer.duplicate();
			onionLayer.moveAfter(startLayer);
			var frameSkip = frameTime*(skinFrameInputInt*(i+1));

			// check if layer is before or after
			if (before == true) {
				onionLayer.startTime = onionLayer.startTime + frameSkip;
			} else {
				onionLayer.startTime = onionLayer.startTime - frameSkip;
			}
			onionLayer.blendingMode = BlendingMode.MULTIPLY;
			onionLayer.label = 13;
			onionLayer.opacity.setValue(opacityStart);
			opacityStart = opacityStart - opacityChange; // incrementally decrease opacity
			onionLayer.name = "Onion Skin";
			onionLayer.selected = true; // make sure new layer selected
			app.executeCommand(app.findMenuCommandId("Color Overlay")); // add color overlay to new layer
			var overlayGroup = onionLayer.property("ADBE Layer Styles").property("solidFill/enabled");
			// set overlay color
			if (overlayGroup.canSetEnabled){
				// if so, it means that the overlay group has been revealed and its values can be modified
				overlayGroup.property("solidFill/color").setValue(overlayColor);
			}
				else alert("layer("+layer.index+") overlay cannot be modified, it is not enabled.");
			
			onionLayer.shy = true;
			onionLayer.locked = true;
			onionArray.push(onionLayer);
			onionLayer.selected = false;
		}
	}
	function removeOnionSkin() {
		for (var i = 0; i < onionArray.length; i++) {
			onionArray[i].locked = false;
			onionArray[i].remove();
		}
		onionArray = [];
	}
	function refreshOnionSkin() {
		removeOnionSkin();
		makeOnionSkin();
	}

///  Check if panel is floating window or dockable
	var scriptPal = scottPanel_buildUI(thisObj);
	if ((scriptPal != null) && (scriptPal instanceof Window)) {
		scriptPal.center();
		scriptPal.show();
		}
	}
	scottPanel(this);
}
