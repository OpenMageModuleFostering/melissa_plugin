	$(document).ready(function() {
		var pGress = setInterval(function() {
				doGawsWebCall();
				return false;
		}, 3000);
		
		// global variables here
		var MAX_SHOW_RESULTS 					= 25; // how many results to fetch & show?
		var MAX_LENGTH_GEE_FIELDED_BLOCK 		= 225; // how many pixel width
		var MAX_LENGTH_GEE_SINGLELINE_BLOCK 	= 450; // how many pixel width
	
		// todo: billing && shipping,  $('#checkout-step-shipping').append(function(i, re) {
	
		// append our Autocompletion field to Magento top					
		var insert_string = '<br /><p><table id="autocomplete_melissadata_fielded" border="0px;"><tbody style="font-weight: bold; font-size: 140%;"><b>Melissa Data Fielded Autocompletion Support:</b></tbody><tr width="'+(3*MAX_LENGTH_GEE_FIELDED_BLOCK)+'px"><td><br /></td></tr><tr style="clear:both;"><td width="'+MAX_LENGTH_GEE_FIELDED_BLOCK+'px"><input type="text" value="" placeholder="1. Step: Type Country Name" title="Start typing a country name to get Suggestions" id="CountrySuggestions" style="width: '+MAX_LENGTH_GEE_FIELDED_BLOCK+'px;" /><span id="showCountryResults" style="width:150px;height:75px;line-height:3em;overflow:auto;padding:5px;"></span></td><td width="'+MAX_LENGTH_GEE_FIELDED_BLOCK+'px"><input type="text" value="" placeholder="2. Step: Type Postal Code" title="Start typing a Postal code to get Suggestions from within that Country" id="PostalCodeSuggestions" style="width: '+MAX_LENGTH_GEE_FIELDED_BLOCK+'px;" /><span id="showPostalCodeResults" style="width:150px;height:75px;line-height:3em;overflow:auto;padding:5px;"></span></td><td width="'+MAX_LENGTH_GEE_FIELDED_BLOCK+'px"><input type="text" value="" placeholder="3. Step: Type House Number and Street Name" title="Start typing a street name to get suggestions for them within that Postal code range in that country" id="StreetSuggestions" style="width: '+MAX_LENGTH_GEE_FIELDED_BLOCK+'px;" /><span id="showStreetResults" style="height:75px;line-height:3em;overflow:auto;padding:5px;"></span></td></tr></table></p><br /><br /><br /><br /><p><table id="autocomplete_melissadata_singlerow" border="0px;"><tbody style="font-weight: bold; font-size: 140%;"><b>Melissa Data Single Row Autocompletion Support:</b></tbody><tr width="" style="clear:both;"><td><br /></td></tr><tr style="clear:both;"><td width="'+MAX_LENGTH_GEE_FIELDED_BLOCK+'px"><input type="text" value="" placeholder="1. Step: Type Country Name" title="Start typing a country name to get Suggestions" id="CountrySuggestionsSingleRow" style="width: '+MAX_LENGTH_GEE_FIELDED_BLOCK+'px;" /><span id="showCountryResultsSingleRow" style="height:75px;line-height:3em;overflow:auto;padding:5px;"></span></td><td width="'+MAX_LENGTH_GEE_SINGLELINE_BLOCK+'px"><input type="text" value="" placeholder="2. Step: Type House Number and Street Name" title="Start typing a Postal code & Address to get Suggestions from within that Country" id="AddressSuggestionsSingleRow" style="width: '+MAX_LENGTH_GEE_SINGLELINE_BLOCK+'px;" /><span id="showAddressResultsSingleRow" style="width: '+MAX_LENGTH_GEE_SINGLELINE_BLOCK+'px; height:75px;line-height:3em;overflow:auto;padding:5px;"></span></td></tr></table></p><br /><br /><span id="gawsresults_top"></span><br />';
			
		$( insert_string ).insertBefore("#checkout-step-billing");
					
		var insert_gawsresults = '<input name="billing[fax]" title="Fax" class="input-text " id="billing:fax" type="tel"><br /><br /><span id="gawsresults"></span>';
		$( insert_gawsresults ).insertAfter("#billing\\:fax");	
		
		// Set the Country ISO 2 Code Result from GEE Country to corresponding Magento Field
		$('#showCountryResults').on("click", function(){
			var iso2Code 		= $("#showCountryResults").find(":selected").val();
			var isoName 		= $("#showCountryResults").find(":selected").text();
			var html_country 	= '<option selected value="'+iso2Code+'">'+isoName+'</option>';
			$(".field .input-box #billing\\:country_id").html(html_country);
			//var check = $(".field .input-box #billing\\:country_id").val();
			
			$('#PostalCodeSuggestions').focus();
			$('#showPostalCodeResults').focus();
			
			//console.log("checking selected option:"+check);
		}); // $('#showCountryResults').on("click", function(){
		
		// set the postal code from the GEE Postal Code Endpoint to Magento fields
		$('#showPostalCodeResults').on("click", function(){
			var locality 		= $("#showPostalCodeResults").find(":selected").val();
			var postalcode 		= $("#showPostalCodeResults").find(":selected").attr("pc");
						
			var iso2Code 		= $("#showCountryResults").find(":selected").val();
			var isoName 		= $("#showCountryResults").find(":selected").text();
			var html_country 	= '<option selected value="'+iso2Code+'">'+isoName+'</option>';
			
			$(".field .input-box #billing\\:country_id").html(html_country);
			$(".field .input-box #billing\\:city").val(locality);
			$(".field .input-box #billing\\:postcode").val(postalcode);
			
			// reset street if clicked to postal code
			$("#billing\\:street1").val("");
			$("#showStreetResults").val("");
			$("#showStreetResults").html("");
			$("#StreetSuggestions").val("");
			$("#StreetSuggestions").html("");
			//$("#StreetSuggestions").focus();
			$("#showStreetResults").focus();
			$("#StreetSuggestions").focus();
			//console.log("PostalCode Click: locality:"+locality, "postalcode:" + postalcode);
		}); // $('#showPostalCodeResults').on("click", function(){
		
		$('#showCountryResultsSingleRow').on("click", function(){		
			
			// reset street if clicked to postal code
			$("#showAddressResultsSingleRow").html("");
			$("#showAddressResultsSingleRow").val("");
			$("#AddressSuggestionsSingleRow").html("");
			$("#AddressSuggestionsSingleRow").val("");
			$("#AddressSuggestionsSingleRow").focus();
			
			$('#showAddressResultsSingleRow').focus();
			$('#AddressResultsSingleRow').focus();
			//console.log("PostalCode Click: locality:"+locality, "postalcode:" + postalcode);
		}); // $('#showPostalCodeResults').on("click", function(){
		
		// set the street information from the GEE Address Endpoint to Magento fields
		$('#showStreetResults').on("click", function(){
			var locality 		= $("#showPostalCodeResults").find(":selected").val();
			//var postalcode 	= $("#showPostalCodeResults").find(":selected").text();
			var postalcode 		= $("#showPostalCodeResults").find(":selected").attr("pc");
			var deliveryaddr	= $("#showStreetResults").find(":selected").text();
			var adminarea		= $("#showPostalCodeResults").find(":selected").attr("aarea");
			var adminarea_name	= $("#showStreetResults").find(":selected").attr("aarea");
			
			var iso2Code 		= $("#showCountryResults").find(":selected").val();
			var isoName 		= $("#showCountryResults").find(":selected").text();
			var html_country 	= '<option selected value="'+iso2Code+'">'+isoName+'</option>';
			var html_state 		= '<option selected value="'+adminarea+'">'+adminarea_name+'</option>';
			
			$(".field .input-box #billing\\:city").val(locality);
			$(".field .input-box #billing\\:postcode").val(postalcode);
			$("#billing\\:street1").val(deliveryaddr);
			$(".field .input-box #billing\\:country_id").html(html_country);
			$(".field .input-box #billing\\:region_id").html(html_state);
			
		//	console.log("PostalCode Click: locality:"+locality, "postalcode:" + postalcode, "Addr:"+deliveryaddr);
		}); // $('#showStreetResults').on("click", function(){
		
		// set the street information from the GEE Free Form Endpoint to Magento fields
		$('#showAddressResultsSingleRow').on("click", function(){
			var locality 		= $("#showAddressResultsSingleRow").find(":selected").attr("loc");
			var postalcode 		= $("#showAddressResultsSingleRow").find(":selected").attr("pc");
			var deliveryaddr	= $("#showAddressResultsSingleRow").find(":selected").attr("deliver");
			var adminarea		= $("#showAddressResultsSingleRow").find(":selected").attr("aarea");
			var simpleaddr		= $("#showAddressResultsSingleRow").find(":selected").attr("simpleaddr");
			
			var iso2Code 		= $("#showCountryResultsSingleRow").find(":selected").val();
			var isoName 		= $("#showCountryResultsSingleRow").find(":selected").text();
			var html_country 	= '<option selected value="'+iso2Code+'">'+isoName+'</option>';
			var html_state 		= '<option selected value="'+adminarea+'">'+adminarea+'</option>';
			
			$(".field .input-box #billing\\:city").val(locality);
			$(".field .input-box #billing\\:postcode").val(postalcode);
			$("#billing\\:street1").val(deliveryaddr);
			$("#billing\\:street2").val();
			$(".field .input-box #billing\\:country_id").html(html_country);
			$(".field .input-box #billing\\:region_id").html(html_state);
			
			//console.log("PostalCode Click: locality:"+locality, "postalcode:" + postalcode, "Addr:"+deliveryaddr);
		}); // $('#showStreetResults').on("click", function(){
		
		// check for GEE cookie
		Cookies.set('MelissaDataMagento_GEE_Token', "111466882");
		Cookies.set('MelissaDataMagento_GEE_TimeStamp', $.now() );

		var isGeeTokenCookie 		= Cookies.get('MelissaDataMagento_GEE_Token');
		var isGeeTimeStampCookie 	= Cookies.get('MelissaDataMagento_GEE_TimeStamp');	

		// Later more services
		var isGawsTokenCookie 		= Cookies.get('MelissaDataMagento_GAWS_Token');
		var isGawsTimeStampCookie 	= Cookies.get('MelissaDataMagento_GAWS_TimeStamp');			
		var isEmailTokenCookie 		= Cookies.get('MelissaDataMagento_EMAIL_Token');
		var isEmailTimeStampCookie 	= Cookies.get('MelissaDataMagento_EMAIL_TimeStamp');		
		var isNameTokenCookie 		= Cookies.get('MelissaDataMagento_NAME_Token');
		var isNameTimeStampCookie 	= Cookies.get('MelissaDataMagento_NAME_TimeStamp');		
		var isPhoneTokenCookie 		= Cookies.get('MelissaDataMagento_PHONE_Token');
		var isPhoneTimeStampCookie 	= Cookies.get('MelissaDataMagento_PHONE_TimeStamp');		

		if (isGeeTokenCookie == undefined || isGeeTimeStampCookie == undefined ){
		//	alert("Cookie existiert nicht und oder TimeStamp existiert nicht");
		}

		// later add validity check for Timestamp so that we make sure token is valid for request
		// if cookie is undefined, that means no cookie is existing with valid information		
		if ( isGeeTokenCookie == undefined || isGeeTimeStampCookie == undefined  ) { 
			
			//alert("In cookie");
			//no cookie so make Token Server call
			$.ajax({
				url: "http://www.melissadata.de/demonstration/tokenserver_gee_magento.asp",
								//url: "https://token.melissadata.net/v3/web/Service.svc/RequestToken?L=DGZahU25W0nQv9fUJ2zdMG==NlXZ792A3KHu9S3pscyFGM==OWkrOXfySi1i1etA/JOY0J==&P=pkgExpressEntry",				
				async: false, // dont change!
				cache: false,
				error: function(errmessage) {
					//console.log("errmessage object: %o", errmessage);
					//$('#results').html('<p>An error has occurred: '+errmessage+"</p>");
					console.log("error while making token server request:");
				},
				dataType: "jsonp",
				success: function(data) {
					Cookies.set('MelissaDataMagento_GEE_Token', data);
					Cookies.set('MelissaDataMagento_GEE_TimeStamp', $.now() );
					console.log("Cookie successfully set");
				} // success
			}) // $.ajax({})

			// debug
			//alert($.cookie('MelissaDataMagento_GEE_Token'));		
		} // if ( isGeeTokenCookie == undefined || isGeeTimeStampCookie == undefined  ) { 

		var my_token 		= Cookies.get('MelissaDataMagento_GEE_Token');
		
		// Global Express Entry
		var urlGeePC_Real 	= "https://expressentry.melissadata.net/jsonp/GlobalExpressPostalCode";
		var urlGeeCN_Real 	= "https://expressentry.melissadata.net/jsonp/GlobalExpressCountry";
		var urlGeePC_Real	= "https://expressentry.melissadata.net/jsonp/GlobalExpressPostalCode";
		var urlGeeAd_Real   = "https://expressentry.melissadata.net/jsonp/GlobalExpressAddress";
		var urlGeeFF_Real	= "https://expressentry.melissadata.net/jsonp/GlobalExpressFreeForm";
		
		// Global Address Verification
		var urlGaws_Real	= "https://address.melissadata.net/V3/WEB/GlobalAddress/doGlobalAddress";
				
		$('#AddressSuggestionsSingleRow').autocomplete({
			showHeader: 	true, 
			minLength: 		1, 
			delay: 			55,
			source: function( request, response ){
				$.ajax({
				  url: 		urlGeeFF_Real,
				  dataType: "jsonp",
				  data: {
					maxrecords: 	MAX_SHOW_RESULTS,
					ff: 			$("#AddressSuggestionsSingleRow").val(),
					country: 		$("#showCountryResultsSingleRow").find(":selected").val(),
					id: 			my_token,		
					format: 		"jsonp",
					nativecharset: 	false,
				  },
				  success: function( data ){
						//console.log("data:" +data );
						var parts_addr 			= new Array();
						var arr_addr_options 	= new Array();
						var parts_addr_count	= 1;
						
						var select_block_size = MAX_LENGTH_GEE_SINGLELINE_BLOCK + 100;
						
						arr_addr_options.push('<select style="width: '+select_block_size+'px;" size="10">');
						
						var string 		= JSON.stringify(data);
						var obj 		= $.parseJSON(string);
						
						var string2 	= JSON.stringify(obj.Results);
						var obj2 		= $.parseJSON(string2);
						
						var rand = Math.random();
						console.log("Random id:" + rand);
						var resultHtmlAddr 	= traverseAddrSingle(obj2);

						arr_addr_options.push(resultHtmlAddr);
						arr_addr_options.push('</select>');
						var addr_html 	= arr_addr_options.join("");
						
						//console.log("POSTALCOOOODEEE: " + pc_html);
						$("#showAddressResultsSingleRow").html(addr_html);
						
						// reset array
						parts_addr 		= [];
						
						function traverseAddrSingle(o){
							var pc = "";
							var lc = "";
							var addr = "";
							for (i in o) {
							//	pc = o.PostalCodePrimary; 
							//	lc = o.Locality;
								
								var cntryyy= $("#showCountryResultsSingleRow").find(":selected").val();
								addr 		= o.Address;
								simpleaddr 	= o.Address2;
								loc 		= o.Locality;
								pc 			= o.PostalCode;
								aarea 		= o.AdministrativeArea;
								deliver 	= o.DeliveryAddress;
								
								//console.log("cntryyy: "+cntryyy+" loc="+lc+" pc="+pc+" simpleaddr="+simpleaddr+" aarea="+aarea+" deliver="+deliver);
								//addr = o.DeliveryAddress;
								if (((typeof addr != "undefined") && (typeof addr.valueOf() == "string")) && (addr.length > 0)) {
									if (parts_addr_count >= 0){
										parts_addr.push('<option selected value="'+addr+'" loc="'+loc+'" pc="'+pc+'" aarea="'+aarea+'" simpleaddr="'+simpleaddr+'" deliver="'+deliver+'">'+addr+'</option>');
										parts_addr_count++;
									} else if ( parts_addr_count >= 2 && parts_addr_count <= MAX_SHOW_RESULTS ){
										parts_addr.push('<option value="'+addr+'" loc="'+loc+'" pc="'+pc+'" aarea="'+aarea+'" simpleaddr="'+simpleaddr+'" deliver="'+deliver+'">'+addr+'</option>');
										parts_addr_count++;
									}
								} // if strict check
								if (typeof(o[i])=="object") {
								//	console.log("key:" + i, "value:"+o[i])
									//console.log("key:" + i.PostalCodePrimary, "value:"+o[i.PostalCodePrimary])
									traverseAddrSingle(o[i]);
								} // if (typeof(o[i])=="object") {
							} // for (i in o) {
							//return parts_addr.join("");
							return uniqAddr(parts_addr).join("");
						}   // function traverseAddrSingle(o){
												
						function uniqAddr(a) {
							var seen = {};
							return a.filter(function(item) {
								return seen.hasOwnProperty(item) ? false : (seen[item] = true);
							});
						} // function uniqAddr(a) {
						
					} // success: function( data ){
				}) // $.ajax({
			} // source: function( request, response ){
		}); // $('#checkout-step-billing #CountrySuggestions').autocomplete({
		
		
		$('#StreetSuggestions').autocomplete({
			showHeader: 	true, 
			minLength: 		1, 
			delay: 			95,
			source: function( request, response ){
				$.ajax({
				  url: 		urlGeeAd_Real,
				  dataType: "jsonp",
				  data: {
					maxrecords: 	MAX_SHOW_RESULTS,
					address1: 		$("#StreetSuggestions").val(),
					locality: 		$("#showPostalCodeResults").find(":selected").val(),
					postalcode: 	$("#showPostalCodeResults").find(":selected").attr("pc"), // this is right here!
					country: 		$("#showCountryResults").find(":selected").val(),
					id: 			my_token,		
					format: 		"jsonp",
					nativecharset: 	false,
				  },
				  success: function( data ){
						//console.log("data:" +data );
						var parts_addr 			= new Array();
						var arr_addr_options 	= new Array();
						var parts_addr_count	= 1;
						
						arr_addr_options.push('<select style="width: '+MAX_LENGTH_GEE_FIELDED_BLOCK+'px;" size="10">');
						
						var string 		= JSON.stringify(data);
						var obj 		= $.parseJSON(string);
						
						var string2 	= JSON.stringify(obj.Results);
						var obj2 		= $.parseJSON(string2);
						
						var rand = Math.random();
						console.log("Random id:" + rand);
						var resultHtmlAddr 	= traverseAddr(obj2);

						arr_addr_options.push(resultHtmlAddr);
						arr_addr_options.push('</select>');
						var addr_html 	= arr_addr_options.join("");
						
						//console.log("POSTALCOOOODEEE: " + pc_html);
						$("#showStreetResults").html(addr_html);
						
						// reset array
						parts_addr 		= [];
						
						function traverseAddr(o){
							var pc = "";
							var lc = "";
							var addr = "";
							for (i in o) {
							//	pc = o.PostalCodePrimary; 
							//	lc = o.Locality;
								addr = o.DeliveryAddress;//o.Address;
								aarea = o.AdministrativeArea;
								
								//addr = o.DeliveryAddress;
								if (((typeof addr != "undefined") && (typeof addr.valueOf() == "string")) && (addr.length > 0)) {
								/*	console.log("addr:" +addr);
									if (parts_addr_count >= 0){
										parts_addr.push('<option selected value="'+addr+'">'+addr+'</option>');
									} else {
										parts_addr.push('<option value="'+addr+'">'+addr+'</option>');
									}
									parts_addr_count++;
								*/
									if (parts_addr_count >= 0){
										parts_addr.push('<option selected value="'+addr+'" aarea="'+aarea+'">'+addr+'</option>');
										parts_addr_count++;
									} else if ( parts_addr_count >= 2 && parts_addr_count <= MAX_SHOW_RESULTS ){
										parts_addr.push('<option value="'+addr+'" aarea="'+aarea+'">'+addr+'</option>');
										parts_addr_count++;
									}
								} // if strict check
								if (typeof(o[i])=="object") {
								//	console.log("key:" + i, "value:"+o[i])
									//console.log("key:" + i.PostalCodePrimary, "value:"+o[i.PostalCodePrimary])
									traverseAddr(o[i]);
								} // if (typeof(o[i])=="object") {
							} // for (i in o) {
							//return parts_addr.join("");
							return uniqAddr(parts_addr).join("");
						}   // function traverseAddr(o){
												
						function uniqAddr(a) {
							var seen = {};
							return a.filter(function(item) {
								return seen.hasOwnProperty(item) ? false : (seen[item] = true);
							});
						} // function uniqAddr(a) {
						
					} // success: function( data ){
				}) // $.ajax({
			} // source: function( request, response ){
		}); // $('#checkout-step-billing #CountrySuggestions').autocomplete({
		
		
		$('#PostalCodeSuggestions').autocomplete({
			showHeader: 	true, 
			minLength: 		1, 
			delay: 			35,
			source: function( request, response ){
				$.ajax({
				  url: 		urlGeePC_Real,
				  dataType: "jsonp",
				  data: {
					maxrecords: 	MAX_SHOW_RESULTS,
					postalcode: 	$("#PostalCodeSuggestions").val(),
					country: 		$("#showCountryResults").find(":selected").val(),
					id: 			my_token,		
					format: 		"jsonp",
					nativecharset: 	false,
				  },
				  success: function( data ){
						//console.log("data:" +data );
						var parts_pc 		= new Array();
						var arr_pc_options 	= new Array();
						var parts_pc_count	= 1;
						
						arr_pc_options.push('<select style="width: '+MAX_LENGTH_GEE_FIELDED_BLOCK+'px;" size="10">');
						
						var string 		= JSON.stringify(data);
						var obj 		= $.parseJSON(string);
						
						var string2 	= JSON.stringify(obj.Results);
						var obj2 		= $.parseJSON(string2);
						
						var resultHtml 	= traversePC(obj2);

						arr_pc_options.push(resultHtml);
						arr_pc_options.push('</select>');
						var pc_html 	= arr_pc_options.join("");
						
						//console.log("POSTALCOOOODEEE: " + pc_html);
						$("#showPostalCodeResults").html(pc_html);
						
						// reset array
						parts_pc 		= [];
						
						function traversePC(o){
							var pc = "";
							var lc = "";
							var aarea = "";
							for (i in o) {
								pc 		= o.PostalCodePrimary; 
								lc 		= o.Locality;
								aarea 	= o.AdministrativeArea;
								
							//	var postalcode 	= $("#PostalCodeSuggestions").val();
							//	var country 	= 	$("#showCountryResults").find(":selected").val();
					
								//console.log("POSTALCOOOODEEE: " +postalcode+" locality: "+lc +"country: "+country);
								//console.log("i: " +i+"o: "+o);
								if (((typeof pc != "undefined") && (typeof pc.valueOf() == "string")) && (pc.length > 0) && ((typeof lc != "undefined") && (typeof lc.valueOf() == "string")) && (lc.length > 0)) {
									if (parts_pc_count >= 0){
										parts_pc.push('<option selected value="'+lc+'" pc="'+pc+'" aarea="'+aarea+'">'+pc+", "+lc+'</option>');
										parts_pc_count++;
									} else if ( parts_pc_count >= 2 && parts_pc_count <= MAX_SHOW_RESULTS ){
										parts_pc.push('<option value="'+lc+'" pc="'+pc+'" aarea="'+aarea+'">'+pc+", "+lc+'</option>');
										parts_pc_count++;
									}
								} // if strict check
								if (typeof(o[i])=="object") {
								//	console.log("key:" + i, "value:"+o[i])
									//console.log("key:" + i.PostalCodePrimary, "value:"+o[i.PostalCodePrimary])
									traversePC(o[i]);
								} // if (typeof(o[i])=="object") {
							} // for (i in o) {
							return uniq(parts_pc).join("");
						}   // function traversePC(o){
												
						function uniq(a) {
							var seen = {};
							return a.filter(function(item) {
								return seen.hasOwnProperty(item) ? false : (seen[item] = true);
							});
						} // function uniq(a) {
						
					} // success: function( data ){
				}) // $.ajax({
			} // source: function( request, response ){
		}); // $('#PostalCodeSuggestions').autocomplete({
		
		
		$('#CountrySuggestions').autocomplete({
			showHeader: true, 
			minLength: 	1, 
			delay: 		35,
			source: function( request, response ){
				$.ajax({
				  url: 		urlGeeCN_Real,
				  dataType: "jsonp",
				  data: {
					country: 	$("#CountrySuggestions").val(),
					id: 		my_token,	
					maxrecords: MAX_SHOW_RESULTS,
					format: 	"jsonp",
				  },
				 
				success: function( data ){
						//console.log("data:" +data );
						var parts_pc 		= new Array();
						var arr_pc_options 	= new Array();
						var parts_pc_count	= 1;
					
						arr_pc_options.push('<select style="width: '+MAX_LENGTH_GEE_FIELDED_BLOCK+'px;" size="10">');
						
						var string 			= JSON.stringify(data);
						var obj 			= $.parseJSON(string);
						
						var string2 		= JSON.stringify(obj.Results);
						var obj2 			= $.parseJSON(string2);
						
						var resultHtml 		= traverseCN(obj2);

						arr_pc_options.push(resultHtml);
						arr_pc_options.push('</select>');
						var pc_html 		= arr_pc_options.join("");
						
						//console.log("POSTALCOOOODEEE: " + pc_html);
						$("#showCountryResults").html(pc_html);
						
						// reset array
						parts_pc 		= [];
						
						function traverseCN(o){							
							var iso = "";
							var eng = "";
							for (i in o) {
								iso = o.Char2ISO; 
								eng = o.English;
								//console.log("Before strict testing: " +iso +" -> "+eng);
								if (((typeof iso != "undefined") && (typeof iso.valueOf() == "string")) && (iso.length > 0) && ((typeof eng != "undefined") && (typeof eng.valueOf() == "string")) && (eng.length > 0)) {
									//console.log("count:" +parts_pc_count);
									if (parts_pc_count >= 0){
										parts_pc.push('<option selected value="'+iso+'">'+eng+'</option>');
										parts_pc_count++;
									} else if ( parts_pc_count >= 2 && parts_pc_count <= MAX_SHOW_RESULTS ){
										parts_pc.push('<option value="'+iso+'">'+eng+'</option>');
										parts_pc_count++;
									}
									//console.log("iso/eng:" +iso +" -> "+eng );
								} // if strict check
								if (typeof(o[i])=="object") {
								//	console.log("key:" + i, "value:"+o[i])
									//console.log("key:" + i.PostalCodePrimary, "value:"+o[i.PostalCodePrimary])
									traverseCN(o[i]);
								} // if (typeof(o[i])=="object") {
							} // for (i in o) {
							return uniqCN(parts_pc).join("");
							//return parts_pc.join("");
						}   // function traverseCN(o){
												
						function uniqCN(a) {
							var seen = {};
							return a.filter(function(item) {
								return seen.hasOwnProperty(item) ? false : (seen[item] = true);
							});
						} // function uniq(a) {
						
					} // success: function( data ){
				})
			}
		}); // $('#CountrySuggestions').autocomplete({
		
		$('#CountrySuggestionsSingleRow').autocomplete({
			showHeader: true, 
			minLength: 	1, 
			delay: 		35,
			source: function( request, response ){
				$.ajax({
				  url: 		urlGeeCN_Real,
				  dataType: "jsonp",
				  data: {
					country: 	$("#CountrySuggestionsSingleRow").val(),
					id: 		my_token,	
					maxrecords: MAX_SHOW_RESULTS,
					format: 	"jsonp",
				},
				 
				success: function( data ){
						//console.log("data:" +data );
						var parts_pc 		= new Array();
						var arr_pc_options 	= new Array();
						var parts_pc_count	= 1;
					
						arr_pc_options.push('<select style="width: '+MAX_LENGTH_GEE_FIELDED_BLOCK+'px;" size="10">');
					
						//arr_pc_options.push('<select style="width: '+MAX_LENGTH_GEE_FIELDED_BLOCK+'px;" size="'+MAX_SHOW_RESULTS+'">');
						
						var string 			= JSON.stringify(data);
						var obj 			= $.parseJSON(string);
						
						var string2 		= JSON.stringify(obj.Results);
						var obj2 			= $.parseJSON(string2);
						
						var resultHtml 		= traverseCN2(obj2);

						arr_pc_options.push(resultHtml);
						arr_pc_options.push('</select>');
						var pc_html 		= arr_pc_options.join("");
						
						//console.log("POSTALCOOOODEEE: " + pc_html);
						$("#showCountryResultsSingleRow").html(pc_html);
						
						// reset array
						parts_pc 		= [];
						
						function traverseCN2(o){							
							var iso = "";
							var eng = "";
							for (i in o) {
								iso = o.Char2ISO; 
								eng = o.English;
								//console.log("Before strict testing: " +iso +" -> "+eng);
								if (((typeof iso != "undefined") && (typeof iso.valueOf() == "string")) && (iso.length > 0) && ((typeof eng != "undefined") && (typeof eng.valueOf() == "string")) && (eng.length > 0)) {
									//console.log("count:" +parts_pc_count);
									if (parts_pc_count >= 0){
										parts_pc.push('<option selected value="'+iso+'">'+eng+'</option>');
										parts_pc_count++;
									} else if ( parts_pc_count >= 2 && parts_pc_count <= MAX_SHOW_RESULTS ){
										parts_pc.push('<option value="'+iso+'">'+eng+'</option>');
										parts_pc_count++;
									}
									//console.log("iso/eng:" +iso +" -> "+eng );
								} // if strict check
								if (typeof(o[i])=="object") {
								//	console.log("key:" + i, "value:"+o[i])
									//console.log("key:" + i.PostalCodePrimary, "value:"+o[i.PostalCodePrimary])
									traverseCN2(o[i]);
								} // if (typeof(o[i])=="object") {
							} // for (i in o) {
							return uniqCN(parts_pc).join("");
							//return parts_pc.join("");
						}   // function traverseCN(o){
												
						function uniqCN(a) {
							var seen = {};
							return a.filter(function(item) {
								return seen.hasOwnProperty(item) ? false : (seen[item] = true);
							});
						} // function uniq(a) {
						
					} // success: function( data ){
				})
			}
		}); // $('#CountrySuggestionsSingleRow').autocomplete({
	
	
	function doGawsWebCall(){

		var resultquality 		= "";
		var content_locality 	= $("#billing\\:city").val();
		var content_postalcode 	= $("#billing\\:postcode").val();
		var content_street 		= $("#billing\\:street1").val();
		var content_street2 	= $("#billing\\:street2").val();
		var content_country 	= $("#billing\\:country_id").val();
		var content_region 		= $("#billing\\:region_id").val();
		
		content_locality 		= $.trim(content_locality);
		content_postalcode 		= $.trim(content_postalcode);
		content_street 			= $.trim(content_street);
		content_street2 		= $.trim(content_street2);
		content_country 		= $.trim(content_country);
		content_region 			= $.trim(content_region);
		
		var cookiehash			= hashCode(content_locality)+hashCode(content_postalcode)+hashCode(content_street)+hashCode(content_street2)+hashCode(content_country);
		var CookieAddrHash		= Cookies.get('MelissaDataMagento_GAWS_AddressHash');
		
		console.log("doGawsWebCall [none]: Locality:"+content_locality+" Street: "+content_street+" PostalCode: "+content_postalcode+" Country: "+content_country);
		//console.log("doGawsWebCall [none]: cookiehash: "+cookiehash);
		//console.log("doGawsWebCall [none]: CookieAddrHash: "+CookieAddrHash);
		
		if (content_locality.length >= 2 && content_postalcode.length >= 2 && content_street.length >= 2 && content_country.length >= 1 && cookiehash != CookieAddrHash){
			console.log("doGawsWebCall [live]: Calling GAWS Webservice!");
			$.ajax({
				type:     "GET",
				url:      urlGaws_Real,
				dataType: 'jsonp',
				async: 		true,
				cache: 		false,
				data: {
					id: 		my_token,	
					t:			"Melissa Data Magento Plugin - Address Check (SE)",
					format: 	"json",
					ctry: 		content_country,
					a1:			content_street,
					//a2:			content_street2,
					postal: 	content_postalcode,
					loc:		content_locality,
				},
				success: function( data ){
						var string 			= JSON.stringify(data);
						var obj 			= $.parseJSON(string);
											
						var string2 		= JSON.stringify(obj.Records);
						var obj2 			= $.parseJSON(string2);
				
						var ResultCodes 	= obj2[0].Results;
						var ArrResultCodes 	= ResultCodes.split(',');
						
						var FormAddr 		= obj2[0].FormattedAddress;
						var Latitude 		= obj2[0].Latitude;
						var Longitude 		= obj2[0].Longitude;
						
						var Locality		= obj2[0].Locality;
						var PostalCode		= obj2[0].PostalCode;
						var AddressLine1	= obj2[0].AddressLine1;
						var AddressLine2	= obj2[0].AddressLine2;
						var AddressLine3	= obj2[0].AddressLine3;
						var AddressLine4	= obj2[0].AddressLine4;
						var AddressLine5	= obj2[0].AddressLine5;
						var Thoroughfare	= obj2[0].Thoroughfare;
												
						var CountryName		= obj2[0].CountryName;
						var AdminAreaName	= obj2[0].AdministrativeArea;
						var SubNationalArea = obj2[0].SubNationalArea;
						var CountryISO3166_1_Alpha3 = obj2[0].CountryISO3166_1_Alpha3;
						var CountryISO3166_1_Alpha2 = obj2[0].CountryISO3166_1_Alpha2;
						var PremisesNumber	= obj2[0].PremisesNumber;
						
						console.log("doGawsWebCall [live] ResultCodes:" + ResultCodes + " FormAddr: "+ FormAddr);
						
						if ( ResultCodes.match(/(AE..)/ig) != null ){
							resultquality = "Address: "+FormAddr+" is not postal deliverable! <br />Please change your input address (Street, Premise, Suite, Locality, Postalcode)!";
							html_result_gaws = '<span style="color: red; font-weight:bold;">'+resultquality+'</span>';
						} else if ( ResultCodes.match(/(AV1|AE05|AV21|AV22)/ig) != null ){
							resultquality = "Address: "+FormAddr+" has some errors in it! <br />Please consider checking your input (Street, Premise, Suite, Locality, Postalcode)!";
							html_result_gaws = '<span style="color: orange; font-weight:bold;">'+resultquality+'</span>';
						} else if ( ResultCodes.match(/(AV23|AV24|AV25)/ig) != null ){
							resultquality = "Address: "+FormAddr+" is fully postal deliverable! <br /> You are great!";
							html_result_gaws = '<span style="color: green; font-weight:bold;">'+resultquality+'</span>';
							
							// if full verified GAWS address, then take that values and write them back
							$("#billing\\:country_id").val(CountryISO3166_1_Alpha2);
							$("#billing\\:street1").val(AddressLine1);
							//$("#billing\\:street2").val(AddressLine2);
							$("#billing\\:postcode").val(PostalCode);
							$("#billing\\:city").val(Locality);
						}
						
						$("#gawsresults").html("");
						$("#gawsresults").html(html_result_gaws);
						
						$("#gawsresults_top").html("");
						$("#gawsresults_top").html(html_result_gaws);
						
						// set cookie -> no double GAWS calls
						Cookies.set('MelissaDataMagento_GAWS_AddressHash', "");
						Cookies.set('MelissaDataMagento_GAWS_AddressHash', cookiehash);
											
						// later for each result code give the corresponding hint on what to improve for NON AV24/25 addresses
						
			/*				
						$.each(ArrResultCodes, function( index, value ) {
							value = value.trim();
							if ( value.match(/AE/ig) != null ){
								if (AEisDone==0){
									AEisDone = 1;
									tmpAdd = '<br /><b style="text-decoration: underline">Adressfehler:</b><br /><br />';
								}								
								stringToAddTemp = tmpAdd+"<li><b>"+value+"</b> -> "+errorcodes[value]['desc']+"</li>";
								tmpAdd = "";
							} else if ( value.match(/AV/ig) != null ){
								if (AVisDone==0){
									AVisDone = 1;
									tmpAdd = '<br /><b style="text-decoration: underline">Validierungsebene:</b><br /><br />';
								}
								stringToAddTemp = tmpAdd+"<li><b>"+value+"</b> -> "+verifycodes[value]['desc']+"</li>";
								tmpAdd = "";
							}
						
							if ( value.match(/AE01/ig) != null ){ 
								image_postalcode_notok = '<img alt="Nicht korrekt" title="Schlechte Ergebnisqualit\E4t" src="data:image/png;base64,'+red_notok+'"/>';
							}
							if ( value.match(/AE02/ig) != null ){ 
								image_street_notok = '<img alt="Nicht korrekt" title="Schlechte Ergebnisqualit\E4t" src="data:image/png;base64,'+red_notok+'"/>';
							}
							if ( value.match(/AV13/ig) != null ){ 
								image_street_notok = '<img alt="Gr\FCner Haken" title="Sehr gute Ergebnisse / Very good Quality" src="data:image/png;base64,'+green_ok+'"/>';
							}
							var n = stringToAddTemp.length;
							if (n>3){
								stringToAdd += stringToAddTemp;
								stringToAddTemp = "";
							}
						});
			*/			
					} // success: function( data ){
			}); // $.ajax({
		}// if (locality == 1 && street == 1 && postcode == 1 && country == 1){
		return;
	} // doGawsWebCall
	
	function hashCode (str){
		var hash = 0;
		if (str.length == 0) return hash;
		for (i = 0; i < str.length; i++) {
			char = str.charCodeAt(i);
			hash = ((hash<<5)-hash)+char;
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash;
	} // function hashCode (str){

}); // $(document).ready(function() {
