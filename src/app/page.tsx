"use client";
import { useState, useEffect, useRef } from "react";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { BentoGridShowcase } from "@/components/ui/bento-product-features";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import {
  Zap, BarChart2, Users, RefreshCw, Bell, TrendingUp, ShoppingCart
} from "lucide-react";

/* ─── ORBITAL DATA ──────────────────────────────────────── */
const ORBITAL_DATA = [
  { id:1, title:"Servicio 01", date:"", content:"Descripción del primer servicio o capacidad clave de Red42.", category:"Core", icon:Zap, relatedIds:[2,6], status:"completed" as const, energy:100 },
  { id:2, title:"Servicio 02", date:"", content:"Descripción del segundo servicio o capacidad clave de Red42.", category:"IA", icon:RefreshCw, relatedIds:[1,3], status:"completed" as const, energy:95 },
  { id:3, title:"Servicio 03", date:"", content:"Descripción del tercer servicio o capacidad clave de Red42.", category:"Datos", icon:TrendingUp, relatedIds:[2,4], status:"completed" as const, energy:85 },
  { id:4, title:"Servicio 04", date:"", content:"Descripción del cuarto servicio o capacidad clave de Red42.", category:"Automatización", icon:Users, relatedIds:[3,5], status:"in-progress" as const, energy:75 },
  { id:5, title:"Servicio 05", date:"", content:"Descripción del quinto servicio o capacidad clave de Red42.", category:"Analítica", icon:Bell, relatedIds:[4,6], status:"in-progress" as const, energy:70 },
  { id:6, title:"Servicio 06", date:"", content:"Descripción del sexto servicio o capacidad clave de Red42.", category:"Integración", icon:BarChart2, relatedIds:[1,5], status:"pending" as const, energy:60 },
  { id:7, title:"Servicio 07", date:"", content:"Descripción del séptimo servicio o capacidad clave de Red42.", category:"Estrategia", icon:ShoppingCart, relatedIds:[1,2], status:"pending" as const, energy:55 },
];

/* ─── TOKENS ─────────────────────────────────────────────── */
const C = {
  bg:       "#FAFAFA",
  bgCard:   "#ffffff",
  bgCream:  "#FFF5F5",
  purple:   "#D00000",   // rojo primario
  purpleM:  "#FF2222",   // rojo brillante
  purpleL:  "#FFEEEE",   // rojo muy claro (fills)
  purpleT:  "#FF9999",   // rojo suave (líneas)
  green:    "#00E5A0",
  text:     "#0A0A0A",
  textMid:  "#3A3A3A",
  textMut:  "#888888",
  border:   "#F0E8E8",
  borderM:  "rgba(208,0,0,0.18)",
  wa:       "#FFF5F5",
  waBotBg:  "#D00000",
  waCliBg:  "#ffffff",
  waCliTx:  "#0A0A0A",
  waBotTx:  "#ffffff",
};

/* ─── LOGO ─────────────────────────────────────────────── */
const Logo = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="9" fill={C.purple} />
    {/* R monoline */}
    <path
      d="M10 8h7a4 4 0 0 1 0 8h-7M17 16l5 8"
      stroke="#ffffff"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="23" cy="9" r="3" fill={C.green} />
  </svg>
);

const Logotype = ({ onDark = false, size = 26 }: { onDark?: boolean; size?: number }) => (
  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
    <Logo size={size} />
    <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:size*0.65, letterSpacing:"-0.02em", lineHeight:1 }}>
      <span style={{ color: onDark ? "#ffffff" : C.text }}>red</span>
      <span style={{ color: onDark ? "#FF9999" : C.purple }}>42</span>
    </span>
  </div>
);

/* ─── TIPOS ─────────────────────────────────────────────── */
type MsgType = "text" | "audio" | "image" | "bot" | "typing";
type Msg = { id:number; side:"left"|"right"; type:MsgType; text?:string; time?:string };
const TABS = ["Caso 01", "Caso 02", "Caso 03"] as const;
type Tab = typeof TABS[number];

/* ─── CONVERSACIONES ─────────────────────────────────────── */
const CONVOS: Record<Tab, Msg[]> = {
  "Caso 01": [
    { id:1, side:"left",  type:"text", text:"Hola, necesito automatizar este proceso.", time:"9:14" },
    { id:2, side:"right", type:"typing" },
    { id:3, side:"right", type:"bot",  text:"Perfecto. Analicé tu flujo y puedo resolverlo en 48 horas. ¿Empezamos?", time:"9:14" },
    { id:4, side:"left",  type:"text", text:"Sí, adelante.", time:"9:15" },
    { id:5, side:"right", type:"bot",  text:"✅ Proceso automatizado. Ahorrás 12 horas semanales desde hoy.", time:"9:15" },
  ],
  "Caso 02": [
    { id:1, side:"left",  type:"text", text:"Necesito analizar estos datos.", time:"8:42" },
    { id:2, side:"right", type:"typing" },
    { id:3, side:"right", type:"bot",  text:"Procesé 50.000 registros. Encontré 3 patrones clave para tu negocio.", time:"8:43" },
    { id:4, side:"left",  type:"text", text:"Increíble, ¿cuánto tardó?", time:"8:43" },
    { id:5, side:"right", type:"bot",  text:"✅ 2 minutos. Un analista humano tardaría 3 días.", time:"8:44" },
  ],
  "Caso 03": [
    { id:1, side:"left",  type:"text", text:"¿Puedes integrar nuestra plataforma con el CRM?", time:"10:00" },
    { id:2, side:"right", type:"typing" },
    { id:3, side:"right", type:"bot",  text:"Sí. Conecto tu stack actual con el CRM sin tocar el código existente.", time:"10:00" },
    { id:4, side:"left",  type:"text", text:"Qué bien. ¿Cuándo podemos empezar?", time:"10:01" },
    { id:5, side:"right", type:"bot",  text:"✅ Esta semana. Sin downtime, sin riesgos.", time:"10:01" },
  ],
};

