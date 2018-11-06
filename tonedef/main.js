//
var harv = require('role.harvester');
var upr = require('role.upgrader');
var builder = require('role.builder');
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
				spawn.spawnCreep([WORK,WORK,WORK,CARRY,MOVE], newName,
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
			if(geners.length < 5) {
				var newName = 'gener' + Game.time;
				console.log('Spawning new gener: ' + newName);
				spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
					{memory: {role: 'general', spawn: name, source: 0}});
			}
		}

		if(spawn.room.energyAvailable > 250) {
			// respawn upgrader
			var upgraders = _.filter(creeps, (creep) => creep.memory.role == 'upgrader');
			if(upgraders.length < 7) {
				var newName = 'upr' + Game.time;
				console.log('Spawning new upgrader: ' + newName);
				spawn.spawnCreep([WORK,CARRY,MOVE], newName, 
					{memory: {role: 'upgrader', spawn: name, source: 1}});
			}
		}

		if(spawn.room.energyAvailable > 250 && name == "s0") {
			// respawn seeker
			var seeker = _.filter(Game.creeps, (creep) => creep.memory.role == 'seeker');
			if(seeker.length < 5) {
				var newName = 'seek' + Game.time;
				console.log('Spawning new seeker: ' + newName);
				spawn.spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
				//spawn.spawnCreep([MOVE,MOVE,CLAIM,TOUGH,ATTACK,ATTACK], newName, 
					{memory: {role: 'seeker', spawn: name, source: 0}});
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
		if(enemies.length > 0 && enemies[0].owner != "Invader") {
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
		if(creep.memory.role == 'seeker') {
//			seeker.run(creep);

		if(creep.room.name == "W31N22") {

			if(creep.memory.building && creep.carry.energy == 0) {
				creep.memory.building = false;
				creep.say("withdrawing");
			}

			if(creep.memory.building) {
				var storage = creep.room.storage;
				if(creep.transfer(storage, RESOURCE_MINERAL) == ERR_NOT_IN_RANGE) {
					creep.moveTo(storage);
				}
			} else {
				creep.moveTo(28, 0, "W31N22");
			}
//			creep.moveTo(49, 26, "W31N22");
		} else {
//			if(creep.room.name == "W30N22") {
//				creep.moveTo(14, 49, "W30N22");
			if(creep.room.name == "W31N23") {

				if(creep.memory.building) {
					creep.moveTo(28, 49, "W31N23");
				} else {
					creep.moveTo(24, 0, "W31N23");
				}

			} else {
//				if(creep.room.name == "W30N21") {
//					creep.moveTo(0, 27, "W30N21");
				if(creep.room.name == "W31N24") {

					if(!creep.memory.building && _.sum(creep.carry) == creep.carryCapacity) {
						creep.memory.building = true;
						creep.say("depositing");
					}

					if(creep.memory.building) {
						creep.moveTo(24, 49, "W31N23");
					} else {
						var storage = Game.getObjectById("5bd006f300321c253c6c3adc");
						if(creep.withdraw(storage, RESOURCE_MINERAL) == ERR_NOT_IN_RANGE) {
							creep.moveTo(storage);
						}
					}

				}
			}
		}
		}
	}

	// structure task list
	var towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);
	for(var i in towers) {
		fixer.run(towers[i]);
	}
}

//
