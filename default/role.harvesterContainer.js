

var roleHarvesterContainer = {

    // Have to change, that it will go to the closest energy source to Spawn

    /** @param {Creep} creep **/
    run: function (creep) {

        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (struct) =>
                (struct.structureType == STRUCTURE_CONTAINER)
        });


        // at first we have to move the creep over a container, so energy will fall in it
        // probably we first have to look at that coord, if someone is standing there, then do nothins (to save CPU) or mine energy to floor (to save time)
        // also good idea first to look under a creep, probably it's already standing over a some container, then do nothing
        // we also can do a loop to cycle through all containers and move to the free one, cause we can have more than 1 container
        if ( (containers.length > 0) && !(creep.pos.isEqualTo(containers[0].pos)) )  {
            creep.moveTo(containers[0]);
            return; // If there are containers exist and we are standing not over container, then don't harvest'
        }

        if (creep.harvest(Game.getObjectById(Game.spawns['Spawn1'].room.memory.sources[0].id)) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(Game.spawns['Spawn1'].room.memory.sources[0].id), { visualizePathStyle: { stroke: '#ffff00' } }); // path to energy source marked with yellow
        }
    }
};

module.exports = roleHarvesterContainer;