/**
 * SwingUtils Examples - DeadZone API Integration
 * 
 * This file demonstrates how to use SwingUtils to create useful windows
 */


// Track game data
const gameData = {
    tickCount: 0,
    gameState: "UNKNOWN",
    playerPosition: { x: 0, y: 0, plane: 0 },
    playerStatus: {
        moving: false,
        webWalking: false,
        inCombat: false,
        inWilderness: false,
        prayer: 0,
        runEnergy: 0,
        idle: false
    },
    inventoryItems: [],
    nearbyNpcs: [],
    nearbyPlayers: []
};

// Variables to hold window references
let statsWindow = null;
let movementTracker = null;
let inventoryMonitor = null;
let environmentMonitor = null;

/**
 * Game tick handler - updates all our tracked data
 */
function OnGameTick() {
    // Increment tick counter
    gameData.tickCount++;
    
    // Update player position data if possible
    try {
        const localPlayer = Client.getLocalPlayer();
        if (localPlayer) {
            const worldLocation = localPlayer.getWorldLocation();
            if (worldLocation) {
                gameData.playerPosition = {
                    x: worldLocation.getX(),
                    y: worldLocation.getY(),
                    plane: worldLocation.getPlane()
                };
            }
        }
    } catch (e) {
        // Handle error silently or log to debug console
        if (statsWindow) {
            statsWindow.log(`Error getting player position: ${e.message}`, "ERROR");
        }
    }
    
    // Update player status data
    try {
        gameData.playerStatus.moving = PlayerHelper.isMoving();
        gameData.playerStatus.webWalking = PlayerHelper.isWebWalking();
        gameData.playerStatus.inCombat = PlayerHelper.isInCombat();
        gameData.playerStatus.inWilderness = PlayerHelper.isInWilderness();
        gameData.playerStatus.prayer = Client.getBoostedSkillLevels(Skill.PRAYER);
        gameData.playerStatus.runEnergy = PlayerHelper.getRunEnergy();
        gameData.playerStatus.idle = PlayerHelper.isPlayerIdle();
    } catch (e) {
        // Handle error silently or log to debug console
        if (statsWindow) {
            statsWindow.log(`Error getting player status: ${e.message}`, "ERROR");
        }
    }
    
    // Get inventory items
    try {
        gameData.inventoryItems = Game.info.inventory.getItems() || [];
    } catch (e) {
        // Handle error silently
        gameData.inventoryItems = [];
    }
    
    // Get nearby NPCs
    try {
        gameData.nearbyNpcs = Game.info.npc.getAll() || [];
    } catch (e) {
        // Handle error silently
        gameData.nearbyNpcs = [];
    }
    
    // Get nearby players
    try {
        gameData.nearbyPlayers = Game.info.getPlayers() || [];
    } catch (e) {
        // Handle error silently
        gameData.nearbyPlayers = [];
    }
    
    // Update windows if they exist
    updateWindowsOnTick();
}

/**
 * Game state changed handler
 */
function OnGameStateChanged(event) {
    if (event) {
        const state = event.getGameState();
        if (state) {
            gameData.gameState = state.toString();
            
            // Log state changes to debug window
            if (statsWindow) {
                statsWindow.log(`Game state changed to: ${gameData.gameState}`, "INFO");
            }
        }
    }
}

/**
 * Updates all open windows with current game data
 */
