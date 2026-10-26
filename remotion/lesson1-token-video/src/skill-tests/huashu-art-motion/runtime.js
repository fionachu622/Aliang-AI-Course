// Approved huashu-art-motion whiteboard engine, isolated for frame-driven Remotion.
export function createWhiteboardRuntime() {
const scope = {};
let U, PAINT, KIT, MO, CAM, DG;

// lib/util.js
// 通用工具（最先加载，转场库与引擎共用）
(() => {
// ---------- 工具 ----------
U = scope.U = {
  TAU: Math.PI * 2,
  clamp: (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)),
  lerp: (a, b, p) => a + (b - a) * p,
  // smoothstep：x 在 [a,b] 内平滑地从 0 走到 1（开场写出、渐显、段内节奏都用它）
  ss: (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); },
  // 把 p 的 [a,b] 段线性拉成 0..1（转场里分阶段用）
  seg: (p, a, b) => Math.max(0, Math.min(1, (p - a) / (b - a))),
  // 步进帧率：把连续时间量化成 fps 步——「一顿一顿」是很多风格的味道本身：
  // 橡皮管卡通 12fps（一拍二）、皮影杆操 10fps、哈林跳舞小人 8fps 硬切、手绘线条沸腾 8–12fps、胶片层 24fps。
  stepTime: (t, fps) => Math.floor(t * fps) / fps,
  ease: {
    linear: p => p,
    inOut: p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2,
    out: p => 1 - Math.pow(1 - p, 3),
    in: p => p * p * p,
    outBack: p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
  },
  // 种子随机：mulberry32
  rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; },
  hash(i, j = 0) { let h = (i * 374761393 + j * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; },
  // 点列 → Path2D（折线）
  poly(pts, closed = true) { const p = new Path2D(); pts.forEach((q, i) => i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1])); if (closed) p.closePath(); return p; },
};

// ---------- 画布尺寸 ----------
// 默认 1920×1080。竖屏片段（clip.html，spec.width/height）和竖屏整片（index.html?w=1080&h=1920，或 eras.js 里写 scope.FILM_SIZE = [1080, 1920]）
// 启动时调一次 U.setStage(w, h)。用到屏幕尺寸的库（PAINT / BRUSH / RENDER / POST / KIT / TOON / CAM / UI / CH / DG / CL / MD、transitions.js、engine.js）
// 用 U.onStage 登记，尺寸一改全部跟着改；登记时立刻按当前尺寸回调一次，后加载的库也拿得到。
// 35 种艺术风格场景（scenes/）是按 1920×1080 画的，竖屏只保证解说语法、转场和引擎本身。
const stageHooks = [];
scope.STAGE = { W: 1920, H: 1080 };
U.onStage = f => { stageHooks.push(f); f(scope.STAGE.W, scope.STAGE.H); };
U.setStage = (w, h) => { w = Math.round(+w); h = Math.round(+h); if (!(w > 0 && h > 0)) throw new Error(`U.setStage：尺寸不对 ${w}×${h}`); scope.STAGE = { W: w, H: h }; stageHooks.forEach(f => f(w, h)); };

// ---------- 字形检查 ----------
// 字体文件缺某个字时浏览器会静默回退到系统字体：measureText 不报错、宽度也对，换台机器就变样（迁移测试 B、D：全角字母、▶、「戏」「蓝」都踩过）。
// 做法：启动时（engine boot，字体加载完）把 FONT_FACES 里每个字体文件的 cmap 表读出来（WOFF1 用 DecompressionStream 解 zlib），查表判断有没有这个字。
// 不用 measureText 对比回退字体：macOS 上 Chromium 的逐字回退以首选字体为基准挑系统字体，两种写法会落到不同字体上，缺字也测不出来（实测误判）。
// font 可以是 family 名（'LXGWWenKai-500'）或 CSS 字体串（'80px "LXGWWenKai-500"'）。family 不在 FONT_FACES 里 → 当作全缺。
const famOf = font => { const m = /"([^"]+)"/.exec(font) || /'([^']+)'/.exec(font); return m ? m[1] : String(font).replace(/^(italic\s+|bold\s+|\d+\s+)*[\d.]+px\s+/, '').trim(); };
const CMAPS = {};
const inflate = async (buf) => new Uint8Array(await new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('deflate'))).arrayBuffer());
async function readCmap(url) {
  const ab = await (await fetch(url)).arrayBuffer(), dv = new DataView(ab), sig = dv.getUint32(0);
  let tab = null;
  if (sig === 0x774F4646) {                                            // 'wOFF'
    const n = dv.getUint16(12);
    for (let i = 0; i < n; i++) { const o = 44 + i * 20; if (dv.getUint32(o) !== 0x636D6170) continue;   // 'cmap'
      const off = dv.getUint32(o + 4), comp = dv.getUint32(o + 8), orig = dv.getUint32(o + 12), raw = new Uint8Array(ab, off, comp);
      tab = comp < orig ? await inflate(raw) : raw.slice(); }
  } else {                                                             // 裸 TTF/OTF
    const n = dv.getUint16(4);
    for (let i = 0; i < n; i++) { const o = 12 + i * 16; if (dv.getUint32(o) === 0x636D6170) tab = new Uint8Array(ab, dv.getUint32(o + 8), dv.getUint32(o + 12)).slice(); }
  }
  if (!tab) throw new Error('没有 cmap 表');
  const t = new DataView(tab.buffer, tab.byteOffset, tab.byteLength), set = new Set(), nt = t.getUint16(2);
  for (let i = 0; i < nt; i++) {
    const so = t.getUint32(4 + i * 8 + 4), fmt = t.getUint16(so);
    if (fmt === 4) { const segX2 = t.getUint16(so + 6), ends = so + 14, starts = ends + segX2 + 2, deltas = starts + segX2, ros = deltas + segX2;
      for (let k = 0; k < segX2 / 2; k++) { const e = t.getUint16(ends + k * 2), s = t.getUint16(starts + k * 2), d = t.getInt16(deltas + k * 2), ro = t.getUint16(ros + k * 2);
        for (let ch = s; ch <= e && ch !== 0xFFFF; ch++) { let g; if (!ro) g = (ch + d) & 0xFFFF; else { g = t.getUint16(ros + k * 2 + ro + (ch - s) * 2); if (g) g = (g + d) & 0xFFFF; } if (g) set.add(ch); } } }
    else if (fmt === 12 || fmt === 13) { const ng = t.getUint32(so + 12); for (let k = 0; k < ng; k++) { const o = so + 16 + k * 12, s = t.getUint32(o), e = t.getUint32(o + 4), g = t.getUint32(o + 8);
      for (let ch = s; ch <= e; ch++) if (fmt === 13 ? g : g + ch - s) set.add(ch); } }
    else if (fmt === 0) { for (let ch = 0; ch < 256; ch++) if (t.getUint8(so + 6 + ch)) set.add(ch); }
    else if (fmt === 6) { const first = t.getUint16(so + 6), cnt = t.getUint16(so + 8); for (let k = 0; k < cnt; k++) if (t.getUint16(so + 10 + k * 2)) set.add(first + k); }
  }
  return set;
}
// 引擎 boot 里调用一次（字体加载之后）。读失败的字体记 console.error，不阻断启动。
U.loadCmaps = async (faces = scope.FONT_FACES || []) => {
  await Promise.all(faces.map(async f => { try { CMAPS[f.family] = await readCmap(f.url); } catch (e) { console.error(`读不了字体 ${f.family} 的 cmap：${e}`); } }));
};
U.missingGlyphs = (font, text) => {
  const fam = famOf(font), cm = CMAPS[fam];
  const chars = [...new Set([...String(text)])].filter(ch => !/\s/.test(ch));
  if (!cm) return chars;
  return chars.filter(ch => !cm.has(ch.codePointAt(0)));
};
// 缺字就 console.error（qa.py / render.py 会把页面 console.error 当失败）。返回 true = 全都有。
U.assertGlyphs = (font, text, where = '') => {
  const fam = famOf(font), miss = U.missingGlyphs(font, text);
  if (miss.length) console.error(!CMAPS[fam] ? `字体「${fam}」没注册或没读到 cmap（lib/fonts.js 的 FONT_FACES）${where ? '（' + where + '）' : ''}`
    : `缺字形：字体「${fam}」里没有「${miss.join('')}」${where ? '（' + where + '）' : ''}——会静默回退系统字体。用 scripts/font_subset.py 补进子集，或改用路径自画。`);
  return miss.length === 0;
};
U.fontFamily = famOf;

})();

U = scope.U;

// lib/paint.js
// 纯代码绘画工具库：噪声、纹理、手绘线、风格渲染器（笔触/色点/马赛克/网点/像素/切面）、共享编舞。
// 约定：所有随机都用种子；「抖动线条」按 boilFps 换种子（手绘动画的 boiling line），其余保持帧间稳定。
(() => {
let W = 1920, H = 1080; U.onStage((w, h) => { W = w; H = h; });   // 画布尺寸跟 U.setStage 走（默认 1920×1080）
const P = scope.PAINT = {};
const { clamp, lerp, ease, rng } = U;

// ---------- 画布 ----------
P.canvas = (w = W, h = H) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const CACHE = {};
P.cached = (key, w, h, fn) => { if (!CACHE[key]) { const c = P.canvas(w, h); fn(c.getContext('2d'), c); CACHE[key] = c; } return CACHE[key]; };
P.scratch = (key) => { if (!CACHE['s_' + key]) CACHE['s_' + key] = P.canvas(); return CACHE['s_' + key]; };

// ---------- 噪声 ----------
const perm = new Uint8Array(512); { const r = rng(1337); const p = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = (r() * (i + 1)) | 0; [p[i], p[j]] = [p[j], p[i]]; } for (let i = 0; i < 512; i++) perm[i] = p[i & 255]; }
const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
const grad = (h, x, y) => { const u = (h & 1) ? x : -x, v = (h & 2) ? y : -y; return (h & 4) ? u + v * 0.5 : u * 0.5 + v; };
P.noise = (x, y) => {                                   // Perlin 2D，约 [-1,1]
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255; x -= Math.floor(x); y -= Math.floor(y);
  const u = fade(x), v = fade(y), a = perm[X] + Y, b = perm[X + 1] + Y;
  return lerp(lerp(grad(perm[a], x, y), grad(perm[b], x - 1, y), u), lerp(grad(perm[a + 1], x, y - 1), grad(perm[b + 1], x - 1, y - 1), u), v);
};
P.fbm = (x, y, o = 4) => { let s = 0, a = 0.5, f = 1; for (let i = 0; i < o; i++) { s += a * P.noise(x * f, y * f); a *= 0.5; f *= 2; } return s; };

// ---------- 颜色 ----------
P.hex = h => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(x => x + x).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
P.rgb = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
P.mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
P.jitter = (c, r, amt) => [c[0] + (r() - .5) * amt, c[1] + (r() - .5) * amt, c[2] + (r() - .5) * amt];

// ---------- 纹理（缓存） ----------
// 纸/墙/岩石：底色 + 多层噪声斑驳 + 细颗粒
P.texture = (key, base, opt = {}) => P.cached('tex_' + key, W, H, (g) => {
  const { scale = 0.004, amt = 26, grain = 14, dark = null, seed = 1 } = opt;
  const img = g.createImageData(W, H), d = img.data, b = P.hex(base), r = rng(seed);
  const dk = dark ? P.hex(dark) : null;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const n = P.fbm(x * scale + seed, y * scale, 5), gr = (r() - .5) * grain;
    const i = (y * W + x) * 4;
    let c = b;
    if (dk) c = P.mix(b, dk, clamp(n * 1.2 + 0.25));
    d[i] = c[0] + n * amt + gr; d[i + 1] = c[1] + n * amt + gr; d[i + 2] = c[2] + n * amt * 0.8 + gr; d[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
});
// 颗粒噪点叠层（扁平插画的 grain、旧印刷）：透明底上的随机点
P.grain = (key, density = 0.08, col = [0, 0, 0], alpha = 0.18) => P.cached('grain_' + key, W, H, (g) => {
  const img = g.createImageData(W, H), d = img.data, r = rng(key.length * 97 + 3);
  for (let i = 0; i < W * H; i++) if (r() < density) { d[i * 4] = col[0]; d[i * 4 + 1] = col[1]; d[i * 4 + 2] = col[2]; d[i * 4 + 3] = 255 * alpha * (0.4 + r() * 0.6); }
  g.putImageData(img, 0, 0);
});
// 龟裂纹（古典油画）：随机游走的细裂线网
P.craquelure = (key, alpha = 0.35) => P.cached('crack_' + key, W, H, (g) => {
  const r = rng(77); g.strokeStyle = `rgba(40,25,10,${alpha})`; g.lineWidth = 0.8;
  for (let k = 0; k < 900; k++) {
    let x = r() * W, y = r() * H, a = r() * Math.PI * 2; g.beginPath(); g.moveTo(x, y);
    for (let s = 0; s < 6 + r() * 10; s++) { a += (r() - .5) * 1.6; x += Math.cos(a) * (6 + r() * 14); y += Math.sin(a) * (6 + r() * 14); g.lineTo(x, y); }
    g.stroke();
  }
});

// ---------- 手绘线 ----------
// 把折线/曲线采样后加噪声抖动；boil = 当前时间换种子的频率（0 = 不抖）
P.boilSeed = (t, fps = 12) => Math.floor(t * fps);
P.roughPath = (c, pts, { amp = 2, seed = 1, closed = false, step = 6 } = {}) => {
  const r = rng(seed);
  // 先按 step 重采样
  const out = [];
  const N = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < N; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / step));
    for (let k = 0; k < n; k++) { const q = k / n; out.push([lerp(a[0], b[0], q) + (r() - .5) * amp, lerp(a[1], b[1], q) + (r() - .5) * amp]); }
  }
  if (!closed) out.push([pts[pts.length - 1][0] + (r() - .5) * amp, pts[pts.length - 1][1] + (r() - .5) * amp]);
  c.beginPath(); out.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); if (closed) c.closePath();
};
// 三次贝塞尔采样成点列（便于 roughPath / 变形）
P.bez = (p0, p1, p2, p3, n = 24) => { const o = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; o.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]); } return o; };
// SVG path 字符串 → Path2D（写复杂轮廓最省事）
P.path = (d) => new Path2D(d);

