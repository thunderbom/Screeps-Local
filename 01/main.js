// Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Harvester1',     { memory: { role: 'harvester' } } );
//  Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Builder1',     { memory: { role: 'builder' } } );


var roleHarvester = require('role.harvester');
var roleHarvesterContainer = require('role.harvesterContainer');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    // Automatically spawns at least 1 screep for roles 'harvester' and 'upgrader'
    
    //if (_.filter(Game.creeps, function (creep) { return creep.memory.role == 'harvester' && creep.ticksToLive > 12; }).length < 1)
    //{
    //    Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE], 'Harvester1', { memory: { role: 'harvester' } });
    //    console.log('Spawning harvester');
    //}

    if (_.filter(Game.creeps, function (creep) { return creep.memory.role == 'upgrader' && creep.ticksToLive > 12; }).length < 1) {
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE], 'Upgrader1', { memory: { role: 'upgrader' } });
        console.log('Spawning upgrader');
    }
    
    if (_.filter(Game.creeps, function (creep) { return creep.memory.role == 'builder' && creep.ticksToLive > 12; }).length < 1) {
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE], 'Builder1', { memory: { role: 'builder' } });
        console.log('Spawning builder');
    }
    
    //for(var name in Game.rooms) {
    //   console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
    //}
        
    for (var name in Game.creeps) {
        
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }

        if (creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
        }

        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        
        if (creep.memory.role == 'harvesterContainer') {
            roleHarvesterContainer.run(creep);
        }
    }
};