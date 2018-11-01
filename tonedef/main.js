//
var harv = require('role.harvester');
var upr = require('role.upgrader');
var builder = require('role.builder');
var fixer = require('role.fixer');
// seeker = require('role.seeker');

module.exports.loop = function () {

	// clean-up
	for(var name in Memory.creeps) {
		if(!Game.creeps[name]) {
			delete Memory.creeps[name];
			console.log('Clearing non-existing creep memory:', name);
		}
	}

	// spawn tasks
	for(var name in Game.spawns) {
		var spawn = Game.spawns[name];
	
		// respawn
		// respawn harvester
		var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
		if(harvesters.length < 5) {
			var newName = 'harv' + Game.time;
			console.log('Spawning new harvester: ' + newName);
//			Game.spawns['s0'].spawnCreep( [WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName,
			spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
				{memory: {role: 'harvester', spawn: name}});
		}

		if(spawn.energy > 200) { //TODO: change to energy in room

			// respawn builder
			var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
			if(builders.length < 6) {
				var newName = 'build' + Game.time;
				console.log('Spawning new builder: ' + newName);
//			Game.spawns['s0'].spawnCreep( [WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName,
				spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
					{memory: {role: 'builder', spawn: name}});
			}

			// respawn upgrader
			var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
			if(upgraders.length < 12) {
				var newName = 'upr' + Game.time;
				console.log('Spawning new upgrader: ' + newName);
//			Game.spawns['s0'].spawnCreep( [WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName,
				spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
					{memory: {role: 'upgrader', spawn: name}});
			}

			// respawn seeker
			var seeker = _.filter(Game.creeps, (creep) => creep.memory.role == 'seeker');
			if(seeker.length < 0) {
				var newName = 'seek' + Game.time;
				console.log('Spawning new seeker: ' + newName);
				spawn.spawnCreep([CLAIM,MOVE], newName, 
					{memory: {role: 'seeker', spawn: name}});
			}
		}

		// renew creeps
		var creeps = spawn.pos.findInRange(FIND_CREEPS,3);
		creeps = _.filter(creeps, (creep) => creep.ticksToLive < 1000);
		for(var i in creeps) {
			console.log('Renewing : ' + creeps[i].name);
			spawn.renewCreep(creeps[i]);
		}
	}

	// screep task list
	for(var name in Game.creeps) {
		var creep = Game.creeps[name];
		if(creep.memory.role == 'harvester') {
			harv.run(creep, 1);
		}
		if(creep.memory.role == 'upgrader') {
			upr.run(creep);
		}
		if(creep.memory.role == 'builder') {
			builder.run(creep);
		}
		if(creep.memory.role == 'seeker') {
//			creep.moveTo(11, 42, "E12N36");
		   creep.reserveController(creep.room.controller);
 //		   creep.claimController(creep.room.controller);
		}
	}

	// structure task list
	var towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);
	for(var i in towers) {
		fixer.run(towers[i]);
	}
}
