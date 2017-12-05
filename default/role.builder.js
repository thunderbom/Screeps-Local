/*
Script for builder creep
It takes energy from container or energy source (if container is empty)
Then it looks for unbuilt structures and performs building task on the most completed structure
If there are nothing to be built, then it's looking for structures, that needs repairing (damaged more than on 10%) and repairs it.
*/

var common = require('common');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvest');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('build');
        }

        // We have to rewrite code, that builder start repairing walls only when everything is built, and more than for 50% healthy
        // We should repair the weakest wall
	    if(creep.memory.building) {
	        var buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (buildTargets.length>0) {
                // Searching for the most completed site to finish it in the first time
                var completestSiteNumber = 0;
                var completestSiteProgress = buildTargets[completestSiteNumber].progress;
                for (var site in buildTargets)
                {
                    if (buildTargets[site].progress > completestSiteProgress)
                    {
                        completestSiteNumber = site;
                        completestSiteProgress = buildTargets[site].progress;
                    }
                }

                if (buildTargets[completestSiteNumber].progress == 0)   // If there are no started sites, then start the site, closest to Spawn1
                {
                    buildTargets = _.sortBy(buildTargets, target => Game.spawns['Spawn1'].pos.getRangeTo(target));
                }

                if (creep.build(buildTargets[completestSiteNumber]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(buildTargets[completestSiteNumber], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            else {  // No valid targets found for building, we need to free space near energy source
                var repairTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.hits < (structure.hitsMax - (structure.hitsMax / 30)) &&
                            (structure.structureType != STRUCTURE_WALL) );     // All structures, that are damaged more than for 30%, but no walls
                    }
                });

                if (repairTargets.length < 1) {     // If no structures to repair other than walls, then look for walls damaged mor ethan for 30%, and repairing the wall with least HP
                    repairTargets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.hits < (structure.hitsMax - (structure.hitsMax / 30)));     // All structures, that are damaged more than for 30%, but no walls
                        }
                    });
                    repairTargets = _.sortBy(repairTargets, function (target) { return target.hits; })
                }

                if (creep.repair(repairTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairTargets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
	    }
	    else {
	        common.gatherEnergy(creep);
	    }
	}
};

module.exports = roleBuilder;