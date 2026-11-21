// scenes.js — paints the harbour cafe scene on a canvas.
//
// drawHarbourScene draws one panel of "Harbour Lights": a cosy harbour cafe
// at golden hour. The left panel is drawn with no differences applied; the
// right panel is drawn with the round's difference ids in `changed`, and
// every difference id flips exactly one small thing in the picture. All art
// is drawn in code — no images are loaded.

function harbourPalette(roundIndex) {
  // Round 1 is golden hour, round 2 duskier, round 3 nearly dark.
  const palettes = [
    { skyTop: '#ffb347', skyMid: '#ff8e6e', skyLow: '#ffd9a0', seaTop: '#3f7ea6', seaLow: '#2a5a7c', sand: '#e8c98f' },
    { skyTop: '#e8804f', skyMid: '#c65f74', skyLow: '#f2b183', seaTop: '#356b8f', seaLow: '#234a68', sand: '#d9b57e' },
    { skyTop: '#b25a63', skyMid: '#7d4a72', skyLow: '#d98a6d', seaTop: '#2c5878', seaLow: '#1d3d57', sand: '#c9a26e' }
  ];
  return palettes[roundIndex] || palettes[0];
}

function drawHarbourScene(ctx, roundIndex, changed) {
  const W = PANEL_W;
  const H = PANEL_H;
  const pal = harbourPalette(roundIndex);
  const has = function (id) { return changed.has(id); };

  ctx.clearRect(0, 0, W, H);

  // ---- sky ---------------------------------------------------------------
  const sky = ctx.createLinearGradient(0, 0, 0, 250);
  sky.addColorStop(0, pal.skyTop);
  sky.addColorStop(0.55, pal.skyMid);
  sky.addColorStop(1, pal.skyLow);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 250);

  // ---- sun (difference: sun) ---------------------------------------------
  if (!has('sun')) {
    ctx.fillStyle = '#fff3c4';
    ctx.beginPath();
    ctx.arc(468, 66, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 243, 196, 0.35)';
    ctx.beginPath();
    ctx.arc(468, 66, 48, 0, Math.PI * 2);
    ctx.fill();
  }

  // ---- clouds ------------------------------------------------------------
  drawCloud(ctx, 118, 58, 1);
  drawCloud(ctx, 298, 42, 0.8);
  drawCloud(ctx, 428, 112, 0.7);

  // ---- seagulls (difference: gull — the middle bird) ---------------------
  drawGull(ctx, 140, 96);
  if (!has('gull')) drawGull(ctx, 196, 82);
  drawGull(ctx, 252, 104);

  // ---- distant headland and lighthouse -----------------------------------
  ctx.fillStyle = '#5d6b52';
  ctx.beginPath();
  ctx.moveTo(0, 250);
  ctx.lineTo(0, 210);
  ctx.lineTo(70, 196);
  ctx.lineTo(120, 226);
  ctx.lineTo(150, 250);
  ctx.closePath();
  ctx.fill();

  // Lighthouse on the headland.
  ctx.fillStyle = '#f4ede0';
  ctx.fillRect(52, 150, 20, 62);
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(52, 166, 20, 8);
  ctx.fillRect(52, 188, 20, 8);
  ctx.fillStyle = '#33414f';
  ctx.fillRect(50, 142, 24, 10);
  ctx.fillStyle = '#ffe27a';
  ctx.beginPath();
  ctx.arc(62, 147, 5, 0, Math.PI * 2);
  ctx.fill();
  // Lighthouse beam (difference: beam).
  if (!has('beam')) {
    ctx.fillStyle = 'rgba(255, 226, 122, 0.28)';
    ctx.beginPath();
    ctx.moveTo(62, 147);
    ctx.lineTo(210, 118);
    ctx.lineTo(210, 176);
    ctx.closePath();
    ctx.fill();
  }

  // ---- sea ---------------------------------------------------------------
  const sea = ctx.createLinearGradient(0, 250, 0, 340);
  sea.addColorStop(0, pal.seaTop);
  sea.addColorStop(1, pal.seaLow);
  ctx.fillStyle = sea;
  ctx.fillRect(0, 250, W, 90);
  // Gentle wave lines.
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const y = 262 + i * 14;
    ctx.beginPath();
    ctx.moveTo(20 + i * 12, y);
    ctx.quadraticCurveTo(140, y - 5, 260, y);
    ctx.quadraticCurveTo(380, y + 5, 520, y - 2);
    ctx.stroke();
  }
  // Sun reflection (difference: reflection).
  if (!has('reflection')) {
    ctx.fillStyle = 'rgba(255, 220, 130, 0.45)';
    for (let i = 0; i < 6; i++) {
      const y = 258 + i * 12;
      const w = 60 - i * 6;
      ctx.fillRect(468 - w / 2, y, w, 4);
    }
  }

  // ---- sailboat (differences: flag, sail) --------------------------------
  ctx.fillStyle = '#7a4a2b';
  ctx.beginPath();
  ctx.moveTo(96, 268);
  ctx.lineTo(168, 268);
  ctx.lineTo(156, 282);
  ctx.lineTo(108, 282);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#5d3820';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(132, 268);
  ctx.lineTo(132, 218);
  ctx.stroke();
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath();
  ctx.moveTo(132, 222);
  ctx.lineTo(132, 262);
  ctx.lineTo(160, 262);
  ctx.closePath();
  ctx.fill();
  // Sail stripe (difference: sail).
  if (!has('sail')) {
    ctx.fillStyle = '#e2725b';
    ctx.beginPath();
    ctx.moveTo(132, 236);
    ctx.lineTo(132, 248);
    ctx.lineTo(150, 248);
    ctx.closePath();
    ctx.fill();
  }
  // Boat flag (difference: flag).
  if (!has('flag')) {
    ctx.fillStyle = '#e2725b';
    ctx.beginPath();
    ctx.moveTo(132, 218);
    ctx.lineTo(152, 223);
    ctx.lineTo(132, 228);
    ctx.closePath();
    ctx.fill();
  }

  // ---- buoy (difference: buoy) -------------------------------------------
  ctx.fillStyle = has('buoy') ? '#f2c230' : '#d94f3d';
  ctx.beginPath();
  ctx.arc(452, 288, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fdf6e3';
  ctx.fillRect(446, 282, 12, 4);

  // ---- sand strip and dock -----------------------------------------------
  ctx.fillStyle = pal.sand;
  ctx.fillRect(0, 340, W, 80);
  ctx.fillStyle = 'rgba(120, 84, 40, 0.25)';
  ctx.fillRect(0, 340, W, 4);

  // Wooden dock boards across the foreground.
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(0, 356, W, 64);
  ctx.fillStyle = '#754a28';
  for (let x = 0; x < W; x += 56) ctx.fillRect(x, 356, 3, 64);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(0, 356, W, 3);

  // Starfish resting on the dock boards (difference: starfish).
  if (!has('starfish')) drawStarfish(ctx, 96, 396);

  // Pier lantern at the dock end (difference: lantern).
  ctx.fillStyle = '#2e2a26';
  ctx.fillRect(48, 306, 6, 30);
  ctx.fillStyle = has('lantern') ? '#6b5a45' : '#ffd76a';
  ctx.beginPath();
  ctx.arc(51, 300, 9, 0, Math.PI * 2);
  ctx.fill();
  if (!has('lantern')) {
    ctx.fillStyle = 'rgba(255, 215, 106, 0.3)';
    ctx.beginPath();
    ctx.arc(51, 300, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  // ---- the cafe ----------------------------------------------------------
  // Walls and roof.
  ctx.fillStyle = '#f7ead2';
  ctx.fillRect(300, 150, 240, 190);
  ctx.fillStyle = '#b5502e';
  ctx.beginPath();
  ctx.moveTo(292, 152);
  ctx.lineTo(420, 108);
  ctx.lineTo(548, 152);
  ctx.closePath();
  ctx.fill();
  // Chimney and smoke (difference: smoke).
  ctx.fillStyle = '#9c4a30';
  ctx.fillRect(492, 96, 18, 34);
  if (!has('smoke')) {
    ctx.fillStyle = 'rgba(245, 240, 230, 0.85)';
    ctx.beginPath();
    ctx.arc(501, 88, 9, 0, Math.PI * 2);
    ctx.arc(508, 74, 12, 0, Math.PI * 2);
    ctx.arc(516, 58, 10, 0, Math.PI * 2);
    ctx.fill();
  }
  // Cafe sign (difference: sign — the accent on the E).
  ctx.fillStyle = '#2e2a26';
  ctx.fillRect(348, 146, 144, 24);
  ctx.fillStyle = '#ffe9a8';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(has('sign') ? 'HARBOUR CAFE' : 'HARBOUR CAFÉ', 420, 159);

  // Small windows flanking the sign (difference: shutters — the right one).
  ctx.fillStyle = '#7fb3c8';
  ctx.fillRect(312, 150, 18, 20);
  if (!has('shutters')) {
    ctx.fillStyle = '#7fb3c8';
    ctx.fillRect(510, 150, 18, 20);
  }
  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 2;
  ctx.strokeRect(312, 150, 18, 20);
  if (!has('shutters')) ctx.strokeRect(510, 150, 18, 20);

  // Awning (difference: awning — stripe colour).
  const stripeA = has('awning') ? '#3f7ea6' : '#d94f3d';
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 === 0 ? stripeA : '#fdf6e3';
    ctx.fillRect(312 + i * 28, 176, 28, 22);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(312, 194, 224, 4);

  // Cafe windows and door.
  // Left window glows on the left panel (difference: window).
  ctx.fillStyle = has('window') ? '#7fb3c8' : '#ffd76a';
  ctx.fillRect(344, 216, 32, 40);
  ctx.fillStyle = '#7fb3c8';
  ctx.fillRect(392, 216, 32, 40);
  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 2;
  ctx.strokeRect(344, 216, 32, 40);
  ctx.strokeRect(392, 216, 32, 40);
  ctx.beginPath();
  ctx.moveTo(360, 216);
  ctx.lineTo(360, 256);
  ctx.moveTo(344, 236);
  ctx.lineTo(376, 236);
  ctx.moveTo(408, 216);
  ctx.lineTo(408, 256);
  ctx.moveTo(392, 236);
  ctx.lineTo(424, 236);
  ctx.stroke();

  // Door.
  ctx.fillStyle = '#5d7a4a';
  ctx.fillRect(448, 214, 40, 84);
  ctx.fillStyle = '#e8c98f';
  ctx.beginPath();
  ctx.arc(480, 258, 3, 0, Math.PI * 2);
  ctx.fill();

  // Cafe clock on the wall left of the windows (difference: clock).
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath();
  ctx.arc(318, 232, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(318, 232, 13, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(318, 232);
  if (has('clock')) {
    ctx.lineTo(318, 223); // 12
    ctx.moveTo(318, 232);
    ctx.lineTo(310, 236); // 7:30-ish
  } else {
    ctx.lineTo(324, 223); // 1
    ctx.moveTo(318, 232);
    ctx.lineTo(318, 242); // 5:00
  }
  ctx.stroke();

  // Wall anchor or lifebuoy between the windows and the door (difference: anchor).
  if (has('anchor')) {
    ctx.strokeStyle = '#d94f3d';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(436, 268, 11, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#fdf6e3';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(436, 268, 11, Math.PI * 0.15, Math.PI * 0.45);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(436, 268, 11, Math.PI * 0.65, Math.PI * 0.95);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(436, 268, 11, Math.PI * 1.15, Math.PI * 1.45);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(436, 268, 11, Math.PI * 1.65, Math.PI * 1.95);
    ctx.stroke();
  } else {
    ctx.strokeStyle = '#33414f';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(436, 254);
    ctx.lineTo(436, 278);
    ctx.moveTo(428, 262);
    ctx.quadraticCurveTo(436, 282, 444, 262);
    ctx.moveTo(428, 262);
    ctx.lineTo(424, 258);
    ctx.moveTo(428, 262);
    ctx.lineTo(432, 258);
    ctx.moveTo(444, 262);
    ctx.lineTo(440, 258);
    ctx.moveTo(444, 262);
    ctx.lineTo(448, 258);
    ctx.stroke();
  }

  // Flower pot by the door (difference: flowerpot).
  if (!has('flowerpot')) {
    ctx.fillStyle = '#c96a3b';
    ctx.beginPath();
    ctx.moveTo(312, 330);
    ctx.lineTo(332, 330);
    ctx.lineTo(328, 352);
    ctx.lineTo(316, 352);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#e2725b';
    ctx.beginPath();
    ctx.arc(318, 322, 6, 0, Math.PI * 2);
    ctx.arc(328, 320, 6, 0, Math.PI * 2);
    ctx.arc(322, 312, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#5d7a4a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(322, 330);
    ctx.lineTo(322, 318);
    ctx.stroke();
  }

  // ---- dock table, umbrella and cups -------------------------------------
  // Table.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(158, 330, 64, 6);
  ctx.fillRect(186, 336, 6, 26);
  // Umbrella (difference: umbrella — colour).
  ctx.fillStyle = has('umbrella') ? '#3f7ea6' : '#e8862e';
  ctx.beginPath();
  ctx.moveTo(138, 306);
  ctx.quadraticCurveTo(190, 268, 242, 306);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#5d3820';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(190, 272);
  ctx.lineTo(190, 330);
  ctx.stroke();
  // Cups (difference: cup — the second cup).
  ctx.fillStyle = '#fdf6e3';
  ctx.fillRect(168, 318, 12, 12);
  ctx.fillStyle = '#d94f3d';
  ctx.fillRect(168, 318, 12, 3);
  if (!has('cup')) {
    ctx.fillStyle = '#fdf6e3';
    ctx.fillRect(200, 318, 12, 12);
    ctx.fillStyle = '#3f7ea6';
    ctx.fillRect(200, 318, 12, 3);
  }

  // Rope coil on the dock (difference: rope).
  if (!has('rope')) {
    ctx.strokeStyle = '#c9a26e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(286, 392, 12, 0, Math.PI * 2);
    ctx.arc(286, 392, 7, 0, Math.PI * 2);
    ctx.stroke();
  }

  // The dock cat (difference: cat).
  if (!has('cat')) drawCat(ctx, 246, 372);
}

function drawCloud(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(255, 244, 224, 0.9)';
  ctx.beginPath();
  ctx.arc(x, y, 16 * s, 0, Math.PI * 2);
  ctx.arc(x + 18 * s, y - 6 * s, 13 * s, 0, Math.PI * 2);
  ctx.arc(x + 36 * s, y, 15 * s, 0, Math.PI * 2);
  ctx.fill();
}

function drawGull(ctx, x, y) {
  ctx.strokeStyle = '#3a3230';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 9, y);
  ctx.quadraticCurveTo(x - 4, y - 7, x, y);
  ctx.quadraticCurveTo(x + 4, y - 7, x + 9, y);
  ctx.stroke();
}

function drawStarfish(ctx, x, y) {
  ctx.fillStyle = '#e8862e';
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
    const a2 = a + Math.PI / 5;
    ctx.lineTo(x + Math.cos(a) * 11, y + Math.sin(a) * 11);
    ctx.lineTo(x + Math.cos(a2) * 5, y + Math.sin(a2) * 5);
  }
  ctx.closePath();
  ctx.fill();
}

function drawCat(ctx, x, y) {
  // A small ginger cat sitting on the dock, tail curled.
  ctx.fillStyle = '#e8862e';
  ctx.beginPath();
  ctx.ellipse(x, y + 8, 14, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x - 2, y - 8, 10, 0, Math.PI * 2);
  ctx.fill();
  // Ears.
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 14);
  ctx.lineTo(x - 7, y - 22);
  ctx.lineTo(x - 3, y - 15);
  ctx.closePath();
  ctx.moveTo(x + 4, y - 15);
  ctx.lineTo(x + 7, y - 22);
  ctx.lineTo(x + 10, y - 14);
  ctx.closePath();
  ctx.fill();
  // Tail.
  ctx.strokeStyle = '#e8862e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x + 12, y + 10);
  ctx.quadraticCurveTo(x + 24, y + 6, x + 20, y - 4);
  ctx.stroke();
  // Face.
  ctx.fillStyle = '#2e2a26';
  ctx.beginPath();
  ctx.arc(x - 5, y - 9, 1.5, 0, Math.PI * 2);
  ctx.arc(x + 1, y - 9, 1.5, 0, Math.PI * 2);
  ctx.fill();
}