function updateWindowsOnTick() {
    // Update player stats window
    if (statsWindow) {
        // Update stat labels with current values
        statsWindow.updateComponent("tick-count", `Ticks: ${gameData.tickCount}`);
        statsWindow.updateComponent("game-state", `State: ${gameData.gameState}`);
        statsWindow.updateComponent("position", `Position: ${gameData.playerPosition.x}, ${gameData.playerPosition.y}, ${gameData.playerPosition.plane}`);
        
        // Update status indicators
        statsWindow.updateComponent("moving", `Moving: ${gameData.playerStatus.moving ? 'Yes' : 'No'}`);
        statsWindow.updateComponent("webwalking", `Web Walking: ${gameData.playerStatus.webWalking ? 'Yes' : 'No'}`);
        statsWindow.updateComponent("in-combat", `In Combat: ${gameData.playerStatus.inCombat ? 'Yes' : 'No'}`);
        statsWindow.updateComponent("in-wilderness", `In Wilderness: ${gameData.playerStatus.inWilderness ? 'Yes' : 'No'}`);
        statsWindow.updateComponent("idle", `Idle: ${gameData.playerStatus.idle ? 'Yes' : 'No'}`);
        
        // Update resource bars
        if (statsWindow.components["prayer-bar"]) {
            statsWindow.components["prayer-bar"].setValue(gameData.playerStatus.prayer);
            statsWindow.components["prayer-bar"].setString(`Prayer: ${gameData.playerStatus.prayer}/99`);
        }
        
        if (statsWindow.components["energy-bar"]) {
            statsWindow.components["energy-bar"].setValue(gameData.playerStatus.runEnergy);
            statsWindow.components["energy-bar"].setString(`Energy: ${gameData.playerStatus.runEnergy}%`);
        }
    }
    
    // Update inventory monitor
    if (inventoryMonitor) {
        const displayItems = gameData.inventoryItems
            .filter(item => item !== null)
            .slice(0, 10) // Show first 10 items
            .map((item, index) => {
                try {
                    const itemComp = Client.getItemComposition(item.getId());
                    const name = itemComp ? itemComp.getName() : `Item #${item.getId()}`;
                    const quantity = item.getQuantity();
                    return { index, name, quantity, id: item.getId() };
                } catch (e) {
                    return { index, name: `Item #${item.getId()}`, quantity: item.getQuantity(), id: item.getId() };
                }
            });
            
        // Update item rows
        displayItems.forEach((item, idx) => {
            const idComponent = `inv-id-${idx}`;
            const nameComponent = `inv-name-${idx}`;
            const qtyComponent = `inv-qty-${idx}`;
            
            if (inventoryMonitor.components[idComponent]) {
                inventoryMonitor.updateComponent(idComponent, item.id.toString());
                inventoryMonitor.updateComponent(nameComponent, item.name);
                inventoryMonitor.updateComponent(qtyComponent, item.quantity.toString());
            }
        });
        
        // Update inventory count
        const totalItems = gameData.inventoryItems.filter(item => item !== null).length;
        const maxItems = 28; // Standard inventory size
        inventoryMonitor.updateComponent("inv-count", `Items: ${totalItems}/${maxItems}`);
        
        // Update "inventory full" indicator
        const isFull = Game.info.inventory.isFull();
        inventoryMonitor.updateComponent("inv-full", `Full: ${isFull ? 'Yes' : 'No'}`);
    }
    
    // Update movement tracker
    if (movementTracker) {
        const moving = gameData.playerStatus.moving;
        const webWalking = gameData.playerStatus.webWalking;
        
        // Update status
        movementTracker.updateComponent("moving-status", `Movement Status: ${moving ? 'Moving' : 'Stationary'}`);
        movementTracker.updateComponent("webwalk-status", `Web Walking: ${webWalking ? 'Active' : 'Inactive'}`);
        
        // Update position
        movementTracker.updateComponent("position-x", `X: ${gameData.playerPosition.x}`);
        movementTracker.updateComponent("position-y", `Y: ${gameData.playerPosition.y}`);
        movementTracker.updateComponent("position-plane", `Plane: ${gameData.playerPosition.plane}`);
        
        // Highlight movement indicator based on status
        if (moving && !webWalking) {
            movementTracker.updatePanelColor("status-panel", new java.awt.Color(70, 130, 180, 200)); // Blue for regular movement
        } else if (webWalking) {
            movementTracker.updatePanelColor("status-panel", new java.awt.Color(70, 180, 70, 200)); // Green for web walking
        } else {
            movementTracker.updatePanelColor("status-panel", new java.awt.Color(40, 40, 40, 200)); // Dark for stationary
        }
    }
    
    // Update environment monitor
    if (environmentMonitor) {
        // Update nearby entity counts
        const npcCount = gameData.nearbyNpcs.length;
        const playerCount = gameData.nearbyPlayers.length;
        
        environmentMonitor.updateComponent("npc-count", `NPCs: ${npcCount}`);
        environmentMonitor.updateComponent("player-count", `Players: ${playerCount}`);
        
        // Update NPC list (top 5)
        const topNpcs = gameData.nearbyNpcs.slice(0, 5);
        for (let i = 0; i < 5; i++) {
            const npcComponent = `npc-${i}`;
            if (environmentMonitor.components[npcComponent]) {
                if (i < topNpcs.length) {
                    const npc = topNpcs[i];
                    const name = npc.getName() || `NPC #${npc.getId()}`;
                    const combatLevel = npc.getCombatLevel();
                    environmentMonitor.updateComponent(npcComponent, `${name} (Lvl ${combatLevel})`);
                } else {
                    environmentMonitor.updateComponent(npcComponent, "-");
                }
            }
        }
        
        // Update Player list (top 5)
        const topPlayers = gameData.nearbyPlayers.slice(0, 5);
        for (let i = 0; i < 5; i++) {
            const playerComponent = `player-${i}`;
            if (environmentMonitor.components[playerComponent]) {
                if (i < topPlayers.length) {
                    const player = topPlayers[i];
                    const name = player.getName() || "Unknown";
                    const combatLevel = player.getCombatLevel();
                    environmentMonitor.updateComponent(playerComponent, `${name} (Lvl ${combatLevel})`);
                } else {
                    environmentMonitor.updateComponent(playerComponent, "-");
                }
            }
        }
        
        // Update wilderness info if in wilderness
        if (gameData.playerStatus.inWilderness) {
            const wildyLevel = PlayerHelper.getWildernessLevel(gameData.playerPosition);
            environmentMonitor.updateComponent("wilderness-level", `Wilderness Level: ${wildyLevel}`);
            environmentMonitor.updatePanelColor("wilderness-panel", new java.awt.Color(180, 70, 70, 200)); // Red for wilderness
        } else {
            environmentMonitor.updateComponent("wilderness-level", "Not in Wilderness");
            environmentMonitor.updatePanelColor("wilderness-panel", new java.awt.Color(40, 40, 40, 200)); // Dark for safe
        }
    }
}