type Item = { icon:string; name:string; detail:string; value:string };
const ORDERS: Record<Tab, Item[]> = {
  "Caso 01": [
    { icon:"⚡", name:"Automatización de proceso", detail:"Flujo completo · 12 pasos", value:"12 h/semana ahorradas" },
    { icon:"🤖", name:"Agente IA desplegado",       detail:"24/7 activo",              value:"100% uptime" },
    { icon:"📊", name:"Dashboard de métricas",      detail:"Tiempo real",              value:"ROI visible" },
  ],
  "Caso 02": [
    { icon:"🧠", name:"Análisis de datos",    detail:"50.000 registros · 2 min",  value:"3 patrones clave" },
    { icon:"📈", name:"Predicción de demanda", detail:"Modelo ML propio",          value:"+23% precisión" },
    { icon:"🔍", name:"Detección de anomalías",detail:"Tiempo real",              value:"-90% falsos positivos" },
  ],
  "Caso 03": [
    { icon:"🔗", name:"Integración CRM",      detail:"Sin downtime",   value:"En 48 horas" },
    { icon:"🔄", name:"Sincronización datos", detail:"Bidireccional",  value:"Tiempo real" },
    { icon:"🛡️", name:"Seguridad",            detail:"Cifrado end-to-end", value:"ISO 27001" },
  ],
};

const TOTALS:  Record<Tab,string> = { "Caso 01":"ROI en 30 días", "Caso 02":"3 días → 2 minutos", "Caso 03":"Integrado en 48 h" };
const OTITLES: Record<Tab,string> = { "Caso 01":"Automatización · Proceso completo", "Caso 02":"Análisis · IA aplicada", "Caso 03":"Integración · Sin fricciones" };
const OSUBS:   Record<Tab,string> = { "Caso 01":"3 entregables · Semana 1", "Caso 02":"50k registros · 2 minutos", "Caso 03":"48 horas · 0 downtime" };
const BADGES:  Record<Tab,string> = { "Caso 01":"Automatización", "Caso 02":"Análisis IA", "Caso 03":"Integración" };
const AV_COL:  Record<Tab,string> = { "Caso 01":C.purple, "Caso 02":C.purple, "Caso 03":C.purple };
const CH_NAME: Record<Tab,string> = { "Caso 01":"Red42", "Caso 02":"Red42", "Caso 03":"Red42" };

function T({ text, bot }: { text:string; bot?:boolean }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*|_[^_]+_|\n)/g).map((p,i)=>{
        if (p.startsWith("**") && p.endsWith("**")) return <strong key={i} style={{color: bot ? "#FF9999" : C.purple}}>{p.slice(2,-2)}</strong>;
        if (p.startsWith("_")  && p.endsWith("_"))  return <em key={i} style={{opacity:.75,fontStyle:"italic"}}>{p.slice(1,-1)}</em>;
        if (p==="\n") return <br key={i}/>;
        return p;
      })}
    </>
  );
}

function TypingDots({ right }: { right?:boolean }) {
  return (
    <div style={{display:"flex", justifyContent: right ? "flex-end" : "flex-start"}}>
      <div style={{background: right ? C.waBotBg : C.waCliBg, borderRadius: right ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding:"10px 14px", display:"flex", gap:4, boxShadow:"0 1px 4px rgba(0,0,0,.08)"}}>
        {[0,150,300].map(d=>(
          <span key={d} style={{width:6,height:6,borderRadius:"50%",background: right ? C.purpleT : C.purple,display:"inline-block",animation:"typing 1.2s infinite",animationDelay:`${d}ms`}}/>
        ))}
      </div>
    </div>
  );
}

