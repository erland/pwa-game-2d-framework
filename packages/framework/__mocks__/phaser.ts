// Minimal stubs to satisfy imports; add more surface as needed by your tests.
class Scene {}
class GameObjectsContainer {}

export default {
  Scene,
  GameObjects: {
    Container: GameObjectsContainer,
    Text: class {},
    Graphics: class {},
  },
  Input: {
    Keyboard: {
      KeyCodes: { UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39, W: 87, A: 65, S: 83, D: 68 },
    },
    Pointer: class {},
  },
  Scale: { CENTER_BOTH: 0 },
  Math: { Between: (a: number, b: number) => a + Math.floor((b - a) / 2) },
  Events: { EventEmitter: class {} },
} as unknown as typeof import('phaser');