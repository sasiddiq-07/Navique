import React, { useEffect, useRef, useState } from 'react';
import { Bot, Compass, Navigation, Send, ShieldAlert, X } from 'lucide-react';
import {
  AssistantMessage,
  BuildingDataset,
  EmergencyScenario,
  Language,
  Place,
} from '../types/navigation';
import { UI_TRANSLATIONS } from '../data/translations';
import { askNavigationAssistant } from '../services/assistantClient';

interface AIAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: BuildingDataset;
  language: Language;
  currentPlace: Place | null;
  wheelchairMode: boolean;
  emergencyMode: boolean;
  activeScenario: EmergencyScenario | null;
  onFocusPlace: (placeId: string, startNav: boolean) => void;
  onTriggerSafeExit: () => void;
}

const SAMPLE_PROMPTS: Record<'mall' | 'hospital', Record<Language, string[]>> = {
  mall: {
    en: [
      'Where is the pharmacy?',
      'How do I reach the Food Court?',
      'Where are the nearest restrooms?',
      'How can I reach Apple Store?',
      'Where is the nearest emergency exit?',
    ],
    te: [
      'ఫార్మసీ ఎక్కడ ఉంది?',
      'ఫుడ్ కోర్ట్ కు ఎలా వెళ్ళాలి?',
      'సమీప రెస్ట్‌రూమ్‌లు ఎక్కడ ఉన్నాయి?',
      'ఆపిల్ స్టోర్ ఏ అంతస్తులో ఉంది?',
      'సమీప అత్యవసర నిష్క్రమణ ఎక్కడ ఉంది?',
    ],
    hi: [
      'फार्मेसी कहाँ है?',
      'फूड कोर्ट कैसे पहुँचें?',
      'निकटतम शौचालय कहाँ हैं?',
      'एप्पल स्टोर किस मंजिल पर है?',
      'निकटतम आपातकालीन निकास कहाँ है?',
    ],
  },
  hospital: {
    en: [
      'Where is the pharmacy?',
      'Which floor has Cardiology?',
      'How do I reach MRI Scan?',
      'Where is the nearest lift?',
      'Where is the nearest emergency exit?',
    ],
    te: [
      'ఫార్మసీ ఎక్కడ ఉంది?',
      'కార్డియాలజీ ఏ అంతస్తులో ఉంది?',
      'ఎంఆర్ఐ స్కాన్ కు ఎలా వెళ్ళాలి?',
      'సమీప లిఫ్ట్ ఎక్కడ ఉంది?',
      'సమీప అత్యవసర నిష్క్రమణ ఎక్కడ ఉంది?',
    ],
    hi: [
      'फार्मेसी कहाँ है?',
      'कार्डियोलॉजी किस मंजिल पर है?',
      'एमआरआई स्कैन कैसे पहुँचें?',
      'निकटतम लिफ्ट कहाँ है?',
      'निकटतम आपातकालीन निकास कहाँ है?',
    ],
  },
};

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  isOpen,
  onClose,
  dataset,
  language,
  currentPlace,
  wheelchairMode,
  emergencyMode,
  activeScenario,
  onFocusPlace,
  onTriggerSafeExit,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset welcome message when building or language changes
  useEffect(() => {
    const welcomeText = dataset.id === 'mall' ? t.aiWelcomeMall : t.aiWelcomeHospital;
    setMessages([
      {
        id: `welcome-${dataset.id}-${language}`,
        role: 'assistant',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [dataset.id, language, t.aiWelcomeHospital, t.aiWelcomeMall]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sendQuestion = async (rawQuestion: string) => {
    const question = rawQuestion.trim();
    if (!question || loading) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const response = await askNavigationAssistant({
      question,
      dataset,
      language,
      currentPlace,
      wheelchairMode,
      emergencyMode,
      activeScenario,
    });

    const botMsg: AssistantMessage = {
      id: `bot-${Date.now()}`,
      role: 'assistant',
      text: response.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedPlaceId: response.targetPlaceId,
      suggestedEmergencyExit: response.suggestEmergencyExit,
    };

    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  const quickPrompts = SAMPLE_PROMPTS[dataset.id][language];

  return (
    <div
      className="fixed bottom-14 right-4 sm:right-20 z-50 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[80vh] bg-white rounded-3xl border border-brand-borderWarm shadow-2xl flex flex-col overflow-hidden"
      role="dialog"
      aria-label={t.aiAssistantTitle}
    >
      {/* Header */}
      <div
        className={`px-5 py-4 flex items-center justify-between gap-3 text-white ${
          emergencyMode ? 'bg-red-800' : 'bg-brand-maroon'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="font-serif-heading text-base font-bold leading-tight truncate">
              {t.aiAssistantTitle}
            </h3>
            <p className="text-[11px] text-white/80 truncate">{dataset.name[language]}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Active Preference Context Strip */}
      <div className="px-4 py-2 bg-brand-creambg border-b border-brand-borderWarm text-[11px] text-neutral-600 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>
          {t.currentLocation}:{' '}
          <strong className="text-neutral-900">
            {currentPlace ? `${currentPlace.name[language]} (${currentPlace.floor})` : t.notSet}
          </strong>
        </span>
        {wheelchairMode && (
          <span className="text-brand-tealDark font-semibold">· {t.wheelchairMode}</span>
        )}
        {emergencyMode && (
          <span className="text-red-700 font-semibold">· {t.emergencyActiveTitle}</span>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fbf8f3]">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const linkedPlace = msg.suggestedPlaceId
            ? dataset.places.find((p) => p.id === msg.suggestedPlaceId)
            : null;

          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-brand-maroon text-white rounded-tr-sm'
                    : 'bg-white text-neutral-800 border border-brand-borderWarm rounded-tl-sm shadow-xs'
                }`}
              >
                <p>{msg.text}</p>

                {!isUser && (linkedPlace || msg.suggestedEmergencyExit) && (
                  <div className="mt-2.5 pt-2.5 border-t border-brand-borderLight flex flex-wrap gap-2">
                    {linkedPlace && (
                      <>
                        <button
                          type="button"
                          onClick={() => onFocusPlace(linkedPlace.id, true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-brand-maroon hover:bg-brand-maroonHover transition-colors cursor-pointer"
                        >
                          <Navigation className="w-3 h-3" />
                          {t.aiNavigateAction}
                        </button>
                        <button
                          type="button"
                          onClick={() => onFocusPlace(linkedPlace.id, false)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-800 bg-brand-creambg hover:bg-brand-cardcream border border-brand-borderWarm transition-colors cursor-pointer"
                        >
                          <Compass className="w-3 h-3" />
                          {t.aiShowOnMap} ({linkedPlace.floor})
                        </button>
                      </>
                    )}
                    {msg.suggestedEmergencyExit && !linkedPlace && (
                      <button
                        type="button"
                        onClick={onTriggerSafeExit}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-red-700 hover:bg-red-800 transition-colors cursor-pointer"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        {t.nearestSafeExit}
                      </button>
                    )}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-neutral-400 mt-1 px-1 tabular-nums">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start">
            <div className="bg-white border border-brand-borderWarm rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-xs text-neutral-500">
              {t.aiThinking}
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-2 bg-white border-t border-brand-borderLight flex gap-1.5 overflow-x-auto">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => sendQuestion(prompt)}
            disabled={loading}
            className="shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-brand-creambg hover:bg-brand-cardcream text-neutral-800 border border-brand-borderWarm transition-colors cursor-pointer whitespace-nowrap"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendQuestion(input);
        }}
        className="p-3 bg-white border-t border-brand-borderWarm flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.aiInputPlaceholder}
          className="flex-1 min-w-0 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-brand-creambg border border-brand-borderWarm focus:outline-none focus:ring-2 focus:ring-brand-maroon/40 text-neutral-900 placeholder:text-neutral-400"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          aria-label={t.aiSend}
          className="w-10 h-10 rounded-xl bg-brand-maroon hover:bg-brand-maroonHover disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