/**
 * Creates all debug windows
 */
function createDebugWindows() {
    // Create player stats window
    statsWindow = SwingUtils.createDebugWindow({
        id: "player-stats",
        title: "Player Debug Info",
        colorScheme: SwingUtils.ColorSchemes.DEBUG
    });
    
    // Add some initial log entries
    statsWindow.log("Debug windows initialized", "INFO");
    statsWindow.log("Tracking player data...", "INFO");
    
    // Create inventory monitor window
    createInventoryMonitor();
    
    // Create movement tracker window
    createMovementTracker();
    
    // Create environment monitor window
    createEnvironmentMonitor();
    
    // Log successful initialization
    statsWindow.log("All monitoring windows created", "INFO");
}

/**
 * Creates the inventory monitoring window
 */
function createInventoryMonitor() {
    inventoryMonitor = SwingUtils.createWindow({
        id: "inventory-monitor",
        title: "Inventory Monitor",
        colorScheme: SwingUtils.ColorSchemes.DARK,
        width: 350,
        height: 400,
        x: 800,
        y: 100
    });
    
    // Create header panel
    const headerPanel = inventoryMonitor.createPanel({
        id: "header-panel",
        layout: "flow",
        position: BorderLayout.NORTH
    });
    
    // Add inventory summary info
    inventoryMonitor.createLabel({
        id: "inv-count",
        text: "Items: 0/28",
        panel: "header-panel",
        font: { family: "Dialog", style: java.awt.Font.BOLD, size: 12 }
    });
    
    inventoryMonitor.createLabel({
        id: "inv-full",
        text: "Full: No",
        panel: "header-panel",
        font: { family: "Dialog", style: java.awt.Font.BOLD, size: 12 }
    });
    
    // Create item list panel
    const itemsPanel = inventoryMonitor.createPanel({
        id: "items-panel",
        title: "Inventory Items",
        layout: "grid",
        layoutOptions: { rows: 11, cols: 3, vgap: 2 },
        position: BorderLayout.CENTER
    });
    
    // Add header row
    inventoryMonitor.createLabel({
        id: "header-id",
        text: "ID",
        panel: "items-panel",
        font: { family: "Dialog", style: java.awt.Font.BOLD, size: 12 }
    });
    
    inventoryMonitor.createLabel({
        id: "header-name",
        text: "Item Name",
        panel: "items-panel",
        font: { family: "Dialog", style: java.awt.Font.BOLD, size: 12 }
    });
    
    inventoryMonitor.createLabel({
        id: "header-qty",
        text: "Qty",
        panel: "items-panel",
        font: { family: "Dialog", style: java.awt.Font.BOLD, size: 12 }
    });
    
    // Add rows for item data (10 rows)
    for (let i = 0; i < 10; i++) {
        inventoryMonitor.createLabel({
            id: `inv-id-${i}`,
            text: "-",
            panel: "items-panel"
        });
        
        inventoryMonitor.createLabel({
            id: `inv-name-${i}`,
            text: "-",
            panel: "items-panel"
        });
        
        inventoryMonitor.createLabel({
            id: `inv-qty-${i}`,
            text: "-",
            panel: "items-panel"
        });
    }
    
    // Create actions panel
    const actionsPanel = inventoryMonitor.createPanel({
        id: "actions-panel",
        layout: "flow",
        position: BorderLayout.SOUTH
    });
    
    // Add a refresh button
    inventoryMonitor.createButton({
        id: "refresh-btn",
        text: "Refresh Now",
        panel: "actions-panel",
        onClick: function() {
            // Force an immediate update of inventory
            try {
                gameData.inventoryItems = Game.info.inventory.getItems() || [];
                updateWindowsOnTick();
                statsWindow.log("Inventory manually refreshed", "INFO");
            } catch (e) {
                statsWindow.log(`Error refreshing inventory: ${e.message}`, "ERROR");
            }
        }
    });
    
    // Show the window
    inventoryMonitor.show();
}

