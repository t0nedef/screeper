//
var roleHarvester = {

	/** @param {Creep} creep **/
	run: function(creep, src) {
		if(creep.carry.energy < creep.carryCapacity) {
			var sources = creep.room.find(FIND_SOURCES);
			if(creep.harvest(sources[src]) == ERR_NOT_IN_RANGE) {
				if(creep.harvest(sources[1-src]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[src], {visualizePathStyle: {stroke: '#ffaa00'}});
				}
				else {
					creep.moveTo(sources[1-src], {visualizePathStyle: {stroke: '#ffaa00'}});
				}
			}
		}
		else if(Game.spawns[creep.memory.spawn].energy == Game.spawns[creep.memory.spawn].energyCapacity) {
			var structs = _.filter(Game.structures,
				(structure) => structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity);
			var struct;
			if(structs.length) {
				struct = creep.pos.findClosestByRange(structs);
				if(creep.transfer(struct, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(struct);
				}
			} else {
//				console.log('Looking for the tower');
				structs = _.filter(Game.structures,
					(structure) => structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity);
				if(structs.length) {
					struct = creep.pos.findClosestByRange(structs);
					if(creep.transfer(struct, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(struct);
					}
				}
			}
		}
		else {
			if(creep.transfer(Game.spawns[creep.memory.spawn], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(Game.spawns[creep.memory.spawn]);
			}
		}
	}
};

module.exports = roleHarvester;
