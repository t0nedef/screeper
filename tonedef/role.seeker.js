//
var roleSeeker = {

	/** @param {Creep} creep **/
	run: function(creep) {

		if(creep.room.name == "W31N22") {
			if(creep.memory.march) {
				creep.moveTo(28, 0, "W31N22");
			} else {
				creep.moveTo(28, 5, "W31N22");
				var seekers = _.filter(Game.creeps, (creep) => creep.memory.role == 'seeker');
				if(seekers.length == 15) {
					creep.memory.march = 1;
				}
			}
		} else {
			if(creep.room.name == "W31N23") {
				creep.moveTo(0, 21, "W31N23");
			} else {
				if(creep.room.name == "W32N23") {
					var ramps = _.filter(creep.room.find(FIND_STRUCTURES),
						(structure) => structure.structureType == STRUCTURE_RAMPART);
					var ramp = ramps[0];
					if(creep.attack(ramp) == ERR_NOT_IN_RANGE) {
						creep.moveTo(ramp);
					}
					/*} else {
						//var spawns = creep.room.find(STRUCTURE_SPAWN);
						//var spawn = spawns[0];
						var spawn = Game.getObjectById("5bdd995825639f4f35687192");
						creep.moveTo(spawn);
					}*/
				}
			}
		}
//		creep.moveTo(11, 42, "E12N36");
//	  creep.claimController(creep.room.controller);
	}
};

module.exports = roleSeeker;
//
