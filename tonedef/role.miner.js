//
var roleMiner = {

	/** @param {Creep} creep **/
	run: function(creep) {

		if(creep.memory.building && creep.carry.energy == 0) {
			creep.memory.building = false;
			creep.say("mining");
		}
		if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
			creep.memory.building = true;
			creep.say("storing");
		}

		if(creep.memory.building) {
			var store = creep.room.storage;
			if(creep.transfer(store, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(store);
			}
		} else {
			var source = creep.memory.source;
			if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
				creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
			}
		}
	}
};

module.exports = roleMiner;