// ---------- 风格渲染器（对一张底稿 canvas 做「重画」） ----------
// 1) 流场笔触（梵高/印象派）：在抖动网格上取底稿颜色，沿 angle(x,y,t) 画短笔触，带深色描边
//    cap：宽笔（width ≥ 30）密排时圆头会连成一排排「人头/鹅卵石」（迁移测试 D 蓝色时期），改 'butt'。
//    boil：只给母题区域沸腾，静止区（地板、道具、角色）boil=0 种子固定——全屏 8fps 换种子读成满屏闪烁（迁移测试 C 莫奈）。
P.strokes = (dst, src, { cell = 12, len = 22, width = 7, angle, seed = 1, t = 0, boil = 8, outline = 0.35, outlineCol = [20, 25, 60], outlineMix = 0.55, jitterCol = 18, mask, alphaMask = false, palette, cap = 'round' } = {}) => {
  const sd = src.getContext('2d').getImageData(0, 0, W, H).data;
  const r = rng(seed * 1000 + P.boilSeed(t, boil));
  dst.lineCap = cap;
  for (let y = 0; y < H + cell; y += cell) for (let x = 0; x < W + cell; x += cell) {
    const px = x + (r() - .5) * cell, py = y + (r() - .5) * cell;
    const ix = clamp(px | 0, 0, W - 1), iy = clamp(py | 0, 0, H - 1), i = (iy * W + ix) * 4;
    if (mask && !mask(px, py)) continue;
    if (alphaMask && sd[i + 3] < 200) continue;
    let col = [sd[i], sd[i + 1], sd[i + 2]];
    const pc = palette ? palette(px, py, col, r) : null; if (pc) col = pc;       // 区域色板：从色组里抽一个颜色
    const a = angle ? angle(px, py, t) : 0, l = len * (0.7 + r() * 0.6);
    const dx = Math.cos(a) * l / 2, dy = Math.sin(a) * l / 2;
    if (outline > 0) { dst.strokeStyle = P.rgb(P.mix(col, outlineCol, outlineMix), outline); dst.lineWidth = width + 2.5; dst.beginPath(); dst.moveTo(px - dx, py - dy); dst.lineTo(px + dx, py + dy); dst.stroke(); }
    dst.strokeStyle = P.rgb(pc ? col : P.jitter(col, r, jitterCol)); dst.lineWidth = width;
    dst.beginPath(); dst.moveTo(px - dx, py - dy); dst.lineTo(px + dx, py + dy); dst.stroke();
  }
};
// 色组工具：给一组 hex 和权重，返回按随机数抽色的函数（配 strokes 的 palette 用）；mixBase 把底稿色混进来保留明暗
P.swatch = (hexes, mixBase = 0.35) => { const cs = hexes.map(P.hex); return (col, r) => { const k = cs[(r() * cs.length) | 0]; return P.mix(k, col, mixBase); }; };
// 2) 色点（印象派）：椭圆短点，颜色带冷暖偏移、大小不一。注意这不是点彩——修拉的点彩是「等大点＋纯色板视觉混色」，用 P.pointillism（lib/render.js）
P.dabs = (dst, src, { cell = 10, size = 9, seed = 2, t = 0, boil = 8, angle = -0.6, shift = 22 } = {}) => {
  const sd = src.getContext('2d').getImageData(0, 0, W, H).data, r = rng(seed * 1000 + P.boilSeed(t, boil));
  for (let y = 0; y < H + cell; y += cell) for (let x = 0; x < W + cell; x += cell) {
    const px = x + (r() - .5) * cell * 1.2, py = y + (r() - .5) * cell * 1.2;
    const i = (clamp(py | 0, 0, H - 1) * W + clamp(px | 0, 0, W - 1)) * 4;
    const warm = r() < 0.5 ? [shift, shift * 0.5, -shift] : [-shift * 0.6, 0, shift];
    dst.fillStyle = `rgb(${sd[i] + warm[0]},${sd[i + 1] + warm[1]},${sd[i + 2] + warm[2]})`;
    dst.beginPath(); dst.ellipse(px, py, size * (0.8 + r() * 0.6), size * 0.45, angle + (r() - .5) * 0.5, 0, Math.PI * 2); dst.fill();
  }
};
// 3) 马赛克：带缝隙的小石块，颜色取中心，略有抖动与倒角
P.mosaic = (dst, src, { tile = 14, grout = '#3b352e', seed = 3, jitter = 0.25 } = {}) => {
  const sd = src.getContext('2d').getImageData(0, 0, W, H).data, r = rng(seed);
  dst.fillStyle = grout; dst.fillRect(0, 0, W, H);
  for (let y = 0; y < H; y += tile) { const off = (y / tile) % 2 ? tile * 0.5 * jitter : 0; for (let x = -tile; x < W; x += tile) {
    const cx = x + off + tile / 2, cy = y + tile / 2, i = (clamp(cy | 0, 0, H - 1) * W + clamp(cx | 0, 0, W - 1)) * 4;
    const c = P.jitter([sd[i], sd[i + 1], sd[i + 2]], r, 14), s = tile * (0.82 + r() * 0.1);
    dst.fillStyle = P.rgb(c); dst.fillRect(cx - s / 2 + (r() - .5) * 1.5, cy - s / 2 + (r() - .5) * 1.5, s, s);
    dst.fillStyle = 'rgba(255,255,255,.12)'; dst.fillRect(cx - s / 2, cy - s / 2, s, 2);
  } }
};
// 4) 网点（本戴点）：颜色取中心，半径随暗度
P.halftone = (dst, src, { cell = 14, paper = '#f4ecd8', seed = 4 } = {}) => {
  const sd = src.getContext('2d').getImageData(0, 0, W, H).data;
  dst.fillStyle = paper; dst.fillRect(0, 0, W, H);
  for (let y = 0; y < H + cell; y += cell) for (let x = 0; x < W + cell; x += cell) {
    const cx = x + ((y / cell) % 2) * cell / 2, i = (clamp(y | 0, 0, H - 1) * W + clamp(cx | 0, 0, W - 1)) * 4;
    const L = (sd[i] * .3 + sd[i + 1] * .59 + sd[i + 2] * .11) / 255;
    dst.fillStyle = `rgb(${sd[i]},${sd[i + 1]},${sd[i + 2]})`;
    dst.beginPath(); dst.arc(cx, y, cell * 0.72 * (0.3 + (1 - L) * 0.9), 0, Math.PI * 2); dst.fill();
  }
};
// 5) 像素：最近邻降采样，可选调色板量化
P.pixelate = (dst, src, { size = 8, palette } = {}) => {
  const w = Math.ceil(W / size), h = Math.ceil(H / size), s = P.scratch('px'), g = s.getContext('2d');
  g.imageSmoothingEnabled = false; g.clearRect(0, 0, w, h); g.drawImage(src, 0, 0, w, h);
  if (palette) { const pal = palette.map(P.hex), im = g.getImageData(0, 0, w, h), d = im.data;
    for (let i = 0; i < d.length; i += 4) { let best = 0, bd = 1e9; for (let k = 0; k < pal.length; k++) { const q = pal[k], dd = (d[i] - q[0]) ** 2 + (d[i + 1] - q[1]) ** 2 + (d[i + 2] - q[2]) ** 2; if (dd < bd) { bd = dd; best = k; } } d[i] = pal[best][0]; d[i + 1] = pal[best][1]; d[i + 2] = pal[best][2]; }
    g.putImageData(im, 0, 0); }
  dst.imageSmoothingEnabled = false; dst.drawImage(s, 0, 0, w, h, 0, 0, w * size, h * size); dst.imageSmoothingEnabled = true;
};
// 6) 立体主义切面：抖动三角网，每块取「偏移视角」的颜色做线性渐变，描暗边
P.facets = (dst, src, { nx = 22, ny = 13, seed = 5, t = 0, shiftAmt = 26, edge = 'rgba(40,30,20,.45)' } = {}) => {
  const sd = src.getContext('2d').getImageData(0, 0, W, H).data, r = rng(seed);
  const pts = []; for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) { const e = i === 0 || j === 0 || i === nx || j === ny; pts.push([i / nx * W + (e ? 0 : (r() - .5) * W / nx * .9), j / ny * H + (e ? 0 : (r() - .5) * H / ny * .9)]); }
  const col = (x, y) => { const i = (clamp(y | 0, 0, H - 1) * W + clamp(x | 0, 0, W - 1)) * 4; return [sd[i], sd[i + 1], sd[i + 2]]; };
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const a = pts[j * (nx + 1) + i], b = pts[j * (nx + 1) + i + 1], c2 = pts[(j + 1) * (nx + 1) + i], d2 = pts[(j + 1) * (nx + 1) + i + 1];
    for (const tri of (r() < .5 ? [[a, b, d2], [a, d2, c2]] : [[a, b, c2], [b, d2, c2]])) {
      const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3, cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
      const sh = Math.sin(t * 3 + cx * 0.01) * shiftAmt * r();
      const c0 = col(cx + sh, cy), c1 = P.mix(c0, [60, 45, 30], 0.35);
      const g = dst.createLinearGradient(tri[0][0], tri[0][1], tri[2][0], tri[2][1]); g.addColorStop(0, P.rgb(P.mix(c0, [255, 250, 235], 0.12))); g.addColorStop(1, P.rgb(c1));
      dst.fillStyle = g; dst.beginPath(); tri.forEach((p, k) => k ? dst.lineTo(p[0], p[1]) : dst.moveTo(p[0], p[1])); dst.closePath(); dst.fill();
      dst.strokeStyle = edge; dst.lineWidth = 1.5; dst.stroke();
    }
  }
};

// ---------- 共享编舞：16 个时代用同一套动作曲线，各自用自己的画法画出来 ----------
// lt = 本段局部时间（秒）。返回 0..1 或角度，时代代码按需取用。
// 端杯循环（全片时间）：2.4s 一轮——0.9s 举到嘴边、停 0.7s 喝、0.8s 放回
P.cupCycle = (t, period = 2.4) => { const q = ((t % period) + period) % period;
  if (q < 0.9) return 0.5 - 0.5 * Math.cos(q / 0.9 * Math.PI); if (q < 1.6) return 1; return 0.5 + 0.5 * Math.cos((q - 1.6) / 0.8 * Math.PI); };
