"use client";
import { forwardRef, useImperativeHandle, useEffect, useState } from "react";

interface RoleCardTemplateProps {
  roleId: number;
  employer: string;
  onTextureReady: (dataUrl: string) => void;
}

export interface RoleCardTemplateRef {
  captureTexture: () => Promise<void>;
}

const CANVAS_SIZE = 1376;

const RoleCardTemplate = forwardRef<RoleCardTemplateRef, RoleCardTemplateProps>(
  ({ roleId, employer, onTextureReady }, ref) => {
    const [ready, setReady] = useState(false);

    useEffect(() => { setReady(true) }, []);

    const captureTexture = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.04;
      for (let i = -CANVAS_SIZE; i < CANVAS_SIZE * 2; i += 60) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + CANVAS_SIZE, CANVAS_SIZE); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i - CANVAS_SIZE, CANVAS_SIZE); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      const cx = CANVAS_SIZE / 2;
      const cy = CANVAS_SIZE / 2;
      const er = 120;

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(cx - 320, cy - 80);
      ctx.quadraticCurveTo(cx, cy - 320, cx + 320, cy - 80);
      ctx.quadraticCurveTo(cx, cy + 160, cx - 320, cy - 80);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy - 80, er, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy - 80, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx - 260, cy + 180); ctx.lineTo(cx + 260, cy + 180); ctx.stroke();
      ctx.globalAlpha = 0.22;
      ctx.beginPath(); ctx.moveTo(cx - 200, cy + 230); ctx.lineTo(cx + 200, cy + 230); ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.fillStyle = "#ffffff";
      ctx.font = `bold 120px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`ROLE #${roleId}`, cx, cy + 420);

      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = `48px monospace`;
      ctx.fillText(employer ? `${employer.slice(0,10)}...${employer.slice(-6)}` : "···", cx, cy + 580);

      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.font = `40px monospace`;
      ctx.fillText("BLINDHIRE", cx, cy - 480);

      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.font = `32px monospace`;
      ctx.fillText("REQUIREMENTS ENCRYPTED", cx, cy + 680);

      const dataUrl = canvas.toDataURL("image/png");
      onTextureReady(dataUrl);
    };

    useImperativeHandle(ref, () => ({ captureTexture }));
    return null;
  }
);

RoleCardTemplate.displayName = "RoleCardTemplate";
export default RoleCardTemplate;
