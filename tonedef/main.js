//
var harv = require('role.harvester');
var upr = require('role.upgrader');
//var builder = require('role.builder');
var gener = require('role.general');
var miner = require('role.miner');
var fixer = require('role.fixer');
var seeker = require('role.seeker');

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
		var creeps = spawn.room.find(FIND_MY_CREEPS);
	
		// respawn
		// respawn harvester
		if(spawn.room.energyAvailable > 200) {
			var harvesters = _.filter(creeps, (creep) => creep.memory.role == 'harvester');
			if(harvesters.length < 3) {
				var newName = 'harv' + Game.time;
				console.log('Spawning new harvester: ' + newName);
				spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
					{memory: {role: 'harvester', spawn: name, source: 1}});
			}
		}

//		if(spawn.room.energyAvailable > 400) {
		if(spawn.room.energyAvailable > 200) {
			// respawn miner
			// alpha
			var miners = _.filter(creeps, (creep) => creep.memory.role == 'aminer');
			if(miners.length < 2) {
				var newName = 'miner' + Game.time;
				console.log('Spawning new alpha miner: ' + newName);
//				spawn.spawnCreep([WORK,WORK,WORK,CARRY,MOVE], newName,
				spawn.spawnCreep([WORK,CARRY,MOVE], newName,
					{memory: {role: 'aminer', spawn: name, source: 1}});
			}
			// beta
			miners = _.filter(creeps, (creep) => creep.memory.role == 'bminer');
			if(miners.length < 0) {
				var newName = 'miner' + Game.time;
				console.log('Spawning new beta miner: ' + newName);
//				spawn.spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE], newName,
				spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
					{memory: {role: 'bminer', spawn: name, source: 0}});
			}
		}

		if(spawn.room.energyAvailable > 200) {
			// respawn builder
			var geners = _.filter(creeps, (creep) => creep.memory.role == 'general');
			if(geners.length < 3) {
				var newName = 'gener' + Game.time;
				console.log('Spawning new gener: ' + newName);
				spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
					{memory: {role: 'general', spawn: name, source: 1}});
			}
		}

		if(spawn.room.energyAvailable > 200) {
			// respawn upgrader
			var upgraders = _.filter(creeps, (creep) => creep.memory.role == 'upgrader');
			if(upgraders.length < 9) {
				var newName = 'upr' + Game.time;
				console.log('Spawning new upgrader: ' + newName);
				spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
					{memory: {role: 'upgrader', spawn: name, source: 0}});
			}
		}

		if(spawn.room.energyAvailable > 870) {
			// respawn seeker
			var seeker = _.filter(Game.creeps, (creep) => creep.memory.role == 'seeker');
			if(seeker.length < 0) {
				var newName = 'seek' + Game.time;
				console.log('Spawning new seeker: ' + newName);
				spawn.spawnCreep([MOVE,MOVE,CLAIM,TOUGH,ATTACK,ATTACK], newName, 
					{memory: {role: 'seeker', spawn: name}});
			}
		}

		// renew creeps
		var creeps = spawn.pos.findInRange(FIND_MY_CREEPS,2);
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
			creep.memory.source = 1;
			harv.run(creep);
		}
		if(creep.memory.role == 'upgrader') {
			upr.run(creep);
		}
		if(creep.memory.role == 'builder') {
			gener.run(creep);
		}
		if(creep.memory.role == 'general') {
			gener.run(creep);
		}
		if(creep.memory.role == 'aminer') {
			miner.run(creep);
		}
		if(creep.memory.role == 'bminer') {
			miner.run(creep);
		}
		if(creep.memory.role == 'seeker') {
			seeker.run(creep);
		}
	}

	// structure task list
	var towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);
	for(var i in towers) {
		fixer.run(towers[i]);
	}
}
