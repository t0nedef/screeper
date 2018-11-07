//
var roleUpgrader = {

	/** @param {Creep} creep **/
	run: function(creep) {
		if(creep.carry.energy < creep.memory.targetEnergy) {
			creep.memory.targetEnergy = creep.carryCapacity;
			// look for energy hanging around
			// look for minerals hanging around
			var source = creep.room.storage;
			if(source) {
				if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
				}
			} else {
				var structs = _.filter(creep.room.find(FIND_STRUCTURES),
					(structure) => structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) > 0);
				if(structs.length > 0) {
					var struct = creep.pos.findClosestByRange(structs);
					if(creep.withdraw(struct, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(struct, {visualizePathStyle: {stroke: '#ffaa00'}});
					}
				} else {
					var sources = creep.room.find(FIND_SOURCES);
					var source = sources[creep.memory.source];
					if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
						creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
					}
				}
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
