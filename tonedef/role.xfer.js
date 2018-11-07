//
var roleXfer = {

	/** @param {Creep} creep **/
	run: function(creep) {

		if(creep.memory.building && creep.carry.energy == 0) {
			creep.memory.building = false;
			creep.say("harvesting");
		}
		if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
			creep.memory.building = true;
			creep.say("building");
		}

		// check for a nearby link, help empty other links
		if(creep.memory.building) {
			var towers = _.filter(creep.room.find(FIND_STRUCTURES),
				(structure) => structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity);
			if(towers.length) {
				if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(towers[0]);
				}
			} else {
				var store = creep.room.storage;
				if(creep.transfer(store, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(store, {visualizePathStyle: {stroke: '#ffaa00'}});
				}
			}
		} else {
			var structs = _.filter(creep.room.find(FIND_TOMBSTONES),
				(structure) => _.sum(structure.store) > 0);
			if(structs.length) {
				var source = structs[0];
				if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
				}
			} else {
				var structs = _.filter(creep.pos.findInRange(FIND_STRUCTURES, 2),
					(structure) => structure.structureType == STRUCTURE_LINK);
				if(structs.length) {
					var source = structs[0];
					structs = _.filter(creep.room.find(FIND_STRUCTURES),
						(structure) => structure.structureType == STRUCTURE_LINK &&
						structure.energy > 200 && structure.id != source.id);
					if(structs.length) {
						structs[0].transferEnergy(source);
					}
					if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
					}
				} else {
					var store = creep.room.storage;
					creep.moveTo(store, {visualizePathStyle: {stroke: '#ffaa00'}});
				}
			}
		}
	}
};

module.exports = roleXfer;
