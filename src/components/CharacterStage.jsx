import { Component, Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Avatar } from './Avatar';

const moods = {
  about: { animation: 'Wave', title: 'Hey, I’m Bharadwaj.', caption: 'Engineer by trade. Builder by nature.', label: 'SAYING HELLO' },
  skills: { animation: 'Pointing', title: 'The right tools. A curious mind.', caption: 'Let’s connect the dots.', label: 'EXPLORING THE TOOLKIT' },
  experience: { animation: 'Pointing', title: 'Better together.', caption: 'Building systems. Supporting people.', label: 'SHARING THE JOURNEY' },
  projects: { animation: 'Typing', title: 'Always building something.', caption: 'From a first idea to a working product.', label: 'IN THE BUILD ZONE' },
  contact: { animation: 'Wave', title: 'Let’s start a conversation.', caption: 'My assistant can show you around.', label: 'READY TO CONNECT' },
};
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="character-fallback"><img src="/images/myavatar.png" alt="Bharadwaj’s character"/></div> : this.props.children; }
}
function Scene({animation, paused}) {
  const group = useRef();
  useFrame((state, delta) => {
    if (!group.current || paused) return;
    const target = animation === 'Typing' ? -.35 : -.12 + state.pointer.x * .08;
    group.current.rotation.y += (target - group.current.rotation.y) * Math.min(delta * 4, 1);
  });
  return <>
    <ambientLight intensity={.8}/><hemisphereLight args={['#efffdc', '#53653f', 1]}/><directionalLight position={[3,5,4]} intensity={1.6}/><directionalLight position={[-3,2,-1]} intensity={1} color="#c2f36b"/>
    <group ref={group} position={[0,-.96,0]}>
      <Avatar animation={paused ? 'Standing' : animation} paused={paused}/>
      {animation === 'Typing' && <group position={[0,.73,.43]}>
        <mesh position={[0,0,0]}><boxGeometry args={[.85,.05,.52]}/><meshStandardMaterial color="#536341"/></mesh>
        <mesh position={[0,.18,.22]} rotation={[-.2,0,0]}><boxGeometry args={[.5,.32,.028]}/><meshStandardMaterial color="#303d27"/></mesh>
        <mesh position={[0,.18,.239]} rotation={[-.2,0,0]}><planeGeometry args={[.44,.26]}/><meshBasicMaterial color="#c2f36b"/></mesh>
        <mesh position={[0,.045,0]}><boxGeometry args={[.5,.025,.28]}/><meshStandardMaterial color="#a5b58c"/></mesh>
        {[-.32,.32].map(x => <mesh key={x} position={[x,-.37,0]}><boxGeometry args={[.035,.74,.035]}/><meshStandardMaterial color="#4f5a43"/></mesh>)}
      </group>}
      <mesh position={[0,-.025,0]}><cylinderGeometry args={[.75,.79,.05,64]}/><meshStandardMaterial color="#34422a"/></mesh>
      <mesh position={[0,.005,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.68,.685,64]}/><meshBasicMaterial color="#b6d891"/></mesh>
    </group>
  </>;
}
export default function CharacterStage({section='about', busy=false}) {
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [override, setOverride] = useState(null);
  const [replay, setReplay] = useState(0);
  useEffect(() => { setOverride(null); }, [section]);
  const mood = moods[override || section] || moods.about;
  const animation = busy ? 'Typing' : mood.animation;
  return <>
    <div className="stage-grid" aria-hidden="true"/>
    <div className="stage-canvas" aria-hidden="true"><SceneBoundary><Suspense fallback={<div className="character-fallback"><img src="/images/myavatar.png" alt=""/></div>}><Canvas dpr={[1,1.5]} camera={{position:[0,.25,3.65],fov:37}} gl={{alpha:true,antialias:true}} fallback={<div className="character-fallback"><img src="/images/myavatar.png" alt=""/></div>}><Suspense fallback={null}><Scene key={replay} animation={animation} paused={paused}/></Suspense></Canvas></Suspense></SceneBoundary></div>
    <div className="stage-floating-tag"><CodeLabel animation={animation}/></div>
    <div className="stage-caption"><span className="stage-label"><i className="status-dot"/>{busy ? 'THINKING THROUGH YOUR QUESTION' : mood.label}</span><h3>{busy ? 'On it. Give me a moment.' : mood.title}</h3><p>{mood.caption}</p>
      <div className="stage-controls"><div className="pose-buttons" aria-label="Character actions">{[['about','Wave'],['skills','Explain'],['projects','Build']].map(([id,label]) => <button key={id} aria-pressed={(override || section) === id} onClick={() => {setOverride(id);setReplay(r=>r+1);}}>{label}</button>)}</div><button className="icon-button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play character animation' : 'Pause character animation'}>{paused ? <Play size={14}/> : <Pause size={14}/>}</button><button className="icon-button" onClick={() => {setOverride(null);setReplay(r=>r+1);}} aria-label="Reset character to current section"><RotateCcw size={14}/></button></div>
    </div>
  </>;
}
function CodeLabel({animation}) { return <span>{animation === 'Typing' ? '< building />' : animation === 'Pointing' ? '{ let’s explore }' : 'hello, world ✳'}</span>; }
