/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */

// Нужно добавить код, чтобы он в первую очередь строил наиболее построенную структуру

// Game.rooms['W3N5'].find(FIND_MY_STRUCTURES, {
// filter: { hitsMax/hits>2 }
// })

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                // Сюда добавляем поиск наиболее построееного сайта, чтобы в первую очередь достраивать его
                var completestSiteNumber = 0;
                var completestSiteProgress = targets[completestSiteNumber].progress;
                for (var site in targets)
                {
                    if (targets[site].progress > completestSiteProgress)
                    {
                        completestSiteNumber = site;
                        completestSiteProgress = targets[site].progress;
                    }
                }
                // console.log('Completest site progress = ', completestSiteProgress);
                if (creep.build(targets[completestSiteNumber]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[completestSiteNumber], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            else {  // No valid targets found for building, we need to free space near energy source
                // console.log('Nothing to build');
                var spawnss = creep.room.find(FIND_STRUCTURES, {
                    filter: { structureType: STRUCTURE_SPAWN }
                });
                creep.moveTo(spawnss[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
            {

            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
	    }
	}
};

module.exports = roleBuilder;