//

var common = require('common');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.carry.energy == creep.carryCapacity && creep.memory.harvesting) {    // Creep is full, going upgrading
            creep.memory.harvesting = false;
            creep.say('U upgrading');
        }
        if (creep.carry.energy == 0 && !creep.memory.harvesting) {  // Creep is empty, going to harvest
            creep.memory.harvesting = true;
            creep.say('H harvest');
        }

        if (creep.memory.harvesting) {  // Going harvesting
            common.gatherEnergy(creep);
            //var sources = creep.room.find(FIND_SOURCES);
            //if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            //    creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            //}
        }
        else {      // Going upgrading
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
};

module.exports = roleUpgrader;