//
var roleSeeker = {

	/** @param {Creep} creep **/
	run: function(creep) {

		if(creep.room.name == "W31N22") {
			creep.moveTo(49, 26, "W31N22");
		} else {
			if(creep.room.name == "W30N22") {
				creep.moveTo(14, 49, "W30N22");
			} else {
				if(creep.room.name == "W30N21") {
					creep.moveTo(0, 27, "W30N21");
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
//							enemy = Game.getObjectById("5bdcf6802a146643889d60f4");
//							if(creep.attack(enemy) == ERR_NOT_IN_RANGE) {
//								creeep.moveTo(enemy);
//							}
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