P.choreo = (lt, t) => ({
  cupG: P.cupCycle(t),                                         // 按全片时间的端杯（跨段连续：速通片换段时姿势不重置）
  cup: 0.5 - 0.5 * Math.cos(Math.min(1, lt / 0.9) * Math.PI),   // 端杯：0=在桌上 1=在嘴边（约 0.9s 举起）
  sip: Math.max(0, Math.sin(lt * 6)) * 0.15,                    // 喝时头部微仰
  tail: Math.sin(t * 5.2) * 0.35 + Math.sin(t * 11) * 0.08,      // 猫尾摆（弧度）
  blink: (t % 2.3) > 2.18 ? 1 : 0,                              // 眨眼
  ear: Math.max(0, Math.sin(t * 9)) > 0.97 ? 1 : 0,
  breathe: Math.sin(t * 4) * 0.012,
  steam: t,                                                     // 热气用全局时间
});

// ---------- 通用元素 ----------
// 热气：几条随时间上行的正弦曲线（风格化的 S 形可传 width/color）
P.steam = (c, t, x, y, { h = 80, n = 3, color = 'rgba(255,255,255,.8)', width = 4, spread = 16, wobble = 10, seed = 1 } = {}) => {
  c.save(); c.lineCap = 'round'; c.lineWidth = width;
  for (let k = 0; k < n; k++) {
    const ox = (k - (n - 1) / 2) * spread, ph = t * 3 + k * 2.1 + seed;
    const g = c.createLinearGradient(0, y, 0, y - h); g.addColorStop(0, color); g.addColorStop(1, 'rgba(255,255,255,0)'); c.strokeStyle = g;
    c.beginPath(); for (let s = 0; s <= 20; s++) { const q = s / 20; const xx = x + ox + Math.sin(ph - q * 5) * wobble * q, yy = y - q * h; s ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } c.stroke();
  }
  c.restore();
};
// 粒子：给定种子与时间，返回确定的粒子位置（飘落/上浮）
P.particles = (n, seed, t, { x0 = 0, x1 = W, y0 = -40, y1 = H + 40, speed = 80, drift = 30, life = 6 } = {}) => {
  const r = rng(seed), out = [];
  for (let i = 0; i < n; i++) { const bx = lerp(x0, x1, r()), ph = r() * life, sp = speed * (0.6 + r() * 0.8), q = ((t + ph) % life) / life;
    out.push({ x: bx + Math.sin((t + ph) * 1.7 + i) * drift, y: lerp(y0, y1, q), a: r() * Math.PI * 2 + t * (r() - .5) * 3, s: 0.6 + r() * 0.8, q, i }); }
  return out;
};
})();

PAINT = scope.PAINT;

// lib/kit.js
// 跨场景共用的小工具：点列加密/等弧长重采样、可变线宽路径 ribbon、整幅行/列扭曲、手绘不规则圆、全片连续编舞、近侧手臂补盖、角标。
// 渲染器在 lib/brush.js（笔与水）、lib/render.js（网点/点彩/赛璐珞/光影/皮影）、lib/post.js（VHS/胶片/泛光/纹理叠角色）。
(() => {
let W = 1920, H = 1080; U.onStage((w, h) => { W = w; H = h; });   // 画布尺寸跟 U.setStage 走（默认 1920×1080）
const { clamp, lerp, rng } = U;
const K = scope.KIT = {};

// Catmull-Rom 加密点列（开放）
K.densify = (pts, per = 6) => {
  const out = [], n = pts.length, P_ = i => pts[Math.max(0, Math.min(n - 1, i))];
  for (let i = 0; i < n - 1; i++) {
    const p0 = P_(i - 1), p1 = P_(i), p2 = P_(i + 1), p3 = P_(i + 2);
    for (let k = 0; k < per; k++) {
      const t = k / per, t2 = t * t, t3 = t2 * t;
      out.push([0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
                0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
    }
  }
  out.push(pts[n - 1]); return out;
};
// 按弧长等距重采样（让噪声、飞白、行波的频率与笔画长短无关）
K.resample = (pts, step = 4) => {
  const out = [pts[0]]; let acc = 0;
  for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]); let d = step - acc;
    while (d <= L) { const q = d / L; out.push([a[0] + (b[0] - a[0]) * q, a[1] + (b[1] - a[1]) * q]); d += step; } acc = L - (d - step); }
  out.push(pts[pts.length - 1]); return out;
};
// 可变线宽路径：点列两侧按 w(q) 偏移成闭合多边形（书法线、飘带、表现主义长笔）
K.ribbon = (pts, w) => {
  const n = pts.length, L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
    const hw = (typeof w === 'function' ? w(i / (n - 1), i) : w) / 2;
    L.push([pts[i][0] - dy * hw, pts[i][1] + dx * hw]); R.push([pts[i][0] + dy * hw, pts[i][1] - dx * hw]);
  }
  const p = new Path2D(); L.forEach((q, i) => i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1]));
  for (let i = n - 1; i >= 0; i--) p.lineTo(R[i][0], R[i][1]); p.closePath(); return p;
};
// 少女部件按画序列出（远→近），给「不调 drawGirl、自己逐部件上色」的风格用
K.girlOrder = ['farSleeve', 'farHand', 'farCuff', 'hairDown', 'skirt', 'shoe', 'torso', 'neck', 'hairBack', 'bun', 'face', 'bangs', 'upperArm', 'foreArm', 'cuff', 'hand'];   // 完整画序（含五官、杯、钩子插槽名）见 RIG.GIRL_ORDER

// 把 src 按「水平条带位移」画到 dst：fx(y) 返回该行的 x 位移（蒙克式整个世界在流动）
// margin：每行横向多拉伸 2·margin 像素，位移后左右不露缝（margin ≥ 最大位移）
K.warpRows = (dst, src, fx, band = 6, margin = 0) => {
  for (let y = 0; y < H; y += band) { const dx = fx(y + band / 2); dst.drawImage(src, 0, y, W, band, dx - margin, y, W + 2 * margin, band); }
};
K.warpCols = (dst, src, fy, band = 6, margin = 0) => {
  for (let x = 0; x < W; x += band) { const dy = fy(x + band / 2); dst.drawImage(src, x, 0, band, H, x, dy - margin, band, H + 2 * margin); }
};

// n 角星（剪纸星、爆炸框、闪光）：外半径 r0、内半径 r1
K.star = (cx, cy, r0, r1, n, rot = 0) => { const pts = []; for (let i = 0; i < n * 2; i++) { const a = rot + i / (n * 2) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? r1 : r0; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return U.poly(pts); };
// 手绘不规则圆（草间的点不是完美圆）：n 个顶点、半径按种子起伏
K.blob = (c, x, y, r, seed, wob = 0.08, n = 14) => {
  const rr = rng(seed); const off = []; for (let i = 0; i < n; i++) off.push(1 + (rr() - .5) * 2 * wob);
  const pts = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; pts.push([x + Math.cos(a) * r * off[i], y + Math.sin(a) * r * off[i]]); }
  c.moveTo((pts[0][0] + pts[n - 1][0]) / 2, (pts[0][1] + pts[n - 1][1]) / 2);
  for (let i = 0; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n]; c.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); }
  c.closePath();
};

// 全片连续的编舞：端杯按全局时间走（周期 = 两段 = 2.34s，在嘴边和桌上各停一会儿），
// 换风格时姿势不重置——速通看的是「同一瞬间换了画风」，而不是每段重喝一次。转场正好落在杯子停住的时刻。
K.choreo = (lt, t) => {
  const ch = PAINT.choreo(lt, t), k = 0.5 - 0.5 * Math.cos(2 * Math.PI * t / 2.34375);
  let q = clamp((k - 0.15) / 0.7); q = q * q * (3 - 2 * q);
  ch.cup = q; ch.sip = Math.max(0, Math.sin(t * 6)) * 0.15 * q; return ch;
};
// drawGirl(mode:'line') 会把被近侧手臂挡住的躯干线画穿：线稿画完后，把近侧手臂、袖口、手、杯重新盖一遍
K.nearArm = (c, G, { fill, line = '#111', lw = 3, skin, cuff, cupBody, cupRim, pattern } = {}) => {
  const arm = new Path2D(); arm.addPath(G.upperArm); arm.addPath(G.foreArm);
  c.save(); c.lineJoin = 'round'; c.fillStyle = fill; c.fill(arm); if (pattern) { c.save(); c.clip(arm); pattern(c); c.restore(); }
  c.strokeStyle = line; c.lineWidth = lw; c.stroke(G.upperArm); c.stroke(G.foreArm);
  if (cuff) { c.fillStyle = cuff; c.fill(G.cuff); c.stroke(G.cuff); }
  c.fillStyle = skin; c.fill(G.hand); c.lineWidth = lw * 0.8; c.stroke(G.hand);
  RIG.drawCup(c, G.cup, { body: cupBody, rim: cupRim, line, lw: lw * 0.8, hw: 7 });
  c.fillStyle = skin; c.beginPath(); c.arc(G.thumb[0], G.thumb[1], 7, 0, Math.PI * 2); c.fill(); c.lineWidth = lw * 0.7; c.stroke();
  c.restore();
};
// 右上角角标：标题（中文）＋副标题；入场 0.18s 由各风格的 reveal(c,p) 决定怎么出现
K.label = (c, { title, sub, tFont, sFont, tCol, sCol, x = 1866, y = 128, sy = 182, shadow, before, after, spacing = 0 }) => {
  c.save(); c.textAlign = 'right'; c.textBaseline = 'alphabetic';
  if (before) before(c);
  if (shadow) { c.shadowColor = shadow.color; c.shadowOffsetX = shadow.x || 0; c.shadowOffsetY = shadow.y || 0; c.shadowBlur = shadow.blur || 0; }
  c.font = tFont; c.fillStyle = tCol; if (spacing) c.letterSpacing = spacing + 'px'; c.fillText(title, x, y); c.letterSpacing = '0px';
  if (sub) { c.font = sFont; c.fillStyle = sCol || tCol; c.fillText(sub, x, sy); }
  if (after) after(c);
  c.restore();
};
})();

KIT = scope.KIT;

