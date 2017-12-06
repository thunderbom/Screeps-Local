// Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Harvester1',     { memory: { role: 'harvester' } } );
// Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Builder1',     { memory: { role: 'builder' } } );
// Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, MOVE], 'HarvesterContainer1', { memory: { role: 'harvesterContainer' } });
// Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], 'Upgrader3', { memory: { role: 'upgrader' } } );

// Checking game memory and if it's empty, initializing it
if (!Memory.vars) {
    Memory.vars = {};
    Memory.vars.minHarvesters = 1;
    Memory.vars.minContainerHarvesters = 0;
    Memory.vars.minUpgraders = 0;
    Memory.vars.minBuilders = 0;
}

//Overriding memory vars:
//Memory.vars.minHarvesters = 1;
//Memory.vars.minContainerHarvesters = 1;
//Memory.vars.minUpgraders = 2;
//Memory.vars.minBuilders = 2;

var roleHarvester = require('role.harvester');
var roleHarvesterContainer = require('role.harvesterContainer');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var visuals = require('visuals');
var common = require('common');

module.exports.loop = function () {

    //common.initRoom();
    //common.checkExtensions();

    // Draw visuals (amount of energy in spawn out of total and so on)
    visuals.drawVisuals();

    // Automatically spawns at least 1 screep for roles 'harvester' and 'upgrader'
    common.spawnCreeps(); // Spawning new creeps
               
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