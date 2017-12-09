(function (root) {
    "use strict";

    var Zone = {
        Wildland: {
            name: "Wildland",
            description: "",
            owned: true,
            price: 0,
        }
    };

    Zone.init = function (zone) {
        var options = {
            width: 21,
            height: 13,
            fontSize: 20,
            forceSquareRatio: true,
            fontFamily: "fixedsys",
            spacing: 1.10
        };

        World.display = new ROT.Display(options);
        if (World.containerDiv.hasChildNodes()) {
            World.containerDiv.removeChild(World.containerDiv.childNodes[0]);
        }

        World.contentDiv.innerText = zone.name;
        World.containerDiv.appendChild(World.display.getContainer());

        World.map = {};
        zone.generateMap();

        var scheduler = new ROT.Scheduler.Simple();
        scheduler.add(World.player, true);

        World.engine = new ROT.Engine(scheduler);
        World.engine.start();
    };

    /**
     * 
     */
    Zone.Wildland.init = function () {
        return Zone.init(Zone.Wildland);
    };

    Zone.Wildland.generateMap = function () {
        World.map = new RoguelikeMap.WildlandMap(50, 30);

        var digCallback = function (tile) {
            World.map.setTile(tile.getX(), tile.getY(), tile);
        };

        World.map.create(digCallback.bind(this));

        World.map.setFreeCells();

        this.generateStuff(World.map.getFreeCells());
        this.createPlayer(World.map.getFreeCells());

        World.display.clear();
        World.render();
    };

    Zone.Wildland.drawWholeMap = function () {
        for (var x = 0; x < 50; x++) {
            for (var y = 0; y < 30; y++) {
                World.display.draw(x, y, World.map.getTile(x, y).getIcon());
            }
        }
    };

    Zone.Wildland.generateStuff = function (freeCells) {
        for (var i = 0; i < 10; i++) {
            let randomTile = freeCells[Math.floor(ROT.RNG.getUniform() * freeCells.length)];
            World.map.getTile(randomTile.getX(), randomTile.getY()).addItem(new Item("Berry", 1));
        }

        World.map.setFreeCells();
    };

    Zone.Wildland.createPlayer = function (freeCells) {
        let randomTile = freeCells[Math.floor(ROT.RNG.getUniform() * freeCells.length)];

        World.player = new Player(randomTile.getX(), randomTile.getY());
    };

    root.Zone = Zone;
}(this));