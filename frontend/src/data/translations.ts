import { FloorId, Language, PlaceCategory } from '../types/navigation';

export interface UIStrings {
  backToHome: string;
  switchToMall: string;
  switchToHospital: string;
  searchPlaceholder: string;
  searchNoResults: string;
  currentLocation: string;
  selectCurrentLocation: string;
  notSet: string;
  scanQR: string;
  qrModalTitle: string;
  qrModalSubtitle: string;
  qrPrototypeNote: string;
  qrScannedSuccess: string;
  simulateScan: string;
  wheelchairMode: string;
  wheelchairModeDesc: string;
  emergencyMode: string;
  exitEmergencyMode: string;
  emergencyPrototypeBanner: string;
  emergencyActiveTitle: string;
  selectScenario: string;
  promptLocationForEmergency: string;
  nearestSafeExit: string;
  dangerZonesActive: string;
  blockedPathsNote: string;
  requestSOS: string;
  sosModalTitle: string;
  sosModalDisclaimer: string;
  sosNeedType: string;
  sosNeedGeneral: string;
  sosNeedWheelchair: string;
  sosNeedMedical: string;
  sosNeedBlocked: string;
  sosNotesPlaceholder: string;
  sosSubmit: string;
  sosSubmittedTitle: string;
  sosSubmittedDesc: string;
  sosTicketLabel: string;
  close: string;
  cancel: string;
  wheelchairAccessibleYes: string;
  wheelchairAccessibleNo: string;
  navigateHere: string;
  setAsCurrentLocation: string;
  clearRoute: string;
  activeRoute: string;
  distanceLabel: string;
  etaLabel: string;
  minutesShort: string;
  metersShort: string;
  floorsInvolved: string;
  stepByStepDirections: string;
  stepFreeVerified: string;
  evacuationRouteBadge: string;
  noAccessibleRouteError: string;
  blockedByHazardError: string;
  sameLocationNote: string;
  selectDestinationPrompt: string;
  youAreHere: string;
  destination: string;
  dangerZone: string;
  blockedPath: string;
  emergencyExit: string;
  liftsLabel: string;
  zoomIn: string;
  zoomOut: string;
  resetView: string;
  hidePlaceLabels: string;
  showPlaceLabels: string;
  aiAssistantTitle: string;
  aiInputPlaceholder: string;
  aiSend: string;
  aiThinking: string;
  aiNavigateAction: string;
  aiShowOnMap: string;
  aiWelcomeMall: string;
  aiWelcomeHospital: string;
  quickDirectory: string;
  allCategories: string;
  tapFloorToInspect: string;
  takeLiftTo: string;
  takeEscalatorTo: string;
  takeStairsTo: string;
  openControls: string;
  closeControls: string;
}

