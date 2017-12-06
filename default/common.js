
// All possible types of harvesters
const creepHarvester = [
    [WORK, CARRY, MOVE],
    [WORK, WORK, CARRY, MOVE],
    [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
    ];

const creepDeliverer = [
    [CARRY, CARRY, MOVE, MOVE],
    [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    [CARRY, CARRY, CARRY, CARRY,CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
    ];

// All possible types of container harvesters:
const creepContainerHarvester = [
    [WORK, MOVE],
    [WORK, WORK, MOVE],
    [WORK, WORK, WORK, MOVE],
    [WORK, WORK, WORK, WORK, MOVE],
    [WORK, WORK, WORK, WORK, WORK, MOVE]
    ];

const creepUpgrader = [
    [WORK, CARRY, MOVE],
    [WORK, WORK, CARRY, MOVE],
    [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
    ];

const creepBuilder = [
    [WORK, CARRY, MOVE],
    [WORK, CARRY, CARRY, MOVE, MOVE],
    [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
    ];


/** @description Spawn a creep of selected modification (level) and role.  
* @param {array} creepMods array of different creep modifications, for example: [ [WORK, MOVE], [WORK, CARRY, MOVE]]
* @param {string} creepRole Role of the creep, for example 'builder'
*/
function spawnCreep(creepMods, creepRole)   // creepMods - array of creep builds, role - is the role
{
    var currentCreep = null;   // Select the cheapest creep for beginning
    for (creepMod in creepMods)    // looking for all possible creeps of that type
    {
        if (creepPrice(creepMods[creepMod]) < Game.spawns['Spawn1'].room.energyAvailable)  // if room has enough energy, then spawn the largest creep of this type
            currentCreep = creepMods[creepMod];
    }

    if (currentCreep != null) {
        console.log('Spawning ', creepRole, ' :', currentCreep, ' with energy price: ', creepPrice(currentCreep));
        Game.spawns['Spawn1'].spawnCreep(currentCreep, creepRole + Game.time.toString(), { memory: { role: creepRole } });
    }
}

/** @description Returns energy price of creep depending on it modification
* @param {array} creepMods array with creep parts, for example: [WORK, CARRY, MOVE]
* @return {int} Creep price.
*/
function creepPrice(creepParts)
{
    var price = 0;
    for (var creepPart in creepParts)
    {
        price = price + BODYPART_COST[creepParts[creepPart]];
    }

    return price;
}

// checks Memory for entries of missing (dead) creeps and removes them
function clearMemory()
{
    console.log('Clearing memory');
    for (memCreep in Memory.creeps)
    {
        if (!Game.creeps[memCreep])     // If there are something in memory for creep, that doesn't exist, clear this memory'
            delete Memory.creeps[memCreep];

        if (Memory.creeps[memCreep].role == undefined)        // If there are creeps with no role specified, kill that creep.
            Game.creeps[memCreep].suicide();
        // Probably we should not kill this creeps, but reverse them with some role, that we a lacking this time
    }
}

// gatherEnergy(creep) - function for creep to gather energy. First looks for container with energy and gets it from there.
// If no containers with energy, then it looks for energy source and gathers energy from it.
//
module.exports.gatherEnergy = function (creep) {
        
    var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: (res) =>
            (res.resourceType == RESOURCE_ENERGY) &&
            (res.amount >= 50)
    });

    if (droppedEnergy.length > 0) {
        if (creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(droppedEnergy[0], { visualizePathStyle: { stroke: '#ffff00' } }); // path to energy source marked with yellow
        }
        return;
    }
    
    // Finding a container that has more energy then the creep's can carry
    var sources = creep.room.find(FIND_STRUCTURES, {
        filter: (struct) =>
                (struct.structureType == STRUCTURE_CONTAINER) && 
                (struct.store[RESOURCE_ENERGY] > creep.carryCapacity)
    });

    // If there are no containers found or container contains too few energy, then looking for energy sources
    if (sources.length<1)
    {
        if (creep.harvest(Game.getObjectById(Game.spawns['Spawn1'].room.memory.sources[0].id) ) == ERR_NOT_IN_RANGE){
            creep.moveTo(Game.getObjectById(Game.spawns['Spawn1'].room.memory.sources[0].id) , { visualizePathStyle: { stroke: '#ffff00' } }); // path to energy source marked with yellow
        }
    }
    else    // If there is container found and it contains energy, then withdrawing energy from it
    {
        if (creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#0000ff' } });    // path to container marked with blue
        }
    }
}

// spawnCreeps() - function to check for existing creeps and spawn missing creeps
module.exports.spawnCreeps = function ()
{
    if (Game.spawns['Spawn1'].spawning || Game.spawns['Spawn1'].room.energyAvailable<200) // If spawner is already spawning something or energyu is less than 200 then leaving this function
        return;

    if (_.filter(Game.creeps, function (creep) { return creep.memory.role == 'harvester' && creep.ticksToLive > 20; }).length < Memory.vars.minHarvesters) {
        clearMemory();  // Clear memory from dead creeps
        spawnCreep(creepHarvester, 'harvester');
        return; // Not to try spawning additional creeps this turn
    }

    if (_.filter(Game.creeps, function (creep) { return creep.memory.role == 'harvesterContainer' && creep.ticksToLive > 12; }).length < Memory.vars.minContainerHarvesters) {
        clearMemory();
        spawnCreep(creepContainerHarvester, 'harvesterContainer');
        return;
    }

    if (_.filter(Game.creeps, function (creep) { return creep.memory.role == 'upgrader' && creep.ticksToLive > 12; }).length < Memory.vars.minUpgraders) {
        clearMemory();
        spawnCreep(creepUpgrader, 'upgrader');
        return;
    }

    if (_.filter(Game.creeps, function (creep) { return creep.memory.role == 'builder' && creep.ticksToLive > 12; }).length < Memory.vars.minBuilders) {
        clearMemory();
        spawnCreep(creepBuilder, 'builder');
        return;
    }

}

/** @description Find all sources in room with 'Spawn1' and make array of them, sorted by the distance from spawn
*/
module.exports.initRoom = function ()
{
    // Probably should add 'roomName' parameter to the function to go out from 'Spawn1', but then we additionally have to find spawn in this room

    // Listing all sources in the room with Spawn1 in memory sorting them by distance
    var sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
    var sourcesSorted = _.sortBy(sources, s => Game.spawns['Spawn1'].pos.getRangeTo(s));
    Game.spawns['Spawn1'].room.memory.sources = sourcesSorted;

    for (source in sourcesSorted) {
        var surroundings = Game.spawns['Spawn1'].room.lookAtArea(sourcesSorted[source].pos.y - 1, sourcesSorted[source].pos.x - 1, sourcesSorted[source].pos.y + 1, sourcesSorted[source].pos.x + 1, true); // true for getting results as plain array
        var containerFound = false;
        for (var cell in surroundings) {
            if (surroundings[cell].type == "creep" || surroundings[cell].type == "source" || surroundings[cell].terrain == "wall")
                continue;   // if we are looking or source, wall or just entry with creep, then ignore it and go to next for iteration

            if (surroundings[cell].type == "source" && surroundings[cell].structure.structureType == "container") {
                // If we found a container, set a found flag, so later we know that there are no need to build another container
                // Add info for this container in memory looking like: Memory.rooms[roomname].spawns[spawnname].<source>.containers
                // Possibly has to change it, not just looking for 1 container, but counting containers around source and putting this info in memory
                containerFound = true;
                Game.spawns['Spawn1'].room.memory.sourcesSorted[source].container = surroundings[cell].structure;
            }

            if (surroundings[cell].type == "terrain") {
                // Adding to memory info about free terrain spots (plains and swamp) around source
                // free attribute is for creeps to look for free cell and occupy it (free: false), if no free cells, then go to next source
                Game.spawns['Spawn1'].room.memory.sourcesSorted[source].freeSpaces.push({ "x": surroundings[cell].x, "y": surroundings[cell].y, "free": true });
            }
        }

        if (!containerFound) {
            // Here we add code fo building a container on a free space, for example Game.spawns['Spawn1'].room.memory.sourcesSorted[source].freeSpaces[0]
            // better is to count free spaces and get a middle from it, so a container will appear in the central free cell near source to provide access for more creeps
            // Ideally is to find for container a freecell near source, that is surrounded by maximum number of freecells, so the container is accessible for max creeps
            // if any containerharvesters exist, we should put free=false on the cell with container, so other creeps will not occupy it. But we have to check if container building is finished.
            var containerX = Game.spawns['Spawn1'].room.memory.sourcesSorted[source].freeSpaces[0].x;
            var containerY = Game.spawns['Spawn1'].room.memory.sourcesSorted[source].freeSpaces[0].y;
            Game.spawns['Spawn1'].room.createConstructionSite(containerX, containerY, STRUCTURE_CONTAINER);
        }
    }

        //var containerFound = false;
        //var structures = Game.spawns['Spawn1'].room.lookForAtArea(LOOK_STRUCTURES, sourcesSorted[source].pos.y - 1, sourcesSorted[source].pos.x - 1, sourcesSorted[source].pos.y + 1, sourcesSorted[source].pos.x + 1);
        //Game.spawns['Spawn1'].room.memory.structures = structures;
        //// delete Game.spawns['Spawn1'].room.memory.structures;
        //var containers = [];        // new Array()
        //for (y in structures) 
        //    for (x in structures[y])
        //        if (structures[y][x].length > 0)
        //            for (structure in structures[y][x])
        //                if (structures[y][x][structure].structureType == 'container')
        //                {
        //                    containerFound = true;
        //                    containers.push(structures[y][x][structure]);       // Adding container to array
        //                }
        //// console.log(containers);
        //if (containerFound) {
        //    Game.spawns['Spawn1'].room.memory.sources[source].containers = containers;
        //}
        //else
        //{
        //    // Here add code for building a container near source
        //    // We have to check for free spaces near a source and build container there
        //}
}

/** @description Check, if number of spawn extensions is compared to controller level and building new extensions if needed
* Possibly we have to add a 'roomName' param to deal with different rooms, now we work only with room with 'Spawn1'
*/
module.exports.checkExtensions = function ()
{
    // Possibly we have to add a flag in the memory, that for example for controller level 2 is everything done (while loop finished OK)
    // Then just check in the very beginning, if controller level still the same and everything was done, then just leave function to save CPU
    const capacities = [300, 550, 800, 1300, 1800, 2300, 2800, 3300];
    if (Game.spawns['Spawn1'].room.energyCapacityAvailable >= capacities[Game.spawns['Spawn1'].room.controller.level - 1])
        return; // Already built all extensions for this controller level

    extensionsToBuild = (capacities[Game.spawns['Spawn1'].room.controller.level - 1] - Game.spawns['Spawn1'].room.energyCapacityAvailable) / 50;

    var coordOffset = 1; // at first starting building 1 cell away from spawn, then we will go by spiral adding to coordOffset
    while (extensionsToBuild > 0)
    {
         for (var x = Game.spawns['Spawn1'].pos.x - coordOffset; Game.spawns['Spawn1'].pos.x + coordOffset; x++)
            for (var y = Game.spawns['Spawn1'].pos.y - coordOffset; Game.spawns['Spawn1'].pos.y + coordOffset; y++)
            {
                // This loops can be not effective, because increasing coordoffset we still checking everything inside the area, what was done in the previous loop
                var tryResult = Game.spawns['Spawn1'].room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
                if (tryResults == OK) {  // Construction site created OK
                    extensionsToBuild--;
                    continue;
                } else if (tryResults == ERR_FULL || tryResults == ERR_RCL_NOT_ENOUGH)
                    return; // If errors "too many construction sites" or "insufficient controller level", then leave the function
            }
         coordOffset++; // Increasing coordOffset - going further away from spawn by spirale
    }
}