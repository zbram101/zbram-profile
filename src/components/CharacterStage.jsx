import { Component, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { ArrowUpRight, HelpCircle, Code2, Hand, Lightbulb, MoveHorizontal, Pause, Play, RotateCcw, Scan, Smile, PartyPopper } from 'lucide-react';
import { MathUtils, Vector3 } from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { Avatar } from './Avatar';
import { stageCameraDistance, workstation } from './characterStageLayout';
import './character-stage.css';

extend({ RoundedBoxGeometry });

const actions = {
  hello: { animation: 'Wave', icon: Hand, button: 'Say hi', label: 'GOOD TO MEET YOU', title: 'A builder. A curious human.', caption: 'Thoughtful code starts with a little curiosity.', note: 'Hey, welcome in.' },
  explain: { animation: 'Pointing', icon: Lightbulb, button: 'Explain', label: 'CONNECTING THE DOTS', title: 'Big ideas, made simple.', caption: 'The best part? Figuring it out together.', note: 'What if we tried…' },
  build: { animation: 'Typing', icon: Code2, button: 'Build', label: 'IN THE FLOW', title: 'An idea becomes something real.', caption: 'A little focus. A lot of making things work.', note: 'One good idea at a time.' },
  think: { animation: 'Thinking', icon: HelpCircle, button: 'Think', label: 'A MOMENT OF CURIOSITY', title: 'There’s always another angle.', caption: 'Step back. Ask why. Find a better way.', note: 'Let me think about that.' },
  celebrate: { animation: 'Celebrate', icon: PartyPopper, button: 'Celebrate', label: 'ENJOY THE SMALL WINS', title: 'That feeling when it works.', caption: 'Good work deserves a little celebration.', note: 'Yes. We got it.' },
  relax: { animation: 'Standing', icon: Smile, button: 'Relax', label: 'ROOM TO BREATHE', title: 'A little pause goes a long way.', caption: 'Fresh perspective starts with a clear head.', note: 'Taking a moment.' },
};
const sectionActions = { about: 'hello', skills: 'explain', experience: 'explain', projects: 'build', contact: 'hello' };

function PortraitFallback({ loading = false }) {
  return <div className="character-fallback stage-portrait-fallback">
    <img src="/images/myavatar.png" alt="Bharadwaj’s illustrated portrait" />
    <span>{loading ? 'Getting the studio ready…' : 'A little glimpse of the human behind the code.'}</span>
  </div>;
}

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? <PortraitFallback /> : this.props.children; }
}

function SceneReady({ onReady }) {
  useEffect(() => { onReady(); }, [onReady]);
  return null;
}

function Block({ size, color, metalness = 0, roughness = .7, ...props }) {
  return <mesh castShadow receiveShadow {...props}>
    <roundedBoxGeometry args={[...size, 2, .015]} />
    <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
  </mesh>;
}

