//
var roleSeeker = {

	/** @param {Creep} creep **/
	run: function(creep) {

		if(creep.room.name == "W31N22") {
			var seekers = _.filter(Game.creeps, (creep) => creep.memory.role == 'seeker');
			if(seekers.length == 15) {
				creep.moveTo(28, 0, "W31N22");
			}
		} else {
			if(creep.room.name == "W31N23") {
				creep.moveTo(0, 21, "W31N23");
			} else {
				if(creep.room.name == "W32N23") {
					//var spawns = creep.room.find(STRUCTURE_SPAWN);
					//var spawn = spawns[0];
					var spawn = Game.getObjectById("5bdd995825639f4f35687192");
					creep.moveTo(spawn);
				}
			}
		}

//		creep.moveTo(11, 42, "E12N36");
//	  creep.claimController(creep.room.controller);
	}
};

module.exports = roleSeeker;
//
