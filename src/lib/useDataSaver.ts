import { useEffect, useState } from "react";

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
}

function readConnection(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  return conn.effectiveType === "2g" || conn.effectiveType === "slow-2g";
}

/**
 * Liefert true, wenn der Nutzer Datensparmodus aktiviert hat oder eine
 * sehr langsame Verbindung meldet (2g/slow-2g). Unabhaengig von
 * useReducedMotion: reine Ruecksicht auf Datenvolumen, nicht auf
 * Bewegungspraeferenz. Wo verfuegbar reagiert der Hook live auf
 * Verbindungswechsel; die Network Information API ist nicht in allen
 * Browsern implementiert, dann bleibt der Rueckgabewert stabil false.
 */
export function useDataSaver(): boolean {
  const [saveData, setSaveData] = useState(readConnection);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
    if (!conn?.addEventListener) return;
    const onChange = () => setSaveData(readConnection());
    conn.addEventListener("change", onChange);
    return () => conn.removeEventListener?.("change", onChange);
  }, []);

  return saveData;
}
