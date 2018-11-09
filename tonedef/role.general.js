//
var roleGeneral = {

	/** @param {Creep} creep **/
	run: function(creep, aType) {

		if(creep.memory.building && creep.carry.energy == 0) {
			creep.memory.building = false;
			creep.memory.loadingFrom = false;
			creep.say("harvesting");
		}
		if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
			creep.memory.building = true;
			creep.memory.loadingFrom = false;
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
			if(!creep.memory.loadingFrom) {
				var source = creep.room.storage;
				if(source) {
					var err = creep.withdraw(source, RESOURCE_ENERGY);
					if(err == ERR_NOT_IN_RANGE) {
						creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
					} else if(err == 0) { //save source until its exhausted
						creep.memory.loadingFrom = true;
						creep.memory.lastSrcType = FIND_STRUCTURES;
						creep.memory.lastSrc = source.id;
					}
				} else {
					var sources = _.filter(creep.room.find(FIND_STRUCTURES),
						(structure) => structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) > 0);
					if(sources.length > 0) {
						source = creep.pos.findClosestByRange(sources);
						var err = creep.withdraw(source, RESOURCE_ENERGY);
						if(err == ERR_NOT_IN_RANGE) {
							creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
						} else if(err == 0) { //save source until its exhausted
							creep.memory.loadingFrom = true;
							creep.memory.lastSrcType = FIND_STRUCTURES;
							creep.memory.lastSrc = source.id;
						}
					} else {
						sources = creep.room.find(FIND_SOURCES);
						source = sources[creep.memory.source];
						var err = creep.harvest(source);
						if(err == ERR_NOT_IN_RANGE) {
							creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
						} else if(err == 0) { //save source until its exhausted
							creep.memory.loadingFrom = true;
							creep.memory.lastSrcType = FIND_SOURCES;
							creep.memory.lastSrc = source.id;
						}
					}
				}
			// then harvest,withdraw from the same source
			} else {
				var source = Game.getObjectById(creep.memory.lastSrc);
				if(creep.memory.lastSrcType == FIND_SOURCES) {
					if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
						creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
					} else if(err == ERR_NOT_ENOUGH_ENERGY) {
						creep.memory.building = true;
					}
				} else if (creep.memory.lastSrcType == FIND_STRUCTURES) {
					var err = creep.withdraw(source, RESOURCE_ENERGY);
					if(err == ERR_NOT_IN_RANGE) {
						creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
					} else if(err == ERR_NOT_ENOUGH_ENERGY) {
						creep.memory.building = true;
					}
				}
			}
		}
	}
};

module.exports = roleGeneral;
