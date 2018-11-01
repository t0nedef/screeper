//
var roleSeeker = {

	/** @param {Creep} creep **/
	run: function(creep) {

		if(creep.room.name == "E11N37") {
			creep.moveTo(49, 44, "E11N37");
		} else {
			if(creep.room.name == "E12N37") {
				creep.moveTo(3, 49, "E12N37");
			} else {
				// now in target room
				// hostiles
				var enemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS,2);
				if(enemies.length > 0) {
					creep.attack(enemies[0]);
				} else {
					enemies = _.filter(creep.pos.findInRange(FIND_CREEPS,2),
						(creep) => creep.my == false);
					if(enemies.length > 0) {
						creep.attack(enemies[0]);
					} else {
						//creep.claimController(creep.room.controller);
						if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
							creep.moveTo(creep.room.controller);
						}
					}
				}
			}
		}

//		creep.moveTo(11, 42, "E12N36");
//	  creep.claimController(creep.room.controller);
	}
};

module.exports = roleSeeker;
//
