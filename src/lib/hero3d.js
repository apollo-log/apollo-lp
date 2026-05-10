// ============================================================
// APOLLO — 3D Hero Compass (Three.js)
// initHero3D(canvas) → cleanup(): mounts a stylized compass into
// the given canvas and animates it. Returns a teardown that the
// caller (React effect) must invoke on unmount.
// ============================================================

import * as THREE from 'three';

export function initHero3D(canvas) {
  const wrap = canvas.parentElement;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0b0b0b, 6, 18);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // — lights —
  scene.add(new THREE.AmbientLight(0xffffff, 0.45));
  const key = new THREE.DirectionalLight(0xffd9a3, 1.6);
  key.position.set(3, 4, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xd4a24a, 1.1);
  rim.position.set(-4, -2, -3);
  scene.add(rim);
  const fill = new THREE.PointLight(0xffffff, 0.6, 12);
  fill.position.set(0, 0, 4);
  scene.add(fill);

  // — materials (collected for disposal) —
  const disposables = [];
  const mat = (m) => { disposables.push(m); return m; };
  const geom = (g) => { disposables.push(g); return g; };

  const goldMat = mat(new THREE.MeshStandardMaterial({
    color: 0xd4a24a, metalness: 0.85, roughness: 0.32, emissive: 0x3a2a0a,
  }));
  const steelMat = mat(new THREE.MeshStandardMaterial({
    color: 0x9a978f, metalness: 0.95, roughness: 0.28, emissive: 0x141414,
  }));
  const darkMat = mat(new THREE.MeshStandardMaterial({
    color: 0x2a2a2a, metalness: 0.6, roughness: 0.5,
  }));

  // — root group (compass) —
  const compass = new THREE.Group();
  scene.add(compass);

  // outer gold ring
  compass.add(new THREE.Mesh(geom(new THREE.TorusGeometry(1.6, 0.06, 16, 96)), goldMat));
  // inner steel ring
  compass.add(new THREE.Mesh(geom(new THREE.TorusGeometry(1.25, 0.03, 12, 80)), steelMat));

  // tick marks
  const ticks = new THREE.Group();
  for (let i = 0; i < 32; i++) {
    const isMajor = i % 4 === 0;
    const tick = new THREE.Mesh(
      geom(new THREE.BoxGeometry(0.04, isMajor ? 0.18 : 0.08, 0.02)),
      isMajor ? goldMat : steelMat
    );
    const a = (i / 32) * Math.PI * 2;
    tick.position.set(Math.cos(a) * 1.42, Math.sin(a) * 1.42, 0);
    tick.rotation.z = a - Math.PI / 2;
    ticks.add(tick);
  }
  compass.add(ticks);

  // dots between ticks (matches logo dots)
  for (let i = 0; i < 8; i++) {
    const dot = new THREE.Mesh(geom(new THREE.SphereGeometry(0.05, 16, 16)), goldMat);
    const a = (i / 8) * Math.PI * 2 + Math.PI / 16;
    dot.position.set(Math.cos(a) * 1.78, Math.sin(a) * 1.78, 0);
    compass.add(dot);
  }

  // four compass star points
  const starGroup = new THREE.Group();
  function makePoint(angleDeg, length, width, depth, material) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(width, -length * 0.35);
    shape.lineTo(0, -length);
    shape.lineTo(-width, -length * 0.35);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, {
      depth, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2,
    });
    g.translate(0, 0, -depth / 2);
    disposables.push(g);
    const mesh = new THREE.Mesh(g, material);
    mesh.rotation.z = (angleDeg * Math.PI) / 180;
    return mesh;
  }
  starGroup.add(makePoint(180, 1.15, 0.14, 0.08, steelMat));
  starGroup.add(makePoint(0, 1.15, 0.14, 0.08, steelMat));
  starGroup.add(makePoint(90, 1.15, 0.14, 0.08, steelMat));
  starGroup.add(makePoint(270, 1.15, 0.14, 0.08, steelMat));
  starGroup.add(makePoint(135, 0.6, 0.08, 0.06, darkMat));
  starGroup.add(makePoint(225, 0.6, 0.08, 0.06, darkMat));
  starGroup.add(makePoint(45,  0.6, 0.08, 0.06, darkMat));
  starGroup.add(makePoint(315, 0.6, 0.08, 0.06, darkMat));
  compass.add(starGroup);

  // central hub
  const hub = new THREE.Mesh(geom(new THREE.CylinderGeometry(0.14, 0.16, 0.16, 24)), goldMat);
  hub.rotation.x = Math.PI / 2;
  compass.add(hub);

  // arrow needle
  const needleGroup = new THREE.Group();
  const needleShaft = new THREE.Mesh(geom(new THREE.CylinderGeometry(0.04, 0.06, 1.45, 12)), goldMat);
  needleShaft.position.y = 0.6;
  needleGroup.add(needleShaft);
  const needleHead = new THREE.Mesh(geom(new THREE.ConeGeometry(0.16, 0.32, 16)), goldMat);
  needleHead.position.y = 1.45;
  needleGroup.add(needleHead);
  const needleTail = new THREE.Mesh(geom(new THREE.ConeGeometry(0.06, 0.18, 12)), goldMat);
  needleTail.position.y = -0.18;
  needleTail.rotation.x = Math.PI;
  needleGroup.add(needleTail);
  needleGroup.rotation.z = -Math.PI / 6;
  needleGroup.position.z = 0.12;
  compass.add(needleGroup);

  // — telemetry data particles —
  const particleCount = 220;
  const positions = new Float32Array(particleCount * 3);
  const speeds = new Float32Array(particleCount);
  const offsets = new Float32Array(particleCount);
  for (let i = 0; i < particleCount; i++) {
    const r = 2.2 + Math.random() * 2.4;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * 0.8;
    positions[i * 3] = Math.cos(theta) * r;
    positions[i * 3 + 1] = Math.sin(phi) * r * 0.5;
    positions[i * 3 + 2] = Math.sin(theta) * r;
    speeds[i] = 0.2 + Math.random() * 0.6;
    offsets[i] = Math.random() * Math.PI * 2;
  }
  const pGeom = new THREE.BufferGeometry();
  pGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  disposables.push(pGeom);
  const pMat = mat(new THREE.PointsMaterial({
    color: 0xd4a24a, size: 0.04, transparent: true, opacity: 0.85,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  const particles = new THREE.Points(pGeom, pMat);
  scene.add(particles);

  // — orbital rings —
  const orbits = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const orbitGeom = geom(new THREE.TorusGeometry(2.1 + i * 0.35, 0.005, 8, 128));
    const orbitMat = mat(new THREE.MeshBasicMaterial({
      color: 0xd4a24a, transparent: true, opacity: 0.18 - i * 0.04,
    }));
    const orbit = new THREE.Mesh(orbitGeom, orbitMat);
    orbit.rotation.x = (Math.random() - 0.5) * 1.2;
    orbit.rotation.y = (Math.random() - 0.5) * 1.2;
    orbits.add(orbit);
  }
  scene.add(orbits);

  // — packets —
  const packets = [];
  const packetGeom = geom(new THREE.SphereGeometry(0.05, 12, 12));
  const packetMat = mat(new THREE.MeshBasicMaterial({ color: 0xe8b85f }));
  for (let i = 0; i < 12; i++) {
    const p = new THREE.Mesh(packetGeom, packetMat);
    p.userData = {
      r: 2.1 + Math.random() * 1.0,
      a: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.6,
      tilt: (Math.random() - 0.5) * 0.6,
    };
    scene.add(p);
    packets.push(p);
  }

  // — resize —
  // baseZ recuada conforme o aspect do wrap pra garantir que o compasso
  // (raio efetivo ~1.83 com escala máx 1.10) caiba sem clip horizontal.
  let baseZ = 7;
  const vFovTan = Math.tan(((40 * Math.PI) / 180) / 2);
  const targetHalfExtent = 2.1;
  function resize() {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.aspect = aspect;
    const zForHeight = targetHalfExtent / vFovTan;
    const zForWidth = targetHalfExtent / (vFovTan * aspect);
    baseZ = Math.max(7, zForHeight, zForWidth);
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(wrap);

  // — mouse parallax —
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  const onMouseMove = (e) => {
    tmx = (e.clientX / window.innerWidth - 0.5) * 2;
    tmy = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('mousemove', onMouseMove);

  // — scroll —
  let scrollY = 0;
  const onScroll = () => { scrollY = window.scrollY; };
  window.addEventListener('scroll', onScroll, { passive: true });

  // — animation —
  const clock = new THREE.Clock();
  let rafId;
  function tick() {
    const t = clock.getElapsedTime();
    const dt = clock.getDelta();

    mx += (tmx - mx) * 0.06;
    my += (tmy - my) * 0.06;

    compass.rotation.y = mx * 0.5 + t * 0.18;
    compass.rotation.x = my * 0.3 + Math.sin(t * 0.4) * 0.06;
    compass.rotation.z = Math.sin(t * 0.25) * 0.04;

    needleGroup.rotation.y = Math.sin(t * 0.6) * 0.04;

    orbits.rotation.x = t * 0.05;
    orbits.rotation.y = t * 0.08;
    orbits.children.forEach((o, i) => {
      o.rotation.z = t * (0.1 + i * 0.05);
    });

    const arr = pGeom.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3;
      arr[ix + 1] += Math.sin(t * speeds[i] + offsets[i]) * 0.0015;
      const a = t * 0.05 * speeds[i];
      const x = arr[ix], z = arr[ix + 2];
      const cs = Math.cos(a), sn = Math.sin(a) * 0.001;
      arr[ix] = x * cs - z * sn;
      arr[ix + 2] = x * sn + z * cs;
    }
    pGeom.attributes.position.needsUpdate = true;

    packets.forEach((p) => {
      p.userData.a += dt * p.userData.speed;
      const r = p.userData.r;
      p.position.x = Math.cos(p.userData.a) * r;
      p.position.z = Math.sin(p.userData.a) * r;
      p.position.y = Math.sin(p.userData.a * 1.5 + p.userData.tilt) * 0.6;
    });

    const sFactor = Math.max(0, 1 - scrollY / 1200);
    compass.scale.setScalar(0.85 + sFactor * 0.25);
    camera.position.z = baseZ + (1 - sFactor) * 1.5;

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }
  tick();

  return () => {
    cancelAnimationFrame(rafId);
    ro.disconnect();
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('scroll', onScroll);
    disposables.forEach((d) => d.dispose?.());
    renderer.dispose();
  };
}
