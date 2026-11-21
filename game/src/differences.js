// differences.js — the difference sets for Harbour Lights.
//
// Each round holds seven differences. A difference is a spot on the scene
// (panel coordinates, 560 x 420) with a short name, a hint line, and a hit
// radius. The scene painter in scenes.js reads the same ids and draws the
// changed version of that spot on the right-hand panel only.

const PANEL_W = 560;
const PANEL_H = 420;

const ROUNDS = [
  {
    name: 'Golden Hour',
    blurb: 'The cafe is waking up. Seven small things changed on the right.',
    timeLimit: 180,
    hints: 3,
    differences: [
      { id: 'sun', name: 'The sun', x: 468, y: 66, r: 34, hint: 'Look high in the sky, on the right side.' },
      { id: 'cat', name: 'The dock cat', x: 246, y: 372, r: 26, hint: 'Something furry sits on the boards near the cafe.' },
      { id: 'awning', name: 'Awning stripes', x: 418, y: 186, r: 30, hint: 'The cafe awning changed its colours.' },
      { id: 'flag', name: 'Boat flag', x: 140, y: 223, r: 22, hint: 'The little sailboat lost something at the top of its mast.' },
      { id: 'window', name: 'Cafe window', x: 360, y: 236, r: 26, hint: 'One cafe window glows on the left and stays dark on the right.' },
      { id: 'gull', name: 'A seagull', x: 196, y: 82, r: 22, hint: 'Count the gulls in the sky.' },
      { id: 'flowerpot', name: 'Flower pot', x: 322, y: 366, r: 24, hint: 'A pot of flowers stands by the cafe door.' }
    ]
  },
  {
    name: 'Evening Tide',
    blurb: 'The tide is coming in and the light is fading. Look closer.',
    timeLimit: 150,
    hints: 3,
    differences: [
      { id: 'beam', name: 'Lighthouse beam', x: 62, y: 176, r: 30, hint: 'The lighthouse is sweeping its light across the water.' },
      { id: 'smoke', name: 'Chimney smoke', x: 508, y: 76, r: 26, hint: 'Smoke curls above the cafe roof.' },
      { id: 'umbrella', name: 'Umbrella colour', x: 182, y: 296, r: 32, hint: 'The table umbrella is a different colour.' },
      { id: 'buoy', name: 'The buoy', x: 452, y: 288, r: 24, hint: 'Something bobs in the water near the pier.' },
      { id: 'cup', name: 'Second cup', x: 206, y: 324, r: 20, hint: 'Two cups sit on the table. Or one.' },
      { id: 'sign', name: 'Cafe sign', x: 420, y: 158, r: 26, hint: 'Read the cafe sign carefully, letter by letter.' },
      { id: 'rope', name: 'Rope coil', x: 286, y: 392, r: 24, hint: 'A coil of rope lies on the dock boards.' }
    ]
  },
  {
    name: 'Last Light',
    blurb: 'Nearly dark now. The last differences are the shyest ones.',
    timeLimit: 120,
    hints: 2,
    differences: [
      { id: 'clock', name: 'Cafe clock', x: 318, y: 232, r: 22, hint: 'The clock on the cafe wall shows a different time.' },
      { id: 'shutters', name: 'Upper window', x: 519, y: 160, r: 24, hint: 'Count the small windows beside the cafe sign.' },
      { id: 'anchor', name: 'Wall anchor', x: 436, y: 268, r: 24, hint: 'Something hangs on the cafe wall by the door.' },
      { id: 'starfish', name: 'Starfish', x: 96, y: 396, r: 20, hint: 'A starfish rests on the sand at the waterline.' },
      { id: 'sail', name: 'Sail stripe', x: 132, y: 246, r: 26, hint: 'The sailboat sail carries a stripe.' },
      { id: 'reflection', name: 'Sun reflection', x: 468, y: 306, r: 26, hint: 'The sun leaves a glittering path on the water.' },
      { id: 'lantern', name: 'Pier lantern', x: 52, y: 330, r: 22, hint: 'The lantern at the end of the pier glows.' }
    ]
  }
];

// How many points a find is worth, before the time bonus.
const POINTS_PER_FIND = 100;
const POINTS_PER_HINT_COST = 50;
const WRONG_CLICK_PENALTY = 10;
