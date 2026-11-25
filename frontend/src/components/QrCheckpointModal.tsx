import React, { useEffect, useRef, useState } from 'react';
import { QrCode, X } from 'lucide-react';
import { BuildingDataset, Language, Place } from '../types/navigation';
import { FLOOR_FULL_LABELS, UI_TRANSLATIONS } from '../data/translations';

interface QrCheckpointModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: BuildingDataset;
  language: Language;
  onSelectCheckpoint: (place: Place) => void;
}

export const QrCheckpointModal: React.FC<QrCheckpointModalProps> = ({
  isOpen,
  onClose,
  dataset,
  language,
  onSelectCheckpoint,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [scanningId, setScanningId] = useState<string | null>(null);
  const scanTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (scanTimerRef.current !== null) {
        window.clearTimeout(scanTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const checkpoints = dataset.places.filter((place) => place.isQRCheckpoint);

  const handleSimulateScan = (place: Place) => {
    setScanningId(place.id);
    if (scanTimerRef.current !== null) {
      window.clearTimeout(scanTimerRef.current);
    }
    scanTimerRef.current = window.setTimeout(() => {
      setScanningId(null);
      onSelectCheckpoint(place);
      onClose();
    }, 350);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.qrModalTitle}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-white rounded-3xl border border-brand-borderWarm shadow-2xl overflow-hidden">
        <div className="px-6 py-4 bg-brand-creambg border-b border-brand-borderWarm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-maroon/10 text-brand-maroon flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-heading text-lg font-bold text-neutral-950">
                {t.qrModalTitle}
              </h3>
              <p className="text-xs text-neutral-600">{dataset.name[language]}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="w-8 h-8 rounded-full hover:bg-neutral-200/70 flex items-center justify-center text-neutral-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-neutral-700">{t.qrModalSubtitle}</p>

          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            {checkpoints.map((checkpoint) => {
              const isScanning = scanningId === checkpoint.id;
              return (
                <div
                  key={checkpoint.id}
                  className="p-3.5 rounded-2xl border border-brand-borderWarm bg-brand-cream hover:border-brand-maroon/40 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-white border border-brand-borderWarm flex items-center justify-center text-neutral-900 shrink-0">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-neutral-950 truncate">
                        {checkpoint.name[language]}
                      </p>
                      <p className="text-xs text-neutral-600 truncate">
                        {FLOOR_FULL_LABELS[checkpoint.floor][language]} ·{' '}
                        <span className="font-mono text-[11px]">{checkpoint.qrCode}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSimulateScan(checkpoint)}
                    disabled={isScanning}
                    className="shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold text-white bg-brand-maroon hover:bg-brand-maroonHover transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {isScanning ? '...' : t.simulateScan}
                  </button>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-xl p-3">
            {t.qrPrototypeNote}
          </p>
        </div>
      </div>
    </div>
  );
};