// lib/motion.js
// 动效时间库 MO：缓动、弹簧、步进、错开、拍号。全部是「时间 → 数值」的纯函数，不读时钟，确定性。
// 来源：YouTube 解说动画语法 8 支示范片（references/09-视频动画语法.md）。约定：p 是 0..1 的进度，t/lt 是秒。
//   选缓动的一句话：讲解（3b1b/白板）用 smooth/sineInOut 两端都停稳；发布会用 appleOut/弹簧；动态文字用 expoOut＋弹簧；
//   拼贴（Vox）相机用 sineInOut 或长尾 longTail，纸片按 12fps 步进；Kurzgesagt 动作用 k75，循环用 easyEase。
(() => {
const { clamp, lerp } = U;
const MO = scope.MO = {};

// 画布尺寸 U.setStage / U.onStage 在 util.js（比本文件先加载的 paint/brush/render/post 也要登记）。

// ---------- 时间片 ----------
MO.seg = (t, a, b) => clamp((t - a) / (b - a));                          // [a,b] → 0..1
MO.at = (t, t0, dur) => clamp((t - t0) / dur);                           // [t0, t0+dur] → 0..1
MO.anim = (lt, start, dur, ease = MO.smooth) => ease(clamp((lt - start) / dur));
// 步进时间：把连续时间量化成 fps 步。拼贴纸片/打字/荧光笔「一拍二」= 12fps；故事型角色 24fps；相机仍按 60fps 平滑。
MO.step = (t, fps = 12) => Math.floor(t * fps + 1e-6) / fps;

// ---------- manim 缓动（3b1b/manim rate_functions.py） ----------
// smooth = 6t⁵−15t⁴+10t³：两端速度、加速度都为 0。讲解类片子的默认缓动。
MO.smooth = t => { t = clamp(t); return t * t * t * (10 - 15 * t + 6 * t * t); };
const sig = x => 1 / (1 + Math.exp(-x));
MO.smoothCE = (t, inflection = 10) => { const e = sig(-inflection / 2); return clamp((sig(inflection * (t - 0.5)) - e) / (1 - 2 * e)); };   // ManimCE 版
MO.thereAndBack = t => MO.smooth(t < 0.5 ? 2 * t : 2 * (1 - t));          // Indicate 用：去了又回
MO.rushInto = t => 2 * MO.smooth(t / 2);                                  // 慢起、冲进终点
MO.rushFrom = t => 2 * MO.smooth(t / 2 + 0.5) - 1;                        // 冲出、慢收
MO.doubleSmooth = t => t < 0.5 ? 0.5 * MO.smooth(2 * t) : 0.5 * (1 + MO.smooth(2 * t - 1));
MO.wiggle = (t, wiggles = 2) => MO.thereAndBack(t) * Math.sin(wiggles * Math.PI * t);
// manim LaggedStart(lag_ratio=r)：n 个子动画里第 i 个在总进度 p 下的局部进度。总长 = 1+(n-1)·r 个单位，第 i 个占 [i·r, i·r+1]。
MO.lagged = (i, n, p, r = 0.05) => clamp(p * (1 + (n - 1) * r) - i * r);

// ---------- 常用解析缓动（AE / CSS 名字） ----------
MO.linear = p => p;
MO.sineInOut = p => -(Math.cos(Math.PI * p) - 1) / 2;
MO.cubicIn = p => p * p * p;
MO.cubicOut = p => 1 - Math.pow(1 - p, 3);
MO.cubicInOut = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
MO.quartOut = p => 1 - Math.pow(1 - p, 4);
MO.quintOut = p => 1 - Math.pow(1 - p, 5);
MO.quintInOut = p => p < .5 ? 16 * p ** 5 : 1 - Math.pow(-2 * p + 2, 5) / 2;
MO.expoIn = p => p <= 0 ? 0 : Math.pow(2, 10 * p - 10);
MO.expoOut = p => p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);                // 动效设计最常用的「快出慢停」
MO.expoInOut = p => p <= 0 ? 0 : p >= 1 ? 1 : p < .5 ? Math.pow(2, 20 * p - 10) / 2 : (2 - Math.pow(2, -20 * p + 10)) / 2;
// backOut 过冲：s=1.70158 约 10%；2.2 约 13%；2.6 约 17%；3.5 约 23%
MO.backOut = (p, s = 1.70158) => { const q = p - 1; return 1 + (s + 1) * q * q * q + s * q * q; };
// 弹性落定：overshoot 一次再回（贴纸「啪」地落下）
MO.elasticOut = p => p <= 0 ? 0 : p >= 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * (2 * Math.PI / 3)) + 1;

// ---------- CSS cubic-bezier(x1,y1,x2,y2)：牛顿法由 x 求参数，再取 y ----------
MO.bezier = (x1, y1, x2, y2) => {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = s => ((ax * s + bx) * s + cx) * s, Y = s => ((ay * s + by) * s + cy) * s, dX = s => (3 * ax * s + 2 * bx) * s + cx;
  return p => {
    if (p <= 0) return 0; if (p >= 1) return 1;
    let s = p; for (let k = 0; k < 8; k++) { const e = X(s) - p, d = dX(s); if (Math.abs(e) < 1e-6 || Math.abs(d) < 1e-6) break; s -= e / d; }
    s = clamp(s); return Y(s);
  };
};
MO.appleOut = MO.bezier(0.25, 0.1, 0.25, 1);        // CSS `ease`：苹果官网/发布会过渡
MO.emphasized = MO.bezier(0.2, 0, 0, 1);            // Material 3 emphasized：长尾减速
MO.k75 = MO.bezier(0.75, 0, 0.25, 1);               // Kurzgesagt「其他动作用 75% influence」（y1 调研 §6.2）
MO.easyEase = MO.bezier(0.333, 0, 0.667, 1);        // AE Easy Ease：循环动作
MO.longTail = MO.bezier(0.33, 0, 0.2, 1);           // Vox「沿线追过去」「拉出揭示」：起步快、长尾落定（y2 调研）

// ---------- 弹簧 ----------
// SwiftUI 参数化（WWDC23 Animate with springs）：stiffness=(2π/duration)²，damping=4π(1-bounce)/duration → ζ=1-bounce，ω=2π/duration。
// 返回 0→1 的位移（可 >1 = 过冲）。t 单位秒。发布会 UI 用它：.smooth(bounce 0) / .snappy(0.15) / .bouncy(0.3)。
MO.spring = (t, { duration = 0.5, bounce = 0, v0 = 0 } = {}) => {
  if (t <= 0) return 0;
  const w = 2 * Math.PI / duration, z = 1 - bounce;
  let x;                                                                 // x = 剩余位移（1→0）
  if (Math.abs(z - 1) < 1e-4) x = Math.exp(-w * t) * (1 + (w - v0) * t);
  else if (z < 1) { const wd = w * Math.sqrt(1 - z * z); x = Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w - v0) / wd) * Math.sin(wd * t)); }
  else { const r = Math.sqrt(z * z - 1), a = -w * (z - r), b = -w * (z + r); const A = (-v0 - b) / (a - b); x = A * Math.exp(a * t) + (1 - A) * Math.exp(b * t); }
  return 1 - x;
};
MO.smoothSpring = t => MO.spring(t, { duration: 0.5, bounce: 0 });
MO.snappy = t => MO.spring(t, { duration: 0.5, bounce: 0.15 });
MO.bouncy = t => MO.spring(t, { duration: 0.5, bounce: 0.3 });
// 频率/衰减参数化的欠阻尼弹簧阶跃响应（动态文字用）：freq Hz、decay 1/s。
//   freq 3 / decay 6 第一次过冲 ≈37%（砸进来的大字）；2.5 / 9 ≈16%（常规弹入）；2.2 / 10 ≈8%（主词落定）
MO.springHz = (t, freq = 2.5, decay = 9) => t <= 0 ? 0 : 1 - Math.exp(-decay * t) * Math.cos(2 * Math.PI * freq * t);
// 到位后的余振（Dan Ebberts 惯性回弹）：amp·sin(2πft)/e^(decay·t)。换姿势的身体挤压、屏幕震动都用它。
MO.settle = (t, amp, freq = 3, decay = 5) => t <= 0 ? 0 : amp * Math.sin(2 * Math.PI * freq * t) / Math.exp(decay * t);

// ---------- 脉冲节奏（解说片的默认运动：停住 → 猛动 → 停住） ----------
// 出处：一支被判「像放 PPT」的片子（每镜匀速推近 7.5%）换成脉冲后被认可：快推 0.28s、同倍率横移 0.30s、砸入 0.17s，其余时间停住。
// 时长常量集中在这里，CAM.track / MD / 各片段都读它；要改节奏改这里，别在片段里另写一套。
MO.PULSE = { punch: 0.28, pan: 0.30, slam: 0.17, k: 0.25, kMin: 0.18, kMax: 0.32 };
// 砸入曲线：k = 0..1（砸入进度）→ 缩放。1.55 → 0.94（前 60%，3 帧砸下）→ 1.0（后 40%，2 帧回弹）。k≤0 返回 1.55（还没落下）。
MO.slamK = (k, from = 1.55, under = 0.94) => k <= 0 ? from : k < 0.6 ? from - (from - under) * (k / 0.6) : k < 1 ? under + (1 - under) * ((k - 0.6) / 0.4) : 1;
// 某个元素在 at 这一帧砸进来：返回它此刻的缩放（at 之前 = 0，元素还不该画）。o: {dur=0.17, from=1.55, under=0.94}
MO.slam = (t, at, o = {}) => t < at ? 0 : MO.slamK((t - at) / (o.dur || MO.PULSE.slam), o.from, o.under);
// 脉冲进度：at 起 dur 秒内按 cubicInOut 从 0 走到 1，之后停在 1（快推、横移都用它）
MO.pulse = (t, at, dur = MO.PULSE.punch, ease = MO.cubicInOut) => ease(clamp((t - at) / dur));

// ---------- 持续微动 ----------
// 只给环境层（星闪、粒子、远景云）和艺术风格画面用。解说片的主体、标签、卡片落定后停住，不加浮动、呼吸。
// 漂浮：两频正弦叠加。周期避开 5s 左右（HIG：~0.2Hz 的持续摆动让人不适）
MO.float = (t, amp = 6, period = 4, ph = 0) => amp * (0.75 * Math.sin(2 * Math.PI * t / period + ph) + 0.25 * Math.sin(2 * Math.PI * t / (period * 0.53) + ph * 1.7));

// ---------- 反查与拍号 ----------
// 缓动的反函数（二分）：「线头/计数在什么时刻到达 y」。例：折线按 smooth 画，求画到某个 x 的时刻（t3 镜 2 的事件标注）。
MO.invert = (ease, y, iters = 30) => { let a = 0, b = 1; for (let i = 0; i < iters; i++) { const m = (a + b) / 2; if (ease(m) < y) a = m; else b = m; } return (a + b) / 2; };
// 拍 → 秒
MO.beat = (n, bpm = 120) => n * 60 / bpm;
// 揭开那一帧落在拍上：段起点 = 小节线 − 揭开点 × 转场时长（y5：zoom 揭开点 .55、色带 .6、push 到 90% 位移在 .58）
MO.onBeat = (barTime, revealP, trDur) => barTime - revealP * trDur;
})();

MO = scope.MO;

// lib/camera.js
// 世界相机 CAM：解说片不是「一段段画＋转场」，而是「一张连续的世界画布＋一台相机」。
// 铁律：相机只由全片时间（或本段时间）算出来，场景每帧按相机矢量重画——缩放转场永远清楚，不会把 1920 的位图放大 20 倍糊掉；
//       引擎在转场窗口里会把上一段继续按 t 画进 A 缓冲，所以「上一镜的相机继续推」天然成立（live 推进）。
// cam = { x, y, z, r }：世界点 (x,y) 落在画面中心，缩放 z（>1 推近），绕中心旋转 r（弧度）。缺省 x=960,y=540,z=1,r=0。
(() => {
let W = 1920, H = 1080; U.onStage((w, h) => { W = w; H = h; });   // 画布尺寸跟 U.setStage 走（默认 1920×1080）
const { clamp, lerp } = U;
const CAM = scope.CAM = {};
const n = cam => ({ x: cam.x ?? W / 2, y: cam.y ?? H / 2, z: cam.z ?? 1, r: cam.r || 0 });

// 把相机变换作用到 c 上（不 save/restore，调用方负责）
CAM.apply = (c, cam) => { const k = n(cam); c.translate(W / 2, H / 2); if (k.r) c.rotate(k.r); c.scale(k.z, k.z); c.translate(-k.x, -k.y); };
// 在相机下画 fn(c)，自动 save/restore
CAM.with = (c, cam, fn) => { c.save(); CAM.apply(c, cam); fn(c); c.restore(); };
// 世界 → 屏幕 / 屏幕 → 世界
CAM.toScreen = (cam, x, y) => { const k = n(cam); let dx = (x - k.x) * k.z, dy = (y - k.y) * k.z; if (k.r) { const cs = Math.cos(k.r), sn = Math.sin(k.r); [dx, dy] = [dx * cs - dy * sn, dx * sn + dy * cs]; } return [W / 2 + dx, H / 2 + dy]; };
CAM.toWorld = (cam, sx, sy) => { const k = n(cam); let dx = sx - W / 2, dy = sy - H / 2; if (k.r) { const cs = Math.cos(-k.r), sn = Math.sin(-k.r); [dx, dy] = [dx * cs - dy * sn, dx * sn + dy * cs]; } return [k.x + dx / k.z, k.y + dy / k.z]; };

// ---------- 缩放 ----------
// 对数插值：z0→z1 每帧放大同样的倍数，观众感到「匀速穿越尺度」；线性插值会前慢后猛。所有推拉缩放都用它。
CAM.zlerp = (z0, z1, e) => z0 * Math.pow(z1 / z0, e);
// 「从一个半径 r 的圆形开口穿进去，开口要在转场结束前盖满屏」需要的最小放大倍数 = 开口中心到最远屏幕角的距离 / r。
// 开口在画面中心时 ≈ 1101/r（卡片里写的「放大倍数 ≥ 1100/半径」）。小了，最后一帧开口没盖满会跳。
CAM.coverZoom = (r, cx = W / 2, cy = H / 2) => Math.max(Math.hypot(cx, cy), Math.hypot(W - cx, cy), Math.hypot(cx, H - cy), Math.hypot(W - cx, H - cy)) / r;
// 让世界点 (wx,wy) 在缩放 z 下出现在屏幕 (sx,sy)：返回相机。推近某物时让它平滑移到画面中心就靠它。
CAM.anchor = (wx, wy, z, sx, sy) => ({ x: wx - (sx - W / 2) / z, y: wy - (sy - H / 2) / z, z });
// 推进某个世界点：从 base 相机出发，缩放按对数插值到 Z（进度 e）；该点在屏幕上从原位置移向画面中心（进度 k，默认 = e；k=0 = 绕它原地推）。
// 用于「钻进镜头」（y1）、「推满照片再硬切」（y2）、「推进最新数据点」（t3，k=0）。
CAM.pushTo = (base, wx, wy, Z, e, k = e, to = [W / 2, H / 2]) => {
  const s0 = CAM.toScreen(base, wx, wy), z = CAM.zlerp(n(base).z, Z, e);
  return CAM.anchor(wx, wy, z, lerp(s0[0], to[0], k), lerp(s0[1], to[1], k));
};

// ---------- 关键帧 ----------
// keys = [{t, x, y, z, r, ease}]；ease 作用在「从上一键到这一键」，默认 cubicInOut；z 用对数插值。
// 沿路径平移（Vox 桌面、白板上的平移/甩镜）就是一串关键帧：平滑移动用 sineInOut，远跳用 cubicInOut＋运动模糊，沿线追用 MO.longTail。
CAM.at = (keys, t) => {
  if (t <= keys[0].t) return { ...keys[0] };
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (t <= b.t) { const e = (b.ease || MO.cubicInOut)(MO.seg(t, a.t, b.t));
      return { x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e), z: CAM.zlerp(a.z, b.z, e), r: lerp(a.r || 0, b.r || 0, e), v: e }; }
  }
  return { ...keys[keys.length - 1] };
};