function ChatDemo({ tab }: { tab:Tab }) {
  const [count, setCount] = useState(0);
  const msgs = CONVOS[tab];
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    setCount(0);
    const ts: ReturnType<typeof setTimeout>[] = [];
    msgs.forEach((_,i)=>{ ts.push(setTimeout(()=>setCount(i+1), 300 + i*620)); });
    return ()=>ts.forEach(clearTimeout);
  },[tab]);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth",block:"nearest"}); },[count]);

  return (
    <div style={{background:"#0A0A0A",borderRadius:36,padding:10,boxShadow:"0 32px 64px rgba(10,10,46,.3)",maxWidth:320,margin:"0 auto"}}>
      <div style={{background:C.waCliBg,borderRadius:28,overflow:"hidden"}}>
        <div style={{background:"#0A0A0A",height:28,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:60,height:6,background:"rgba(255,255,255,.15)",borderRadius:3}}/>
        </div>
        <div style={{background:C.purple,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
          <Logo size={34}/>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:600,color:"#fff"}}>{CH_NAME[tab]}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.65)"}}>en línea</div>
          </div>
          <div style={{background:"rgba(255,255,255,.2)",color:"#fff",fontSize:8,fontWeight:700,letterSpacing:".08em",padding:"2px 8px",borderRadius:999,textTransform:"uppercase"}}>en vivo</div>
        </div>
        <div style={{background:C.wa,padding:12,minHeight:280,maxHeight:340,overflowY:"auto",display:"flex",flexDirection:"column",gap:8}}>
          <div style={{textAlign:"center",fontSize:9,color:C.textMut,background:"rgba(26,26,255,.08)",borderRadius:8,padding:"2px 10px",alignSelf:"center",marginBottom:4}}>Hoy</div>
          {msgs.slice(0,count).map((msg,idx,arr)=>{
            if (msg.type==="typing"){
              const next=arr[idx+1];
              if(next && next.side===msg.side) return null;
            }
            return (
              <div key={msg.id} className="msg-animate">
                {msg.type==="typing" && <TypingDots right={msg.side==="right"}/>}
                {(msg.type==="text"||msg.type==="bot") && (
                  <div style={{display:"flex",justifyContent: msg.side==="right" ? "flex-end" : "flex-start"}}>
                    <div style={{padding:"8px 11px 18px",borderRadius: msg.side==="right" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",fontSize:12,lineHeight:1.55,position:"relative",maxWidth:"80%",background: msg.side==="right" ? C.waBotBg : C.waCliBg,color: msg.side==="right" ? C.waBotTx : C.waCliTx,boxShadow:"0 1px 4px rgba(0,0,0,.08)"}}>
                      <T text={msg.text!} bot={msg.side==="right"}/>
                      {msg.time && <span style={{fontSize:9,position:"absolute",bottom:4,right:9,color: msg.side==="right" ? "rgba(255,255,255,.5)" : C.textMut}}>{msg.time}</span>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={endRef}/>
        </div>
        <div style={{background:"#fff",padding:"8px 12px",display:"flex",alignItems:"center",gap:8,borderTop:`1px solid ${C.border}`}}>
          <div style={{flex:1,background:C.bgCream,borderRadius:20,padding:"7px 14px",fontSize:11,color:C.textMut}}>Escribe un mensaje...</div>
          <div style={{width:30,height:30,borderRadius:"50%",background:C.purple,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:12,color:"#fff"}}>↑</span>
          </div>
        </div>
        <div style={{background:"#fff",height:20,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:48,height:4,background:"rgba(0,0,0,.15)",borderRadius:2}}/>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ tab }: { tab:Tab }) {
  return (
    <div style={{background:C.bgCard,borderRadius:20,border:`1px solid ${C.border}`,overflow:"hidden",boxShadow:"0 4px 24px rgba(26,26,255,.07)"}}>
      <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:13,fontWeight:600,color:C.text}}>{OTITLES[tab]}</div>
          <div style={{fontSize:11,color:C.textMut,marginTop:2}}>{OSUBS[tab]}</div>
        </div>
        <div style={{background:C.purpleL,color:C.purple,fontSize:9,fontWeight:700,letterSpacing:".08em",padding:"3px 10px",borderRadius:999,textTransform:"uppercase",whiteSpace:"nowrap"}}>{BADGES[tab]}</div>
      </div>
      <div style={{padding:"10px 18px"}}>
        {ORDERS[tab].map((item,i)=>(
          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{width:30,height:30,borderRadius:8,background:C.purpleL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{item.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:500,color:C.text}}>{item.name}</div>
              <div style={{fontSize:10,color:C.textMut,marginTop:1}}>{item.detail}</div>
            </div>
            <div style={{fontSize:12,fontWeight:600,color:C.purple,whiteSpace:"nowrap"}}>{item.value}</div>
          </div>
        ))}
      </div>
      <div style={{padding:"12px 18px",borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.bgCream}}>
        <div style={{fontSize:14,fontWeight:700,color:C.text}}>{TOTALS[tab]}</div>
        <div style={{background:C.purple,color:"#fff",fontSize:11,fontWeight:600,borderRadius:10,padding:"6px 14px"}}>✓ Entregado</div>
      </div>
    </div>
  );
}

/* ─── DATA ───────────────────────────────────────────────── */
const CLIENTS = ["Cliente A","Cliente B","Cliente C","Cliente D","Cliente E","Cliente F","Cliente G","Cliente H","Cliente I","Cliente J"];
const STEPS = [
  {day:"DÍA 1-2",  title:"Diagnóstico",       desc:"Analizamos tu negocio, procesos actuales y oportunidades de automatización."},
  {day:"DÍA 3-7",  title:"Diseño de solución", desc:"Diseñamos la arquitectura IA adaptada exactamente a tu caso de uso."},
  {day:"DÍA 8-12", title:"Implementación",     desc:"Desplegamos y probamos en entorno real con tu equipo."},
  {day:"DÍA 14",   title:"En producción",      desc:"Red42 opera en piloto automático. Empezás a ver resultados."},
];
const TECH_STACK = ["OpenAI","Anthropic","Langchain","n8n","Make","Supabase","Vercel","Python"];

/* ─── PAGE ───────────────────────────────────────────────── */
export default function Home() {
  const [tab, setTab] = useState<Tab>("Caso 01");

  return (
    <main style={{background:C.bg,minHeight:"100vh"}}>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:50,background:"rgba(248,249,255,.94)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.border}`,padding:"0 6%",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
        <Logotype size={30}/>
        <div className="nav-links" style={{display:"flex",gap:28}}>
          {["Servicios","Casos de uso","Stack"].map(l=>(
            <a key={l} href="#" style={{fontSize:13,color:C.textMut,fontWeight:500,textDecoration:"none"}}>{l}</a>
          ))}
        </div>
        <LiquidButton size="sm" style={{background:C.purple,color:"#fff",fontSize:13,fontWeight:700} as React.CSSProperties}>
          Hablar con Red42
        </LiquidButton>
      </nav>

      {/* HERO */}
      <section style={{padding:"80px 6% 60px",position:"relative",overflow:"hidden"}}>
        <AnimatedGradientBackground
          Breathing
          animationSpeed={0.012}
          breathingRange={5}
          startingGap={80}
          topOffset={0}
          gradientColors={["#0A0A0A","#1A0000","#D00000","#FF2222","#FF9999","#FFE8E8","#FAFAFA"]}
          gradientStops={[20,38,55,67,78,90,100]}
          containerStyle={{opacity:0.9}}
        />
        <div className="hero-grid" style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"center",position:"relative",zIndex:1}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:999,padding:"4px 14px",fontSize:11,color:"#fff",fontWeight:600,marginBottom:24,backdropFilter:"blur(8px)"}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:C.green,display:"inline-block"}}/>
              Agencia de IA para el mercado español
            </div>
            <h1 className="hero-h1" style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:50,lineHeight:1.1,color:"#ffffff",marginBottom:20}}>
              Automatiza. Integra. Escala.{" "}
              <span style={{color:"#FF9999"}}>Con inteligencia artificial.</span>
            </h1>
            <p style={{fontSize:17,color:"rgba(255,255,255,0.82)",lineHeight:1.7,marginBottom:36,maxWidth:520,fontFamily:"'Hanken Grotesk',sans-serif"}}>
              Red42 diseña e implementa soluciones de IA para empresas que quieren dejar de perder tiempo en tareas repetitivas y empezar a operar a otra escala.
            </p>
            <div style={{background:C.bgCard,borderRadius:16,padding:20,boxShadow:"0 4px 24px rgba(26,26,255,.1)",border:`1px solid ${C.border}`,maxWidth:460}}>
              <div className="hero-form-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div>
                  <label style={{fontSize:11,fontWeight:500,color:C.textMut,display:"block",marginBottom:5}}>Email</label>
                  <input placeholder="tu@empresa.com" style={{width:"100%",padding:"10px 12px",borderRadius:9,border:`1px solid ${C.border}`,fontSize:13,color:C.text,background:C.bgCream,outline:"none",fontFamily:"inherit"}}/>
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:500,color:C.textMut,display:"block",marginBottom:5}}>Empresa</label>
                  <input placeholder="Nombre empresa" style={{width:"100%",padding:"10px 12px",borderRadius:9,border:`1px solid ${C.border}`,fontSize:13,color:C.text,background:C.bgCream,outline:"none",fontFamily:"inherit"}}/>
                </div>
              </div>
              <LiquidButton
                size="lg"
                style={{width:"100%",background:C.purple,color:"#fff",fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:14,fontWeight:700} as React.CSSProperties}
              >
                Solicitar sesión estratégica →
              </LiquidButton>
            </div>
          </div>

          {/* PHONE MOCKUP HERO */}
          <div className="hero-phone-col" style={{display:"flex",justifyContent:"center"}}>
            <div style={{background:"#0A0A0A",borderRadius:36,padding:10,boxShadow:"0 32px 80px rgba(10,10,46,.25)"}}>
              <div style={{background:C.waCliBg,borderRadius:28,overflow:"hidden",width:280}}>
                <div style={{background:"#0A0A0A",height:28,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:60,height:6,background:"rgba(255,255,255,.15)",borderRadius:3}}/>
                </div>
                <div style={{background:C.purple,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                  <Logo size={32}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600,color:"#fff"}}>Red42</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>en línea</div>
                  </div>
                  <div style={{background:"rgba(255,255,255,.2)",color:"#fff",fontSize:8,fontWeight:700,padding:"2px 7px",borderRadius:999,textTransform:"uppercase"}}>LIVE</div>
                </div>
                <div style={{background:C.wa,padding:12,display:"flex",flexDirection:"column",gap:8}}>
                  <div style={{display:"flex",justifyContent:"flex-start"}}>
                    <div style={{background:C.waCliBg,borderRadius:"14px 14px 14px 3px",padding:"8px 11px",fontSize:11,color:C.waCliTx,maxWidth:"80%",boxShadow:"0 1px 3px rgba(0,0,0,.07)"}}>
                      Hola, quiero automatizar nuestro proceso de ventas con IA.
                    </div>
                  </div>
                  <div style={{display:"flex",justifyContent:"flex-end"}}>
                    <div style={{background:C.waBotBg,borderRadius:"14px 14px 3px 14px",padding:"8px 11px",fontSize:11,color:"#fff",maxWidth:"80%"}}>
                      Perfecto. Cuéntame más y te preparo una propuesta en <strong style={{color:"#FF9999"}}>24 horas</strong>.
                    </div>
                  </div>
                  <div style={{display:"flex",justifyContent:"flex-start"}}>
                    <div style={{background:C.waCliBg,borderRadius:"14px 14px 14px 3px",padding:"8px 11px",fontSize:11,color:C.waCliTx,boxShadow:"0 1px 3px rgba(0,0,0,.07)"}}>
                      Queremos reducir el tiempo en tareas repetitivas.
                    </div>
                  </div>
                  <div style={{display:"flex",justifyContent:"flex-end"}}>
                    <div style={{background:C.waBotBg,borderRadius:"14px 14px 3px 14px",padding:"8px 11px",fontSize:11,color:"#fff",maxWidth:"80%"}}>
                      ✅ Entendido. Nuestros clientes ahorran <strong style={{color:"#FF9999"}}>-60% de tiempo</strong> en las primeras 2 semanas.
                    </div>
                  </div>
                  <div style={{background:C.bgCard,borderRadius:12,padding:"10px 12px",border:`1px solid ${C.border}`,marginTop:4}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <span style={{fontSize:10,fontWeight:600,color:C.text}}>Propuesta · Generada por IA</span>
                      <span style={{background:C.purpleL,color:C.purple,fontSize:8,fontWeight:700,padding:"2px 6px",borderRadius:999}}>IA</span>
                    </div>
                    {[{n:"Automatización de procesos",v:"12 h/semana"},{n:"Agente IA personalizado",v:"24/7 activo"},{n:"Dashboard de resultados",v:"Tiempo real"}].map((r,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderTop: i>0 ? `1px solid ${C.border}` : "none"}}>
                        <span style={{fontSize:10,fontWeight:500,color:C.text}}>{r.n}</span>
                        <span style={{fontSize:10,fontWeight:600,color:C.purple}}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{background:"#fff",padding:"8px 12px",display:"flex",alignItems:"center",gap:8,borderTop:`1px solid ${C.border}`}}>
                  <div style={{flex:1,background:C.bgCream,borderRadius:20,padding:"6px 12px",fontSize:10,color:C.textMut}}>Escribe un mensaje...</div>
                  <div style={{width:28,height:28,borderRadius:"50%",background:C.purple,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontSize:11,color:"#fff"}}>↑</span>
                  </div>
                </div>
                <div style={{background:"#fff",height:20,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:48,height:4,background:"rgba(0,0,0,.12)",borderRadius:2}}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENTES */}
      <section style={{padding:"32px 6%",borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,background:C.bgCard}}>
        <p style={{textAlign:"center",fontSize:11,color:C.textMut,fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",marginBottom:18}}>
          Confiado por empresas que quieren ir más rápido
        </p>
        <div style={{display:"flex",gap:32,justifyContent:"center",flexWrap:"wrap"}}>
          {CLIENTS.map(c=><span key={c} style={{fontSize:13,fontWeight:600,color:C.purpleT}}>{c}</span>)}
        </div>
      </section>

      {/* DEMO */}
      <section className="section-pad" style={{padding:"80px 6%"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <p style={{fontSize:10,fontWeight:600,letterSpacing:".18em",textTransform:"uppercase",color:C.purple,marginBottom:12,textAlign:"center"}}>casos de uso</p>
          <h2 className="section-h2-lg" style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:40,color:C.text,textAlign:"center",maxWidth:700,marginTop:0,marginBottom:12,marginLeft:"auto",marginRight:"auto"}}>
            IA que resuelve problemas reales de negocio.
          </h2>
          <p style={{fontSize:15,color:C.textMid,textAlign:"center",maxWidth:620,margin:"0 auto 36px",lineHeight:1.7}}>
            No vendemos tecnología por vender. Red42 analiza tu operación, identifica dónde la IA genera más valor y lo implementa sin burocracia.
          </p>
          <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:36}}>
            {TABS.map(t=>(
              <LiquidButton key={t} onClick={()=>setTab(t)} size="sm" style={{padding:"9px 22px",borderRadius:999,border: tab===t ? "none" : `1.5px solid ${C.borderM}`,background: tab===t ? C.purple : "transparent",color: tab===t ? "#fff" : C.textMid,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"} as React.CSSProperties}>
                {t}
              </LiquidButton>
            ))}
          </div>
          <div className="demo-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,alignItems:"start"}}>
            <ChatDemo tab={tab}/>
            <ResultCard tab={tab}/>
          </div>
        </div>
      </section>

      {/* ORBITAL — SERVICIOS */}
      <section className="section-pad" style={{padding:"80px 6%",background:"#0A0A0A",overflow:"hidden"}}>
        <div className="orbital-flex" style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",gap:60}}>
          <div className="orbital-col-left" style={{flex:"0 0 380px",minWidth:0}}>
            <p style={{fontSize:10,fontWeight:600,letterSpacing:".18em",textTransform:"uppercase",color:"#FF2222",marginBottom:16}}>lo que hacemos</p>
            <h2 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:38,color:"#ffffff",marginBottom:20,lineHeight:1.15}}>
              Tu red de IA,{" "}
              <span style={{color:"#FF9999"}}>diseñada a medida.</span>
            </h2>
            <p style={{fontSize:15,color:"rgba(255,200,200,.75)",lineHeight:1.75,marginBottom:36}}>
              Red42 no es una herramienta. Es un equipo que entiende tu negocio, diseña la solución correcta y la opera contigo.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[
                {label:"Automatización de procesos", desc:"Eliminamos el trabajo repetitivo que consume tiempo y genera errores."},
                {label:"Agentes IA personalizados",  desc:"Construimos agentes que entienden tu negocio y operan de forma autónoma."},
                {label:"Integración de sistemas",    desc:"Conectamos tu stack actual con IA sin tirar nada por la borda."},
                {label:"Análisis e inteligencia",    desc:"Convertimos tus datos en decisiones más rápidas y precisas."},
                {label:"Formación y adopción",       desc:"Tu equipo aprende a trabajar con IA desde el primer día."},
              ].map(({label,desc})=>(
                <div key={label} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(208,0,0,.25)",borderLeft:`3px solid ${C.purple}`,borderRadius:10,padding:"12px 16px"}}>
                  <p style={{color:"#ffffff",fontWeight:700,fontSize:13,margin:"0 0 3px",fontFamily:"'Bricolage Grotesque',sans-serif"}}>{label}</p>
                  <p style={{color:"rgba(255,200,200,.7)",fontSize:12,margin:0,lineHeight:1.55}}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="orbital-col-right" style={{flex:1,minWidth:0}}>
            <RadialOrbitalTimeline timelineData={ORBITAL_DATA}/>
          </div>
        </div>
      </section>

      {/* MÉTRICAS BENTO */}
      <section className="section-pad" style={{padding:"80px 6%",background:C.bgCard,borderTop:`1px solid ${C.border}`}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <p style={{fontSize:10,fontWeight:600,letterSpacing:".18em",textTransform:"uppercase",color:C.purple,marginBottom:12,textAlign:"center"}}>resultados</p>
          <h2 className="section-h2-lg" style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:36,color:C.text,textAlign:"center",marginBottom:10}}>
            Números que hablan por sí solos
          </h2>
          <p style={{fontSize:14,color:C.textMid,textAlign:"center",maxWidth:480,margin:"0 auto 48px"}}>
            Resultados reales de proyectos completados con clientes en España y LATAM.
          </p>
          <BentoGridShowcase
            integration={
              <div style={{background:"#0A0A0A",border:"1px solid rgba(208,0,0,.3)",borderRadius:16,padding:28,display:"flex",flexDirection:"column",boxSizing:"border-box",height:"100%"}}>
                <div style={{width:48,height:48,borderRadius:12,background:"rgba(208,0,0,.25)",border:"1px solid rgba(208,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,flexShrink:0}}>
                  <Logo size={28}/>
                </div>
                <p style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:20,color:"#ffffff",marginBottom:12}}>Red42 conectado a tu negocio</p>
                <p style={{fontSize:13,color:"rgba(255,200,200,.75)",lineHeight:1.7,flex:1}}>
                  Analizamos tu operación, diseñamos la solución IA y la integramos en tu stack existente. Sin disrupciones, sin fricciones.
                </p>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:24}}>
                  {["Implementación en menos de 2 semanas","Sin cambiar tu stack actual","Soporte continuo incluido"].map(f=>(
                    <div key={f} style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:C.green,flexShrink:0}}/>
                      <span style={{fontSize:12,color:"rgba(255,255,255,.8)",fontWeight:500}}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:24,paddingTop:20,borderTop:"1px solid rgba(208,0,0,.2)"}}>
                  <span style={{fontSize:11,color:"rgba(255,200,200,.6)",fontWeight:600,letterSpacing:".1em",textTransform:"uppercase"}}>Estado</span>
                  <span style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.green,fontWeight:700}}>
                    <span style={{width:7,height:7,borderRadius:"50%",background:C.green,display:"inline-block"}}/>
                    Activo
                  </span>
                </div>
              </div>
            }
            trackers={
              <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:16,padding:24,height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between",boxSizing:"border-box",minHeight:160}}>
                <div>
                  <p style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:C.textMid,marginBottom:4}}>Tiempo de implementación</p>
                  <p style={{fontSize:12,color:C.textMid}}>Desde contrato a producción</p>
                </div>
                <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:52,color:C.purple,lineHeight:1}}>14 días</div>
                <p style={{fontSize:12,color:C.textMid,lineHeight:1.5}}>Promedio en todos nuestros proyectos.</p>
              </div>
            }
            statistic={
              <div style={{background:"#0A0A0A",border:"1px solid rgba(208,0,0,.3)",borderRadius:16,height:"100%",minHeight:160,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",position:"relative",boxSizing:"border-box"}}>
                <div style={{position:"absolute",inset:0,opacity:.08,backgroundImage:"radial-gradient(rgba(208,0,0,1) 1px, transparent 1px)",backgroundSize:"18px 18px"}}/>
                <div style={{textAlign:"center",position:"relative",zIndex:1}}>
                  <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:72,color:"#ffffff",lineHeight:1}}>-60%</div>
                  <p style={{fontSize:12,color:"rgba(255,200,200,.7)",marginTop:6}}>tiempo en tareas manuales</p>
                </div>
              </div>
            }
            focus={
              <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:16,padding:24,height:"100%",minHeight:160,display:"flex",flexDirection:"column",justifyContent:"space-between",boxSizing:"border-box"}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
                  <div>
                    <p style={{fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:C.textMid,marginBottom:4}}>ROI promedio</p>
                    <p style={{fontSize:12,color:C.textMid}}>Primeros 90 días</p>
                  </div>
                  <span style={{fontSize:10,fontWeight:700,color:C.purple,background:C.purpleL,border:`1px solid ${C.purpleT}`,borderRadius:999,padding:"3px 8px",whiteSpace:"nowrap"}}>Garantizado</span>
                </div>
                <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:52,color:C.purple,lineHeight:1}}>3.2x</div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textMid}}>
                  <span>retorno sobre inversión</span>
                  <span>en 3 meses</span>
                </div>
              </div>
            }
            productivity={
              <div style={{background:"#0A0A0A",border:"1px solid rgba(208,0,0,.3)",borderRadius:16,padding:24,height:"100%",minHeight:160,display:"flex",flexDirection:"column",justifyContent:"flex-end",boxSizing:"border-box"}}>
                <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:42,color:C.green,marginBottom:8,lineHeight:1}}>+40%</div>
                <p style={{fontSize:13,fontWeight:700,color:"#ffffff",marginBottom:6}}>capacidad operativa sin contratar</p>
                <p style={{fontSize:12,color:"rgba(255,200,200,.65)",lineHeight:1.5}}>Tu equipo produce más con el mismo tamaño gracias a la IA.</p>
              </div>
            }
            shortcuts={
              <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:16,padding:24,display:"flex",alignItems:"center",justifyContent:"space-between",gap:32,minHeight:120,boxSizing:"border-box"}}>
                <div style={{flex:1}}>
                  <p style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:17,color:C.text,marginBottom:6}}>Más velocidad, menos errores</p>
                  <p style={{fontSize:13,color:C.textMid,lineHeight:1.6}}>Los procesos automatizados no se cansan, no se equivocan y no piden vacaciones.</p>
                </div>
                <div style={{display:"flex",gap:24,flexShrink:0}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:40,color:C.purple,lineHeight:1}}>-95%</div>
                    <p style={{fontSize:11,color:C.textMid,marginTop:4}}>errores humanos</p>
                  </div>
                  <div style={{width:1,background:C.border}}/>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:40,color:C.purple,lineHeight:1}}>24/7</div>
                    <p style={{fontSize:11,color:C.textMid,marginTop:4}}>operación continua</p>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* IMPLEMENTACIÓN */}
      <section className="section-pad" style={{padding:"80px 6%"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <p style={{fontSize:10,fontWeight:600,letterSpacing:".18em",textTransform:"uppercase",color:C.purple,marginBottom:12,textAlign:"center"}}>proceso</p>
          <h2 className="section-h2-lg" style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:36,color:C.text,textAlign:"center",marginBottom:10}}>
            De cero a producción en dos semanas
          </h2>
          <p style={{fontSize:14,color:C.textMid,textAlign:"center",maxWidth:480,margin:"0 auto 48px"}}>
            Sin proyectos eternos. Sin consultoras. Resultados reales en el primer mes.
          </p>
          <div className="steps-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
            {STEPS.map((s,i)=>(
              <div key={i} style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:16,padding:24,boxShadow:"0 2px 12px rgba(26,26,255,.06)"}}>
                <div style={{background:C.purpleL,color:C.purple,fontSize:9,fontWeight:700,letterSpacing:".1em",padding:"3px 8px",borderRadius:999,display:"inline-block",marginBottom:16,textTransform:"uppercase"}}>{s.day}</div>
                <div style={{width:32,height:32,borderRadius:"50%",background:C.purple,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff",marginBottom:12}}>{i+1}</div>
                <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:700,fontSize:15,color:C.text,marginBottom:8}}>{s.title}</div>
                <div style={{fontSize:12,color:C.textMid,lineHeight:1.6}}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESPONSIVE STYLES */}
      <style>{`
        @keyframes typing { 0%,80%,100%{transform:scale(0.6);opacity:.4} 40%{transform:scale(1);opacity:1} }
        @keyframes erp-spin-cw  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes erp-spin-ccw { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        .erp-icon { animation: erp-spin-ccw var(--d) linear infinite; }
        .msg-animate { animation: msgIn .25s ease; }
        @keyframes msgIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

        @media (max-width: 900px) {
          .steps-grid { grid-template-columns: repeat(2,1fr) !important; }
          .bento-grid  { grid-template-columns: 1fr 1fr !important; grid-template-rows: auto !important; }
          .bento-cell-1 { grid-column: 1/3 !important; grid-row: auto !important; min-height: 200px; }
          .bento-cell-2 { grid-column: 1   !important; grid-row: auto !important; min-height: 160px; }
          .bento-cell-3 { grid-column: 2   !important; grid-row: auto !important; min-height: 160px; }
          .bento-cell-4 { grid-column: 1   !important; grid-row: auto !important; min-height: 160px; }
          .bento-cell-5 { grid-column: 2   !important; grid-row: auto !important; min-height: 160px; }
          .bento-cell-6 { grid-column: 1/3 !important; grid-row: auto !important; min-height: 160px; }
        }

        @media (max-width: 640px) {
          .nav-links      { display: none !important; }
          .hero-grid      { grid-template-columns: 1fr !important; gap: 32px !important; }
          .hero-phone-col { display: none !important; }
          .hero-form-grid { grid-template-columns: 1fr !important; }
          .hero-h1        { font-size: 34px !important; }
          .demo-grid      { grid-template-columns: 1fr !important; gap: 24px !important; }
          .orbital-flex   { flex-direction: column !important; gap: 32px !important; }
          .orbital-col-left  { flex: none !important; width: 100% !important; max-width: 100% !important; }
          .orbital-col-right { display: none !important; }
          .steps-grid     { grid-template-columns: 1fr !important; }
          .erp-flex       { flex-direction: column !important; min-height: auto !important; gap: 32px !important; }
          .erp-col-left   { flex: none !important; width: 100% !important; max-width: 100% !important; }
          .erp-col-right  { display: none !important; }
          .bento-grid     { grid-template-columns: 1fr !important; grid-template-rows: auto !important; }
          .bento-cell-1,.bento-cell-2,.bento-cell-3,
          .bento-cell-4,.bento-cell-5,.bento-cell-6 { grid-column: 1 !important; grid-row: auto !important; min-height: 160px; }
          .section-pad    { padding-left: 5% !important; padding-right: 5% !important; }
          .section-h2-lg  { font-size: 28px !important; }
        }
      `}</style>

      {/* TECH STACK */}
      <section className="section-pad" style={{padding:"60px 6%",borderTop:`1px solid ${C.border}`,background:C.bgCard,overflow:"hidden"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",gap:40}}>
          <div style={{flex:"0 0 420px",minWidth:0}}>
            <p style={{fontSize:10,fontWeight:600,letterSpacing:".18em",textTransform:"uppercase",color:C.purple,marginBottom:14}}>stack tecnológico</p>
            <h2 style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:34,color:C.text,marginBottom:14,lineHeight:1.15}}>
              Las mejores herramientas<br/>del ecosistema IA.
            </h2>
            <p style={{fontSize:14,color:C.textMid,lineHeight:1.75,marginBottom:28}}>
              Trabajamos con las tecnologías más avanzadas del mercado. Sin vendor lock-in, sin dependencias innecesarias.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {["Modelos de última generación (GPT-4, Claude, Gemini)","Infraestructura escalable en la nube","Integración con cualquier API o sistema"].map(f=>(
                <div key={f} style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:C.green,flexShrink:0}}/>
                  <span style={{fontSize:13,color:C.textMid}}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{flex:1,display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center"}}>
            {TECH_STACK.map(t=>(
              <div key={t} style={{background:C.bgCream,border:`1px solid ${C.border}`,borderRadius:12,padding:"10px 20px",fontSize:13,fontWeight:600,color:C.textMid}}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad" style={{padding:"80px 6%",borderTop:`1px solid ${C.border}`}}>
        <div style={{maxWidth:560,margin:"0 auto",textAlign:"center"}}>
          <h2 className="section-h2-lg" style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:40,color:C.text,marginBottom:16}}>
            ¿Listo para operar a otra <span style={{color:C.purple}}>escala?</span>
          </h2>
          <p style={{fontSize:15,color:C.textMid,marginBottom:32}}>Primera sesión estratégica gratuita. Sin compromisos.</p>
          <LiquidButton
            size="xxl"
            style={{fontFamily:"'Bricolage Grotesque',sans-serif",background:C.purple,color:"#fff",fontSize:16,fontWeight:700} as React.CSSProperties}
          >
            Hablar con Red42 →
          </LiquidButton>
        </div>
      </section>

      {/* FOOTER */}
      {/* ── FOOTER ── */}
      <footer style={{position:"relative",zIndex:10,marginTop:0,width:"100%",overflow:"hidden",paddingTop:64,paddingBottom:32,background:"#0A0A0A"}}>
        {/* Glow blobs */}
        <div style={{pointerEvents:"none",position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",height:"100%",zIndex:0}}>
          <div style={{position:"absolute",top:-80,left:"20%",width:260,height:260,borderRadius:"50%",background:"rgba(208,0,0,.15)",filter:"blur(72px)"}}/>
          <div style={{position:"absolute",bottom:-60,right:"20%",width:300,height:300,borderRadius:"50%",background:"rgba(208,0,0,.12)",filter:"blur(80px)"}}/>
        </div>

        {/* Glass card */}
        <div style={{
          position:"relative",margin:"0 auto",maxWidth:1100,
          backdropFilter:"blur(12px) saturate(160%)",
          background:"radial-gradient(circle, rgba(255,255,255,.04) 0%, rgba(30,0,0,.10) 60%, rgba(10,0,0,.95) 100%)",
          border:"1px solid rgba(208,0,0,.18)",
          borderRadius:20,padding:"40px 40px 32px",
          display:"flex",flexDirection:"column",gap:40,
        }}>
          {/* Top row */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:32,flexWrap:"wrap"}} className="footer-grid">

            {/* Brand */}
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <Logotype size={26} onDark/>
              <p style={{fontSize:13,color:"rgba(255,255,255,.45)",lineHeight:1.7,margin:0,maxWidth:220}}>
                Automatizamos y escalamos negocios con IA. Desde agentes hasta infraestructura completa.
              </p>
              {/* Social */}
              <div style={{display:"flex",gap:14,marginTop:4}}>
                {[
                  {label:"LinkedIn", path:"M19 0h-14a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5v-14a5 5 0 00-5-5zm-11 19h-3v-9h3zm-1.5-10.268a1.752 1.752 0 110-3.505 1.752 1.752 0 010 3.505zm15.5 10.268h-3v-4.5c0-1.07-.02-2.45-1.492-2.45-1.495 0-1.725 1.166-1.725 2.372v4.578h-3v-9h2.88v1.23h.04a3.157 3.157 0 012.847-1.568c3.042 0 3.605 2.003 3.605 4.612v4.726z"},
                  {label:"Twitter/X", path:"M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"},
                  {label:"Instagram", path:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"},
                ].map(({label,path})=>(
                  <a key={label} href="#" aria-label={label} style={{color:"rgba(208,0,0,.7)",transition:"color .2s"}}
                    onMouseEnter={e=>(e.currentTarget.style.color="#FF2222")}
                    onMouseLeave={e=>(e.currentTarget.style.color="rgba(208,0,0,.7)")}>
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d={path}/></svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Servicios */}
            <div>
              <p style={{fontSize:11,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"#D00000",marginBottom:20,margin:"0 0 20px"}}>Servicios</p>
              <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:12}}>
                {["Automatización de procesos","Agentes IA personalizados","Integración de sistemas","Análisis e inteligencia","Formación y adopción"].map(s=>(
                  <li key={s}><a href="#" style={{fontSize:13,color:"rgba(255,255,255,.45)",textDecoration:"none",transition:"color .2s"}}
                    onMouseEnter={e=>(e.currentTarget.style.color="#fff")}
                    onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,.45)")}>{s}</a></li>
                ))}
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <p style={{fontSize:11,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"#D00000",marginBottom:20,margin:"0 0 20px"}}>Empresa</p>
              <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:12}}>
                {["Sobre Red42","Casos de éxito","Stack tecnológico","Blog","Trabaja con nosotros"].map(s=>(
                  <li key={s}><a href="#" style={{fontSize:13,color:"rgba(255,255,255,.45)",textDecoration:"none",transition:"color .2s"}}
                    onMouseEnter={e=>(e.currentTarget.style.color="#fff")}
                    onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,.45)")}>{s}</a></li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <p style={{fontSize:11,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"#D00000",marginBottom:20,margin:"0 0 20px"}}>Contacto</p>
              <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:14}}>
                {[
                  {icon:"M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", text:"hola@red42.ai"},
                  {icon:"M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", text:"+34 600 000 000"},
                  {icon:"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", text:"España · Remoto"},
                ].map(({icon,text})=>(
                  <li key={text} style={{display:"flex",alignItems:"center",gap:10}}>
                    <svg width="16" height="16" fill="none" stroke="#D00000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d={icon}/></svg>
                    <span style={{fontSize:13,color:"rgba(255,255,255,.45)"}}>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{borderTop:"1px solid rgba(208,0,0,.15)",paddingTop:24,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
            <p style={{fontSize:11,color:"rgba(255,255,255,.25)",margin:0}}>© 2026 Red42. Todos los derechos reservados.</p>
            <div style={{display:"flex",gap:20}}>
              {["Privacidad","Términos","Cookies"].map(l=>(
                <a key={l} href="#" style={{fontSize:11,color:"rgba(255,255,255,.25)",textDecoration:"none",transition:"color .2s"}}
                  onMouseEnter={e=>(e.currentTarget.style.color="rgba(255,255,255,.6)")}
                  onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,.25)")}>{l}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Responsive styles */}
        <style>{`
          @media (max-width: 768px) {
            .footer-grid { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 480px) {
            .footer-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </footer>

    </main>
  );
}
