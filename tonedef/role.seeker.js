//
var roleSeeker = {

	/** @param {Creep} creep **/
	run: function(creep) {

		if(creep.room.name == "W31N22") {
			creep.moveTo(28, 0, "W31N22");
		} else {
			if(creep.room.name == "W31N23") {
				creep.moveTo(24, 0, "W31N23");
			} else {
				if(creep.room.name == "W32N24") {
					var spawns = creep.room.find(STRUCTURE_SPAWN);
					creep.moveTo(spawns[0]);
				}
			}
		}

//		creep.moveTo(11, 42, "E12N36");
//	  creep.claimController(creep.room.controller);
	}
};

module.exports = roleSeeker;
//