export const UI_TRANSLATIONS: Record<Language, UIStrings> = {
  en: {
    backToHome: 'Home',
    switchToMall: 'Shopping Mall',
    switchToHospital: 'City Hospital',
    searchPlaceholder: 'Search shops, departments, lifts, restrooms...',
    searchNoResults: 'No matching places found in this building.',
    currentLocation: 'Your Location',
    selectCurrentLocation: 'Select starting location',
    notSet: 'Not set',
    scanQR: 'Scan QR',
    qrModalTitle: 'QR Checkpoint Detection',
    qrModalSubtitle: 'Select a sample building QR checkpoint below to simulate scanning your location.',
    qrPrototypeNote: 'Prototype simulation: Predefined QR checkpoints update your map marker without requiring live indoor positioning hardware.',
    qrScannedSuccess: 'Location updated via QR checkpoint',
    simulateScan: 'Simulate Scan',
    wheelchairMode: 'Wheelchair Friendly',
    wheelchairModeDesc: 'Avoids stairs & escalators; uses accessible lifts and step-free corridors',
    emergencyMode: 'Emergency SOS',
    exitEmergencyMode: 'Exit Emergency',
    emergencyPrototypeBanner: 'PROTOTYPE DEMONSTRATION ONLY: Simulated emergency alerts, danger zones, evacuation routes, and SOS requests are for demo purposes and are NOT real emergency services or approved evacuation guidance.',
    emergencyActiveTitle: 'Emergency Evacuation Active',
    selectScenario: 'Demo Scenario',
    promptLocationForEmergency: 'Select your current location to calculate the safest evacuation route:',
    nearestSafeExit: 'Nearest Safe Exit',
    dangerZonesActive: 'Active Danger Zones',
    blockedPathsNote: 'Unsafe and blocked corridors are automatically avoided.',
    requestSOS: 'Request SOS Assistance',
    sosModalTitle: 'SOS Assistance Request (Prototype Demo)',
    sosModalDisclaimer: 'Simulated prototype feature only. In a real emergency, call your local emergency services or follow building security staff immediately.',
    sosNeedType: 'Type of Assistance Needed',
    sosNeedGeneral: 'Need evacuation guidance',
    sosNeedWheelchair: 'Wheelchair / mobility assistance',
    sosNeedMedical: 'Medical attention needed',
    sosNeedBlocked: 'My nearest corridor is blocked',
    sosNotesPlaceholder: 'Optional details (e.g., landmark nearby, number of people)...',
    sosSubmit: 'Send Simulated SOS',
    sosSubmittedTitle: 'Simulated SOS Request Logged',
    sosSubmittedDesc: 'Your demo SOS request with location details has been recorded in this prototype interface.',
    sosTicketLabel: 'Demo Reference ID',
    close: 'Close',
    cancel: 'Cancel',
    wheelchairAccessibleYes: 'Wheelchair accessible',
    wheelchairAccessibleNo: 'Not step-free',
    navigateHere: 'Navigate Here',
    setAsCurrentLocation: 'Set as My Location',
    clearRoute: 'Clear Route',
    activeRoute: 'Route Guidance',
    distanceLabel: 'Distance',
    etaLabel: 'Est. Time',
    minutesShort: 'min',
    metersShort: 'm',
    floorsInvolved: 'Floors on route',
    stepByStepDirections: 'Step-by-Step Directions',
    stepFreeVerified: 'Wheelchair-Friendly Route',
    evacuationRouteBadge: 'Safe Evacuation Route (Demo)',
    noAccessibleRouteError: 'No wheelchair-accessible route is currently available between these locations because accessible corridors or lifts are blocked. Please request assistance or change scenario.',
    blockedByHazardError: 'All routes to this destination are currently blocked by active danger zones.',
    sameLocationNote: 'You are already at this location.',
    selectDestinationPrompt: 'Search a place or click any marker on the map to view details and navigate.',
    youAreHere: 'You are here',
    destination: 'Destination',
    dangerZone: 'Danger Zone',
    blockedPath: 'Blocked Path',
    emergencyExit: 'Emergency Exit',
    liftsLabel: 'Lifts',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    resetView: 'Reset map view',
    hidePlaceLabels: 'Hide labels',
    showPlaceLabels: 'Show labels',
    aiAssistantTitle: 'Navique AI Assistant',
    aiInputPlaceholder: 'Ask where something is or how to get there...',
    aiSend: 'Send',
    aiThinking: 'Checking building map...',
    aiNavigateAction: 'Navigate Now',
    aiShowOnMap: 'View on Map',
    aiWelcomeMall: 'Hello! I am your Navique Shopping Mall assistant. Ask me for any store, restaurant, cinema, restroom, lift, or safe exit across GF to 3F.',
    aiWelcomeHospital: 'Hello! I am your City Care Hospital navigation assistant. Ask me for any department, clinic, diagnostics lab, ward, pharmacy, lift, or emergency exit.',
    quickDirectory: 'Quick Directory',
    allCategories: 'All',
    tapFloorToInspect: 'Click a floor chip to view that segment on the map',
    takeLiftTo: 'Lift →',
    takeEscalatorTo: 'Escalator →',
    takeStairsTo: 'Stairs →',
    openControls: 'Navigation Panel',
    closeControls: 'Hide Panel',
  },
  te: {
    backToHome: 'హోమ్',
    switchToMall: 'షాపింగ్ మాల్',
    switchToHospital: 'సిటీ హాస్పిటల్',
    searchPlaceholder: 'దుకాణాలు, విభాగాలు, లిఫ్ట్‌లు, రెస్ట్‌రూమ్‌లు వెతకండి...',
    searchNoResults: 'ఈ భవనంలో సరిపోలే ప్రదేశాలు కనుగొనబడలేదు.',
    currentLocation: 'మీ ప్రస్తుత స్థానం',
    selectCurrentLocation: 'ప్రారంభ స్థానాన్ని ఎంచుకోండి',
    notSet: 'సెట్ చేయబడలేదు',
    scanQR: 'QR స్కాన్',
    qrModalTitle: 'QR చెక్‌పాయింట్ గుర్తింపు',
    qrModalSubtitle: 'మీ స్థానాన్ని సెట్ చేయడానికి క్రింది నమూనా భవన QR చెక్‌పాయింట్‌ను ఎంచుకోండి.',
    qrPrototypeNote: 'ప్రోటోటైప్ సిమ్యులేషన్: ముందుగా నిర్వచించిన QR చెక్‌పాయింట్‌లు లైవ్ హార్డ్‌వేర్ లేకుండా మీ మ్యాప్ మార్కర్‌ను అప్‌డేట్ చేస్తాయి.',
    qrScannedSuccess: 'QR చెక్‌పాయింట్ ద్వారా స్థానం అప్‌డేట్ చేయబడింది',
    simulateScan: 'స్కాన్ అనుకరించండి',
    wheelchairMode: 'వీల్‌చైర్ మార్గం',
    wheelchairModeDesc: 'మెట్లు మరియు ఎస్కలేటర్లను నివారిస్తుంది; యాక్సెసిబుల్ లిఫ్ట్‌లను ఉపయోగిస్తుంది',
    emergencyMode: 'అత్యవసర SOS',
    exitEmergencyMode: 'అత్యవసర మోడ్ ముగించు',
    emergencyPrototypeBanner: 'ప్రోటోటైప్ ప్రదర్శన మాత్రమే: అనుకరించిన అత్యవసర హెచ్చరికలు, ప్రమాద ప్రాంతాలు, తరలింపు మార్గాలు మరియు SOS అభ్యర్థనలు డెమో కోసం మాత్రమే. ఇవి నిజమైన అత్యవసర సేవలు కావు.',
    emergencyActiveTitle: 'అత్యవసర తరలింపు సక్రియం',
    selectScenario: 'డెమో సందర్భం',
    promptLocationForEmergency: 'సురక్షితమైన తరలింపు మార్గాన్ని లెక్కించడానికి మీ ప్రస్తుత స్థానాన్ని ఎంచుకోండి:',
    nearestSafeExit: 'సమీప సురక్షిత నిష్క్రమణ',
    dangerZonesActive: 'సక్రియ ప్రమాద ప్రాంతాలు',
    blockedPathsNote: 'అసురక్షిత మరియు నిరోధించబడిన కారిడార్‌లు స్వయంచాలకంగా తప్పించబడతాయి.',
    requestSOS: 'SOS సహాయం అభ్యర్థించండి',
    sosModalTitle: 'SOS సహాయ అభ్యర్థన (ప్రోటోటైప్ డెమో)',
    sosModalDisclaimer: 'ఇది ప్రోటోటైప్ ప్రదర్శన మాత్రమే. నిజమైన అత్యవసర పరిస్థితిలో వెంటనే స్థానిక అత్యవసర సేవలను సంప్రదించండి.',
    sosNeedType: 'అవసరమైన సహాయం రకం',
    sosNeedGeneral: 'తరలింపు మార్గదర్శనం కావాలి',
    sosNeedWheelchair: 'వీల్‌చైర్ / కదలిక సహాయం',
    sosNeedMedical: 'వైద్య సహాయం అవసరం',
    sosNeedBlocked: 'నా సమీప మార్గం మూసివేయబడింది',
    sosNotesPlaceholder: 'అదనపు వివరాలు (ఉదా: సమీప గుర్తు, వ్యక్తుల సంఖ్య)...',
    sosSubmit: 'డెమో SOS పంపండి',
    sosSubmittedTitle: 'డెమో SOS అభ్యర్థన నమోదైంది',
    sosSubmittedDesc: 'మీ స్థాన వివరాలతో కూడిన ప్రోటోటైప్ SOS అభ్యర్థన నమోదు చేయబడింది.',
    sosTicketLabel: 'డెమో రిఫరెన్స్ ID',
    close: 'మూసివేయి',
    cancel: 'రద్దు చేయి',
    wheelchairAccessibleYes: 'వీల్‌చైర్ అనుకూలం',
    wheelchairAccessibleNo: 'మెట్లు లేని మార్గం కాదు',
    navigateHere: 'ఇక్కడికి నావిగేట్ చేయి',
    setAsCurrentLocation: 'నా స్థానంగా సెట్ చేయి',
    clearRoute: 'మార్గాన్ని క్లియర్ చేయి',
    activeRoute: 'మార్గదర్శనం',
    distanceLabel: 'దూరం',
    etaLabel: 'అంచనా సమయం',
    minutesShort: 'నిమి',
    metersShort: 'మీ',
    floorsInvolved: 'మార్గంలోని అంతస్తులు',
    stepByStepDirections: 'దశలవారీ దిశలు',
    stepFreeVerified: 'వీల్‌చైర్-అనుకూల మార్గం',
    evacuationRouteBadge: 'సురక్షిత తరలింపు మార్గం (డెమో)',
    noAccessibleRouteError: 'యాక్సెసిబుల్ లిఫ్ట్‌లు లేదా కారిడార్‌లు నిరోధించబడినందున ప్రస్తుతం వీల్‌చైర్-అనుకూల మార్గం అందుబాటులో లేదు.',
    blockedByHazardError: 'సక్రియ ప్రమాద ప్రాంతాల వల్ల ఈ గమ్యస్థానానికి అన్ని మార్గాలు మూసివేయబడ్డాయి.',
    sameLocationNote: 'మీరు ఇప్పటికే ఈ ప్రదేశంలో ఉన్నారు.',
    selectDestinationPrompt: 'వివరాలు చూడటానికి మరియు నావిగేట్ చేయడానికి ప్రదేశాన్ని వెతకండి లేదా మ్యాప్‌లో మార్కర్‌ను క్లిక్ చేయండి.',
    youAreHere: 'మీరు ఇక్కడ ఉన్నారు',
    destination: 'గమ్యస్థానం',
    dangerZone: 'ప్రమాద ప్రాంతం',
    blockedPath: 'మూసివేసిన మార్గం',
    emergencyExit: 'అత్యవసర నిష్క్రమణ',
    liftsLabel: 'లిఫ్ట్‌లు',
    zoomIn: 'జూమ్ ఇన్',
    zoomOut: 'జూమ్ అవుట్',
    resetView: 'మ్యాప్ రీసెట్',
    hidePlaceLabels: 'లేబుల్స్ దాచు',
    showPlaceLabels: 'లేబుల్స్ చూపు',
    aiAssistantTitle: 'నావిక్ AI సహాయకుడు',
    aiInputPlaceholder: 'ఏదైనా ప్రదేశం లేదా మార్గం గురించి అడగండి...',
    aiSend: 'పంపు',
    aiThinking: 'భవన మ్యాప్ తనిఖీ చేస్తోంది...',
    aiNavigateAction: 'ఇప్పుడే నావిగేట్ చేయి',
    aiShowOnMap: 'మ్యాప్‌లో చూడు',
    aiWelcomeMall: 'నమస్కారం! నేను మీ నావిక్ షాపింగ్ మాల్ సహాయకుడిని. GF నుండి 3F వరకు ఏదైనా దుకాణం, ఫుడ్ కోర్ట్, సినిమా, రెస్ట్‌రూమ్ లేదా సురక్షిత నిష్క్రమణ గురించి అడగండి.',
    aiWelcomeHospital: 'నమస్కారం! నేను మీ సిటీ కేర్ హాస్పిటల్ నావిగేషన్ సహాయకుడిని. ఏదైనా విభాగం, క్లినిక్, ల్యాబ్, వార్డ్, ఫార్మసీ లేదా అత్యవసర నిష్క్రమణ గురించి అడగండి.',
    quickDirectory: 'త్వరిత డైరెక్టరీ',
    allCategories: 'అన్నీ',
    tapFloorToInspect: 'మ్యాప్‌లో ఆ విభాగాన్ని చూడటానికి అంతస్తుపై క్లిక్ చేయండి',
    takeLiftTo: 'లిఫ్ట్ →',
    takeEscalatorTo: 'ఎస్కలేటర్ →',
    takeStairsTo: 'మెట్లు →',
    openControls: 'నావిగేషన్ ప్యానెల్',
    closeControls: 'ప్యానెల్ దాచు',
  },
  hi: {
    backToHome: 'होम',
    switchToMall: 'शॉपिंग मॉल',
    switchToHospital: 'सिटी हॉस्पिटल',
    searchPlaceholder: 'दुकानें, विभाग, लिफ्ट, रेस्टरूम खोजें...',
    searchNoResults: 'इस भवन में कोई मिलता-जुलता स्थान नहीं मिला।',
    currentLocation: 'आपका वर्तमान स्थान',
    selectCurrentLocation: 'प्रारंभिक स्थान चुनें',
    notSet: 'चयनित नहीं',
    scanQR: 'QR स्कैन',
    qrModalTitle: 'QR चेकपॉइंट पहचान',
    qrModalSubtitle: 'अपना स्थान सेट करने के लिए नीचे दिए गए नमूना QR चेकपॉइंट का चयन करें।',
    qrPrototypeNote: 'प्रोटोटाइप सिमुलेशन: पूर्व-निर्धारित QR चेकपॉइंट बिना लाइव हार्डवेयर के आपके मैप मार्कर को अपडेट करते हैं।',
    qrScannedSuccess: 'QR चेकपॉइंट के माध्यम से स्थान अपडेट किया गया',
    simulateScan: 'स्कैन सिमुलेट करें',
    wheelchairMode: 'व्हीलचेयर अनुकूल',
    wheelchairModeDesc: 'सीढ़ियों और एस्केलेटर से बचता है; सुगम लिफ्ट और समतल गलियारों का उपयोग करता है',
    emergencyMode: 'आपातकालीन SOS',
    exitEmergencyMode: 'आपातकाल समाप्त करें',
    emergencyPrototypeBanner: 'केवल प्रोटोटाइप प्रदर्शन: सिमुलेटेड आपातकालीन अलर्ट, खतरे के क्षेत्र, निकासी मार्ग और SOS अनुरोध केवल डेमो के लिए हैं। ये वास्तविक आपातकालीन सेवाएं नहीं हैं।',
    emergencyActiveTitle: 'आपातकालीन निकासी सक्रिय',
    selectScenario: 'डेमो परिदृश्य',
    promptLocationForEmergency: 'सबसे सुरक्षित निकासी मार्ग की गणना के लिए अपना वर्तमान स्थान चुनें:',
    nearestSafeExit: 'निकटतम सुरक्षित निकास',
    dangerZonesActive: 'सक्रिय खतरे के क्षेत्र',
    blockedPathsNote: 'असुरक्षित और अवरुद्ध गलियारों को स्वचालित रूप से छोड़ दिया जाता है।',
    requestSOS: 'SOS सहायता अनुरोध करें',
    sosModalTitle: 'SOS सहायता अनुरोध (प्रोटोटाइप डेमो)',
    sosModalDisclaimer: 'यह केवल एक प्रोटोटाइप सुविधा है। वास्तविक आपातकाल में तुरंत स्थानीय आपातकालीन सेवाओं से संपर्क करें।',
    sosNeedType: 'आवश्यक सहायता का प्रकार',
    sosNeedGeneral: 'निकासी मार्गदर्शन चाहिए',
    sosNeedWheelchair: 'व्हीलचेयर / गतिशीलता सहायता',
    sosNeedMedical: 'चिकित्सा सहायता आवश्यक',
    sosNeedBlocked: 'मेरा निकटतम गलियारा अवरुद्ध है',
    sosNotesPlaceholder: 'वैकल्पिक विवरण (जैसे: पास का लैंडमार्क, लोगों की संख्या)...',
    sosSubmit: 'डेमो SOS भेजें',
    sosSubmittedTitle: 'डेमो SOS अनुरोध दर्ज किया गया',
    sosSubmittedDesc: 'आपके स्थान विवरण के साथ प्रोटोटाइप SOS अनुरोध दर्ज कर लिया गया है।',
    sosTicketLabel: 'डेमो संदर्भ ID',
    close: 'बंद करें',
    cancel: 'रद्द करें',
    wheelchairAccessibleYes: 'व्हीलचेयर के लिए सुगम',
    wheelchairAccessibleNo: 'सीढ़ी-रहित नहीं',
    navigateHere: 'यहाँ नेविगेट करें',
    setAsCurrentLocation: 'मेरा स्थान सेट करें',
    clearRoute: 'मार्ग हटाएं',
    activeRoute: 'मार्गदर्शन',
    distanceLabel: 'दूरी',
    etaLabel: 'अनुमानित समय',
    minutesShort: 'मिनट',
    metersShort: 'मी',
    floorsInvolved: 'मार्ग में शामिल मंजिलें',
    stepByStepDirections: 'चरण-दर-चरण दिशा-निर्देश',
    stepFreeVerified: 'व्हीलचेयर-अनुकूल मार्ग',
    evacuationRouteBadge: 'सुरक्षित निकासी मार्ग (डेमो)',
    noAccessibleRouteError: 'सुगम लिफ्ट या गलियारे अवरुद्ध होने के कारण इन स्थानों के बीच व्हीलचेयर-अनुकूल मार्ग उपलब्ध नहीं है।',
    blockedByHazardError: 'सक्रिय खतरे के क्षेत्रों के कारण इस गंतव्य के सभी मार्ग अवरुद्ध हैं।',
    sameLocationNote: 'आप पहले से ही इस स्थान पर हैं।',
    selectDestinationPrompt: 'विवरण देखने और नेविगेट करने के लिए कोई स्थान खोजें या मानचित्र पर किसी मार्कर पर क्लिक करें।',
    youAreHere: 'आप यहाँ हैं',
    destination: 'गंतव्य',
    dangerZone: 'खतरे का क्षेत्र',
    blockedPath: 'अवरुद्ध मार्ग',
    emergencyExit: 'आपातकालीन निकास',
    liftsLabel: 'लिफ्ट',
    zoomIn: 'ज़ूम इन',
    zoomOut: 'ज़ूम आउट',
    resetView: 'मैप रीसेट करें',
    hidePlaceLabels: 'लेबल छिपाएं',
    showPlaceLabels: 'लेबल दिखाएं',
    aiAssistantTitle: 'नाविक AI सहायक',
    aiInputPlaceholder: 'पूछें कि कोई स्थान कहाँ है या वहाँ कैसे पहुँचें...',
    aiSend: 'भेजें',
    aiThinking: 'भवन का मानचित्र जांचा जा रहा है...',
    aiNavigateAction: 'अभी नेविगेट करें',
    aiShowOnMap: 'मैप पर देखें',
    aiWelcomeMall: 'नमस्ते! मैं आपका नाविक शॉपिंग मॉल सहायक हूँ। GF से 3F तक किसी भी दुकान, फूड कोर्ट, सिनेमा, रेस्टरूम, लिफ्ट या सुरक्षित निकास के बारे में पूछें।',
    aiWelcomeHospital: 'नमस्ते! मैं आपका सिटी केयर हॉस्पिटल नेविगेशन सहायक हूँ। किसी भी विभाग, क्लीनिक, लैब, वार्ड, फार्मेसी, लिफ्ट या आपातकालीन निकास के बारे में पूछें।',
    quickDirectory: 'त्वरित निर्देशिका',
    allCategories: 'सभी',
    tapFloorToInspect: 'मैप पर उस हिस्से को देखने के लिए मंजिल पर क्लिक करें',
    takeLiftTo: 'लिफ्ट →',
    takeEscalatorTo: 'एस्केलेटर →',
    takeStairsTo: 'सीढ़ियाँ →',
    openControls: 'नेविगेशन पैनल',
    closeControls: 'पैनल छिपाएं',
  },
};

