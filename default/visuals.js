
module.exports.drawVisuals = function () {
    new RoomVisual().text(Game.spawns['Spawn1'].room.energyAvailable + '/' + Game.spawns['Spawn1'].room.energyCapacityAvailable, Game.spawns['Spawn1'].pos.x, Game.spawns['Spawn1'].pos.y + 1.5, { align: 'center' });
}