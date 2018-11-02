//
var roleUpgrader = {

	/** @param {Creep} creep **/
	run: function(creep) {
		if(creep.carry.energy < creep.memory.targetEnergy) {
			creep.memory.targetEnergy = creep.carryCapacity;
			var sources = creep.room.find(FIND_SOURCES);
			var source = sources[creep.memory.source];
			if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
//			var source = creep.room.storage;
//			if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
			}
		} else {
			creep.memory.targetEnergy = 1;
			if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller);
			}
		}
	}
};

module.exports = roleUpgrader;
