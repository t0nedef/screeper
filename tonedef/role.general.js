//
var roleGeneral = {

	/** @param {Creep} creep **/
	run: function(creep, aType) {

		if(creep.memory.building && creep.carry.energy == 0) {
			creep.memory.building = false;
			creep.say("harvesting");
		}
		if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
			creep.memory.building = true;
			creep.say("building");
		}

		if(creep.memory.building) {
			var moreFlag = false;
			if(aType) {
				var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
				if(target) {
					if(creep.build(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
					}
				} else {
					var structs = _.filter(creep.room.find(FIND_STRUCTURES),
						(structure) => structure.structureType == STRUCTURE_TOWER &&
						structure.energy < structure.energyCapacity);
					if(structs.length) {
						struct = creep.pos.findClosestByRange(structs);
						if(creep.transfer(struct, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(struct);
						}
					} else {
						moreFlag = true;
					}
				}
			} else {
				var structs = _.filter(creep.room.find(FIND_STRUCTURES),
					(structure) => structure.structureType == STRUCTURE_TOWER &&
					structure.energy < structure.energyCapacity);
				if(structs.length) {
					struct = creep.pos.findClosestByRange(structs);
					if(creep.transfer(struct, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(struct);
					}
				} else {
					var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
					if(target) {
						if(creep.build(target) == ERR_NOT_IN_RANGE) {
							creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
						}
					} else {
						moreFlag = true;
					}
				}
			}
			//
			if(moreFlag) {
				structs = _.filter(Game.structures,
					(structure) => structure.structureType == STRUCTURE_EXTENSION &&
					structure.energy < structure.energyCapacity);
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
		} else {
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
		}
	}
};

module.exports = roleGeneral;
