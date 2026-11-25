import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, MapPin, ShieldAlert, X } from 'lucide-react';
import { BuildingDataset, Language, Place } from '../types/navigation';
import { FLOOR_FULL_LABELS, UI_TRANSLATIONS } from '../data/translations';

type SosAssistanceType = 'general' | 'wheelchair' | 'medical' | 'blocked';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: BuildingDataset;
  language: Language;
  currentPlace: Place | null;
  wheelchairMode: boolean;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose,
  dataset,
  language,
  currentPlace,
  wheelchairMode,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [assistanceType, setAssistanceType] = useState<SosAssistanceType>(
    wheelchairMode ? 'wheelchair' : 'general'
  );
  const [notes, setNotes] = useState('');
  const [ticketId, setTicketId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAssistanceType(wheelchairMode ? 'wheelchair' : 'general');
    }
  }, [isOpen, wheelchairMode]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTicketId(null);
        setNotes('');
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const randomCode = `DEMO-SOS-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(randomCode);
  };

  const handleClose = () => {
    setTicketId(null);
    setNotes('');
    onClose();
  };

  const assistanceOptions: ReadonlyArray<readonly [SosAssistanceType, string]> = [
    ['general', t.sosNeedGeneral],
    ['wheelchair', t.sosNeedWheelchair],
    ['medical', t.sosNeedMedical],
    ['blocked', t.sosNeedBlocked],
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.sosModalTitle}
      onClick={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-lg bg-white rounded-3xl border border-red-200 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 bg-red-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-serif-heading text-lg font-bold">{t.sosModalTitle}</h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label={t.close}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">{t.sosModalDisclaimer}</p>
          </div>

          {ticketId ? (
            <div className="py-4 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-serif-heading text-xl font-bold text-neutral-950">
                {t.sosSubmittedTitle}
              </h4>
              <p className="text-sm text-neutral-600">{t.sosSubmittedDesc}</p>
              <div className="inline-block px-4 py-2 rounded-xl bg-brand-creambg border border-brand-borderWarm text-xs">
                <span className="text-neutral-500">{t.sosTicketLabel}: </span>
                <strong className="font-mono text-neutral-950">{ticketId}</strong>
              </div>
              <div className="text-xs text-neutral-600">
                {dataset.name[language]} ·{' '}
                {currentPlace
                  ? `${currentPlace.name[language]} (${currentPlace.floor})`
                  : t.notSet}
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 cursor-pointer"
                >
                  {t.close}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-brand-creambg border border-brand-borderWarm flex items-center gap-2.5 text-xs text-neutral-700">
                <MapPin className="w-4 h-4 text-brand-maroon shrink-0" />
                <span>
                  {t.currentLocation}:{' '}
                  <strong className="text-neutral-950">
                    {currentPlace
                      ? `${currentPlace.name[language]} (${FLOOR_FULL_LABELS[currentPlace.floor][language]})`
                      : t.notSet}
                  </strong>
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-2">
                  {t.sosNeedType}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {assistanceOptions.map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAssistanceType(value)}
                      className={`p-3 rounded-xl text-left text-xs font-medium border transition-colors cursor-pointer ${
                        assistanceType === value
                          ? 'bg-red-50 border-red-600 text-red-900 font-semibold'
                          : 'bg-white border-brand-borderWarm text-neutral-700 hover:bg-brand-creambg'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder={t.sosNotesPlaceholder}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-brand-creambg border border-brand-borderWarm focus:outline-none focus:ring-2 focus:ring-red-500/40 text-neutral-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-red-700 hover:bg-red-800 shadow cursor-pointer"
                >
                  {t.sosSubmit}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
