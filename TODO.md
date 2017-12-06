## TODO
 * Automatic room maintenance
	* Enlist all sources and put them in memory as array
		* Done, needs checking
	* Mark and put in memory all clear spaces around sources (terrain <> wall)
		done, needs checking
	* Check if there is container exist next to source, if not - build it
		* done, needs checking
	* Make a flag, that room has already been initialized (sources, free spaces, containers), not to check it in future to save CPU
	* After all containers are completely built, build roads from sources to spawn and controller, then put a flag, that roads built
	* Remove flag abour room initialization (and possibly roads) after enemy invasion, to check if something was destroyed
	* Automate build of spawn extensions depending on room controller level (get square 4-5 cells away from spawn and try to fill it with extensions)
		* done, needs checking. We go not on square, but by spiral away from spawn.
	* Change the function to pass roomName to it instead of working only with Spawn1.

 * Change gatherEnergy
	* If going to gather from source, then look for free spaces (from memory) around source, and if found, occupy them. 
	If not - go to the next source. If still nothing found, go to distance of 3-4 cells away from the closest source and wait for free cell
	* Check gathering from ground, is it worth to spawn ContainerHarvesters until any containers are built

* Change ContanerHarvesters
	* If no containers found, gather to ground
	* If container is found, mark this plot as free=false, so other creeps will not occupy it.

* Change gatherers code
	* change their role, if spawn is fully charged, and change role back if spawn is not fully charged.

* Implement deliverers (without WORK, just to transfer energy from gound/container to the spawn)

* Check if it's more economically efficшуте to heal creeps, than to spawn new creeps after dead ones

* Implement defender creeps