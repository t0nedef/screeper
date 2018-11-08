//
var harv = require('role.harvester');
var upr = require('role.upgrader');
var builder = require('role.builder');
var gener = require('role.general');
var miner = require('role.miner');
var fixer = require('role.fixer');
var xfer = require('role.xfer');
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
		var src = 0;
	
		// respawn
		// respawn harvester
		if(spawn.room.energyAvailable > 200) {
			var harvesters = _.filter(creeps, (creep) => creep.memory.role == 'harvester');
			if(harvesters.length < 5) {
				var newName = 'harv' + Game.time;
				console.log('Spawning new harvester: ' + newName);
				spawn.spawnCreep([WORK,CARRY,MOVE], newName,
					{memory: {role: 'harvester', spawn: name, source: 0}});
			}
		}

		if(spawn.room.energyAvailable > 400) {
			// respawn miner
			// alpha
			var miners = _.filter(creeps, (creep) => creep.memory.role == 'aminer');
			if(miners.length < 3) {
				var newName = 'miner' + Game.time;
				console.log('Spawning new alpha miner: ' + newName);
				if(name == "s0") {
					src = 1;
				} else { //s1
					src = 0;
				}
				spawn.spawnCreep([WORK,WORK,WORK,CARRY,MOVE], newName,
					{memory: {role: 'aminer', spawn: name, source: src}});
			}
			// beta
			if(spawn.room.energyAvailable > 600) {
				miners = _.filter(creeps, (creep) => creep.memory.role == 'bminer');
				if(miners.length < 2) { //only 2 because takes so long to get to the mine
					var newName = 'miner' + Game.time;
					console.log('Spawning new beta miner: ' + newName);
					if(name == "s0") {
						src = 0;
					} else { //s1
						src = 1;
					}
//					spawn.spawnCreep([WORK,CARRY,MOVE], newName,
					spawn.spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE], newName,
						{memory: {role: 'bminer', spawn: name, source: src}});
				}
			}
		}

		if(spawn.room.energyAvailable > 200) {
			// respawn builder
			var geners = _.filter(creeps, (creep) => creep.memory.role == 'general');
			if(geners.length < 5) {
				var newName = 'gener' + Game.time;
				console.log('Spawning new gener: ' + newName);
				if(spawn.room.energyAvailable > 500) {
					spawn.spawnCreep([WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName,
						{memory: {role: 'general', spawn: name, source: 0}});
				} else {
					spawn.spawnCreep([WORK,CARRY,MOVE], newName,
						{memory: {role: 'general', spawn: name, source: 0}});
				}
			}
		}

		if(spawn.room.energyAvailable > 250) {
			// respawn upgrader
			var upgraders = _.filter(creeps, (creep) => creep.memory.role == 'upgrader');
			if(upgraders.length < 7) {
				var newName = 'upr' + Game.time;
				console.log('Spawning new upgrader: ' + newName);
				if(spawn.room.energyAvailable > 500) {
					spawn.spawnCreep([WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName,
						{memory: {role: 'upgrader', spawn: name, source: 1}});
				} else {
					spawn.spawnCreep([WORK,CARRY,MOVE], newName,
						{memory: {role: 'upgrader', spawn: name, source: 1}});
				}
			}
		}

		if(spawn.room.energyAvailable > 250 && name == "s0") {
			// respawn seeker
			var seekers = _.filter(Game.creeps, (creep) => creep.memory.role == 'seeker');
			if(seekers.length < 0) {
				var newName = 'seek' + Game.time;
				console.log('Spawning new seeker: ' + newName);
				spawn.spawnCreep([TOUGH,MOVE,MOVE,ATTACK], newName,
				//spawn.spawnCreep([TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK], newName,
					{memory: {role: 'seeker', spawn: name, source: 0, march: 0}});
			}
			// respawn seeker
			var seekers = _.filter(Game.creeps, (creep) => creep.memory.role == 'seekerb');
			if(seekers.length < 0) {
				var newName = 'seek' + Game.time;
				console.log('Spawning new seekerh: ' + newName);
				//spawn.spawnCreep([MOVE,ATTACK], newName,
				spawn.spawnCreep([TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK], newName,
					{memory: {role: 'seekerb', spawn: name, source: 0}});
			}
		}

		if(spawn.room.energyAvailable > 500 && name == "s0") {
			// respawn xfer
			var xfers = _.filter(creeps, (creep) => creep.memory.role == 'xfer');
			if(xfers.length < 1) {
				var newName = 'xfer' + Game.time;
				console.log('Spawning new xfer: ' + newName);
				spawn.spawnCreep([WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName,
					{memory: {role: 'xfer', spawn: name}});
			}
		}

		// renew creeps
		var creeps = spawn.pos.findInRange(FIND_MY_CREEPS,2);
		creeps = _.filter(creeps, (creep) => creep.ticksToLive < 1000);
		for(var i in creeps) {
			console.log('Renewing : ' + creeps[i].name);
			spawn.renewCreep(creeps[i]);
		}

		// if an attacker is present, activate safe mode
		var enemies = spawn.room.find(FIND_HOSTILE_CREEPS);
		if(enemies.length > 0 && enemies[0].owner.username != "Invader") {
			Game.notify("enabling safe mode because i detected an invader from ", enemies[0].owner.username);
			spawn.room.controller.activateSafeMode();
		}
	}

	// screep task list
	for(var name in Game.creeps) {
		var creep = Game.creeps[name];
		// relocate a poorly positioned creep
		if(creep.memory.wait > 0) {
			creep.move(TOP);
			creep.memory.wait = creep.memory.wait - 1;
		}
		if(creep.memory.role != 'aminer') {
			if(creep.pos.x == 37 && creep.pos.y == 17) {
				creep.moveTo(36, 17);
				creep.memory.wait = 5;
			}
			if(creep.pos.x == 39 && creep.pos.y == 17) {
				creep.moveTo(40, 17);
				creep.memory.wait = 5;
			}
		}
		if(creep.memory.role == 'harvester') {
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
		if(creep.memory.role == 'xfer') {
			xfer.run(creep);
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

//
