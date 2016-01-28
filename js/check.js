function getMessage(a, b){
	var sType = typeof a;
	if (sType == 'boolean') {
    	if (a) {
    		return 'Я попал в ' + b;
    	} else {
    		return 'Я никуда не попал';
    	}
	} else if (sType == 'number') {
		return 'Я прыгнул на ' + (a * 100) + ' сантиметров';
	} else if ((sType == 'object') &&  (typeof(b) != 'object')) {
		var nSum = 0;
		for(var i = 0; i < a.length; i++) nSum += a[i];
		return 'Я прошёл ' + nSum + ' шагов';	
	} else if (sType == 'object'){
		var nSum = 0;
		var nMinArrayLength = (a.length > b.length) ? b.length : a.length;
		for(var i = 0; i < nMinArrayLength; i++) nSum += a[i]*b[i];
		return 'Я прошёл ' + nSum + ' метров';	
	}
}