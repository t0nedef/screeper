//
var roleHarvester = {

	/** @param {Creep} creep **/
	run: function(creep) {
		if(creep.carry.energy < creep.carryCapacity) {
			var sources = creep.room.find(FIND_SOURCES);
			var source = sources[creep.memory.source];
			if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
				creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
			}
		} else {
			var structs = _.filter(Game.structures,
				(structure) => structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity);
			var struct;
			if(structs.length) {
				struct = creep.pos.findClosestByRange(structs);
				if(creep.transfer(struct, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(struct);
				}
			} else {
				if(creep.transfer(Game.spawns[creep.memory.spawn], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(Game.spawns[creep.memory.spawn]);
				}
			}
		}
	}
};

module.exports = roleHarvester;