// ---------- 脉冲镜头（解说片默认用它，不用匀速慢推） ----------
// 节奏：停住 → 快推 / 横移 / 砸入 → 停住；停多久按口播。时长在 MO.PULSE（快推 0.28s、横移 0.30s、砸入 0.17s）。
// CAM.track(base, events, t) → cam：base 是起始相机 {x, y, z}；events 是按时间排的镜头动作，相机只由 t 算出来（确定性，可跳帧）。
// 每个动作从「上一个动作结束时的相机」出发，到 at + dur 落定；两个动作挨太近（上一个没走完下一个就开始）时，下一个从上一个此刻的位置接着走。
//   {at, kind: 'punch', k?, x?, y?, dur?}   快推：z 乘以 (1+k)（k 默认 0.25；横竖屏都写 0.18–0.32）；给 x, y 就同时把这个世界点移到画面中心，
//                                            不给就绕当前画面中心推。k 可以写负数（快拉，回到上一档）。
//   {at, kind: 'pan', x, y, dur?}            同倍率横移：缩放不变，画面中心移到世界点 (x, y)。同一面「墙」上从一件证据移到下一件。
//   {at, kind: 'to', x?, y?, z?, dur?, ease?} 推到指定相机（推近截图上的一块：z 用 MD.zoomFor 算）；dur 默认 0.28。
//   {at, kind: 'slam', dur?, from?}          整帧砸入：z 额外乘 MO.slamK（1.55→0.94→1.0，0.17s）。镜头切到新画面那一帧用。
//   {at, kind: 'shake', amp?, dur?}          震镜：dur（默认 4 帧 ≈ 0.13s）内上下抖 amp 像素（默认 14），和砸入、盖章同帧用，一支片子别超过两次。
//   {at, kind: 'cut', x?, y?, z?}            硬切到这台相机（不过渡）。
// 返回的 cam 带 moving: true/false（这一刻是否在运动），给运动模糊、标签显隐用。
CAM.track = (base, events, t) => {
  let cam = { x: base.x ?? W / 2, y: base.y ?? H / 2, z: base.z ?? 1 }, zMul = 1, dy = 0, moving = false;
  const evs = [...events].sort((a, b) => a.at - b.at);
  for (const e of evs) {
    if (t < e.at) break;
    const P = MO.PULSE, kind = e.kind || 'punch';
    if (kind === 'cut') { cam = { x: e.x ?? cam.x, y: e.y ?? cam.y, z: e.z ?? cam.z }; continue; }
    if (kind === 'slam') { const d = e.dur || P.slam, k = (t - e.at) / d; if (k < 1) { zMul *= MO.slamK(k, e.from); moving = true; } continue; }
    if (kind === 'shake') { const d = e.dur || 4 / 30, k = (t - e.at) / d; if (k < 1) { dy += (e.amp ?? 14) * Math.sin(k * Math.PI * 4) * (1 - k) / cam.z; moving = true; } continue; }
    const d = e.dur || (kind === 'pan' ? P.pan : P.punch), p = (e.ease || MO.cubicInOut)(clamp((t - e.at) / d));
    let to;
    if (kind === 'pan') to = { x: e.x ?? cam.x, y: e.y ?? cam.y, z: cam.z };
    else if (kind === 'to') to = { x: e.x ?? cam.x, y: e.y ?? cam.y, z: e.z ?? cam.z };
    else to = { x: e.x ?? cam.x, y: e.y ?? cam.y, z: cam.z * (1 + (e.k ?? P.k)) };
    if (p < 1) moving = true;
    cam = { x: lerp(cam.x, to.x, p), y: lerp(cam.y, to.y, p), z: CAM.zlerp(cam.z, to.z, p) };
  }
  return { x: cam.x, y: cam.y + dy, z: cam.z * zMul, moving };
};

// ---------- 视差 ----------
// d=1 是主体平面，d<1 远、d>1 近。远层位移按 d 线性、缩放按 z^d：深推时远景几乎不动，这就是景深感（Kurzgesagt 5 层视差）。
CAM.layer = (c, cam, d, fn) => { const k = n(cam); c.save(); CAM.apply(c, { x: lerp(W / 2, k.x, d), y: lerp(H / 2, k.y, d), z: Math.pow(k.z, d) }); fn(c); c.restore(); };

// ---------- 运动 ----------
// 相机在屏幕上的瞬时速度（像素/帧，60fps）：camFn(t) → cam。给 motionBlur 用。
CAM.velocity = (camFn, t, dt = 1 / 60) => { const a = camFn(t), b = camFn(t - dt); const z = n(a).z; return [(n(a).x - n(b).x) * z, (n(a).y - n(b).y) * z]; };
// 动态模糊：沿速度方向把整帧叠 n 次（快摇/甩镜用；速度 <1.5px 自动退化成一次绘制）。模糊长度应短于相机位移（PremiumBeat）。
CAM.motionBlur = (c, src, vx, vy, k = 7) => {
  const sp = Math.hypot(vx, vy); if (sp < 1.5) { c.drawImage(src, 0, 0); return; }
  c.save(); for (let i = 0; i < k; i++) { const q = i / (k - 1) - 0.5; c.globalAlpha = i === 0 ? 1 : 1 / (i + 1); c.drawImage(src, -vx * q, -vy * q); } c.restore();
};
// 手持感微漂：两路不同周期的正弦（连续时间，不闪），返回 [dx, dy] 像素。只给艺术风格画面和纯氛围镜头；解说镜头停住时就停住，不加微漂
CAM.drift = (t, amp = 6, seed = 0) => [amp * Math.sin(t * 0.9 + seed) + amp * 0.4 * Math.sin(t * 2.3 + seed * 2), amp * 0.7 * Math.sin(t * 1.1 + seed * 3)];
})();

CAM = scope.CAM;

// lib/diagram.js
// 图解与形变 DG：点列、逐笔描出（draw-on）、揭开遮罩、手绘抖动线、manim 式 Transform / Write、白板笔画时间线＋跟随的笔、
// 神经网络（神经元/连线/信号闪过）、Indicate / Circumscribe / 大括号、3b1b 色板。
// 约定：点列 pts = [[x,y],...]；cum = DG.cum(pts) 是累计弧长；「画到 d」都按弧长算。确定性：随机全走种子。
(() => {
let W = 1920, H = 1080; U.onStage((w, h) => { W = w; H = h; });   // 画布尺寸跟 U.setStage 走（默认 1920×1080）
const { clamp, lerp, rng } = U;
const DG = scope.DG = {};

// ---------- 点列 ----------
DG.cum = pts => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return L; };
DG.len = pts => { const L = DG.cum(pts); return L[L.length - 1]; };
// 折线上弧长 d 处的点
DG.pointAt = (pts, cum, d) => {
  if (d <= 0) return pts[0]; const n = pts.length; if (d >= cum[n - 1]) return pts[n - 1];
  let lo = 0, hi = n - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] < d) lo = m; else hi = m; }
  const q = (d - cum[lo]) / (cum[hi] - cum[lo] || 1); return [lerp(pts[lo][0], pts[hi][0], q), lerp(pts[lo][1], pts[hi][1], q)];
};
// 逐笔描出：画折线的前 d 长度（用当前 strokeStyle/lineWidth），返回笔尖位置。白板、红笔圈、红线连接都用它。
DG.drawPartial = (c, pts, cum, d) => {
  const n = pts.length; if (d <= 0 || n < 2) return pts[0];
  c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
  let i = 1; for (; i < n && cum[i] <= d; i++) c.lineTo(pts[i][0], pts[i][1]);
  let tip = pts[n - 1];
  if (i < n) { tip = DG.pointAt(pts, cum, d); c.lineTo(tip[0], tip[1]); }
  c.stroke(); return tip;
};
// 变换点列：平移 (dx,dy)、缩放 s
DG.xform = (pts, dx, dy, s = 1) => pts.map(([x, y]) => [dx + x * s, dy + y * s]);
// 椭圆弧点列（a0→a1）
DG.arcPts = (cx, cy, rx, ry, a0, a1, n = 24) => { const o = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return o; };
// 手画的圈：从 a0 起转 turns 圈（>1 首尾略交叉，像真的用笔圈）
DG.ellipsePts = (cx, cy, rx, ry, a0 = -Math.PI / 2, turns = 1.08, n = 64) => DG.arcPts(cx, cy, rx, ry, a0, a0 + turns * Math.PI * 2, n);
// 手绘抖动：Catmull-Rom 加密后按种子加低频抖动（静态，不沸腾——白板上的线画完就不动）
DG.hand = (pts, { per = 8, amp = 1.6, seed = 1, freq = 0.035 } = {}) => {
  const d = KIT.densify(pts, per), r = rng(seed), ph = r() * 100;
  return KIT.resample(d, 3).map(([x, y], i) => [x + PAINT.noise(i * freq + ph, 3.1) * amp * 2, y + PAINT.noise(i * freq + ph, 7.7) * amp * 2]);
};
// 揭开遮罩：沿折线前 d 长度，每段做成同向绕行的方条（方头延长 w/2），合成一条 Path2D 用来 clip。
// VideoScribe 的「Reveal」画法：之字形笔触从上往下揭开一张画；也用于逐字书写。同向绕行保证 nonzero 下重叠处不抵消。
DG.revealMask = (pts, cum, d, w) => {
  const p = new Path2D(), h = w / 2;
  for (let i = 1; i < pts.length && cum[i - 1] < d; i++) {
    const a = pts[i - 1], b0 = pts[i], L = cum[i] - cum[i - 1]; if (L <= 0) continue;
    const q = Math.min(1, (d - cum[i - 1]) / L), b = [a[0] + (b0[0] - a[0]) * q, a[1] + (b0[1] - a[1]) * q];
    const ux = (b0[0] - a[0]) / L, uy = (b0[1] - a[1]) / L, nx = -uy * h, ny = ux * h;
    const A = [a[0] - ux * h, a[1] - uy * h], B = [b[0] + ux * h, b[1] + uy * h];
    p.moveTo(A[0] + nx, A[1] + ny); p.lineTo(B[0] + nx, B[1] + ny); p.lineTo(B[0] - nx, B[1] - ny); p.lineTo(A[0] - nx, A[1] - ny); p.closePath();
  }
  return p;
};
// 之字形揭开路径：在框 (x,y,w,h) 里从上往下 rows 行来回
DG.zigzag = (x, y, w, h, rows) => { const o = []; for (let r = 0; r <= rows; r++) { const yy = y + h * r / rows; o.push(r % 2 ? [x + w, yy] : [x, yy]); } return o; };

