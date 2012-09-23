var Cryptogram = (function(){
	var TEXTAREA = "#txt";
	var GO_BUTTON = "#go";
	var RESULT_DIV = "#result";
	var MAPPING_DIV = "#mapping";
	var ORIGINAL_DIV = "#original";

	var D = console;

	function Mapping(){
		var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var result = {};
		var failed = false;

		function randomInt(min, max) {
		    return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		// We need to map the character cur to a new letter of the alphabet
		// but it must be an available letter.
		function selectNewLetter(cur, available){
			var result = "";

			var tries = 0;

			while(true){
				tries++;
				if(tries > 500){
					failed = true;
					break;
				}


				var idx = randomInt(0, available.length - 1);
				var potentialLetter = available.charAt(idx);

				// This cannot be the same as the current letter
				if(potentialLetter != cur){
					result = potentialLetter;
					break;
				}

			}
			return result;
		}

		function createAlphabet(){
			var used = "";
			var available = alphabet;

			for(var i = 0; i < alphabet.length; i++){
				var cur = alphabet.charAt(i);
				var target = selectNewLetter(cur, available);
				if(failed) {
					break;
				}
				available = available.replace(target, "");
				result[cur] = target;
			}

			// If we couldnt make an alphabet, reset the failed variable
			// and try again
			if(failed){
				failed = false;
				//D.log('try again');
				createAlphabet();
			}
		}

		function validMapping(){
			var counts = {};

			for(var i = 0; i < alphabet.length; i++){
				var cur = alphabet.charAt(i);
				counts[cur] = 0;
			}

			for(var key in result){
				var target = result[key];
				counts[target]++;
			}


			for(var i = 0; i < alphabet.length; i++){
				var cur = alphabet.charAt(i);
				if(counts[cur] != 1) return false;
			}

			return true;
		}

		// A table with two rows
		//
		// A B C D E ....
		// X R O I F ....
		function createHtml(){
			var html = "<table>";

			var row1 = "<tr>";
			var row2 = "<tr>";

			function makeElem(txt){
				return "<td>"+txt+"</td>";
			}

			for(var key in result){
				var target = result[key];

				row1 += makeElem(key);
				row2 += makeElem(target);
			}

			row1 += "</tr>";
			row2 += "</tr>";

			html += row1 + row2 + "</table>";
			return html;
		}


		// Given a string, encode it with the mapping.
		function encode(str){
			var answer = "";
			for(var i = 0; i < str.length; i++){
				var cur = str.charAt(i);
				var target = result[cur];
				if(target != undefined){
					answer += target;
				}else{
					answer += cur;
				}
			}
			return answer;
		}



		createAlphabet();

		return {
			createHtml: createHtml,
			encode: encode,
			validMapping: validMapping
		};
	}










	function encode(){
		var text = $(TEXTAREA).val().toUpperCase();
		var mapping = new Mapping();
		$(ORIGINAL_DIV).html(text);
		var result = mapping.encode(text);
		$(RESULT_DIV).html(result);
		$(MAPPING_DIV).html(mapping.createHtml());
	}

	function setup(){
		$(GO_BUTTON).click(encode);

		/* Test Mappings
		for(var i = 0; i < 10000; i++){
			var m = new Mapping();
			if(!m) {
				D.log('fail!');
				break;
			}else{
				D.log('ok');
			}
		}
		*/
	}

	return {
		setup: setup
	};
}());


$(document).ready(function(){
	Cryptogram.setup();

});