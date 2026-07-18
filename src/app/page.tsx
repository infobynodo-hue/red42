"use client";
import React, { useState, useEffect, useRef } from "react";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { BentoGridShowcase } from "@/components/ui/bento-product-features";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { LogoCarousel } from "@/components/ui/logo-carousel";
import { GradientHeading } from "@/components/ui/gradient-heading";
import {
  Zap, BarChart2, Users, RefreshCw, Bell, TrendingUp, ShoppingCart,
  Calendar, FileText, FolderOpen, Target, Send, MessageCircle, Star,
  Phone, BookOpen, Globe, ClipboardList, Brain, Receipt, Package,
  Sun, UserPlus, ArrowDown, X,
} from "lucide-react";
import type { SVGProps } from "react";

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

/* ─── AUTOMATIZACIONES DATA ─────────────────────────────────── */
type Area = 'admin' | 'ventas' | 'atencion' | 'interno';
type ServiceItem = {
  id: number; area: Area; icon: React.ElementType;
  title: string; short: string;
  trigger: string; steps: string[]; output: string; saving: string;
};
const AREA_LABELS: Record<Area, string> = {
  admin: 'Administración', ventas: 'Ventas',
  atencion: 'Atención al cliente', interno: 'Procesos internos',
};
const SERVICES: ServiceItem[] = [
  // ADMINISTRACIÓN
  { id:1,  area:'admin',    icon:Calendar,     title:'Gestión de agenda y citas',            short:'Agenda automática vía WhatsApp, sin intervención humana.',          trigger:'Cliente escribe pidiendo una cita o consulta.',                                   steps:['IA comprueba disponibilidad en el calendario en tiempo real.','Confirma el horario y envía detalles al cliente.','Envía recordatorio automático 24 h antes.','Gestiona cancelaciones y reagendados sin intervención.'],                                              output:'Cita confirmada, calendario actualizado y cliente informado.',               saving:'-8 h/semana' },
  { id:2,  area:'admin',    icon:FileText,      title:'Ciclo de facturación automático',      short:'Facturas generadas, enviadas y registradas sin tocarlas.',           trigger:'Cierre de mes o hito de proyecto marcado como completado.',                       steps:['IA genera la factura personalizada con los datos del cliente.','La envía por email en formato PDF.','Registra el ingreso en el sistema contable.','Alerta al equipo si queda impagada a los 15 días.'],                                                         output:'Factura enviada, contabilizada y con seguimiento activo.',                   saving:'-6 h/mes' },
  { id:3,  area:'admin',    icon:FolderOpen,    title:'Gestión documental inteligente',       short:'Documentos clasificados y almacenados automáticamente.',             trigger:'Empleado o cliente envía un documento por email o chat.',                         steps:['IA identifica el tipo de documento (contrato, factura, DNI…).','Lo clasifica y guarda en la carpeta correcta de Drive.','Notifica al responsable correspondiente.','Genera registro de auditoría con fecha y origen.'],                                          output:'Documento organizado y equipo notificado en segundos.',                     saving:'-5 h/semana' },
  { id:4,  area:'admin',    icon:Calendar,      title:'Citas y agenda sector salud',          short:'Agenda de consultas médicas gestionada sola desde WhatsApp.',        trigger:'Paciente escribe o llama pidiendo consulta o cita médica.',                       steps:['IA comprueba la agenda del profesional en tiempo real.','Confirma la cita y envía instrucciones previas al paciente.','Recuerda la cita 24 h antes con indicaciones.','Gestiona cancelaciones y lista de espera automáticamente.'],                             output:'Agenda optimizada sin secretaria dedicada y cero citas perdidas.',           saving:'-90% llamadas' },
  // VENTAS
  { id:5,  area:'ventas',   icon:Target,        title:'Cualificación automática de leads',    short:'Solo llegan leads listos para hablar con ventas.',                   trigger:'Lead entra por formulario web, ads o referido.',                                  steps:['IA hace 3-5 preguntas clave de cualificación.','Puntúa el lead según presupuesto, urgencia y fit.','Si califica, agenda reunión con el comercial en tiempo real.','Si no califica, entra en secuencia de nurturing automático.'],                             output:'Reunión con lead cualificado en el calendario del comercial.',               saving:'+40% conversión' },
  { id:6,  area:'ventas',   icon:Send,          title:'Generación de propuestas comerciales', short:'Propuesta profesional lista en minutos, no en horas.',               trigger:'Comercial rellena ficha básica del cliente tras la reunión.',                     steps:['IA redacta propuesta personalizada con el contexto del cliente.','Genera el PDF con el branding de la empresa.','Lo envía al cliente con enlace de firma digital.','Hace seguimiento automático a los 3 días si no hay respuesta.'],                           output:'Propuesta enviada y seguimiento activo sin esfuerzo del comercial.',         saving:'-3 h por propuesta' },
  { id:7,  area:'ventas',   icon:RefreshCw,     title:'Recuperación de presupuestos fríos',   short:'Reactiva leads que dejaron de responder.',                           trigger:'Presupuesto sin respuesta después de 5 días.',                                    steps:['IA detecta presupuestos inactivos automáticamente.','Envía mensaje personalizado por el canal preferido del cliente.','Si abre el email, alerta al comercial para seguimiento inmediato.','Si no responde, lanza secuencia de 3 mensajes en 10 días.'],           output:'Lead reactivado o descartado con contexto completo para el equipo.',         saving:'+25% cierres' },
  // ATENCIÓN AL CLIENTE
  { id:8,  area:'atencion', icon:MessageCircle, title:'Soporte al cliente 24/7',              short:'Respuestas inmediatas a cualquier hora del día.',                    trigger:'Cliente pregunta por WhatsApp, web o email.',                                    steps:['IA analiza la consulta y busca en la base de conocimiento.','Responde en menos de 30 segundos con información precisa.','Si no puede resolver, escala al humano con todo el contexto.','Registra la interacción para mejorar futuras respuestas.'],               output:'Cliente atendido o escalado con contexto completo.',                         saving:'-70% tickets' },
  { id:9,  area:'atencion', icon:Phone,         title:'Centralita IA telefónica',             short:'Nunca más una llamada sin respuesta.',                               trigger:'Cliente llama fuera de horario o con la línea ocupada.',                          steps:['IA responde y saluda con el nombre de la empresa.','Identifica el motivo: cita, información, queja, pedido…','Resuelve si puede (agenda, da información, registra pedido).','Deja resumen escrito y grabación al equipo para el día siguiente.'],              output:'Cliente atendido y cero llamadas perdidas.',                                 saving:'-100% llamadas perdidas' },
  { id:10, area:'atencion', icon:RefreshCw,     title:'Seguimiento posventa automático',      short:'El cliente siente que te recuerdas de él tras la compra.',           trigger:'Venta o entrega de servicio finalizado.',                                         steps:['IA contacta al cliente a los 3 días para verificar satisfacción.','Si está satisfecho, solicita reseña y ofrece upsell relevante.','Si hay incidencia, abre ticket y alerta al equipo inmediatamente.','Registra el feedback para mejorar el servicio.'],      output:'Cliente fidelizado e incidencias detectadas en las primeras 72 horas.',     saving:'+30% retención' },
  { id:11, area:'atencion', icon:BookOpen,      title:'Onboarding educativo automático',      short:'El cliente aprende a usar el producto sin llamadas de soporte.',     trigger:'Cliente nuevo acaba de contratar o realizar su primera compra.',                  steps:['IA envía secuencia educativa personalizada por WhatsApp o email.','Adapta el contenido y ritmo según las respuestas del cliente.','Responde dudas específicas en tiempo real durante el proceso.','Certifica la finalización y ofrece recursos avanzados.'],       output:'Cliente autónomo desde el primer día, sin soporte básico.',                 saving:'-80% soporte inicial' },
  { id:12, area:'atencion', icon:Star,          title:'Gestión de reseñas y reputación',      short:'Reseñas positivas amplificadas, negativas gestionadas internamente.', trigger:'Cliente completa un servicio o recibe su pedido.',                                steps:['IA contacta al cliente con solicitud de valoración personalizada.','Si la valoración es 4-5★, redirige a Google o Trustpilot.','Si es 1-3★, abre incidencia interna y responde con empatía.','Genera informe mensual de reputación para el equipo directivo.'],  output:'Reputación online protegida y score medio en aumento constante.',            saving:'+4.6★ media' },
  { id:13, area:'atencion', icon:Globe,         title:'Atención multicanal unificada',        short:'Todos los canales, una sola conversación coherente.',                trigger:'Cliente contacta por WhatsApp, Instagram DM, email o web.',                       steps:['IA unifica todos los mensajes en una sola bandeja de entrada.','Responde con el mismo contexto e historial en cada canal.','Evita respuestas duplicadas si el cliente escribe desde varios sitios.','El agente humano ve el hilo completo antes de intervenir.'],  output:'Experiencia coherente para el cliente sin importar el canal.',               saving:'-60% tiempo respuesta' },
  // PROCESOS INTERNOS
  { id:14, area:'interno',  icon:ClipboardList, title:'Actas automáticas de reunión',         short:'La reunión termina y las tareas ya están asignadas.',                trigger:'Reunión grabada o transcrita en Zoom, Meet o Teams.',                             steps:['IA procesa la transcripción y extrae decisiones clave.','Identifica tareas, responsables y fechas límite.','Envía el acta estructurada por email a todos los asistentes.','Crea las tareas en Notion, Asana o ClickUp automáticamente.'],                       output:'Tareas creadas y asignadas sin trabajo manual post-reunión.',                saving:'-3 h/semana' },
  { id:15, area:'interno',  icon:Brain,         title:'Wiki interna con IA',                  short:'Cualquier empleado encuentra respuestas al instante.',               trigger:'Empleado hace una pregunta por Slack o Teams.',                                   steps:['IA consulta los manuales, SOPs y documentos de la empresa.','Responde con el contexto exacto y enlace al documento fuente.','Si no existe la respuesta, escala al experto y guarda la nueva.','Aprende con cada interacción y actualiza la base de conocimiento.'], output:'Respuesta en segundos y wiki actualizada automáticamente.',                  saving:'-5 h/semana' },
  { id:16, area:'interno',  icon:ShoppingCart,  title:'Gestión de proveedores y compras',     short:'Pedidos tramitados sin papeleo ni emails manuales.',                 trigger:'Empleado solicita una compra por formulario interno.',                            steps:['IA comprueba el presupuesto disponible para esa categoría.','Si hay fondos, genera la orden de compra automáticamente.','Notifica al proveedor y registra el pedido en el sistema.','Actualiza la contabilidad cuando llega la factura del proveedor.'],          output:'Compra tramitada y contabilizada sin intervención del equipo.',              saving:'-4 h/semana' },
  { id:17, area:'interno',  icon:Receipt,       title:'Aprobación automática de gastos',      short:'Tickets digitalizados y aprobados sin papeles.',                     trigger:'Empleado fotografía un ticket o recibo con su móvil.',                           steps:['IA extrae importe, categoría, proveedor y fecha del ticket.','Compara con la política de gastos de la empresa.','Aprueba automáticamente si cumple las reglas establecidas.','Escala al manager con contexto si supera el límite definido.'],                    output:'Gasto registrado y aprobado en menos de 2 minutos.',                        saving:'-6 h/mes por empleado' },
  { id:18, area:'interno',  icon:Package,       title:'Control de stock e inventario',        short:'Nunca más quedarse sin producto clave.',                             trigger:'Stock de un producto cae por debajo del umbral mínimo.',                          steps:['IA detecta el nivel bajo y genera una propuesta de pedido.','Envía la propuesta al responsable para aprobación en un click.','Si se aprueba, lanza la orden de compra al proveedor.','Actualiza el inventario cuando llega la mercancía.'],                        output:'Stock repuesto sin intervención manual y sin roturas.',                      saving:'0 roturas de stock' },
  { id:19, area:'interno',  icon:BarChart2,     title:'Actualización automática de proyectos', short:'Estado del proyecto siempre actualizado sin reuniones extra.',       trigger:'Cada viernes a las 16:00, configurado por el equipo.',                            steps:['IA envía mensaje a cada miembro preguntando el estado de sus tareas.','Consolida las respuestas en un informe estructurado.','Detecta bloqueos o retrasos y alerta al PM automáticamente.','Actualiza el tablero del proyecto con el nuevo estado.'],             output:'Informe de proyecto listo el viernes sin necesidad de reunión.',             saving:'-2 h/semana por proyecto' },
  { id:20, area:'interno',  icon:Sun,           title:'Digest diario de equipo',              short:'El directivo empieza el día con el contexto completo.',             trigger:'Cada mañana a las 8:30.',                                                         steps:['IA consolida actividad del día anterior (emails, tareas, incidencias).','Organiza la información por área y nivel de urgencia.','Genera resumen ejecutivo con las 3-5 prioridades del día.','Lo envía al manager por WhatsApp o email antes de las 9:00.'],       output:'Manager informado y prioridades claras cada mañana en 2 minutos.',          saving:'-1 h/día directivo' },
  { id:21, area:'interno',  icon:UserPlus,      title:'Onboarding de empleados',              short:'El primer mes de un nuevo empleado en piloto automático.',          trigger:'Nuevo empleado firma el contrato y es dado de alta en el sistema.',               steps:['IA crea los accesos a todas las herramientas según el rol.','Envía documentos de bienvenida y políticas de la empresa.','Agenda formaciones obligatorias y asigna un buddy del equipo.','Hace check-in automático al final de la semana 1 y semana 2.'],           output:'Empleado integrado y operativo desde el primer día sin carga para RRHH.',   saving:'-12 h por contratación' },
];

