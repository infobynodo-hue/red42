"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({ timelineData }: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => { newState[parseInt(key)] = false; });
      newState[id] = !prev[id];
      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const relatedItems = getRelatedItems(id);
        const newPulse: Record<number, boolean> = {};
        relatedItems.forEach((relId) => { newPulse[relId] = true; });
        setPulseEffect(newPulse);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return newState;
    });
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (autoRotate) {
      timer = setInterval(() => {
        setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)));
      }, 50);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [autoRotate]);

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 200;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const item = timelineData.find((i) => i.id === itemId);
    return item ? item.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const getStatusLabel = (status: TimelineItem["status"]) => {
    if (status === "completed") return "Activo";
    if (status === "in-progress") return "En marcha";
    return "Disponible";
  };

  const getStatusStyles = (status: TimelineItem["status"]) => {
    if (status === "completed") return "text-white bg-[#D00000] border-[#D00000]";
    if (status === "in-progress") return "text-[#D00000] bg-white border-[#D00000]";
    return "text-white/70 bg-white/10 border-white/20";
  };

  return (
    <div
      className="w-full flex items-center justify-center overflow-hidden"
      style={{ height: 520, background: "transparent" }}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div className="absolute w-full h-full flex items-center justify-center" ref={orbitRef}>

          {/* Centro — logo Red42 */}
          <div className="absolute flex items-center justify-center z-10" style={{ width: 72, height: 72 }}>
            {/* Ping rings */}
            <div className="absolute rounded-full animate-ping" style={{ width: 90, height: 90, border: "1.5px solid rgba(0,229,160,.45)", opacity: 0.55 }} />
            <div className="absolute rounded-full animate-ping" style={{ width: 112, height: 112, border: "1.5px solid rgba(208,0,0,.35)", opacity: 0.3, animationDelay: "0.7s" }} />
            {/* Nodo central */}
            <div className="rounded-full flex items-center justify-center" style={{ width: 72, height: 72, background: "linear-gradient(135deg,#D00000,#FF2222)", boxShadow: "0 0 28px rgba(208,0,0,.55)" }}>
              <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <path
                  d="M10 8h7a4 4 0 0 1 0 8h-7M17 16l5 8"
                  stroke="white"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <circle cx="23" cy="9" r="3" fill="#00E5A0" />
              </svg>
            </div>
          </div>

          {/* Órbita */}
          <div className="absolute rounded-full" style={{ width: 400, height: 400, border: "1px solid rgba(208,0,0,.18)" }} />

          {timelineData.map((item, index) => {
            const pos = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                  zIndex: isExpanded ? 200 : pos.zIndex,
                  opacity: isExpanded ? 1 : pos.opacity,
                }}
                onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
              >
                {/* Halo */}
                <div
                  className={`absolute rounded-full ${isPulsing ? "animate-pulse" : ""}`}
                  style={{
                    background: "radial-gradient(circle, rgba(208,0,0,.22) 0%, transparent 70%)",
                    width: item.energy * 0.4 + 40,
                    height: item.energy * 0.4 + 40,
                    left: -(item.energy * 0.4 + 40 - 40) / 2,
                    top: -(item.energy * 0.4 + 40 - 40) / 2,
                  }}
                />

                {/* Nodo */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isExpanded ? "scale-150" : ""}`}
                  style={{
                    background: isExpanded ? "#D00000" : isRelated ? "rgba(208,0,0,.55)" : "rgba(208,0,0,.28)",
                    borderColor: isExpanded ? "#00E5A0" : isRelated ? "#FF9999" : "#FF4444",
                    boxShadow: isExpanded ? "0 0 20px rgba(208,0,0,.65)" : isRelated ? "0 0 10px rgba(255,100,100,.3)" : "0 0 8px rgba(208,0,0,.2)",
                  }}
                >
                  <Icon size={16} color="#ffffff" />
                </div>

                {/* Label */}
                <div
                  className="absolute whitespace-nowrap text-xs font-bold tracking-wide transition-all duration-300"
                  style={{
                    top: 46,
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: "#ffffff",
                    textShadow: "0 1px 6px rgba(0,0,0,.9)",
                    scale: isExpanded ? "1.15" : "1",
                  }}
                >
                  {item.title}
                </div>

                {/* Card expandida */}
                {isExpanded && (
                  <Card
                    className="absolute w-64 overflow-visible"
                    style={{
                      top: 72,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(10,10,10,.96)",
                      border: "1px solid rgba(208,0,0,.35)",
                      backdropFilter: "blur(16px)",
                      boxShadow: "0 8px 32px rgba(208,0,0,.2)",
                    }}
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3" style={{ background: "rgba(208,0,0,.5)" }} />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge className={`px-2 text-xs ${getStatusStyles(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm mt-2 text-white">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs" style={{ color: "rgba(255,200,200,.85)" }}>
                      <p>{item.content}</p>
                      <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(208,0,0,.2)" }}>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="flex items-center gap-1" style={{ color: "rgba(255,255,255,.6)" }}>
                            <Zap size={10} /> Impacto
                          </span>
                          <span style={{ color: "#FF9999", fontFamily: "monospace" }}>{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(208,0,0,.2)" }}>
                          <div className="h-full rounded-full" style={{ width: `${item.energy}%`, background: "linear-gradient(to right, #D00000, #FF9999)" }} />
                        </div>
                      </div>
                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3" style={{ borderTop: "1px solid rgba(208,0,0,.2)" }}>
                          <div className="flex items-center mb-2 gap-1" style={{ color: "rgba(255,200,200,.7)" }}>
                            <Link size={10} />
                            <span className="text-xs uppercase tracking-wider">Relacionado con</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relId) => {
                              const rel = timelineData.find((i) => i.id === relId);
                              return (
                                <Button
                                  key={relId}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center h-6 px-2 py-0 text-xs rounded-md"
                                  style={{ border: "1px solid rgba(208,0,0,.4)", background: "transparent", color: "rgba(255,200,200,.8)" }}
                                  onClick={(e) => { e.stopPropagation(); toggleItem(relId); }}
                                >
                                  {rel?.title}
                                  <ArrowRight size={8} className="ml-1" style={{ color: "rgba(255,150,150,.6)" }} />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
