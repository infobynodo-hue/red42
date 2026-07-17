"use client";

import * as React from "react";

interface BentoGridShowcaseProps {
  integration: React.ReactNode;
  trackers: React.ReactNode;
  statistic: React.ReactNode;
  focus: React.ReactNode;
  productivity: React.ReactNode;
  shortcuts: React.ReactNode;
}

export const BentoGridShowcase = ({
  integration, trackers, statistic, focus, productivity, shortcuts,
}: BentoGridShowcaseProps) => {
  return (
    <div className="bento-grid">
      <div className="bento-cell-1"><div style={{ flex: 1 }}>{integration}</div></div>
      <div className="bento-cell-2"><div style={{ flex: 1 }}>{trackers}</div></div>
      <div className="bento-cell-3"><div style={{ flex: 1 }}>{statistic}</div></div>
      <div className="bento-cell-4"><div style={{ flex: 1 }}>{focus}</div></div>
      <div className="bento-cell-5"><div style={{ flex: 1 }}>{productivity}</div></div>
      <div className="bento-cell-6"><div style={{ flex: 1 }}>{shortcuts}</div></div>
    </div>
  );
};
