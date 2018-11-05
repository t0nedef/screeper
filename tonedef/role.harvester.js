//
var roleHarvester = {

	/** @param {Creep} creep **/
	run: function(creep) {
		if(creep.memory.building && creep.carry.energy == 0) {
			creep.memory.building = false;
			creep.say("harvesting");
		}
		if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
			creep.memory.building = true;
			creep.say("spending");
		}
		if(creep.memory.building) {
			var structs = _.filter(Game.structures,
				(structure) => structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity);
			var struct;
			if(structs.length) {
				struct = creep.pos.findClosestByRange(structs);
				if(creep.transfer(struct, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(struct);
				}
			} else {
				if(Game.spawns[creep.memory.spawn].energy < Game.spawns[creep.memory.spawn].energyCapacity) {
					if(creep.transfer(Game.spawns[creep.memory.spawn], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(Game.spawns[creep.memory.spawn]);
					}
				} else {
					structs = _.filter(creep.room.find(FIND_STRUCTURES),
					(structure) => structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity);
					if(structs.length) {
						struct = creep.pos.findClosestByRange(structs);
						if(creep.transfer(struct, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(struct);
						}
					}
				}
			}
		} else {
			var sources = creep.room.find(FIND_SOURCES);
			var source = sources[creep.memory.source];
			if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
				creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
			}
		}
	}
};

module.exports = roleHarvester;
