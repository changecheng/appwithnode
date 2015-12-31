var Validator = {};
Validator.isEmpty = function(exp){
	if (exp != '') {
		return false;
	};
	return true;
}

Validator.isInvalidFormat=function(){
	//console.log(arguments);
	if (arguments.length<2) {
		return true;
	}else{
		var exp = arguments[0];
		for (var i = 1; i < arguments.length; i++) {
			if (!arguments[i].test(exp)){
				return true;
			}
		};
	}
	return false;
}
module.exports= Validator;