// ---------- manim Transform：两边点数相同、起点对齐（都从左上方向起、顺时针）才能逐点插值 ----------
DG.rectPts = (cx, cy, w, h, n = 64) => {
  const per = 2 * (w + h), out = [];
  for (let i = 0; i < n; i++) {
    let d = i / n * per; let x, y;
    if (d < w) { x = cx - w / 2 + d; y = cy - h / 2; }
    else if ((d -= w) < h) { x = cx + w / 2; y = cy - h / 2 + d; }
    else if ((d -= h) < w) { x = cx + w / 2 - d; y = cy + h / 2; }
    else { d -= w; x = cx - w / 2; y = cy + h / 2 - d; }
    out.push([x, y]);
  }
  return out;
};
DG.circlePts = (cx, cy, r, n = 64) => { const out = []; for (let i = 0; i < n; i++) { const a = -3 * Math.PI / 4 + i / n * 2 * Math.PI; out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return out; };
DG.morph = (A, B, p) => A.map((a, i) => [lerp(a[0], B[i][0], p), lerp(a[1], B[i][1], p)]);
DG.shape = (c, pts, { fill, stroke, lw = 2 } = {}) => {
  c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath();
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke && lw > 0) { c.strokeStyle = stroke; c.lineWidth = lw; c.lineJoin = 'round'; c.stroke(); }
};

// ---------- 颜色（接受 '#hex' 或 [r,g,b]） ----------
DG.arr = h => Array.isArray(h) ? h : PAINT.hex(h);
DG.mixA = (h1, h2, t) => { const a = DG.arr(h1), b = DG.arr(h2); return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; };
DG.rgba = (h, a = 1) => { const v = DG.arr(h); return `rgba(${v[0] | 0},${v[1] | 0},${v[2] | 0},${a})`; };
DG.mix = (h1, h2, t) => DG.rgba(DG.mixA(h1, h2, t));
// 3b1b 色板。Grant 的 custom_config 在 ffmpeg 导出时 saturation=1.5，照 manim 原色值直接用会发灰，所以 DG.MANIM 是饱和后的。
DG.MANIM_RAW = { BLUE_C: '#58C4DD', BLUE_D: '#29ABCA', BLUE_E: '#1C758A', TEAL_C: '#5CD0B3', GREEN_C: '#83C167', YELLOW: '#FFFF00', GOLD_C: '#F0AC5F',
  RED_C: '#FC6255', MAROON_C: '#C55F73', PURPLE_C: '#9A72AC', GREY_A: '#DDDDDD', GREY_B: '#BBBBBB', GREY_C: '#888888', GREY_D: '#444444', GREY_E: '#222222', WHITE: '#FFFFFF', BLACK: '#000000' };
DG.saturate = (hex, s = 1.5) => {                         // CSS/SVG saturate 矩阵
  const [r, g, b] = PAINT.hex(hex);
  const R = (0.213 + 0.787 * s) * r + (0.715 - 0.715 * s) * g + (0.072 - 0.072 * s) * b;
  const G = (0.213 - 0.213 * s) * r + (0.715 + 0.285 * s) * g + (0.072 - 0.072 * s) * b;
  const B = (0.213 - 0.213 * s) * r + (0.715 - 0.715 * s) * g + (0.072 + 0.928 * s) * b;
  const f = v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0');
  return '#' + f(R) + f(G) + f(B);
};
DG.MANIM = {}; for (const k in DG.MANIM_RAW) DG.MANIM[k] = DG.saturate(DG.MANIM_RAW[k]);
DG.U = H / 8;                                             // manim：画面高 8 个单位 → 1 单位 = 135px（1080p）

// ---------- Write 与公式（CMU = LaTeX Computer Modern；中文用思源宋） ----------
DG.FONT = { rm: 'CMU-rm', it: 'CMU-it', zh: 'NotoSerifSC' };
const famOf = tk => tk.zh ? DG.FONT.zh : tk.it ? DG.FONT.it : DG.FONT.rm;
// tokens: [{s, it, zh, col, sub, sup, size, gap}]；返回每个 token 的 {x,w,sz}（相对起点）
DG.layout = (c, tokens, size) => {
  let x = 0; return tokens.map(tk => {
    const sz = (tk.size || 1) * size; c.font = `${sz}px "${famOf(tk)}"`;
    const w = c.measureText(tk.s).width; let sw = 0;
    if (tk.sub || tk.sup) { c.font = `${sz * 0.62}px "${DG.FONT.rm}"`; sw = c.measureText(tk.sub || tk.sup).width + sz * 0.04; }
    const r = { x, w: w + sw, sz }; x += w + sw + (tk.gap != null ? tk.gap : sz * 0.06); return r;
  });
};
// manim Write：每个 token 先沿轮廓描边（lineDash 推进），后半程填色、描边淡掉；token 间 lag = min(4/(n+1), 0.2)（3b1b creation.py）。
// 尊重外层 globalAlpha（FadeOut 时整条公式一起淡）。返回每个 token 的屏幕 {x,w}。
DG.math = (c, tokens, x, y, size, { p = 1, align = 'center', col = '#fff', lag } = {}) => {
  const L = DG.layout(c, tokens, size), total = L.length ? L[L.length - 1].x + L[L.length - 1].w : 0;
  const x0 = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  const n = tokens.length, r = lag != null ? lag : Math.min(4 / (n + 1), 0.2);
  const A0 = c.globalAlpha;
  c.save(); c.textBaseline = 'alphabetic'; c.textAlign = 'left';
  tokens.forEach((tk, i) => {
    const q = MO.lagged(i, n, clamp(p), r); if (q <= 0) return;
    const sz = L[i].sz, fx = x0 + L[i].x, colr = tk.col || col;
    const draw = (txt, xx, yy, f, mode) => { c.font = f; mode === 's' ? c.strokeText(txt, xx, yy) : c.fillText(txt, xx, yy); };
    const main = `${sz}px "${famOf(tk)}"`, small = `${sz * 0.62}px "${DG.FONT.rm}"`;
    c.font = main; const mw = c.measureText(tk.s).width;
    const parts = [[tk.s, fx, y, main]]; if (tk.sub) parts.push([tk.sub, fx + mw + sz * 0.02, y + sz * 0.22, small]); if (tk.sup) parts.push([tk.sup, fx + mw + sz * 0.02, y - sz * 0.42, small]);
    const qs = MO.doubleSmooth(q);
    if (qs < 1) { c.strokeStyle = colr; c.lineWidth = Math.max(1.2, sz * 0.025); c.setLineDash([sz * 5 * clamp(qs * 2), 1e5]); c.globalAlpha = A0 * (1 - clamp((qs - 0.6) / 0.4)); parts.forEach(pt => draw(pt[0], pt[1], pt[2], pt[3], 's')); c.setLineDash([]); }
    const fa = clamp((qs - 0.4) / 0.6); if (fa > 0) { c.globalAlpha = A0 * fa; c.fillStyle = colr; parts.forEach(pt => draw(pt[0], pt[1], pt[2], pt[3], 'f')); }
    c.globalAlpha = A0;
  });
  c.restore();
  return L.map(l => ({ x: x0 + l.x, w: l.w }));
};
// 纯文本的 Write（中文标题也走这个：非 ASCII 字自动用 DG.FONT.zh）
DG.write = (c, text, x, y, size, p, opt = {}) => DG.math(c, [...text].map(ch => ({ s: ch, zh: /[^\x00-\x7f]/.test(ch) || opt.zh, gap: 0 })), x, y, size, { ...opt, p });

// ---------- 神经网络 ----------
// 神经元：描边白 2px，填充不透明度 = 激活值（3b1b nn/part1.py 原做法）
DG.neuron = (c, x, y, r, a, { stroke = '#fff', fill = '#fff', lw = 2, sa = 1 } = {}) => {
  c.save(); c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2);
  if (a > 0) { c.globalAlpha = clamp(a); c.fillStyle = fill; c.fill(); }
  c.globalAlpha = sa; c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); c.restore();
};
// 圆周到圆周的连线端点
DG.edgeEnds = (ax, ay, ar, bx, by, br) => { const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy) || 1; return [ax + dx / d * ar, ay + dy / d * ar, bx - dx / d * br, by - dy / d * br]; };
// 连线：正权重蓝、负权重红；线宽 = minW + maxW·|w|³（nn/part2.py：3·(|w|/max)³）；p = 画到哪（ShowCreation）
DG.edge = (c, e, w, p = 1, { maxW = 3.2, minW = 0.6, pos = DG.MANIM.BLUE_C, neg = DG.MANIM.RED_C, alpha = 0.85, from = 0 } = {}) => {
  if (p <= from) return;
  const [x1, y1, x2, y2] = e;
  c.save(); c.strokeStyle = w >= 0 ? pos : neg; c.globalAlpha = alpha; c.lineWidth = minW + maxW * Math.pow(Math.min(1, Math.abs(w)), 3);
  c.beginPath(); c.moveTo(lerp(x1, x2, from), lerp(y1, y2, from)); c.lineTo(lerp(x1, x2, p), lerp(y1, y2, p)); c.stroke(); c.restore();
};
// ShowPassingFlash（time_width=2.0）：信号沿线闪过，返回可见段 [lo, hi]（0..1）
DG.flash = (alpha, tw = 2) => { const up = lerp(0, 1 + tw, alpha); return [clamp(up - tw), clamp(up)]; };

// ---------- 提示 ----------
DG.indicate = p => ({ s: 1 + 0.2 * MO.thereAndBack(clamp(p)), k: MO.thereAndBack(clamp(p)) });   // 放大 1.2、染黄（k）、回来
// Circumscribe：矩形框沿周长画出再收走（time_width 0.3 的近似）
DG.circumscribe = (c, x, y, w, h, p, { col = DG.MANIM.YELLOW, lw = 4, tw = 0.3 } = {}) => {
  if (p <= 0 || p >= 1) return; const pts = DG.rectPts(x + w / 2, y + h / 2, w, h, 160);
  const hi = clamp(lerp(0, 1 + tw, p)), lo = clamp(hi - tw - (1 - p) * 0.7);
  c.save(); c.strokeStyle = col; c.lineWidth = lw; c.beginPath();
  const i0 = Math.floor(lo * 160), i1 = Math.floor(hi * 160); for (let i = i0; i <= Math.min(160, i1); i++) { const q = pts[i % 160]; i === i0 ? c.moveTo(q[0], q[1]) : c.lineTo(q[0], q[1]); } c.stroke(); c.restore();
};
// 大括号（竖直，开口朝右），从中间向两端长出
DG.brace = (c, x, y0, y1, { col = '#fff', lw = 3, depth = 22, p = 1 } = {}) => {
  if (p <= 0) return; const ym = (y0 + y1) / 2;
  c.save(); c.strokeStyle = col; c.lineWidth = lw; c.lineCap = 'round'; c.globalAlpha = clamp(p * 1.5);
  const k = MO.smooth(p), a0 = lerp(ym, y0, k), a1 = lerp(ym, y1, k);
  c.beginPath(); c.moveTo(x, a0); c.quadraticCurveTo(x - depth * 0.5, a0, x - depth * 0.5, a0 + Math.min(40, (ym - a0) * 0.3));
  c.lineTo(x - depth * 0.5, ym - Math.min(40, (ym - a0) * 0.3)); c.quadraticCurveTo(x - depth * 0.5, ym, x - depth, ym);
  c.quadraticCurveTo(x - depth * 0.5, ym, x - depth * 0.5, ym + Math.min(40, (a1 - ym) * 0.3));
  c.lineTo(x - depth * 0.5, a1 - Math.min(40, (a1 - ym) * 0.3)); c.quadraticCurveTo(x - depth * 0.5, a1, x, a1); c.stroke(); c.restore();
};