/* ─── FLOWCHART MODAL COMPONENT ─────────────────────────────── */
function ServiceModal({ service, onClose }: { service: ServiceItem; onClose: () => void }) {
  const Icon = service.icon;
  return (
    <div
      style={{position:"fixed",inset:0,background:"rgba(0,0,0,.70)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",backdropFilter:"blur(4px)"}}
      onClick={onClose}
    >
      <div
        style={{background:"#111",border:"1px solid rgba(208,0,0,.25)",borderRadius:20,maxWidth:480,width:"100%",maxHeight:"88vh",overflowY:"auto",position:"relative",boxShadow:"0 24px 80px rgba(0,0,0,.8), 0 0 0 1px rgba(208,0,0,.12)"}}
        onClick={e=>e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} style={{position:"absolute",top:14,right:14,width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,.08)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",zIndex:1}}>
          <X size={14}/>
        </button>

        {/* Header */}
        <div style={{padding:"24px 24px 16px",borderBottom:"1px solid rgba(208,0,0,.12)"}}>
          <div style={{width:40,height:40,borderRadius:10,background:"rgba(208,0,0,.2)",border:"1px solid rgba(208,0,0,.3)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>
            <Icon size={20} color="#FF4444"/>
          </div>
          <div style={{fontSize:17,fontWeight:700,color:"#fff",marginBottom:4,fontFamily:"'Bricolage Grotesque',sans-serif"}}>{service.title}</div>
          <div style={{fontSize:12,color:"rgba(208,0,0,.8)",fontWeight:500}}>{AREA_LABELS[service.area]}</div>
        </div>

        {/* Flowchart */}
        <div style={{padding:"20px 24px 24px"}}>
          {/* ENTRADA */}
          <div style={{fontSize:9,fontWeight:700,letterSpacing:".12em",color:"rgba(208,0,0,.6)",textTransform:"uppercase",marginBottom:8}}>Entrada</div>
          <div style={{padding:"11px 14px",borderRadius:10,background:"rgba(208,0,0,.12)",border:"1px solid rgba(208,0,0,.35)",display:"flex",alignItems:"flex-start",gap:10,marginBottom:0}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#D00000",flexShrink:0,marginTop:5}}/>
            <span style={{fontSize:13,color:"rgba(255,255,255,.9)",lineHeight:1.45}}>{service.trigger}</span>
          </div>

          {/* Arrow */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"4px 0"}}>
            <div style={{width:1,height:10,background:"rgba(208,0,0,.3)"}}/>
            <ArrowDown size={12} color="rgba(208,0,0,.5)" style={{marginTop:-2}}/>
          </div>

          {/* PROCESO */}
          <div style={{fontSize:9,fontWeight:700,letterSpacing:".12em",color:"rgba(255,255,255,.35)",textTransform:"uppercase",marginBottom:8}}>Proceso automatizado</div>
          {service.steps.map((step, i) => (
            <React.Fragment key={i}>
              <div style={{padding:"10px 14px",borderRadius:10,background:"rgba(255,255,255,.05)",border:"1px solid rgba(208,0,0,.15)",display:"flex",alignItems:"flex-start",gap:10}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:"rgba(208,0,0,.35)",color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</div>
                <span style={{fontSize:12,color:"rgba(255,255,255,.8)",lineHeight:1.45}}>{step}</span>
              </div>
              {i < service.steps.length - 1 && (
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"2px 0"}}>
                  <div style={{width:1,height:8,background:"rgba(208,0,0,.2)"}}/>
                  <ArrowDown size={10} color="rgba(208,0,0,.3)" style={{marginTop:-2}}/>
                </div>
              )}
            </React.Fragment>
          ))}

          {/* Arrow to output */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"4px 0"}}>
            <div style={{width:1,height:10,background:"rgba(0,229,160,.3)"}}/>
            <ArrowDown size={12} color="rgba(0,229,160,.5)" style={{marginTop:-2}}/>
          </div>

          {/* SALIDA */}
          <div style={{fontSize:9,fontWeight:700,letterSpacing:".12em",color:"rgba(0,229,160,.7)",textTransform:"uppercase",marginBottom:8}}>Salida</div>
          <div style={{padding:"11px 14px",borderRadius:10,background:"rgba(0,229,160,.08)",border:"1px solid rgba(0,229,160,.3)",display:"flex",alignItems:"flex-start",gap:10,marginBottom:16}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#00E5A0",flexShrink:0,marginTop:5}}/>
            <span style={{fontSize:13,color:"rgba(0,229,160,.9)",lineHeight:1.45}}>{service.output}</span>
          </div>

          {/* Saving badge */}
          <div style={{background:"rgba(208,0,0,.12)",border:"1px solid rgba(208,0,0,.25)",borderRadius:10,padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:11,color:"rgba(255,255,255,.5)",fontWeight:500}}>Impacto estimado</span>
            <span style={{fontSize:16,fontWeight:700,color:"#FF4444",fontFamily:"'Bricolage Grotesque',sans-serif"}}>{service.saving}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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

/* ─── CLIENT LOGOS ──────────────────────────────────────── */
const OpenAILogo = (p: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="256" height="260" viewBox="0 0 256 260" {...p}>
    <path d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z"/>
  </svg>
);
const ClaudeLogo = (p: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fillRule="evenodd" clipRule="evenodd" {...p}>
    <rect fill="#CC9B7A" width="512" height="512" rx="104" ry="105"/>
    <path fill="#1F1F1E" fillRule="nonzero" d="M318.663 149.787h-43.368l78.952 212.423 43.368.004-78.952-212.427zm-125.326 0l-78.952 212.427h44.255l15.932-44.608 82.846-.004 16.107 44.612h44.255l-79.126-212.427h-45.317zm-4.251 128.341l26.91-74.701 27.083 74.701h-53.993z"/>
  </svg>
);
const VercelLogo = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 222" width="256" height="222" xmlns="http://www.w3.org/2000/svg" {...p}>
    <path fill="#000" d="m128 0 128 221.705H0z"/>
  </svg>
);
const NextjsLogo = (p: SVGProps<SVGSVGElement>) => (
  <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    <mask id="nxt-m" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
      <circle cx="90" cy="90" r="90" fill="black"/>
    </mask>
    <g mask="url(#nxt-m)">
      <circle cx="90" cy="90" r="87" fill="black" stroke="white" strokeWidth="6"/>
      <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#nxt-g1)"/>
      <rect x="115" y="54" width="12" height="72" fill="url(#nxt-g2)"/>
    </g>
    <defs>
      <linearGradient id="nxt-g1" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="white"/><stop offset="1" stopColor="white" stopOpacity="0"/>
      </linearGradient>
      <linearGradient id="nxt-g2" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
        <stop stopColor="white"/><stop offset="1" stopColor="white" stopOpacity="0"/>
      </linearGradient>
    </defs>
  </svg>
);
const SupabaseLogo = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 109 113" width="109" height="113" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    <path d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874l-43.151 54.347Z" fill="url(#sb-a)"/>
    <path d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874l-43.151 54.347Z" fill="url(#sb-b)" fillOpacity=".2"/>
    <path d="M45.317 2.071c2.86-3.601 8.657-1.628 8.726 2.97l.442 67.251H9.83c-8.19 0-12.759-9.46-7.665-15.875L45.317 2.072Z" fill="#3ECF8E"/>
    <defs>
      <linearGradient id="sb-a" x1="53.974" y1="54.974" x2="94.163" y2="71.829" gradientUnits="userSpaceOnUse">
        <stop stopColor="#249361"/><stop offset="1" stopColor="#3ECF8E"/>
      </linearGradient>
      <linearGradient id="sb-b" x1="36.156" y1="30.578" x2="54.484" y2="65.081" gradientUnits="userSpaceOnUse">
        <stop/><stop offset="1" stopOpacity="0"/>
      </linearGradient>
    </defs>
  </svg>
);
const TypeScriptLogo = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 256" width="256" height="256" xmlns="http://www.w3.org/2000/svg" {...p}>
    <path d="M20 0h216c11.046 0 20 8.954 20 20v216c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20V20C0 8.954 8.954 0 20 0Z" fill="#3178C6"/>
    <path d="M150.518 200.475v27.62c4.492 2.302 9.805 4.028 15.938 5.179 6.133 1.151 12.597 1.726 19.393 1.726 6.622 0 12.914-.633 18.874-1.899 5.96-1.266 11.187-3.352 15.678-6.257 4.492-2.906 8.048-6.704 10.669-11.394 2.62-4.689 3.93-10.486 3.93-17.391 0-5.006-.749-9.394-2.246-13.163a30.748 30.748 0 0 0-6.479-10.055c-2.821-2.935-6.205-5.567-10.149-7.898-3.945-2.33-8.394-4.531-13.347-6.602-3.628-1.497-6.881-2.949-9.761-4.359-2.879-1.41-5.327-2.848-7.342-4.316-2.016-1.467-3.571-3.021-4.665-4.661-1.094-1.64-1.641-3.495-1.641-5.567 0-1.899.489-3.61 1.468-5.135s2.362-2.834 4.147-3.927c1.785-1.094 3.973-1.942 6.565-2.547 2.591-.604 5.471-.906 8.638-.906 2.304 0 4.737.173 7.299.518 2.563.345 5.14.877 7.732 1.597a53.669 53.669 0 0 1 7.558 2.719 41.7 41.7 0 0 1 6.781 3.797v-25.807c-4.204-1.611-8.797-2.805-13.778-3.582-4.981-.777-10.697-1.165-17.147-1.165-6.565 0-12.784.705-18.658 2.115-5.874 1.409-11.043 3.61-15.506 6.602-4.463 2.993-7.99 6.805-10.582 11.437-2.591 4.632-3.887 10.17-3.887 16.615 0 8.228 2.375 15.248 7.127 21.06 4.751 5.811 11.963 10.731 21.638 14.759a291.458 291.458 0 0 1 10.625 4.575c3.283 1.496 6.119 3.049 8.509 4.66 2.39 1.611 4.276 3.366 5.658 5.265 1.382 1.899 2.073 4.057 2.073 6.474a9.901 9.901 0 0 1-1.296 4.963c-.863 1.524-2.174 2.848-3.93 3.97-1.756 1.122-3.945 1.999-6.565 2.632-2.62.633-5.687.95-9.2.95-5.989 0-11.92-1.05-17.794-3.151-5.875-2.1-11.317-5.25-16.327-9.451Zm-46.036-68.733H140V109H41v22.742h35.345V233h28.137V131.742Z" fill="#FFF"/>
  </svg>
);
const TailwindLogo = (p: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 54 33" {...p}>
    <path fill="#38bdf8" fillRule="evenodd" d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z" clipRule="evenodd"/>
  </svg>
);
const StripeLogo = (p: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="214" viewBox="0 0 512 214" {...p}>
    <path fill="#635BFF" d="M512 110.08c0-36.409-17.636-65.138-51.342-65.138c-33.85 0-54.33 28.73-54.33 64.854c0 42.808 24.179 64.426 58.88 64.426c16.925 0 29.725-3.84 39.396-9.244v-28.445c-9.67 4.836-20.764 7.823-34.844 7.823c-13.796 0-26.027-4.836-27.591-21.618h69.547c0-1.85.284-9.245.284-12.658m-70.258-13.511c0-16.071 9.814-22.756 18.774-22.756c8.675 0 17.92 6.685 17.92 22.756zm-90.31-51.627c-13.939 0-22.899 6.542-27.876 11.094l-1.85-8.818h-31.288v165.83l35.555-7.537l.143-40.249c5.12 3.698 12.657 8.96 25.173 8.96c25.458 0 48.64-20.48 48.64-65.564c-.142-41.245-23.609-63.716-48.498-63.716m-8.534 97.991c-8.391 0-13.37-2.986-16.782-6.684l-.143-52.765c3.698-4.124 8.818-6.968 16.925-6.968c12.942 0 21.902 14.506 21.902 33.137c0 19.058-8.818 33.28-21.902 33.28M241.493 36.551l35.698-7.68V0l-35.698 7.538zm0 10.809h35.698v124.444h-35.698zm-38.257 10.524L200.96 47.36h-30.72v124.444h35.556V87.467c8.39-10.951 22.613-8.96 27.022-7.396V47.36c-4.551-1.707-21.191-4.836-29.582 10.524m-71.112-41.386l-34.702 7.395l-.142 113.92c0 21.05 15.787 36.551 36.836 36.551c11.662 0 20.195-2.133 24.888-4.693V140.8c-4.55 1.849-27.022 8.391-27.022-12.658V77.653h27.022V47.36h-27.022zM35.982 83.484c0-5.546 4.551-7.68 12.09-7.68c10.808 0 24.461 3.272 35.27 9.103V51.484c-11.804-4.693-23.466-6.542-35.27-6.542C19.2 44.942 0 60.018 0 85.192c0 39.252 54.044 32.995 54.044 49.92c0 6.541-5.688 8.675-13.653 8.675c-11.804 0-26.88-4.836-38.827-11.378v33.849c13.227 5.689 26.596 8.106 38.827 8.106c29.582 0 49.92-14.648 49.92-40.106c-.142-42.382-54.329-34.845-54.329-50.774"/>
  </svg>
);

const CLIENT_LOGOS = [
  { name: "OpenAI",      id: 1,  img: OpenAILogo     },
  { name: "Claude",      id: 2,  img: ClaudeLogo      },
  { name: "Next.js",     id: 3,  img: NextjsLogo      },
  { name: "Vercel",      id: 4,  img: VercelLogo      },
  { name: "Supabase",    id: 5,  img: SupabaseLogo    },
  { name: "TypeScript",  id: 6,  img: TypeScriptLogo  },
  { name: "Tailwind",    id: 7,  img: TailwindLogo    },
  { name: "Stripe",      id: 8,  img: StripeLogo      },
];

/* ─── iPHONE FRAME ──────────────────────────────────────── */
const IPhoneFrame = ({ children, width = 280 }: { children: React.ReactNode; width?: number }) => {
  const h = Math.round(width * (844 / 390)); // proporción real iPhone
  const r = Math.round(width * 0.138);       // border-radius proporcional (~54px en 390)
  const cam = Math.round(width * 0.282);     // ancho Dynamic Island (~110px en 390)
  return (
    <div style={{
      position:"relative",
      width,
      height:h,
      borderRadius:r,
      background:"linear-gradient(145deg,#2c2c2e 0%,#1c1c1e 50%,#111 100%)",
      padding:3,
      boxShadow:[
        "0 0 0 1px rgba(255,255,255,.10)",
        "0 0 0 2px rgba(0,0,0,.8)",
        "inset 0 1px 0 rgba(255,255,255,.14)",
        "0 40px 80px rgba(0,0,0,.65)",
        "0 16px 32px rgba(208,0,0,.10)",
      ].join(","),
      flexShrink:0,
    }}>
      {/* Titanio highlight */}
      <div style={{position:"absolute",inset:0,borderRadius:r,background:"linear-gradient(130deg,rgba(255,255,255,.13) 0%,transparent 38%,transparent 62%,rgba(255,255,255,.05) 100%)",pointerEvents:"none",zIndex:20}}/>
      {/* Botón silencio */}
      <div style={{position:"absolute",left:-3,top:Math.round(h*.135),width:3,height:Math.round(h*.042),borderRadius:"3px 0 0 3px",background:"linear-gradient(180deg,#3a3a3c,#2c2c2e)"}}/>
      {/* Botón volumen ↑ */}
      <div style={{position:"absolute",left:-3,top:Math.round(h*.205),width:3,height:Math.round(h*.074),borderRadius:"3px 0 0 3px",background:"linear-gradient(180deg,#3a3a3c,#2c2c2e)"}}/>
      {/* Botón volumen ↓ */}
      <div style={{position:"absolute",left:-3,top:Math.round(h*.292),width:3,height:Math.round(h*.074),borderRadius:"3px 0 0 3px",background:"linear-gradient(180deg,#3a3a3c,#2c2c2e)"}}/>
      {/* Botón encendido */}
      <div style={{position:"absolute",right:-3,top:Math.round(h*.205),width:3,height:Math.round(h*.104),borderRadius:"0 3px 3px 0",background:"linear-gradient(180deg,#3a3a3c,#2c2c2e)"}}/>
      {/* Pantalla */}
      <div style={{borderRadius:r-3,overflow:"hidden",width:"100%",height:"100%",position:"relative",background:"#fff"}}>
        {/* Dynamic Island — solo la píldora, sin íconos */}
        <div style={{
          position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",
          width:cam,height:Math.round(width*.077),
          background:"#000",borderRadius:999,
          zIndex:10,
          boxShadow:"0 0 0 1px rgba(255,255,255,.06), 0 2px 8px rgba(0,0,0,.6)",
        }}/>
        {/* Contenido */}
        <div style={{paddingTop:Math.round(width*.077)+20,height:"100%",boxSizing:"border-box",display:"flex",flexDirection:"column"}}>
          {children}
        </div>
        {/* Home indicator */}
        <div style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",width:Math.round(width*.308),height:5,background:"rgba(0,0,0,.18)",borderRadius:3}}/>
      </div>
    </div>
  );
};

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
    <div style={{display:"flex",justifyContent:"center",margin:"0 auto"}}>
      <IPhoneFrame width={290}>
        {/* App bar */}
        <div style={{background:C.purple,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <Logo size={32}/>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:600,color:"#fff"}}>{CH_NAME[tab]}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.65)"}}>en línea</div>
          </div>
          <div style={{background:"rgba(255,255,255,.2)",color:"#fff",fontSize:8,fontWeight:700,letterSpacing:".08em",padding:"2px 8px",borderRadius:999,textTransform:"uppercase"}}>en vivo</div>
        </div>
        {/* Messages */}
        <div style={{background:C.wa,padding:12,flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8}}>
          <div style={{textAlign:"center",fontSize:9,color:C.textMut,background:"rgba(0,0,0,.06)",borderRadius:8,padding:"2px 10px",alignSelf:"center",marginBottom:4}}>Hoy</div>
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
        {/* Input */}
        <div style={{background:"#fff",padding:"8px 12px",display:"flex",alignItems:"center",gap:8,borderTop:`1px solid ${C.border}`,flexShrink:0}}>
          <div style={{flex:1,background:C.bgCream,borderRadius:20,padding:"7px 14px",fontSize:11,color:C.textMut}}>Escribe un mensaje...</div>
          <div style={{width:30,height:30,borderRadius:"50%",background:C.purple,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontSize:12,color:"#fff"}}>↑</span>
          </div>
        </div>
      </IPhoneFrame>
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
  const [serviceArea, setServiceArea] = useState<Area | 'todos'>('todos');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

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
          <div className="hero-phone-col" style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
            <IPhoneFrame width={270}>
              {/* App bar */}
              <div style={{background:C.purple,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                <Logo size={30}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#fff"}}>Red42</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>en línea</div>
                </div>
                <div style={{background:"rgba(255,255,255,.2)",color:"#fff",fontSize:8,fontWeight:700,padding:"2px 7px",borderRadius:999,textTransform:"uppercase"}}>LIVE</div>
              </div>
              {/* Chat */}
              <div style={{background:C.wa,padding:10,display:"flex",flexDirection:"column",gap:7,flex:1,overflowY:"hidden"}}>
                {[
                  {r:false,t:"Hola, quiero automatizar nuestro proceso de ventas con IA."},
                  {r:true, t:<>Perfecto. Te preparo una propuesta en <strong style={{color:"#FF9999"}}>24 horas</strong>.</>},
                  {r:false,t:"Queremos reducir el tiempo en tareas repetitivas."},
                  {r:true, t:<>✅ Nuestros clientes ahorran <strong style={{color:"#FF9999"}}>-60% de tiempo</strong> en 2 semanas.</>},
                ].map((m,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:m.r?"flex-end":"flex-start"}}>
                    <div style={{background:m.r?C.waBotBg:C.waCliBg,borderRadius:m.r?"13px 13px 3px 13px":"13px 13px 13px 3px",padding:"7px 10px",fontSize:10,color:m.r?"#fff":C.waCliTx,maxWidth:"82%",boxShadow:m.r?"none":"0 1px 3px rgba(0,0,0,.07)",lineHeight:1.45}}>{m.t}</div>
                  </div>
                ))}
                <div style={{background:C.bgCard,borderRadius:10,padding:"8px 10px",border:`1px solid ${C.border}`,marginTop:2}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span style={{fontSize:9,fontWeight:600,color:C.text}}>Propuesta · IA</span>
                    <span style={{background:C.purpleL,color:C.purple,fontSize:7,fontWeight:700,padding:"1px 5px",borderRadius:999}}>IA</span>
                  </div>
                  {[{n:"Automatización",v:"12 h/sem"},{n:"Agente IA",v:"24/7"},{n:"Dashboard",v:"Tiempo real"}].map((r,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderTop:i>0?`1px solid ${C.border}`:"none"}}>
                      <span style={{fontSize:9,color:C.text}}>{r.n}</span>
                      <span style={{fontSize:9,fontWeight:600,color:C.purple}}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Input */}
              <div style={{background:"#fff",padding:"7px 10px",display:"flex",alignItems:"center",gap:7,borderTop:`1px solid ${C.border}`,flexShrink:0}}>
                <div style={{flex:1,background:C.bgCream,borderRadius:20,padding:"5px 10px",fontSize:9,color:C.textMut}}>Escribe un mensaje...</div>
                <div style={{width:24,height:24,borderRadius:"50%",background:C.purple,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:10,color:"#fff"}}>↑</span>
                </div>
              </div>
            </IPhoneFrame>
          </div>
        </div>
      </section>

      {/* CLIENTES */}
      <section style={{padding:"48px 6%",borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,background:C.bgCard}}>
        <div style={{maxWidth:900,margin:"0 auto",textAlign:"center"}}>
          <GradientHeading variant="secondary" size="xs" as="p" className="uppercase tracking-widest mb-2">
            Stack y ecosistema de confianza
          </GradientHeading>
          <GradientHeading variant="default" size="lg" as="h3" className="mb-8">
            Las mejores empresas ya están aquí
          </GradientHeading>
          <LogoCarousel columnCount={4} logos={CLIENT_LOGOS}/>
        </div>
      </section>

      {/* AUTOMATIZACIONES */}
      <section className="section-pad" style={{padding:"80px 6%",background:C.bg,borderTop:`1px solid ${C.border}`}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <p style={{fontSize:10,fontWeight:600,letterSpacing:".18em",textTransform:"uppercase",color:C.purple,marginBottom:12,textAlign:"center"}}>automatizaciones</p>
          <h2 className="section-h2-lg" style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:38,color:C.text,textAlign:"center",marginBottom:10}}>
            Procesos que eliminamos de tu día a día
          </h2>
          <p style={{fontSize:15,color:C.textMid,textAlign:"center",maxWidth:620,margin:"0 auto 36px",lineHeight:1.7}}>
            Cada automatización tiene una entrada, un proceso IA y una salida medible. Haz clic en cualquiera para ver el flujo completo.
          </p>

          {/* Tabs por área */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center",marginBottom:36}}>
            {(['todos', 'admin', 'ventas', 'atencion', 'interno'] as const).map(a => (
              <button
                key={a}
                onClick={() => setServiceArea(a)}
                style={{padding:"8px 18px",borderRadius:999,border: serviceArea===a ? "none" : `1.5px solid ${C.borderM}`,background: serviceArea===a ? C.purple : "transparent",color: serviceArea===a ? "#fff" : C.textMid,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}
              >
                {a === 'todos' ? 'Todos' : AREA_LABELS[a]}
              </button>
            ))}
          </div>

          {/* Cards grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
            {SERVICES.filter(s => serviceArea === 'todos' || s.area === serviceArea).map(s => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedService(s)}
                  style={{background:C.bgCard,border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.purple}`,borderRadius:14,padding:"18px 16px",cursor:"pointer",transition:"all .2s",display:"flex",flexDirection:"column",gap:10}}
                  onMouseEnter={e=>(e.currentTarget.style.boxShadow="0 6px 24px rgba(208,0,0,.12)",e.currentTarget.style.transform="translateY(-2px)")}
                  onMouseLeave={e=>(e.currentTarget.style.boxShadow="none",e.currentTarget.style.transform="translateY(0)")}
                >
                  <div style={{width:34,height:34,borderRadius:8,background:C.purpleL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon size={18} color={C.purple}/>
                  </div>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:C.text,lineHeight:1.35,marginBottom:5}}>{s.title}</div>
                    <div style={{fontSize:12,color:C.textMut,lineHeight:1.5}}>{s.short}</div>
                  </div>
                  <div style={{marginTop:"auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontSize:11,background:C.purpleL,color:C.purple,borderRadius:999,padding:"2px 10px",fontWeight:600}}>{s.saving}</span>
                    <span style={{fontSize:11,color:C.textMut}}>Ver flujo →</span>
                  </div>
                </div>
              );
            })}
          </div>
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

      {/* SERVICE MODAL */}
      {selectedService && <ServiceModal service={selectedService} onClose={() => setSelectedService(null)}/>}

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