/**
 * Creates the movement tracking window
 */
function createMovementTracker() {
    movementTracker = SwingUtils.createWindow({
        id: "movement-tracker",
        title: "Movement Tracker",
        colorScheme: SwingUtils.ColorSchemes.DARK,
        width: 250,
        height: 200,
        x: 50,
        y: 450
    });
    
    // Create status panel
    const statusPanel = movementTracker.createPanel({
        id: "status-panel",
        title: "Movement Status",
        layout: "grid",
        layoutOptions: { rows: 2, cols: 1, vgap: 5 },
        position: BorderLayout.NORTH
    });
    
    // Add status labels
    movementTracker.createLabel({
        id: "moving-status",
        text: "Movement Status: Stationary",
        panel: "status-panel",
        font: { family: "Dialog", style: java.awt.Font.BOLD, size: 12 }
    });
    
    movementTracker.createLabel({
        id: "webwalk-status",
        text: "Web Walking: Inactive",
        panel: "status-panel",
        font: { family: "Dialog", style: java.awt.Font.BOLD, size: 12 }
    });
    
    // Create position panel
    const positionPanel = movementTracker.createPanel({
        id: "position-panel",
        title: "Current Position",
        layout: "grid",
        layoutOptions: { rows: 3, cols: 1, vgap: 5 },
        position: BorderLayout.CENTER
    });
    
    // Add position labels
    movementTracker.createLabel({
        id: "position-x",
        text: "X: 0",
        panel: "position-panel"
    });
    
    movementTracker.createLabel({
        id: "position-y",
        text: "Y: 0",
        panel: "position-panel"
    });
    
    movementTracker.createLabel({
        id: "position-plane",
        text: "Plane: 0",
        panel: "position-panel"
    });
    
    // Create actions panel
    const actionsPanel = movementTracker.createPanel({
        id: "actions-panel",
        layout: "flow",
        position: BorderLayout.SOUTH
    });
    
    // Add a "walk to origin" button
    movementTracker.createButton({
        id: "walk-origin-btn",
        text: "Walk to Origin",
        panel: "actions-panel",
        onClick: function() {
            try {
                // Create a world point at origin (Lumbridge)
                const WorldPoint = Java.type("net.runelite.api.coords.WorldPoint");
                const origin = new WorldPoint(3222, 3218, 0); // Lumbridge
                
                // Walk to origin
                PlayerHelper.webWalkTo(origin);
                statsWindow.log("Started web walking to Lumbridge", "INFO");
            } catch (e) {
                statsWindow.log(`Error walking to origin: ${e.message}`, "ERROR");
            }
        }
    });
    
    // Show the window
    movementTracker.show();
}