// ---------- 白板：笔画时间线 ＋ 一支跟着画的笔 ----------
// 按顺序往板上加笔画，每笔时长 = 长度 / 笔速，自动排成时间线；画的时候笔尖永远在最新那一笔的前沿，两笔之间沿弧线滑过去，笔从不离开画面。
//   const B = DG.board({ ink, lw, speed, font });  B.at(0.12); B.line(pts); B.text('猫？', x, y, 150, {rate: 7.5}); B.pop('×1000万张', x, y, 74); ...
//   每帧：const { tip, col } = B.draw(g, ft)（在世界坐标里画，调用方先套相机）；const [sx, sy] = B.penAt(ft, cam, tip)；DG.pen(c, sx, sy, col || B.penColor(ft))。
// 自定义笔画 B.push({ kind:'custom', t0, t1, col, draw(g, q, ft) → 笔尖|null, start() → 世界点, end() → 世界点, handed:true })。
// 速度口径（RSA 实测）：正文写字 ≈16 字/秒、标题 ≈7.5 字/秒；强调色关键词不带手、整词弹出（后期合成）。
DG.board = ({ ink = '#0A0503', lw = 6.5, speed = 2600, font = '"LXGWWenKai-500"' } = {}) => {
  const B = { S: [], cur: 0, ink, lw, speed, font };
  B.at = t => { B.cur = t; return B; };
  B.push = s => { B.S.push(s); return s; };
  B.line = (raw, { w = lw, col = ink, speed: sp = speed, seed = B.S.length + 1, amp = 1.4, smooth = true, min = 0.04, gap = 0.02 } = {}) => {
    const pts = smooth ? DG.hand(raw, { amp, seed, per: 8 }) : raw, cum = DG.cum(pts), len = cum[cum.length - 1];
    const d = Math.max(min, len / sp); B.S.push({ kind: 'line', pts, cum, len, w, col, t0: B.cur, t1: B.cur + d }); B.cur += d + gap;
  };
  // 一笔直线（不抖、固定时长，比如网络连线），不推进太多时间
  B.segment = (a, b, { w = 3, col = ink, dur = 0.06, gap = 0.012 } = {}) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); B.S.push({ kind: 'line', pts: [a, b], cum: [0, L], len: L, w, col, t0: B.cur, t1: B.cur + dur }); B.cur += gap;
  };
  // 手写字：rate 字/秒
  B.text = (str, x, y, size, { col = ink, rate = 16, align = 'left', dur } = {}) => {
    const d = dur || [...str].length / rate; B.S.push({ kind: 'text', str, x, y, size, col, align, t0: B.cur, t1: B.cur + d }); B.cur += d + 0.03;
  };
  // 强调词：不带手、0.3s 放大回落整词弹出
  B.pop = (str, x, y, size, { col = ink, align = 'center', dur = 0.3 } = {}) => { B.S.push({ kind: 'pop', str, x, y, size, col, align, t0: B.cur, t1: B.cur + dur }); B.cur += 0.12; };
  // 铺色（淡入，不推进时间）
  B.fill = (path, col, dur = 0.18) => { B.S.push({ kind: 'fill', path, col, t0: B.cur, t1: B.cur + dur }); };

  const drawOne = (g, s, ft) => {
    if (ft < s.t0) return null;
    const q = clamp((ft - s.t0) / (s.t1 - s.t0));
    if (s.kind === 'custom') return s.draw(g, q, ft);
    if (s.kind === 'fill') { g.save(); g.globalAlpha = q; g.fillStyle = s.col; g.fill(s.path); g.restore(); return null; }
    if (s.kind === 'line') { g.strokeStyle = s.col; g.lineWidth = s.w; return DG.drawPartial(g, s.pts, s.cum, s.len * MO.sineInOut(q)); }
    if (s.kind === 'pop') {
      g.save(); g.font = `${s.size}px ${B.font}`; g.fillStyle = s.col; g.textBaseline = 'alphabetic'; g.textAlign = s.align;
      const e = MO.backOut(q, 2.2); g.globalAlpha = clamp(q * 4); g.translate(s.x, s.y - s.size * 0.35); g.scale(e, e); g.fillText(s.str, 0, s.size * 0.35); g.restore(); return null;
    }
    if (s.kind === 'text') {
      // 逐字写：笔尖在字框里 3 行之字形来回，遮罩跟着笔尖揭开这个字（Reveal 画法用在单字上）
      g.save(); g.font = `${s.size}px ${B.font}`; g.fillStyle = s.col; g.textBaseline = 'alphabetic';
      const chars = [...s.str], ws = chars.map(ch => g.measureText(ch).width), w = ws.reduce((a, b) => a + b, 0), x0 = s.align === 'center' ? s.x - w / 2 : s.x;
      const n = chars.length, k = Math.min(n, q * n), done = Math.floor(k);
      let x = x0, tip = null;
      chars.forEach((ch, i) => {
        if (i < done) g.fillText(ch, x, s.y);
        else if (i === done && k < n) {
          const zz = DG.zigzag(x - 2, s.y - s.size * 0.95, ws[i] + 4, s.size * 1.15, 3), cum = DG.cum(zz), d = cum[cum.length - 1] * (k - done);
          g.save(); g.clip(DG.revealMask(zz, cum, d, s.size * 0.62)); g.fillText(ch, x, s.y); g.restore(); tip = DG.pointAt(zz, cum, d);
        }
        x += ws[i];
      });
      g.restore(); return tip || [x0 + w, s.y - s.size * 0.35];
    }
    return null;
  };
  // 画全部笔画（世界坐标）。返回正在画的那一笔的笔尖与墨色（没有在画的 → tip=null）
  B.draw = (g, ft) => {
    g.lineJoin = 'round'; g.lineCap = 'round';
    let tip = null, col = null;
    for (const s of B.S) { const p = drawOne(g, s, ft); if (p && ft < s.t1) { tip = p; col = s.col; } }
    return { tip, col };
  };
  const handed = () => B.S.filter(s => s.kind !== 'pop' && s.kind !== 'fill' && (s.kind !== 'custom' || s.handed !== false));
  const tw = s => s.size * [...s.str].length * 0.9;
  const endPt = s => s.kind === 'custom' ? s.end() : s.kind === 'line' ? s.pts[s.pts.length - 1] : [s.align === 'center' ? s.x + tw(s) / 2 : s.x + tw(s), s.y - s.size * 0.3];
  const startPt = s => s.kind === 'custom' ? s.start() : s.kind === 'line' ? s.pts[0] : [s.align === 'center' ? s.x - tw(s) / 2 : s.x, s.y - s.size * 0.3];
  // 笔在屏幕上的位置：在画 → 笔尖；两笔之间 → 从上一笔终点沿弧线滑到下一笔起点；开场 → 从右下入画
  B.penAt = (ft, cam, tip) => {
    if (tip) return CAM.toScreen(cam, tip[0], tip[1]);
    let prev = null, next = null;
    for (const s of handed()) { if (s.t1 <= ft) prev = s; else if (s.t0 > ft && !next) next = s; }
    if (prev && next) {
      const q = MO.sineInOut((ft - prev.t1) / (next.t0 - prev.t1)), a = CAM.toScreen(cam, ...endPt(prev)), b = CAM.toScreen(cam, ...startPt(next));
      return [lerp(a[0], b[0], q), lerp(a[1], b[1], q) - Math.sin(q * Math.PI) * Math.min(80, 20 + Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.15)];
    }
    if (next) { const b = CAM.toScreen(cam, ...startPt(next)), q = MO.cubicOut(clamp(ft / next.t0)); return [lerp(W * 0.62, b[0], q), lerp(H * 0.7, b[1], q)]; }
    return CAM.toScreen(cam, ...endPt(prev));
  };
  // 空档里笔的颜色 = 下一笔的墨色（没有下一笔就用上一笔）
  B.penColor = ft => { const hs = handed(), nx = hs.find(s => s.t0 > ft), pv = [...hs].reverse().find(s => s.t1 <= ft); return (nx || pv || { col: ink }).col; };
  return B;
};
// 一支马克笔（屏幕空间，笔尖在 (x,y)，笔身朝右上）。笔尾帽 = 墨色；有高光和投影，浮在板上。用笔引导视线。
DG.pen = (c, x, y, col, tilt = 0) => {
  c.save(); c.translate(x, y); c.rotate(-0.72 + tilt);
  c.fillStyle = 'rgba(0,0,0,.12)'; c.beginPath(); c.roundRect(30, 14, 250, 34, 16); c.fill();
  c.fillStyle = col; c.beginPath(); c.moveTo(0, 0); c.lineTo(26, -8); c.lineTo(26, 8); c.closePath(); c.fill();
  c.fillStyle = '#e8e8e4'; c.beginPath(); c.roundRect(24, -12, 26, 24, 4); c.fill();
  c.fillStyle = '#26262a'; c.beginPath(); c.roundRect(48, -17, 190, 34, 12); c.fill();
  c.fillStyle = col; c.beginPath(); c.roundRect(212, -18, 46, 36, 10); c.fill();
  c.fillStyle = 'rgba(255,255,255,.22)'; c.beginPath(); c.roundRect(60, -12, 140, 7, 4); c.fill();
  c.restore();
};
})();

DG = scope.DG;