function Workstation({ visible, paused }) {
  const desk = useRef();
  useFrame((_, delta) => {
    const scale = paused ? Number(visible) : MathUtils.damp(desk.current.scale.x, visible ? 1 : 0, 10, delta);
    desk.current.scale.setScalar(scale);
    desk.current.visible = scale > .005;
  });
  return <group ref={desk} scale={0}>
    <group position={workstation.desk}>
      <Block size={workstation.desktop} color="#9a8162" />
      {[-.51, .51].flatMap(x => [-.28, .28].map(z => <Block key={`${x}-${z}`} position={[x, -.335, z]} size={[.045, .64, .045]} color="#343a34" metalness={.5} />))}
      <group position={workstation.laptop}>
        <Block size={[.7, .025, .42]} color="#b3b8b2" metalness={.65} roughness={.35} />
        <Block position={[0, .014, -.025]} size={[.62, .004, .235]} color="#272d2b" />
        {[0, 1, 2, 3, 4].map(row => <group key={row} position={[0, workstation.keyboard.offset[1], -.105 + row * .04]}>
          {Array.from({ length: 10 }, (_, col) => <mesh key={col} position={[-.27 + col * .06, 0, 0]}>
            <boxGeometry args={[.05, .006, .03]} /><meshStandardMaterial color="#78817c" />
          </mesh>)}
        </group>)}
        <group position={[0, .012, .2]} rotation={[.18, 0, 0]}>
          <Block size={[.7, .36, .025]} position={[0, .17, 0]} color="#929c94" metalness={.65} roughness={.35} />
          <mesh position={[0, .17, -.014]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[.65, .315]} /><meshBasicMaterial color="#202f2d" />
          </mesh>
          {[.07, .105, .14, .175, .21].map((y, i) => <mesh key={y} position={[.04 - (i % 2) * .025, y, -.015]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[.16 + (i % 3) * .045, .008]} /><meshBasicMaterial color={i % 2 ? '#8aabbd' : '#b5d88d'} />
          </mesh>)}
          <mesh position={[0, .15, .014]}><circleGeometry args={[.025, 24]} /><meshStandardMaterial color="#d5ded3" metalness={.5} /></mesh>
        </group>
      </group>
      <group position={[.49, .095, .12]}>
        <mesh castShadow><cylinderGeometry args={[.045, .035, .12, 24]} /><meshStandardMaterial color="#d5d2bd" /></mesh>
        <mesh position={[0, .061, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[.036, 24]} /><meshStandardMaterial color="#3c2b22" /></mesh>
        <mesh position={[.049, .008, 0]}><torusGeometry args={[.026, .009, 8, 20]} /><meshStandardMaterial color="#d5d2bd" /></mesh>
      </group>
    </group>
    <Block position={workstation.seat} size={[.48, .08, .45]} color="#4a554b" />
    <Block position={workstation.backrest} size={[.48, .54, .075]} color="#4a554b" />
    <mesh position={[0, .22, .04]} castShadow><cylinderGeometry args={[.033, .045, .38, 16]} /><meshStandardMaterial color="#737b72" metalness={.7} roughness={.35} /></mesh>
    {[0, 1, 2, 3, 4].map(i => <group key={i} position={[0, .04, .04]} rotation={[0, i * Math.PI * .4, 0]}>
      <Block position={[0, 0, .13]} size={[.035, .035, .29]} color="#343a34" />
    </group>)}
  </group>;
}

function Scene({ animation, replay, paused, closeup, rotation, pointer, onReady }) {
  const group = useRef();
  const subject = useRef();
  const cameraTarget = useRef(new Vector3(0, .84, 0));
  useFrame((state, delta) => {
    const baseRotation = animation === 'Typing' ? -.48 : -.12;
    const target = rotation.current + baseRotation + (paused ? 0 : pointer.current.x * .055);
    group.current.rotation.y = paused ? target : MathUtils.damp(group.current.rotation.y, target, 5, delta);
    const seated = animation === 'Typing';
    subject.current.position.z = paused ? (seated ? workstation.pivotZ : 0) : MathUtils.damp(subject.current.position.z, seated ? workstation.pivotZ : 0, 6, delta);
    const framing = seated ? .72 : closeup ? 1.42 : .84;
    const aspect = state.size.width / state.size.height;
    const distance = stageCameraDistance(animation, closeup, aspect);
    state.camera.position.z = paused ? distance : MathUtils.damp(state.camera.position.z, distance, 5, delta);
    state.camera.position.y = paused ? framing + .12 : MathUtils.damp(state.camera.position.y, framing + .12, 5, delta);
    cameraTarget.current.y = paused ? framing : MathUtils.damp(cameraTarget.current.y, framing, 5, delta);
    state.camera.lookAt(cameraTarget.current);
  });
  return <>
    <ambientLight intensity={.55} />
    <hemisphereLight args={['#f1eee4', '#333b32', .65]} />
    <directionalLight position={[2.5, 4, 4]} intensity={1.45} color="#fff0d9" />
    <directionalLight position={[-3, 2.4, 1]} intensity={.65} color="#d4e3f0" />
    <directionalLight position={[1, 3, -3]} intensity={1.7} color="#d1e5b0" />
    <group ref={group}>
      <group ref={subject}>
        <Avatar animation={animation} replay={replay} paused={paused} pointer={pointer} />
        <Workstation visible={animation === 'Typing'} paused={paused} />
      </group>
    </group>
    <mesh position={[0, -.055, 0]} receiveShadow>
      <cylinderGeometry args={[.73, .75, .05, 80]} /><meshStandardMaterial color="#192117" roughness={.9} />
    </mesh>
    <mesh position={[0, -.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[.71, .716, 80]} /><meshBasicMaterial color="#798c63" transparent opacity={.65} />
    </mesh>
    <ContactShadows position={[0, -.012, 0]} opacity={.6} scale={3.8} blur={2.5} far={2.5} resolution={256} color="#070c05" />
    <SceneReady onReady={onReady} />
  </>;
}

export default function CharacterStage({ section = 'about', busy = false }) {
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [paused, setPaused] = useState(reducedMotion);
  const [override, setOverride] = useState(null);
  const [replay, setReplay] = useState(0);
  const [closeup, setCloseup] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);
  const handleUnavailable = useCallback(() => setUnavailable(true), []);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const stage = useRef();
  const rotation = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const drag = useRef(null);
  const invalidate = useRef(() => {});

  useEffect(() => { setOverride(null); }, [section]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => { setReducedMotion(media.matches); setPaused(media.matches); };
    const updateVisibility = () => setPageVisible(!document.hidden);
    media.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '80px' });
    observer.observe(stage.current);
    return () => { media.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', updateVisibility); observer.disconnect(); };
  }, []);

  const selected = busy ? 'think' : override || sectionActions[section] || 'hello';
  const mood = actions[selected];
  const MoodIcon = mood.icon;
  const frozen = paused || !visible || !pageVisible;
  const chooseAction = id => { setOverride(id); setReplay(value => value + 1); };
  const reset = () => {
    setOverride(null); setReplay(value => value + 1); setCloseup(true);
    rotation.current = 0; pointer.current = { x: 0, y: 0 }; invalidate.current();
  };
  const endDrag = event => {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null; setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return <div ref={stage} className={`character-studio${paused ? ' is-paused' : ''}`}>
    <div className="studio-backdrop" aria-hidden="true"><span>br.</span><div className="studio-halo" /></div>
    <div className="studio-toolbar" role="group" aria-label="Portrait controls">
      <button className="studio-icon-button" disabled={unavailable || !ready} onClick={() => setCloseup(value => !value)} aria-pressed={closeup} aria-label="Close-up view" title={closeup ? 'Full-body view' : 'Close-up view'}><Scan size={16} /></button>
      <button className="studio-icon-button" disabled={unavailable || !ready} onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play character animation' : 'Pause character animation'} title={paused ? 'Play motion' : 'Pause motion'}>{paused ? <Play size={15} /> : <Pause size={15} />}</button>
      <button className="studio-icon-button" disabled={unavailable || !ready} onClick={reset} aria-label="Reset character and view" title="Reset character and view"><RotateCcw size={15} /></button>
    </div>
    <div className={`studio-viewport${dragging ? ' is-dragging' : ''}`} role="group" aria-label="Interactive 3D portrait" aria-describedby="studio-drag-hint" tabIndex={unavailable ? -1 : 0}
      onPointerDown={event => {
        if (event.button !== 0 || unavailable) return;
        drag.current = { id: event.pointerId, x: event.clientX, rotation: rotation.current };
        event.currentTarget.setPointerCapture(event.pointerId); setDragging(true);
      }}
      onPointerMove={event => {
        const bounds = event.currentTarget.getBoundingClientRect();
        pointer.current = { x: (event.clientX - bounds.left) / bounds.width * 2 - 1, y: (event.clientY - bounds.top) / bounds.height * 2 - 1 };
        if (drag.current?.id === event.pointerId) rotation.current = drag.current.rotation + (event.clientX - drag.current.x) * .009;
        invalidate.current();
      }}
      onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={() => { drag.current = null; setDragging(false); }}
      onPointerLeave={() => { pointer.current = { x: 0, y: 0 }; }}
      onKeyDown={event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)) return;
        event.preventDefault();
        rotation.current = event.key === 'Home' ? 0 : rotation.current + (event.key === 'ArrowLeft' ? -.3 : .3);
        invalidate.current();
      }}>
      {unavailable ? <PortraitFallback /> : <SceneBoundary onUnavailable={handleUnavailable}>
        <Canvas aria-hidden="true" dpr={[1, 1.5]} frameloop={frozen ? 'demand' : 'always'} camera={{ position: [0, 1.54, 2.15], fov: 34 }} gl={{ alpha: true, antialias: true }}
          onCreated={({ invalidate: draw, gl }) => { invalidate.current = draw; gl.domElement.addEventListener('webglcontextlost', handleUnavailable, { once: true }); }}
          fallback={<PortraitFallback />}>
          <Suspense fallback={null}>
            <Scene animation={mood.animation} replay={replay} paused={frozen} closeup={closeup} rotation={rotation} pointer={pointer} onReady={handleReady} />
          </Suspense>
        </Canvas>
        {!ready && !unavailable && <div className="studio-loading"><PortraitFallback loading /></div>}
      </SceneBoundary>}
    </div>
    <div className="studio-note" key={selected} aria-hidden="true"><MoodIcon size={14} /><span>{busy ? 'Connecting the dots…' : mood.note}</span></div>
    <div id="studio-drag-hint" className="studio-hint"><MoveHorizontal size={13} /><span>{unavailable ? 'Portrait preview' : 'Drag to rotate'}<span className="studio-keyboard-hint"> · ← → keys</span></span><span className="studio-motion-state">{paused ? (reducedMotion ? 'Reduced motion' : 'Motion paused') : 'A little more human'}</span></div>
    <div className="studio-caption">
      <div className="studio-story" role="status" aria-live="polite" aria-atomic="true">
        <span className="studio-label"><span className={`studio-equalizer${busy ? ' is-busy' : ''}`} aria-hidden="true"><i /><i /><i /></span>{busy ? 'THINKING THROUGH YOUR QUESTION' : mood.label}</span>
        <h3>{busy ? 'Let’s connect those dots.' : mood.title}</h3>
        <p>{busy ? 'My assistant is working on your answer.' : mood.caption}</p>
      </div>
      <div className="studio-actions" role="group" aria-label="Character actions">
        {Object.entries(actions).map(([id, { icon: Icon, button }]) => <button key={id} aria-pressed={selected === id} disabled={busy || unavailable || !ready} onClick={() => chooseAction(id)}><Icon size={16} strokeWidth={1.6} /><span>{button}</span></button>)}
      </div>
      <a className="studio-chat-link" href="#contact"><span>Curious about my work?</span> Ask my AI <ArrowUpRight size={14} /></a>
    </div>
  </div>;
}