/**
 * Creates the environment monitoring window
 */
function createEnvironmentMonitor() {
    environmentMonitor = SwingUtils.createWindow({
        id: "environment-monitor",
        title: "Environment Monitor",
        colorScheme: SwingUtils.ColorSchemes.DARK,
        width: 300,
        height: 350,
        x: 500,
        y: 400
    });
    
    // Create entity count panel
    const countPanel = environmentMonitor.createPanel({
        id: "count-panel",
        title: "Nearby Entities",
        layout: "grid",
        layoutOptions: { rows: 2, cols: 1, vgap: 5 },
        position: BorderLayout.NORTH
    });
    
    // Add entity count labels
    environmentMonitor.createLabel({
        id: "npc-count",
        text: "NPCs: 0",
        panel: "count-panel",
        font: { family: "Dialog", style: java.awt.Font.BOLD, size: 12 }
    });
    
    environmentMonitor.createLabel({
        id: "player-count",
        text: "Players: 0",
        panel: "count-panel",
        font: { family: "Dialog", style: java.awt.Font.BOLD, size: 12 }
    });
    
    // Create NPC list panel
    const npcPanel = environmentMonitor.createPanel({
        id: "npc-panel",
        title: "Nearby NPCs",
        layout: "grid",
        layoutOptions: { rows: 5, cols: 1, vgap: 2 },
        position: BorderLayout.CENTER
    });
    
    // Add NPC rows
    for (let i = 0; i < 5; i++) {
        environmentMonitor.createLabel({
            id: `npc-${i}`,
            text: "-",
            panel: "npc-panel"
        });
    }
    
    // Create player list panel
    const playerPanel = environmentMonitor.createPanel({
        id: "player-panel",
        title: "Nearby Players",
        layout: "grid",
        layoutOptions: { rows: 5, cols: 1, vgap: 2 },
        position: BorderLayout.SOUTH
    });
    
    // Add player rows
    for (let i = 0; i < 5; i++) {
        environmentMonitor.createLabel({
            id: `player-${i}`,
            text: "-",
            panel: "player-panel"
        });
    }
    
    // Create wilderness panel
    const wildernessPanel = environmentMonitor.createPanel({
        id: "wilderness-panel",
        title: "Wilderness Info",
        layout: "grid",
        layoutOptions: { rows: 1, cols: 1 },
        position: BorderLayout.SOUTH
    });
    
    // Add wilderness info
    environmentMonitor.createLabel({
        id: "wilderness-level",
        text: "Not in Wilderness",
        panel: "wilderness-panel",
        font: { family: "Dialog", style: java.awt.Font.BOLD, size: 12 }
    });
    
    // Show the window
    environmentMonitor.show();
}

/**
 * Start function - called when plugin is loaded
 */
function OnStart() {
        Utility.print("Plugin start");

        // Create all debug windows
        createDebugWindows();
        
        // Log successful startup
        if (statsWindow) {
            statsWindow.log("Plugin started successfully", "INFO");
        }
}

/**
 * Stop function - called when plugin is unloaded
 */
function OnShutdown() {
    try {
        // Close all windows
        SwingUtils.closeAll();
    } catch (e) {
        console.error("Error stopping plugin: " + e.message);
    }
}