export const CATEGORY_LABELS: Record<PlaceCategory, Record<Language, string>> = {
  store: { en: 'Retail Store', te: 'రిటైల్ స్టోర్', hi: 'रिटेल स्टोर' },
  dining: { en: 'Food & Dining', te: 'ఆహారం & డైనింగ్', hi: 'भोजन और डाइनिंग' },
  entertainment: { en: 'Entertainment', te: 'వినోదం', hi: 'मनोरंजन' },
  clinic: { en: 'Speciality Clinic', te: 'స్పెషాలిటీ క్లినిక్', hi: 'विशेषज्ञ क्लिनिक' },
  diagnostics: { en: 'Diagnostics & Lab', te: 'డయాగ్నోస్టిక్స్ & ల్యాబ్', hi: 'डायग्नोस्टिक्स और लैब' },
  emergency_care: { en: 'Emergency & Critical Care', te: 'అత్యవసర & క్రిటికల్ కేర్', hi: 'आपातकालीन और क्रिटिकल केयर' },
  ward: { en: 'Ward & Patient Care', te: 'వార్డ్ & పేషెంట్ కేర్', hi: 'वार्ड और रोगी देखभाल' },
  pharmacy: { en: 'Pharmacy', te: 'ఫార్మసీ', hi: 'फार्मेसी' },
  facility: { en: 'Facility & Services', te: 'సౌకర్యం & సేవలు', hi: 'सुविधा और सेवाएं' },
  transit: { en: 'Lifts / Escalators / Stairs', te: 'లిఫ్ట్‌లు / ఎస్కలేటర్లు / మెట్లు', hi: 'लिफ्ट / एस्केलेटर / सीढ़ियाँ' },
  exit: { en: 'Emergency Exit', te: 'అత్యవసర నిష్క్రమణ', hi: 'आपातकालीन निकास' },
  entrance: { en: 'Entrance & Access', te: 'ప్రవేశం & యాక్సెస్', hi: 'प्रवेश और पहुँच' },
};

export const FLOOR_FULL_LABELS: Record<FloorId, Record<Language, string>> = {
  GF: { en: 'Ground Floor (GF)', te: 'గ్రౌండ్ ఫ్లోర్ (GF)', hi: 'भूतल (GF)' },
  '1F': { en: 'First Floor (1F)', te: 'మొదటి అంతస్తు (1F)', hi: 'पहली मंजिल (1F)' },
  '2F': { en: 'Second Floor (2F)', te: 'రెండవ అంతస్తు (2F)', hi: 'दूसरी मंजिल (2F)' },
  '3F': { en: 'Third Floor (3F)', te: 'మూడవ అంతస్తు (3F)', hi: 'तीसरी मंजिल (3F)' },
};
