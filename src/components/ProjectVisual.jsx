import { ArrowRight, Gamepad2, Layers, Lock, MapPin, MessageSquare, Monitor, Shield } from 'lucide-react';
import './project-visuals.css';

export default function ProjectVisual({ type }) {
  return <div className={`project-visual visual-${type}`} aria-hidden="true">
    {type === 'smart-pin' ? <div className="pin-art"><div className="pin-device"><i /><span>br.</span></div><span className="pin-stealth"><Lock size={10} /> IN STEALTH</span></div>
      : type === 'loadout' ? <div className="loadout-art"><div className="loadout-badge"><Shield size={44} strokeWidth={1} /><Gamepad2 size={21} /></div><strong>go<span>Loadout</span></strong><div className="loadout-path"><Monitor size={12} /> SCREEN <ArrowRight size={14} /> FIELD <MapPin size={12} /></div></div>
      : type === 'skirmesh' ? <div className="radar-art"><i /><i /><span>SKIRMESH</span></div>
      : type === 'fiji' ? <div className="fiji-art">FIJI<br /><span>FRY HOUSE</span><small>GOOD FOOD. GOOD COMPANY.</small></div>
      : type === 'context' ? <div className="bot-art"><Layers size={38} /><span>Context → Query → Evidence</span></div>
      : <div className="bot-art"><MessageSquare size={38} /><span>TherapyAI · Here to listen</span></div>}
  </div>;
}
