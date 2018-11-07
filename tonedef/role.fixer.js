//
var roleFixer = {
	/** @param {Structure} tower **/
	run: function(tower) {
		if(tower.energy > 0) {
			// hostiles
			var attackers = tower.room.find(FIND_HOSTILE_CREEPS);
			if(attackers.length > 0) {
				var enemy = attackers[0];
				Game.notify("attacking an invader from ", enemy.owner.username);
				tower.attack(enemy);
			} else {
				var structs = _.filter(tower.room.find(FIND_STRUCTURES),
					(structure) => structure.hits < structure.hitsMax);
				var roads = _.filter(structs, (structure) => structure.structureType == STRUCTURE_ROAD);
				if(roads.length > 0) {
					tower.repair(roads[0]);
				} else {
//					console.log('Tower found no roads in need of repair');
					var walls = _.filter(structs,
						(structure) => structure.structureType == STRUCTURE_WALL && structure.hits < 25000);
					if(walls.length > 0) {
						tower.repair(walls[0]);
					} else {
						var others = _.filter(structs,
							(structure) => structure.structureType != STRUCTURE_ROAD && structure.structureType != STRUCTURE_WALL);
						if(others.length > 0) {
							tower.repair(others[0]);
						}
					}
				}
			}
		}
	}
};

module.exports = roleFixer;
