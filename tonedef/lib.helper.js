//
var libHelper = {

	distance: function(pos1, pos2) {
		var dx = math.abs(pos1.x - pos2.x);
		var dy = math.abs(pos1.y - pos1.y);
		return(dx + dy);
	}

};

module.exports = libHelper;

