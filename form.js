function substr_count( haystack, needle, offset, length ) {
	var pos = 0, cnt = 0;
	if(isNaN(offset)) offset = 0;
	if(isNaN(length)) length = 0;
	offset--;
	while( (offset = haystack.indexOf(needle, offset+1)) != -1 ){
		if(length > 0 && (offset+needle.length) > length){
			return false;
		} else{
			cnt++;
		}
	}

	return cnt;
}

function PhoneFormat(phone){
	return phone.replace(/\D/g, '');
}

var formSubmitProcessor = function(event) {
    
    event.preventDefault();
	
	var url = '//hgstore.online/cpatl/send-form.php';
	
	var name = 'Empty name';
	var phone = 'Empty phone';
	var mysubid = 'Empty subid';
	var offerid = 'Empty offerid';
	var country = 'Empty country';
	var ipaddress = '';
	var useragent = '';
	
	if('undefined' !== typeof document.getElementsByName('name')[0])
		name = document.getElementsByName('name')[0].value;
	
	if('undefined' !== typeof document.getElementsByName('phone')[0]) {
		phone = document.getElementsByName('phone')[0].value;
		phone = PhoneFormat(phone);
	}
	
    if('undefined' !== typeof document.getElementsByName('_subid')[0])
		mysubid = document.getElementsByName('_subid')[0].value;

	if('undefined' !== typeof document.getElementsByName('offer_id')[0])
		offerid = document.getElementsByName('offer_id')[0].value;
	
	if('undefined' !== typeof document.getElementsByName('country')[0])
		country = document.getElementsByName('country')[0].value;

	if(!useragent.length)
		useragent = navigator.userAgent;
	if(!ipaddress.length) {
		var request = new XMLHttpRequest();
		request.open('GET', 'https://www.cloudflare.com/cdn-cgi/trace', false);  // `false` makes the request synchronous
		request.send(null);

		if (request.status === 200) {
			if(request.responseText.length) {
				var pregIP = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
				var ip = request.responseText.match(pregIP);
				if(ip)
					ipaddress = ip[0];
			}
		}
	}
	
	var tid = Math.floor(Math.random() * 1000000000);
	
	var params = {
		name: name,
		phone: phone,
        mysubid: mysubid,
		offerid: offerid,
		country: country,
		ipaddress: ipaddress,
		useragent: useragent,
		tid: tid,		
		type: 'custom',
	};

	var additionalFields = ['utm_source', 'utm_content', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_sub1', 'utm_sub2', 'utm_sub3', 'utm_sub4', 'utm_sub5'];
	
	additionalFields.forEach(function(additionalField, i, arr) {
		if('undefined' !== typeof document.getElementsByName(additionalField)[0])
			params[additionalField] = document.getElementsByName(additionalField)[0].value;
	});
	
	FreezeUI({ text: 'Будь ласка, зачекайте' });
	
	var http = new XMLHttpRequest();
	
	http.open('POST', url, true);
	
	http.addEventListener("loadend", UnFreezeUI, false);

	http.setRequestHeader('Content-type', 'application/json');
	
	http.onreadystatechange = function() {
		if(http.readyState == 4 && http.status == 200) {
			try {
				var result = http.responseText;
				result = JSON.parse(result);
			console.log(result);
			console.log(result.success);
			if(true === result.success)
				window.location.replace("thankyou.html");
			else
				alert(result.message);
			} catch (e) {
				console.log('Invalid response ' + http.responseText);
			}			
		}
	}
	
	http.send(JSON.stringify(params));
};
document.addEventListener("DOMContentLoaded", function(){
	if('undefined' !== typeof document.getElementsByName('phone')[0]) {
		var phoneMask = IMask(document.getElementsByName('phone')[0], {
			mask: '+{38}(000) 000-00-00',
			lazy: false,
			placeholderChar: '_'
		});
	}

	var form = document.getElementById("order_form");
	form.addEventListener("submit", formSubmitProcessor, true);	
});