const SCENES = scope.SCENES = {};
/* RSA whiteboard: one world, persistent strokes, camera fitted to actual ink bounds. */
scope.SCENES=scope.SCENES||{};
scope.WB=(()=>{
const INK='#0A0503',ORANGE='#EF7226',BG='#FBFBFB';
const B=DG.board({ink:INK,lw:6.5,speed:1750,font:'"LXGWWenKai-500"'});
const groups={},groupTimes={},cl=U.clamp;
function line(pts,col=INK,w=6.5){B.line(pts,{col,w,smooth:false,gap:.017,min:.026});}
function sketch(pts,col=INK,w=6.5){B.line(pts,{col,w,smooth:true,amp:1.0,gap:.018});}
function ellipse(x,y,rx,ry,col=INK,w=6){B.line(DG.ellipsePts(x,y,rx,ry,-1.8,1.03,52),{col,w,smooth:true,amp:.6,gap:.014})}
function box(x,y,w,h,col=INK,lw=6.5){line([[x+3,y],[x+w,y+2],[x+w-2,y+h],[x,y+h-2],[x+3,y]],col,lw)}
function text(s,x,y,size=66,col=INK){B.text(s,x,y,size,{col,rate:10})}
function hatch(x,y,w,h){for(let i=0;i<w;i+=24)line([[x+i,y+h],[x+Math.min(i+32,w),y]],ORANGE,3)}
function arrow(points,col=ORANGE,w=7){sketch(points,col,w);let a=points.at(-2),b=points.at(-1),ang=Math.atan2(b[1]-a[1],b[0]-a[0]);line([[b[0]-31*Math.cos(ang-.55),b[1]-31*Math.sin(ang-.55)],b,[b[0]-31*Math.cos(ang+.55),b[1]-31*Math.sin(ang+.55)]],col,w)}
function check(x,y,s=1,col=ORANGE){line([[x-25*s,y],[x-5*s,y+23*s],[x+45*s,y-35*s]],col,9*s)}
function group(name,start,end,fn){let first=B.S.length;B.at(0);fn();let list=B.S.slice(first),duration=Math.max(...list.map(s=>s.t1),.01);for(const s of list){s.t0=start+s.t0/duration*(end-start);s.t1=start+s.t1/duration*(end-start)}groups[name]=list;groupTimes[name]=[start,end]}
function calendar(x,y,s=1){const P=a=>a.map(([a,b])=>[x+a*s,y+b*s]);line(P([[0,20],[230,16],[231,214],[0,210],[0,20]]));line(P([[0,70],[230,70]]));for(const xx of [47,178])line(P([[xx,0],[xx,43]]));for(let yy=105;yy<194;yy+=39)for(let xx=39;xx<210;xx+=48)line(P([[xx,yy],[xx+14,yy]]),INK,5*s);ellipse(x+140*s,y+146*s,24*s,23*s,ORANGE,5*s)}
function pin(x,y,s=1){sketch([[x,y],[x-31*s,y-48*s],[x-29*s,y-82*s],[x,y-101*s],[x+29*s,y-82*s],[x+31*s,y-48*s],[x,y]]);ellipse(x,y-65*s,10*s,10*s)}
function ticket(x,y,s=1){const P=a=>a.map(([a,b])=>[x+a*s,y+b*s]);line(P([[0,0],[269,0],[270,150],[0,149],[0,0]]));for(let yy=12;yy<140;yy+=19)line(P([[199,yy],[199,yy+6]]),INK,3);line(P([[26,33],[160,33]]),INK,6);line(P([[26,61],[116,61]]),INK,4);for(let i=0;i<17;i++)line(P([[28+i*8, 97],[28+i*8,125]]),INK,(i%3===0?4:2)*s)}
function laptop(x,y,s=1){const P=a=>a.map(([a,b])=>[x+a*s,y+b*s]);line(P([[0,0],[710,0],[710,430],[0,430],[0,0]]));line(P([[28,27],[683,26],[682,399],[26,400],[28,27]]),INK,4);line(P([[0,430],[-58,487],[765,487],[710,430]]));line(P([[260,450],[442,450],[468,469],[240,469],[260,450]]),INK,3)}
function windowFrame(x,y,w,h){box(x,y,w,h);line([[x,y+45],[x+w,y+45]],INK,4);for(let i=0;i<3;i++)ellipse(x+20+i*22,y+22,3,3,INK,4)}
function book(x,y,s=1){const P=a=>a.map(([a,b])=>[x+a*s,y+b*s]);sketch(P([[0,0],[125,-23],[260,4],[260,382],[124,357],[0,382],[0,0]]));sketch(P([[260,4],[395,-23],[520,0],[520,382],[390,357],[260,382]]));sketch(P([[260,7],[254,144],[259,378]]),INK,4);line(P([[-20,26],[-22,405],[250,405],[263,412],[280,405],[540,405],[540,25]]),INK,4)}
function magnify(x,y,s=1){ellipse(x,y,57*s,57*s);ellipse(x,y,43*s,43*s,INK,3);line([[x+41*s,y+42*s],[x+102*s,y+101*s]],INK,15*s)}
function cursor(x,y,s=1){line([[x,y],[x+9*s,y+100*s],[x+34*s,y+75*s],[x+60*s,y+118*s],[x+82*s,y+103*s],[x+52*s,y+60*s],[x+89*s,y+51*s],[x,y]],INK,5)}
// A · a tangible chore, drawn before naming the pain.
group('a_laptop',-.65,1.2,()=>{laptop(180,215,.95);});
group('a_windows',1.22,3.78,()=>{windowFrame(270,320,287,216);ticket(292,383,.78);windowFrame(536,178,330,287);calendar(588,238,.77);sketch([[359,569],[432,580],[487,567]],INK,4);cursor(695,481,.64)});
group('a_pain',4.18,5.65,()=>{ellipse(1058,476,90,89);line([[1058,409],[1058,477],[1101,501]],INK,6);line([[1015,365],[1040,344],[1080,344],[1101,365]],INK,5);text('麻烦',392,807,88,ORANGE);sketch([[384,826],[486,837],[603,829]],ORANGE,7);});
group('ab',5.8,6.35,()=>arrow([[1123,527],[1200,561],[1281,496],[1360,438]]));
// B · speak a goal, then name Agent. Existing ink remains.
group('b_speech',6.35,7.9,()=>{sketch([[1395,224],[1557,203],[1770,211],[1925,222],[1960,285],[1941,388],[1760,399],[1590,389],[1480,433],[1510,384],[1401,381],[1379,303],[1395,224]]);text('安排周末出行',1453,322,56)});
group('b_map',8.25,10.9,()=>{line([[1420,564],[1590,546],[1760,566],[1910,548],[1917,833],[1754,850],[1585,828],[1417,844],[1420,564]]);line([[1590,549],[1585,828]],INK,3);line([[1760,566],[1754,850]],INK,3);pin(1499,719,.65);pin(1831,704,.65);sketch([[1501,745],[1590,744],[1627,675],[1713,727],[1818,725]],ORANGE,8);arrow([[1677,419],[1686,491],[1680,533]],ORANGE,6)});
group('b_agent',14.95,15.78,()=>{text('Agent',2040,492,120,ORANGE);ellipse(2210,463,205,102,ORANGE,7);arrow([[2042,583],[1990,657],[1950,682]],ORANGE,6)});
group('bc',16,16.65,()=>arrow([[2394,445],[2470,375],[2570,371]]));
// C · open book: goal, action, result drawn in the book, with short title.
group('c_book',16.7,18.8,()=>{book(2650,210,1.3);pin(2810,470,.9);line([[2740,549],[2900,549]],INK,5);line([[2757,584],[2880,584]],INK,4);arrow([[2925,465],[3005,461]],ORANGE,6);check(3136,467,1.25);line([[3060,549],[3235,549]],INK,5);line([[3070,584],[3210,584]],INK,4)});
group('c_title',19.12,19.95,()=>{text('基础概念',2787,855,85,ORANGE);sketch([[2782,876],[2940,884],[3125,875]],ORANGE,7)});
group('cd',20.5,21.15,()=>arrow([[3301,766],[3437,874],[3440,974],[3344,1077]]));
// D · real practice: request -> browser operation -> itinerary.
group('d_clip',21.1,22.5,()=>{box(2650,1130,270,380);box(2710,1103,150,59);line([[2685,1242],[2860,1242]],INK,6);line([[2685,1284],[2810,1284]],INK,4);calendar(2690,1327,.75)});
group('d_title',22.55,23.2,()=>text('完整实战',2767,1040,84,ORANGE));
group('d_request',24.5,25.25,()=>{text('需求',2690,1599,66);ellipse(2782,1338,168,235,ORANGE,5)});
group('d_browser',25.45,28.35,()=>{arrow([[2955,1300],[3043,1296]],ORANGE,7);windowFrame(3080,1140,345,290);magnify(3154,1253,.6);line([[3250,1231],[3364,1231]],INK,5);line([[3250,1260],[3346,1260]],INK,4);sketch([[3124,1360],[3192,1330],[3279,1370],[3381,1316]],ORANGE,6);line([[3168,1440],[3240,1475],[3320,1441]],INK,4)});
group('d_action',28.6,30.55,()=>{text('执行',3166,1577,64);arrow([[3378,1457],[3456,1507],[3448,1591],[3342,1657]],ORANGE,7);ticket(3074,1677,1.24)});
group('d_done',30.65,32.75,()=>{check(3400,1817,1.1);text('做成',3136,1940,74,ORANGE);sketch([[3065,1963],[3242,1975],[3425,1955]],ORANGE,7)});
group('de',33,33.65,()=>arrow([[2984,1746],[2857,1812],[2654,1810],[2505,1734]]));
// E · tools: one solid toolbox containing a browser, search and task notebook.
group('e_tools',33.65,36.1,()=>{line([[1500,1560],[2390,1560],[2358,1883],[1535,1883],[1500,1560]]);line([[1500,1560],[1547,1448],[2350,1448],[2390,1560]],INK,5);box(1844,1694,196,89);line([[1900,1694],[1900,1783]],INK,4);line([[1988,1694],[1988,1783]],INK,4);magnify(1688,1416,1.25);windowFrame(1844,1216,306,218);box(2195,1230,150,216);for(let y=1267;y<1410;y+=45){check(2222,y,.31);line([[2252,y],[2315,y]],INK,4)}sketch([[1834,1448],[1851,1360],[2048,1360],[2068,1448]],ORANGE,10)});
group('e_title',36.15,36.85,()=>text('实用工具',1764,2026,82,ORANGE));
group('ef',37.48,37.95,()=>arrow([[1430,1715],[1310,1664],[1184,1740]]));
// F · no programming prerequisite, action on notebook, final whole-board reveal.
group('f_learn',37.9,39.2,()=>{book(416,1274,1.03);line([[476,1450],[441,1481],[479,1512]],INK,5);line([[588,1450],[626,1481],[588,1512]],INK,5);line([[554,1438],[516,1524]],INK,5);line([[434,1548],[634,1398]],ORANGE,9);box(739,1402,151,115);cursor(854,1494,.65)});
group('f_go',39.25,40.02,()=>{text('跟着学',523,1830,91,ORANGE);check(815,1467,.9);sketch([[516,1854],[660,1870],[848,1850]],ORANGE,7)});
// Bounds from actual paths and text extents, including text descenders.
function extent(list){let xs=[],ys=[];for(const s of list){if(s.pts){for(let [x,y] of s.pts){xs.push(x-9,x+9);ys.push(y-9,y+9)}}else if(s.str){let w=s.size*[...s.str].length;xs.push(s.align==='center'?s.x-w/2:s.x,s.align==='center'?s.x+w/2:s.x+w);ys.push(s.y-s.size,s.y+s.size*.25)}}return {x0:Math.min(...xs),y0:Math.min(...ys),x1:Math.max(...xs),y1:Math.max(...ys)}}
function fit(names,pad=130){let r=extent(names.flatMap(n=>groups[n]));let w=r.x1-r.x0+pad*2,h=r.y1-r.y0+pad*2;return{x:(r.x0+r.x1)/2,y:(r.y0+r.y1)/2,z:Math.min(1920/w,1080/h)}}
const targets={A:fit(['a_laptop','a_windows','a_pain'],135),B:fit(['b_speech','b_map','b_agent'],140),Bnear:fit(['b_speech','b_map','b_agent'],85),C:fit(['b_agent','c_book','c_title'],100),Dstart:fit(['d_clip','d_title','d_request'],65),Dmid:fit(['d_clip','d_title','d_request','d_browser'],65),D:fit(['d_clip','d_title','d_request','d_browser','d_action','d_done'],65),E:fit(['e_tools','e_title'],125),F:fit(['f_learn','f_go'],130),ALL:fit(Object.keys(groups),145)};
const keys=[{t:0,...targets.A},{t:5.8,...targets.A},{t:7.05,...targets.B},{t:14.65,...targets.B},{t:14.93,...targets.Bnear},{t:16,...targets.Bnear},{t:17.2,...targets.C},{t:20.5,...targets.C},{t:21.55,...targets.Dstart},{t:25.2,...targets.Dstart},{t:26.1,...targets.Dmid},{t:28.5,...targets.Dmid},{t:29.35,...targets.D},{t:33,...targets.D},{t:34.25,...targets.E},{t:37.45,...targets.E},{t:38.45,...targets.F},{t:40.03,...targets.F},{t:40.8,...targets.ALL},{t:43,...targets.ALL}].map(k=>({...k,ease:MO.sineInOut}));
function camera(t){return CAM.at(keys,t)}
function draw(c,t){const cam=camera(t);c.fillStyle=BG;c.fillRect(0,0,1920,1080);c.save();CAM.apply(c,cam);const {tip,col}=B.draw(c,t);c.restore();
// Pen only while drawing; in long rests it exits rather than floating over the result.
if(t<40.04){let pos,alpha=1;if(tip){pos=CAM.toScreen(cam,...tip)}else{let prev=[...B.S].reverse().find(s=>s.t1<=t&&s.kind==='line'),next=B.S.find(s=>s.t0>t);if(prev&&t-prev.t1<.2){let p=cl((t-prev.t1)/.2);pos=CAM.toScreen(cam,...prev.pts.at(-1));pos=[pos[0]+p*160,pos[1]+p*200];alpha=1-p}else if(next&&next.t0-t<.16){pos=B.penAt(t,cam,null);alpha=cl(1-(next.t0-t)/.16)}}if(pos&&Number.isFinite(pos[0])){c.save();c.globalAlpha=alpha;c.translate(pos[0],pos[1]);c.scale(.72,.72);DG.pen(c,0,0,col||INK,.05);c.restore()}}}
for(let i=0;i<10;i++)SCENES['wb'+String(i+1).padStart(2,'0')]={draw:(c,lt,t)=>draw(c,t)};
return {draw,board:B,camera,groups,groupTimes,targets};
})();

return scope.WB;
}
