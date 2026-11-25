import {
  BuildingDataset,
  FloorId,
  NavEdge,
  NavNode,
} from '../types/navigation';
import { attachPlacesToGraph, PlaceSeed } from './buildingGraphBuilder';

const FLOORS: FloorId[] = ['GF', '1F', '2F', '3F'];

function buildHospitalCorridorGraph(): { nodes: NavNode[]; edges: NavEdge[] } {
  const nodes: NavNode[] = [];
  const edges: NavEdge[] = [];

  const addNode = (node: NavNode) => nodes.push(node);
  const addEdge = (
    from: string,
    to: string,
    kind: NavEdge['kind'] = 'corridor',
    wheelchairAccessible = true,
    weight?: number
  ) => {
    edges.push({ from, to, kind, wheelchairAccessible, weight });
  };

  for (const f of FLOORS) {
    // Isometric hospital corridor skeleton matching all 4 City Care Hospital maps (viewBox 1000 x 545)
    // Main lobby & front hub
    addNode({ id: `${f}_h_lobby`, floor: f, x: 486, y: 368, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_h_wait_front`, floor: f, x: 432, y: 318, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_h_recep_j`, floor: f, x: 562, y: 334, kind: 'corridor', wheelchairAccessible: true });

    // Left-front diagonal corridor (towards SW wing)
    addNode({ id: `${f}_h_sw1`, floor: f, x: 382, y: 298, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_h_sw2`, floor: f, x: 306, y: 262, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_h_sw3`, floor: f, x: 238, y: 232, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_h_w_end`, floor: f, x: 175, y: 215, kind: 'corridor', wheelchairAccessible: true });

    // Left-back corridor (between Left Wing & Main Lifts)
    addNode({ id: `${f}_h_nw1`, floor: f, x: 356, y: 222, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_h_nw2`, floor: f, x: 392, y: 185, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_h_n_exit_j`, floor: f, x: 344, y: 146, kind: 'corridor', wheelchairAccessible: true });

    // Central Lifts & Stairs corridor
    addNode({ id: `${f}_h_lift_j`, floor: f, x: 422, y: 238, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_h_stairs_j`, floor: f, x: 522, y: 205, kind: 'corridor', wheelchairAccessible: true });

    // Right-front diagonal corridor (towards SE & East wing)
    addNode({ id: `${f}_h_se1`, floor: f, x: 642, y: 292, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_h_se2`, floor: f, x: 722, y: 252, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_h_e_end`, floor: f, x: 805, y: 225, kind: 'corridor', wheelchairAccessible: true });

    // Right-back corridor (between Top/Lab wing & Waiting/Restrooms)
    addNode({ id: `${f}_h_ne1`, floor: f, x: 588, y: 235, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_h_ne2`, floor: f, x: 658, y: 196, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_h_ne3`, floor: f, x: 742, y: 198, kind: 'corridor', wheelchairAccessible: true });

    // Vertical transit connectors (aligned across all 4 hospital levels)
    addNode({
      id: `${f}_main_lifts`,
      floor: f,
      x: 426,
      y: 202,
      kind: 'lift',
      wheelchairAccessible: true,
      label: { en: 'Main Lifts', te: 'ప్రధాన లిఫ్ట్‌లు', hi: 'मुख्य लिफ्ट' },
    });
    addNode({
      id: `${f}_main_stairs`,
      floor: f,
      x: 505,
      y: 168,
      kind: 'stairs',
      wheelchairAccessible: false,
      label: { en: 'Stairs', te: 'మెట్లు', hi: 'सीढ़ियाँ' },
    });

    // Emergency Exits
    addNode({
      id: `${f}_exit_north`,
      floor: f,
      x: 334,
      y: 128,
      kind: 'exit',
      wheelchairAccessible: true,
      label: { en: 'Emergency Exit (North)', te: 'అత్యవసర నిష్క్రమణ (ఉత్తరం)', hi: 'आपातकालीन निकास (उत्तर)' },
    });
    addNode({
      id: `${f}_exit_east`,
      floor: f,
      x: 872,
      y: 252,
      kind: 'exit',
      wheelchairAccessible: true,
      label: { en: 'Emergency Exit (East)', te: 'అత్యవసర నిష్క్రమణ (తూర్పు)', hi: 'आपातकालीन निकास (पूर्व)' },
    });
    if (f !== 'GF') {
      addNode({
        id: `${f}_exit_west`,
        floor: f,
        x: 96,
        y: 254,
        kind: 'exit',
        wheelchairAccessible: true,
        label: { en: 'Emergency Exit (West)', te: 'అత్యవసర నిష్క్రమణ (పడమర)', hi: 'आपातकालीन निकास (पश्चिम)' },
      });
    }

    // Walkable corridor edges
    addEdge(`${f}_h_lobby`, `${f}_h_wait_front`);
    addEdge(`${f}_h_lobby`, `${f}_h_recep_j`);
    addEdge(`${f}_h_wait_front`, `${f}_h_sw1`);
    addEdge(`${f}_h_sw1`, `${f}_h_sw2`);
    addEdge(`${f}_h_sw2`, `${f}_h_sw3`);
    addEdge(`${f}_h_sw3`, `${f}_h_w_end`);

    addEdge(`${f}_h_sw2`, `${f}_h_nw1`);
    addEdge(`${f}_h_sw1`, `${f}_h_lift_j`);
    addEdge(`${f}_h_nw1`, `${f}_h_lift_j`);
    addEdge(`${f}_h_nw1`, `${f}_h_nw2`);
    addEdge(`${f}_h_nw2`, `${f}_h_n_exit_j`);

    addEdge(`${f}_h_lift_j`, `${f}_h_wait_front`);
    addEdge(`${f}_h_nw2`, `${f}_h_stairs_j`);
    addEdge(`${f}_h_stairs_j`, `${f}_h_ne1`);
    addEdge(`${f}_h_recep_j`, `${f}_h_ne1`);
    addEdge(`${f}_h_recep_j`, `${f}_h_se1`);
    addEdge(`${f}_h_se1`, `${f}_h_se2`);
    addEdge(`${f}_h_se2`, `${f}_h_e_end`);

    addEdge(`${f}_h_ne1`, `${f}_h_ne2`);
    addEdge(`${f}_h_ne2`, `${f}_h_ne3`);
    addEdge(`${f}_h_ne3`, `${f}_h_e_end`);
    addEdge(`${f}_h_ne2`, `${f}_h_se1`);

    // Connect lifts, stairs, and exits
    addEdge(`${f}_h_lift_j`, `${f}_main_lifts`, 'corridor', true);
    addEdge(`${f}_h_nw2`, `${f}_main_lifts`, 'corridor', true);
    addEdge(`${f}_h_stairs_j`, `${f}_main_stairs`, 'corridor', false);

    addEdge(`${f}_h_n_exit_j`, `${f}_exit_north`, 'corridor', true);
    addEdge(`${f}_h_e_end`, `${f}_exit_east`, 'corridor', true);
    if (f !== 'GF') {
      addEdge(`${f}_h_w_end`, `${f}_exit_west`, 'corridor', true);
    }
  }

  // Vertical multi-floor links across GF <-> 1F <-> 2F <-> 3F
  for (let i = 0; i < FLOORS.length - 1; i++) {
    const f1 = FLOORS[i];
    const f2 = FLOORS[i + 1];
    addEdge(`${f1}_main_lifts`, `${f2}_main_lifts`, 'lift', true, 110);
    addEdge(`${f1}_main_stairs`, `${f2}_main_stairs`, 'stairs', false, 125);
  }

  return { nodes, edges };
}

const { nodes: baseHospitalNodes, edges: baseHospitalEdges } = buildHospitalCorridorGraph();

const hospitalPlaceSeeds: PlaceSeed[] = [
  // Ground Floor (GF) - Emergency & General Services
  {
    id: 'hosp_gf_main_entrance',
    floor: 'GF',
    x: 484,
    y: 422,
    connectTo: 'GF_h_lobby',
    name: { en: 'Main Entrance', te: 'ప్రధాన ప్రవేశ ద్వారం', hi: 'मुख्य प्रवेश द्वार' },
    category: 'entrance',
    description: {
      en: 'Step-free hospital main entrance with automatic sliding doors leading to Main Lobby.',
      te: 'మెయిన్ లాబీకి దారితీసే వీల్‌చైర్-అనుకూల ఆసుపత్రి ప్రధాన ద్వారం.',
      hi: 'मुख्य लॉबी की ओर जाने वाला सीढ़ी-रहित अस्पताल का मुख्य प्रवेश द्वार।',
    },
    keywords: ['main entrance', 'entry', 'lobby', 'gate', 'start'],
    isQRCheckpoint: true,
    qrCode: 'NVQ-HOSP-GF-ENTRY',
  },
  {
    id: 'hosp_gf_reception',
    floor: 'GF',
    x: 604,
    y: 356,
    connectTo: 'GF_h_recep_j',
    name: { en: 'Main Reception & Registration', te: 'ప్రధాన రిసెప్షన్ & రిజిస్ట్రేషన్', hi: 'मुख्य रिसेप्शन और पंजीकरण' },
    category: 'facility',
    description: {
      en: 'Patient registration, appointment check-in, visitor passes, and billing inquiries.',
      te: 'రోగుల నమోదు, అపాయింట్‌మెంట్ చెక్-ఇన్ మరియు సమాచార కేంద్రం.',
      hi: 'रोगी पंजीकरण, अपॉइंटमेंट चेक-इन और पूछताछ काउंटर।',
    },
    keywords: ['reception', 'registration', 'front desk', 'check in', 'help'],
  },
  {
    id: 'hosp_gf_emergency_wing',
    floor: 'GF',
    x: 205,
    y: 160,
    connectTo: 'GF_h_w_end',
    name: { en: 'Emergency Department Wing', te: 'అత్యవసర విభాగం వింగ్', hi: 'आपातकालीन विभाग विंग' },
    category: 'emergency_care',
    description: {
      en: '24/7 acute emergency care wing for urgent medical and surgical interventions.',
      te: '24/7 అత్యవసర వైద్య మరియు శస్త్రచికిత్స సేవల విభాగం.',
      hi: 'तत्काल चिकित्सा और सर्जिकल देखभाल के लिए 24/7 आपातकालीन विभाग।',
    },
    keywords: ['emergency', 'er', 'casualty', 'urgent'],
  },
  {
    id: 'hosp_gf_emergency_wards',
    floor: 'GF',
    x: 294,
    y: 158,
    connectTo: 'GF_h_nw1',
    name: { en: 'Emergency Wards', te: 'అత్యవసర వార్డులు', hi: 'आपातकालीन वार्ड' },
    category: 'emergency_care',
    description: {
      en: 'Short-stay emergency observation beds adjacent to Trauma Care Unit.',
      te: 'ట్రామా కేర్ పక్కన ఉన్న అత్యవసర పరిశీలన వార్డులు.',
      hi: 'ट्रॉमा केयर यूनिट के पास आपातकालीन अवलोकन वार्ड।',
    },
    keywords: ['emergency wards', 'er beds', 'observation'],
  },
  {
    id: 'hosp_gf_trauma_care',
    floor: 'GF',
    x: 275,
    y: 204,
    connectTo: 'GF_h_sw3',
    name: { en: 'Trauma Care Unit', te: 'ట్రామా కేర్ యూనిట్', hi: 'ट्रॉमा केयर यूनिट' },
    category: 'emergency_care',
    description: {
      en: 'Rapid stabilization and resuscitation bay directly connected to Ambulance Bay.',
      te: 'అంబులెన్స్ బేకు నేరుగా అనుసంధానించబడిన ట్రామా కేర్ యూనిట్.',
      hi: 'एम्बुलेंस बे से सीधे जुड़ा हुआ ट्रॉमा केयर और स्थिरीकरण कक्ष।',
    },
    keywords: ['trauma', 'accident', 'emergency', 'critical'],
  },
  {
    id: 'hosp_gf_ambulance_bay',
    floor: 'GF',
    x: 198,
    y: 252,
    connectTo: 'GF_h_w_end',
    name: { en: 'Ambulance Bay', te: 'అంబులెన్స్ బే', hi: 'एम्बुलेंस बे' },
    category: 'emergency_care',
    description: {
      en: 'Dedicated ambulance arrival bay with direct stretcher ramp into Triage & Trauma Care.',
      te: 'ట్రయాజ్ & ట్రామా కేర్‌కు నేరుగా వెళ్లే అంబులెన్స్ ప్రవేశ ప్రాంతం.',
      hi: 'ट्राइएज और ट्रॉमा केयर के लिए सीधा स्ट्रेचर रैंप वाला एम्बुलेंस बे।',
    },
    keywords: ['ambulance', 'emergency entry', 'stretcher'],
  },
  {
    id: 'hosp_gf_triage',
    floor: 'GF',
    x: 266,
    y: 284,
    connectTo: 'GF_h_sw3',
    name: { en: 'Triage Station', te: 'ట్రయాజ్ స్టేషన్', hi: 'ट्राइएज स्टेशन' },
    category: 'emergency_care',
    description: {
      en: 'Immediate patient priority assessment desk at the Emergency Department entry.',
      te: 'అత్యవసర విభాగం వద్ద తక్షణ రోగుల ప్రాధాన్యత అంచనా కేంద్రం.',
      hi: 'आपातकालीन विभाग के प्रवेश पर तत्काल रोगी प्राथमिकता मूल्यांकन डेस्क।',
    },
    keywords: ['triage', 'emergency assessment', 'urgent'],
  },
  {
    id: 'hosp_gf_wheelchair',
    floor: 'GF',
    x: 348,
    y: 326,
    connectTo: 'GF_h_sw2',
    name: { en: 'Wheelchair Collection Point', te: 'వీల్‌చైర్ సేకరణ కేంద్రం', hi: 'व्हीलचेयर संग्रह बिंदु' },
    category: 'facility',
    description: {
      en: 'Complimentary wheelchairs and patient porter assistance located left of Main Lobby.',
      te: 'మెయిన్ లాబీ ఎడమవైపు ఉచిత వీల్‌చైర్లు మరియు సహాయ సిబ్బంది.',
      hi: 'मुख्य लॉबी के बाईं ओर नि:शुल्क व्हीलचेयर और सहायक सेवा।',
    },
    keywords: ['wheelchair', 'mobility', 'porter', 'accessible'],
  },
  {
    id: 'hosp_gf_waiting_area',
    floor: 'GF',
    x: 495,
    y: 262,
    connectTo: 'GF_h_wait_front',
    name: { en: 'Waiting Area (GF)', te: 'వేచి ఉండే ప్రాంతం (GF)', hi: 'प्रतीक्षा क्षेत्र (GF)' },
    category: 'facility',
    description: {
      en: 'Central ground-floor seating lounge with digital token display screens.',
      te: 'డిజిటల్ టోకెన్ స్క్రీన్‌లతో కూడిన సెంట్రల్ గ్రౌండ్ ఫ్లోర్ వెయిటింగ్ హాల్.',
      hi: 'डिजिटल टोकन स्क्रीन के साथ केंद्रीय भूतल प्रतीक्षा क्षेत्र।',
    },
    keywords: ['waiting', 'lounge', 'seating', 'lobby'],
  },
  {
    id: 'hosp_gf_water',
    floor: 'GF',
    x: 552,
    y: 145,
    connectTo: 'GF_h_stairs_j',
    name: { en: 'Drinking Water Station', te: 'తాగునీటి కేంద్రం', hi: 'पेयजल स्टेशन' },
    category: 'facility',
    description: {
      en: 'Filtered chilled and room-temperature drinking water dispenser near the central stairs.',
      te: 'సెంట్రల్ మెట్ల వద్ద ఫిల్టర్ చేసిన తాగునీటి స్టేషన్.',
      hi: 'केंद्रीय सीढ़ियों के पास फ़िल्टर किया हुआ पेयजल स्टेशन।',
    },
    keywords: ['water', 'drinking water', 'fountain'],
  },
  {
    id: 'hosp_gf_gen_consult',
    floor: 'GF',
    x: 615,
    y: 158,
    connectTo: 'GF_h_ne2',
    name: { en: 'General Consultation Rooms (GF)', te: 'జనరల్ కన్సల్టేషన్ గదులు (GF)', hi: 'सामान्य परामर्श कक्ष (GF)' },
    category: 'clinic',
    description: {
      en: 'Outpatient consultation suites for primary care physicians and walk-in checkups.',
      te: 'ప్రాథమిక వైద్య పరీక్షలు మరియు అవుట్ పేషెంట్ సంప్రదింపు గదులు.',
      hi: 'प्राथमिक चिकित्सकों और वॉक-इन जांच के लिए परामर्श कक्ष।',
    },
    keywords: ['consultation', 'doctor', 'opd', 'general', 'checkup'],
  },
  {
    id: 'hosp_gf_gen_medicine',
    floor: 'GF',
    x: 682,
    y: 186,
    connectTo: 'GF_h_ne3',
    name: { en: 'General Medicine', te: 'జనరల్ మెడిసిన్', hi: 'जनरल मेडिसिन' },
    category: 'clinic',
    description: {
      en: 'Internal medicine department for fever, infections, chronic care, and health screenings.',
      te: 'జ్వరం, ఇన్ఫెక్షన్లు మరియు సాధారణ వైద్య చికిత్స విభాగం.',
      hi: 'बुखार, संक्रमण और सामान्य चिकित्सा उपचार विभाग।',
    },
    keywords: ['general medicine', 'physician', 'internal medicine', 'doctor'],
  },
  {
    id: 'hosp_gf_pharmacy',
    floor: 'GF',
    x: 722,
    y: 202,
    connectTo: 'GF_h_ne3',
    name: { en: '24/7 Hospital Pharmacy', te: '24/7 ఆసుపత్రి ఫార్మసీ', hi: '24/7 अस्पताल फार्मेसी' },
    category: 'pharmacy',
    description: {
      en: 'Round-the-clock hospital pharmacy dispensing prescribed medications and surgical supplies.',
      te: '24 గంటలూ మందులు మరియు వైద్య సామగ్రి లభించే ఆసుపత్రి ఫార్మసీ.',
      hi: 'निर्धारित दवाएं और चिकित्सा सामग्री प्रदान करने वाली 24/7 अस्पताल फार्मेसी।',
    },
    keywords: ['pharmacy', 'medicine', 'chemist', 'drugs', 'tablets', '24/7'],
    isQRCheckpoint: true,
    qrCode: 'NVQ-HOSP-GF-PHARM',
  },
  {
    id: 'hosp_gf_diagnostics',
    floor: 'GF',
    x: 728,
    y: 282,
    connectTo: 'GF_h_se2',
    name: { en: 'Diagnostics (GF)', te: 'డయాగ్నోస్టిక్స్ (GF)', hi: 'डायग्नोस्टिक्स (GF)' },
    category: 'diagnostics',
    description: {
      en: 'Ground floor rapid diagnostic intake, ECG, and test registration counter.',
      te: 'గ్రౌండ్ ఫ్లోర్ రాపిడ్ డయాగ్నోస్టిక్ మరియు పరీక్షల రిజిస్ట్రేషన్ కౌంటర్.',
      hi: 'भूतल त्वरित डायग्नोस्टिक और जांच पंजीकरण काउंटर।',
    },
    keywords: ['diagnostics', 'tests', 'ecg', 'lab'],
  },
  {
    id: 'hosp_gf_sample_collection',
    floor: 'GF',
    x: 764,
    y: 240,
    connectTo: 'GF_h_e_end',
    name: { en: 'Sample Collection', te: 'నమూనా సేకరణ', hi: 'सैंपल कलेक्शन' },
    category: 'diagnostics',
    description: {
      en: 'Phlebotomy and specimen drop-off counter for routine blood and urine testing.',
      te: 'రక్త మరియు మూత్ర పరీక్షల కోసం నమూనా సేకరణ కౌంటర్.',
      hi: 'रक्त और मूत्र जांच के लिए सैंपल कलेक्शन काउंटर।',
    },
    keywords: ['sample', 'blood draw', 'collection', 'lab'],
  },
  {
    id: 'hosp_gf_basic_lab',
    floor: 'GF',
    x: 846,
    y: 218,
    connectTo: 'GF_h_e_end',
    name: { en: 'Basic Laboratory', te: 'బేసిక్ ల్యాబొరేటరీ', hi: 'बेसिक लेबोरेटरी' },
    category: 'diagnostics',
    description: {
      en: 'Fast-turnaround ground floor laboratory for urgent CBC, glucose, and rapid assays.',
      te: 'తక్షణ రక్త పరీక్షలు మరియు ప్రాథమిక ల్యాబ్ సేవలు.',
      hi: 'त्वरित सीबीसी, ग्लूकोज और बुनियादी जांच के लिए भूतल प्रयोगशाला।',
    },
    keywords: ['basic laboratory', 'lab', 'tests', 'blood'],
  },

  // First Floor (1F) - Consultation & Speciality Clinics
  {
    id: 'hosp_1f_cardiology',
    floor: '1F',
    x: 194,
    y: 252,
    connectTo: '1F_h_w_end',
    name: { en: 'Cardiology', te: 'కార్డియాలజీ (హృద్రోగ విభాగం)', hi: 'कार्डियोलॉजी (हृदय रोग)' },
    category: 'clinic',
    description: {
      en: 'Heart specialist consultations, echocardiography, stress testing, and cardiac follow-up.',
      te: 'గుండె సంబంధిత నిపుణుల సంప్రదింపులు, ఎకో మరియు కార్డియాక్ పరీక్షలు.',
      hi: 'हृदय रोग विशेषज्ञ परामर्श, इकोकार्डियोग्राफी और कार्डियक जांच।',
    },
    keywords: ['cardiology', 'heart', 'cardiac', 'ecg', 'chest'],
    isQRCheckpoint: true,
    qrCode: 'NVQ-HOSP-1F-CARDIO',
  },
  {
    id: 'hosp_1f_dermatology',
    floor: '1F',
    x: 258,
    y: 210,
    connectTo: '1F_h_sw3',
    name: { en: 'Dermatology', te: 'డెర్మటాలజీ (చర్మ వ్యాధులు)', hi: 'डर्मेटोलॉजी (त्वचा रोग)' },
    category: 'clinic',
    description: {
      en: 'Skin, hair, and allergy speciality clinic with dermatological procedure suites.',
      te: 'చర్మం, జుట్టు మరియు అలర్జీ చికిత్స నిపుణుల క్లినిక్.',
      hi: 'त्वचा, बाल और एलर्जी उपचार विशेषज्ञ क्लिनिक।',
    },
    keywords: ['dermatology', 'skin', 'hair', 'allergy'],
  },
  {
    id: 'hosp_1f_neurology',
    floor: '1F',
    x: 314,
    y: 178,
    connectTo: '1F_h_nw1',
    name: { en: 'Neurology', te: 'న్యూరాలజీ (నరాల విభాగం)', hi: 'न्यूरोलॉजी (तंत्रिका रोग)' },
    category: 'clinic',
    description: {
      en: 'Brain, spine, headache, and nerve disorder consultations and EEG assessments.',
      te: 'మెదడు, వెన్నెముక మరియు నరాల సంబంధిత వ్యాధుల చికిత్స విభాగం.',
      hi: 'मस्तिष्क, रीढ़ और नसों से संबंधित रोगों का विशेषज्ञ परामर्श।',
    },
    keywords: ['neurology', 'brain', 'nerve', 'spine', 'neuro'],
  },
  {
    id: 'hosp_1f_gynaecology',
    floor: '1F',
    x: 258,
    y: 308,
    connectTo: '1F_h_sw3',
    name: { en: 'Gynaecology', te: 'గైనకాలజీ (స్త్రీ వైద్యం)', hi: 'गायनेकोलॉजी (स्त्री रोग)' },
    category: 'clinic',
    description: {
      en: "Women's health consultation rooms and specialist reproductive care.",
      te: 'మహిళల ఆరోగ్య సంరక్షణ మరియు నిపుణుల సంప్రదింపు గదులు.',
      hi: 'महिला स्वास्थ्य परामर्श और विशेषज्ञ स्त्री रोग देखभाल।',
    },
    keywords: ['gynaecology', 'gynecology', 'women', 'obgyn'],
  },
  {
    id: 'hosp_1f_obstetrics',
    floor: '1F',
    x: 338,
    y: 336,
    connectTo: '1F_h_sw2',
    name: { en: 'Obstetrics', te: 'ప్రసూతి విభాగం (ఆబ్స్టెట్రిక్స్)', hi: 'प्रसूति विभाग (ऑब्स्टेट्रिक्स)' },
    category: 'clinic',
    description: {
      en: 'Antenatal checkups, prenatal screening, and maternity care consultations.',
      te: 'గర్భధారణ పరీక్షలు మరియు ప్రసూతి సంరక్షణ విభాగం.',
      hi: 'प्रसवपूर्व जांच और मातृत्व देखभाल परामर्श।',
    },
    keywords: ['obstetrics', 'pregnancy', 'maternity', 'prenatal'],
  },
  {
    id: 'hosp_1f_orthopaedics',
    floor: '1F',
    x: 568,
    y: 146,
    connectTo: '1F_h_stairs_j',
    name: { en: 'Orthopaedics', te: 'ఆర్థోపెడిక్స్ (ఎముకల విభాగం)', hi: 'ऑर्थोपेडिक्स (हड्डी रोग)' },
    category: 'clinic',
    description: {
      en: 'Bone, joint, fracture care, sports injuries, and plaster casting clinic.',
      te: 'ఎముకలు, కీళ్ళు, ఫ్రాక్చర్ చికిత్స మరియు క్రీడా గాయాల క్లినిక్.',
      hi: 'हड्डी, जोड़ों, फ्रैक्चर और खेल चोटों का विशेषज्ञ क्लिनिक।',
    },
    keywords: ['orthopaedics', 'orthopedics', 'bone', 'joint', 'fracture', 'ortho'],
  },
  {
    id: 'hosp_1f_ent',
    floor: '1F',
    x: 645,
    y: 148,
    connectTo: '1F_h_ne2',
    name: { en: 'ENT', te: 'ఈఎన్‌టి (చెవి, ముక్కు, గొంతు)', hi: 'ईएनटी (कान, नाक, गला)' },
    category: 'clinic',
    description: {
      en: 'Ear, nose, throat, sinus, and audiology diagnostic and consultation clinic.',
      te: 'చెవి, ముక్కు, గొంతు మరియు వినికిడి పరీక్షల విభాగం.',
      hi: 'कान, नाक, गला और श्रवण जांच एवं परामर्श क्लिनिक।',
    },
    keywords: ['ent', 'ear', 'nose', 'throat', 'sinus'],
  },
  {
    id: 'hosp_1f_ophthalmology',
    floor: '1F',
    x: 722,
    y: 162,
    connectTo: '1F_h_ne3',
    name: { en: 'Ophthalmology', te: 'ఆప్తల్మాలజీ (కంటి విభాగం)', hi: 'नेत्र विज्ञान (ऑप्थल्मोलॉजी)' },
    category: 'clinic',
    description: {
      en: 'Comprehensive eye exams, vision testing, retina care, and cataract consultations.',
      te: 'సమగ్ర కంటి పరీక్షలు, రెటీనా మరియు క్యాటరాక్ట్ చికిత్స.',
      hi: 'संपूर्ण नेत्र जांच, दृष्टि परीक्षण और मोतियाबिंद परामर्श।',
    },
    keywords: ['ophthalmology', 'eye', 'vision', 'retina', 'cataract'],
  },
  {
    id: 'hosp_1f_paediatrics',
    floor: '1F',
    x: 764,
    y: 266,
    connectTo: '1F_h_se2',
    name: { en: 'Paediatrics', te: 'పీడియాట్రిక్స్ (పిల్లల విభాగం)', hi: 'पीडियाट्रिक्स (बाल रोग)' },
    category: 'clinic',
    description: {
      en: "Child-friendly clinic for infant checkups, vaccinations, and children's health care.",
      te: 'పిల్లల ఆరోగ్య పరీక్షలు, టీకాలు మరియు శిశు సంరక్షణ విభాగం.',
      hi: 'शिशु जांच, टीकाकरण और बच्चों की स्वास्थ्य देखभाल का क्लिनिक।',
    },
    keywords: ['paediatrics', 'pediatrics', 'child', 'kids', 'baby', 'vaccine'],
  },
  {
    id: 'hosp_1f_gen_consult',
    floor: '1F',
    x: 818,
    y: 225,
    connectTo: '1F_h_e_end',
    name: { en: 'General Consultation Rooms (1F)', te: 'జనరల్ కన్సల్టేషన్ గదులు (1F)', hi: 'सामान्य परामर्श कक्ष (1F)' },
    category: 'clinic',
    description: {
      en: 'East wing multi-specialty doctor consultation chambers on First Floor.',
      te: 'మొదటి అంతస్తు తూర్పు విభాగంలో వైద్యుల సంప్రదింపు గదులు.',
      hi: 'पहली मंजिल के पूर्वी विंग में डॉक्टर परामर्श कक्ष।',
    },
    keywords: ['consultation', 'rooms', 'doctor', 'clinic'],
  },
  {
    id: 'hosp_1f_nursing_stations',
    floor: '1F',
    x: 658,
    y: 314,
    connectTo: '1F_h_se1',
    name: { en: 'Nursing Stations (1F)', te: 'నర్సింగ్ స్టేషన్లు (1F)', hi: 'नर्सिंग स्टेशन (1F)' },
    category: 'facility',
    description: {
      en: 'Vitals check, clinic coordination, and patient guidance desks on 1F.',
      te: 'వైటల్స్ పరీక్ష మరియు రోగుల మార్గదర్శనం కోసం నర్సింగ్ స్టేషన్లు.',
      hi: 'वाइटल्स जांच और क्लिनिक समन्वय के लिए नर्सिंग स्टेशन।',
    },
    keywords: ['nursing', 'nurse', 'vitals', 'help'],
  },
  {
    id: 'hosp_1f_waiting',
    floor: '1F',
    x: 498,
    y: 256,
    connectTo: '1F_h_wait_front',
    name: { en: 'Waiting Lounge (1F)', te: 'వెయిటింగ్ లాంజ్ (1F)', hi: 'वेटिंग लाउंज (1F)' },
    category: 'facility',
    description: {
      en: 'Central outpatient waiting lounge serving all First Floor speciality clinics.',
      te: 'మొదటి అంతస్తు క్లినిక్‌ల కోసం సెంట్రల్ వెయిటింగ్ లాంజ్.',
      hi: 'पहली मंजिल के सभी विशेषज्ञ क्लीनिकों के लिए केंद्रीय वेटिंग लाउंज।',
    },
    keywords: ['waiting', 'lounge', 'seating'],
  },
  {
    id: 'hosp_1f_restrooms',
    floor: '1F',
    x: 658,
    y: 226,
    connectTo: '1F_h_ne1',
    name: { en: 'Restrooms (1F)', te: 'రెస్ట్‌రూమ్‌లు (1F)', hi: 'रेस्टरूम (1F)' },
    category: 'facility',
    description: {
      en: 'Accessible washrooms located near the central First Floor corridor.',
      te: 'మొదటి అంతస్తు సెంట్రల్ కారిడార్ వద్ద వీల్‌చైర్ అనుకూల రెస్ట్‌రూమ్‌లు.',
      hi: 'पहली मंजिल के केंद्रीय गलियारे के पास सुगम शौचालय।',
    },
    keywords: ['restroom', 'washroom', 'toilet', 'bathroom'],
    isRestroom: true,
  },

  // Second Floor (2F) - Diagnostics & Treatment
  {
    id: 'hosp_2f_mri',
    floor: '2F',
    x: 195,
    y: 256,
    connectTo: '2F_h_w_end',
    name: { en: 'MRI Scan', te: 'ఎంఆర్ఐ స్కాన్', hi: 'एमआरआई स्कैन' },
    category: 'diagnostics',
    description: {
      en: 'High-field 3-Tesla MRI imaging suite in the West Imaging Department.',
      te: 'వెస్ట్ ఇమేజింగ్ విభాగంలో ఉన్న హై-ఫీల్డ్ ఎంఆర్ఐ స్కానింగ్ సూట్.',
      hi: 'पश्चिम इमेजिंग विभाग में हाई-फील्ड एमआरआई स्कैन सूट।',
    },
    keywords: ['mri', 'scan', 'imaging', 'radiology'],
  },
  {
    id: 'hosp_2f_ct',
    floor: '2F',
    x: 314,
    y: 180,
    connectTo: '2F_h_nw1',
    name: { en: 'CT Scan', te: 'సిటి స్కాన్', hi: 'सीटी स्कैन' },
    category: 'diagnostics',
    description: {
      en: 'Multi-slice computed tomography scanner for rapid diagnostic imaging.',
      te: 'వేగవంతమైన డయాగ్నోస్టిక్ ఇమేజింగ్ కోసం సిటి స్కాన్ విభాగం.',
      hi: 'त्वरित डायग्नोस्टिक इमेजिंग के लिए मल्टी-स्लाइस सीटी स्कैनर।',
    },
    keywords: ['ct', 'ct scan', 'cat scan', 'imaging', 'radiology'],
  },
  {
    id: 'hosp_2f_xray',
    floor: '2F',
    x: 262,
    y: 306,
    connectTo: '2F_h_sw3',
    name: { en: 'X-Ray', te: 'ఎక్స్-రే', hi: 'एक्स-रे' },
    category: 'diagnostics',
    description: {
      en: 'Digital X-Ray radiography suite with wheelchair-accessible imaging tables.',
      te: 'వీల్‌చైర్-అనుకూల డిజిటల్ ఎక్స్-రే విభాగం.',
      hi: 'व्हीलचेयर-अनुकूल डिजिटल एक्स-रे रेडियोग्राफी कक्ष।',
    },
    keywords: ['xray', 'x-ray', 'radiology', 'imaging'],
  },
  {
    id: 'hosp_2f_ultrasound',
    floor: '2F',
    x: 350,
    y: 332,
    connectTo: '2F_h_sw2',
    name: { en: 'Ultrasound', te: 'అల్ట్రాసౌండ్', hi: 'अल्ट्रासाउंड' },
    category: 'diagnostics',
    description: {
      en: 'Sonography, Doppler studies, and prenatal ultrasound imaging rooms.',
      te: 'సోనోగ్రఫీ, డాప్లర్ మరియు అల్ట్రాసౌండ్ స్కానింగ్ గదులు.',
      hi: 'सोनोग्राफी, डॉपलर और अल्ट्रासाउंड इमेजिंग कक्ष।',
    },
    keywords: ['ultrasound', 'sonography', 'scan', 'usg'],
  },
  {
    id: 'hosp_2f_labopaedics',
    floor: '2F',
    x: 568,
    y: 146,
    connectTo: '2F_h_stairs_j',
    name: { en: 'Labopaedics', te: 'ల్యాబోపెడిక్స్', hi: 'लैबोपेडिक्स' },
    category: 'diagnostics',
    description: {
      en: 'Specialized diagnostic lab testing unit adjacent to the central core.',
      te: 'సెంట్రల్ కోర్ పక్కన ఉన్న ప్రత్యేక డయాగ్నోస్టిక్ ల్యాబ్ యూనిట్.',
      hi: 'केंद्रीय कोर के बगल में स्थित विशेष डायग्नोस्टिक लैब यूनिट।',
    },
    keywords: ['labopaedics', 'lab', 'diagnostics'],
  },
  {
    id: 'hosp_2f_lab_dept',
    floor: '2F',
    x: 668,
    y: 126,
    connectTo: '2F_h_ne2',
    name: { en: 'Laboratory Department', te: 'ల్యాబొరేటరీ విభాగం', hi: 'प्रयोगशाला विभाग' },
    category: 'diagnostics',
    description: {
      en: 'Main clinical biochemistry, microbiology, and hematology diagnostic laboratories.',
      te: 'ప్రధాన క్లినికల్ బయోకెమిస్ట్రీ మరియు మైక్రోబయాలజీ ల్యాబ్‌లు.',
      hi: 'मुख्य क्लिनिकल बायोकेमिस्ट्री और माइक्रोबायोलॉजी प्रयोगशालाएँ।',
    },
    keywords: ['laboratory', 'lab', 'diagnostics', 'testing'],
  },
  {
    id: 'hosp_2f_pathology',
    floor: '2F',
    x: 656,
    y: 152,
    connectTo: '2F_h_ne2',
    name: { en: 'Pathology', te: 'పాథాలజీ', hi: 'पैथोलॉजी' },
    category: 'diagnostics',
    description: {
      en: 'Histopathology, biopsy analysis, and comprehensive clinical pathology lab.',
      te: 'బయాప్సీ మరియు సమగ్ర క్లినికల్ పాథాలజీ ల్యాబ్.',
      hi: 'बायोप्सी विश्लेषण और व्यापक क्लिनिकल पैथोलॉजी लैब।',
    },
    keywords: ['pathology', 'biopsy', 'lab', 'tests'],
  },
  {
    id: 'hosp_2f_blood_testing',
    floor: '2F',
    x: 658,
    y: 226,
    connectTo: '2F_h_ne1',
    name: { en: 'Blood Testing', te: 'రక్త పరీక్షల విభాగం', hi: 'रक्त परीक्षण' },
    category: 'diagnostics',
    description: {
      en: 'Dedicated hematology, blood panels, and fasting sample testing bay.',
      te: 'రక్త పరీక్షలు మరియు నమూనా విశ్లేషణ విభాగం.',
      hi: 'हेमेटोलॉजी और रक्त जांच केंद्र।',
    },
    keywords: ['blood testing', 'blood test', 'blood', 'hematology'],
  },
  {
    id: 'hosp_2f_dialysis',
    floor: '2F',
    x: 752,
    y: 194,
    connectTo: '2F_h_ne3',
    name: { en: 'Dialysis Unit', te: 'డయాలసిస్ యూనిట్', hi: 'डायलिसिस यूनिट' },
    category: 'emergency_care',
    description: {
      en: 'Monitored renal hemodialysis unit with reclining treatment stations.',
      te: 'నిపుణుల పర్యవేక్షణలో పనిచేసే కిడ్నీ డయాలసిస్ చికిత్స యూనిట్.',
      hi: 'निगरानी युक्त रीनल हीमोडायलिसिस उपचार इकाई।',
    },
    keywords: ['dialysis', 'kidney', 'renal', 'treatment'],
  },
  {
    id: 'hosp_2f_physiotherapy',
    floor: '2F',
    x: 764,
    y: 270,
    connectTo: '2F_h_se2',
    name: { en: 'Physiotherapy', te: 'ఫిజియోథెరపీ', hi: 'फिजियोथेरेपी' },
    category: 'clinic',
    description: {
      en: 'Physical rehabilitation, mobility training, and post-surgical therapy gym.',
      te: 'ఫిజికల్ రిహాబిలిటేషన్ మరియు శస్త్రచికిత్స అనంతర థెరపీ కేంద్రం.',
      hi: 'शारीरिक पुनर्वास, मोबिलिटी प्रशिक्षण और पोस्ट-सर्जिकल थेरेपी केंद्र।',
    },
    keywords: ['physiotherapy', 'physio', 'rehab', 'therapy', 'exercise'],
  },
  {
    id: 'hosp_2f_minor_or',
    floor: '2F',
    x: 802,
    y: 224,
    connectTo: '2F_h_e_end',
    name: { en: 'Minor Operation Rooms', te: 'మైనర్ ఆపరేషన్ గదులు', hi: 'माइनर ऑपरेशन कक्ष' },
    category: 'emergency_care',
    description: {
      en: 'Day-care procedure suites for minor surgical interventions and wound dressings.',
      te: 'చిన్న శస్త్రచికిత్సలు మరియు డే-కేర్ ప్రొసీజర్ గదులు.',
      hi: 'छोटी सर्जरी और डे-केयर प्रक्रियाओं के लिए ऑपरेशन कक्ष।',
    },
    keywords: ['minor operation', 'minor or', 'procedure', 'surgery'],
  },
  {
    id: 'hosp_2f_diag_reception',
    floor: '2F',
    x: 668,
    y: 326,
    connectTo: '2F_h_se1',
    name: { en: 'Diagnostic Reception', te: 'డయాగ్నోస్టిక్ రిసెప్షన్', hi: 'डायग्नोस्टिक रिसेप्शन' },
    category: 'facility',
    description: {
      en: 'Check-in desk for MRI, CT, X-Ray, Ultrasound, and laboratory appointments.',
      te: 'స్కానింగ్ మరియు ల్యాబ్ అపాయింట్‌మెంట్ల చెక్-ఇన్ కౌంటర్.',
      hi: 'एमआरआई, सीटी, एक्स-रे और लैब अपॉइंटमेंट के लिए चेक-इन डेस्क।',
    },
    keywords: ['diagnostic reception', 'reception', 'check in', 'scan desk'],
    isQRCheckpoint: true,
    qrCode: 'NVQ-HOSP-2F-DIAG',
  },
  {
    id: 'hosp_2f_report_counter',
    floor: '2F',
    x: 552,
    y: 342,
    connectTo: '2F_h_recep_j',
    name: { en: 'Report Collection Counter', te: 'రిపోర్ట్ సేకరణ కౌంటర్', hi: 'रिपोर्ट संग्रह काउंटर' },
    category: 'facility',
    description: {
      en: 'Collect printed lab reports, imaging films, and digital diagnostic records.',
      te: 'ల్యాబ్ రిపోర్టులు మరియు స్కాన్ ఫిల్మ్‌లు తీసుకునే కౌంటర్.',
      hi: 'लैब रिपोर्ट और इमेजिंग फिल्म प्राप्त करने का काउंटर।',
    },
    keywords: ['report', 'results', 'collection', 'counter'],
  },
  {
    id: 'hosp_2f_nursing',
    floor: '2F',
    x: 590,
    y: 190,
    connectTo: '2F_h_ne1',
    name: { en: 'Nursing Station (2F)', te: 'నర్సింగ్ స్టేషన్ (2F)', hi: 'नर्सिंग स्टेशन (2F)' },
    category: 'facility',
    description: {
      en: 'Diagnostics floor nursing support for contrast prep and dialysis coordination.',
      te: 'రెండవ అంతస్తు డయాగ్నోస్టిక్స్ నర్సింగ్ సహాయ కేంద్రం.',
      hi: 'दूसरी मंजिल डायग्नोस्टिक्स और डायलिसिस सहायता नर्सिंग स्टेशन।',
    },
    keywords: ['nursing', 'nurse', 'help'],
  },
  {
    id: 'hosp_2f_waiting',
    floor: '2F',
    x: 498,
    y: 260,
    connectTo: '2F_h_wait_front',
    name: { en: 'Patient Waiting Area (2F)', te: 'రోగుల వెయిటింగ్ ఏరియా (2F)', hi: 'रोगी प्रतीक्षा क्षेत्र (2F)' },
    category: 'facility',
    description: {
      en: 'Comfortable central seating area for patients awaiting scans and lab results.',
      te: 'స్కాన్లు మరియు ల్యాబ్ రిపోర్టుల కోసం వేచి ఉండే ప్రాంతం.',
      hi: 'स्कैन और लैब रिपोर्ट की प्रतीक्षा कर रहे रोगियों के लिए बैठने का क्षेत्र।',
    },
    keywords: ['waiting', 'lounge', 'seating'],
  },
  {
    id: 'hosp_2f_restrooms',
    floor: '2F',
    x: 548,
    y: 152,
    connectTo: '2F_h_stairs_j',
    name: { en: 'Restrooms (2F)', te: 'రెస్ట్‌రూమ్‌లు (2F)', hi: 'रेस्टरूम (2F)' },
    category: 'facility',
    description: {
      en: 'Wheelchair-accessible washrooms near the central core on Second Floor.',
      te: 'రెండవ అంతస్తు సెంట్రల్ కోర్ వద్ద వీల్‌చైర్ అనుకూల రెస్ట్‌రూమ్‌లు.',
      hi: 'दूसरी मंजिल के केंद्रीय कोर के पास सुगम शौचालय।',
    },
    keywords: ['restroom', 'washroom', 'toilet', 'bathroom'],
    isRestroom: true,
  },

  // Third Floor (3F) - Patient Care & Surgery
  {
    id: 'hosp_3f_surgery',
    floor: '3F',
    x: 256,
    y: 152,
    connectTo: '3F_h_nw1',
    name: { en: 'Surgery Department', te: 'శస్త్రచికిత్స విభాగం', hi: 'सर्जरी विभाग' },
    category: 'emergency_care',
    description: {
      en: 'Surgical consultation and sterile operating wing housing OT 1 and OT 3.',
      te: 'OT 1 మరియు OT 3 ఉన్న ప్రధాన శస్త్రచికిత్స విభాగం.',
      hi: 'ओटी 1 और ओटी 3 सहित प्रमुख सर्जरी विभाग।',
    },
    keywords: ['surgery', 'surgical', 'operation', 'ot'],
  },
  {
    id: 'hosp_3f_ot1',
    floor: '3F',
    x: 314,
    y: 178,
    connectTo: '3F_h_nw1',
    name: { en: 'Operation Theatre (OT 1)', te: 'ఆపరేషన్ థియేటర్ (OT 1)', hi: 'ऑपरेशन थिएटर (OT 1)' },
    category: 'emergency_care',
    description: {
      en: 'Modular laminar-flow Operation Theatre 1 for general and speciality surgeries.',
      te: 'సాధారణ మరియు ప్రత్యేక శస్త్రచికిత్సల కోసం ఆపరేషన్ థియేటర్ 1.',
      hi: 'सामान्य और विशेषज्ञ सर्जरी के लिए मॉड्यूलर ऑपरेशन थिएटर 1।',
    },
    keywords: ['ot 1', 'ot1', 'operation theatre', 'surgery'],
  },
  {
    id: 'hosp_3f_ot3',
    floor: '3F',
    x: 262,
    y: 212,
    connectTo: '3F_h_sw3',
    name: { en: 'Operation Theatre (OT 3)', te: 'ఆపరేషన్ థియేటర్ (OT 3)', hi: 'ऑपरेशन थिएटर (OT 3)' },
    category: 'emergency_care',
    description: {
      en: 'Dedicated Operation Theatre 3 equipped for orthopaedic and cardiac procedures.',
      te: 'ఆర్థోపెడిక్ మరియు కార్డియాక్ శస్త్రచికిత్సల కోసం ఆపరేషన్ థియేటర్ 3.',
      hi: 'ऑर्थोपेडिक और कार्डियक प्रक्रियाओं के लिए ऑपरेशन थिएटर 3।',
    },
    keywords: ['ot 3', 'ot3', 'operation theatre', 'surgery'],
  },
  {
    id: 'hosp_3f_preop',
    floor: '3F',
    x: 635,
    y: 138,
    connectTo: '3F_h_ne2',
    name: { en: 'Pre-Operative Area', te: 'ప్రీ-ఆపరేటివ్ ప్రాంతం', hi: 'प्री-ऑपरेटिव क्षेत्र' },
    category: 'emergency_care',
    description: {
      en: 'Pre-surgical preparation and anesthesia readiness bays.',
      te: 'శస్త్రచికిత్సకు ముందు రోగులను సిద్ధం చేసే ప్రాంతం.',
      hi: 'सर्जरी से पहले तैयारी और एनेस्थीसिया मूल्यांकन क्षेत्र।',
    },
    keywords: ['pre-op', 'pre operative', 'surgery prep'],
  },
  {
    id: 'hosp_3f_recovery_room',
    floor: '3F',
    x: 732,
    y: 186,
    connectTo: '3F_h_ne3',
    name: { en: 'Recovery Room', te: 'రికవరీ రూమ్', hi: 'रिकवरी रूम' },
    category: 'ward',
    description: {
      en: 'Post-anesthesia care unit for closely monitored surgical recovery.',
      te: 'శస్త్రచికిత్స అనంతర పర్యవేక్షణ మరియు రికవరీ గది.',
      hi: 'सर्जरी के बाद निगरानी और रिकवरी कक्ष।',
    },
    keywords: ['recovery', 'post-op', 'pacu'],
  },
  {
    id: 'hosp_3f_recovery_icu',
    floor: '3F',
    x: 760,
    y: 195,
    connectTo: '3F_h_ne3',
    name: { en: 'Recovery ICU', te: 'రికవరీ ఐసియు', hi: 'रिकवरी आईसीयू' },
    category: 'emergency_care',
    description: {
      en: 'High-dependency surgical recovery intensive care beds.',
      te: 'శస్త్రచికిత్స అనంతర ఇంటెన్సివ్ కేర్ పడకలు.',
      hi: 'सर्जरी के बाद उच्च-निर्भरता गहन चिकित्सा इकाई।',
    },
    keywords: ['recovery icu', 'surgical icu', 'icu'],
  },
  {
    id: 'hosp_3f_icu',
    floor: '3F',
    x: 796,
    y: 212,
    connectTo: '3F_h_e_end',
    name: { en: 'ICU (Intensive Care Unit)', te: 'ఐసియు (ఇంటెన్సివ్ కేర్ యూనిట్)', hi: 'आईसीयू (गहन चिकित्सा इकाई)' },
    category: 'emergency_care',
    description: {
      en: '24/7 critical care unit with continuous vital monitoring and controlled visitor access.',
      te: '24/7 నిరంతర పర్యవేక్షణతో కూడిన ఇంటెన్సివ్ కేర్ యూనిట్.',
      hi: 'निरंतर निगरानी और नियंत्रित आगंतुक प्रवेश वाली 24/7 गहन चिकित्सा इकाई।',
    },
    keywords: ['icu', 'intensive care', 'critical care'],
    isQRCheckpoint: true,
    qrCode: 'NVQ-HOSP-3F-ICU',
  },
  {
    id: 'hosp_3f_patient_care_unit',
    floor: '3F',
    x: 196,
    y: 256,
    connectTo: '3F_h_w_end',
    name: { en: 'Patient Care Unit', te: 'పేషెంట్ కేర్ యూనిట్', hi: 'रोगी देखभाल इकाई' },
    category: 'ward',
    description: {
      en: 'Inpatient monitoring and dedicated nursing care wing on the West side of 3F.',
      te: '3F పశ్చిమ విభాగంలో ఇన్‌పేషెంట్ పర్యవేక్షణ మరియు సంరక్షణ యూనిట్.',
      hi: '3F के पश्चिमी विंग में इनपेशेंट देखभाल और नर्सिंग इकाई।',
    },
    keywords: ['patient care', 'inpatient', 'ward'],
  },
  {
    id: 'hosp_3f_general_wards',
    floor: '3F',
    x: 232,
    y: 272,
    connectTo: '3F_h_sw3',
    name: { en: 'General Wards', te: 'జనరల్ వార్డులు', hi: 'जनरल वार्ड' },
    category: 'ward',
    description: {
      en: 'Multi-bed inpatient recovery wards with 24-hour nursing supervision.',
      te: '24 గంటల నర్సింగ్ పర్యవేక్షణతో కూడిన జనరల్ వార్డులు.',
      hi: '24 घंटे नर्सिंग देखरेख वाले मल्टी-बेड जनरल वार्ड।',
    },
    keywords: ['general ward', 'wards', 'beds', 'inpatient'],
  },
  {
    id: 'hosp_3f_maternity',
    floor: '3F',
    x: 340,
    y: 342,
    connectTo: '3F_h_sw2',
    name: { en: 'Maternity Ward', te: 'ప్రసూతి వార్డు (మెటర్నిటీ)', hi: 'मातृत्व वार्ड (मैटरनिटी)' },
    category: 'ward',
    description: {
      en: 'Postnatal mother-and-baby suites with dedicated maternity nursing support.',
      te: 'తల్లి మరియు శిశు సంరక్షణ కోసం ప్రత్యేక ప్రసూతి వార్డు.',
      hi: 'माँ और नवजात की देखभाल के लिए विशेष मातृत्व वार्ड।',
    },
    keywords: ['maternity', 'mother', 'baby', 'ward'],
  },
  {
    id: 'hosp_3f_labour_delivery',
    floor: '3F',
    x: 386,
    y: 378,
    connectTo: '3F_h_sw1',
    name: { en: 'Labour & Delivery Room', te: 'లేబర్ & డెలివరీ రూమ్', hi: 'लेबर और डिलीवरी कक्ष' },
    category: 'emergency_care',
    description: {
      en: 'Modern birthing suites directly adjacent to the Neonatal Care Unit.',
      te: 'నియోనాటల్ కేర్ యూనిట్ పక్కన ఉన్న ఆధునిక ప్రసవ గదులు.',
      hi: 'नवजात देखभाल इकाई के ठीक बगल में आधुनिक प्रसव कक्ष।',
    },
    keywords: ['labour', 'labor', 'delivery', 'birthing', 'maternity'],
  },
  {
    id: 'hosp_3f_nicu',
    floor: '3F',
    x: 408,
    y: 378,
    connectTo: '3F_h_lobby',
    name: { en: 'Neonatal Care Unit', te: 'నియోనాటల్ కేర్ యూనిట్ (NICU)', hi: 'नवजात देखभाल इकाई (NICU)' },
    category: 'emergency_care',
    description: {
      en: 'Specialized newborn intensive care nursery with incubator monitoring.',
      te: 'నవజాత శిశువుల ప్రత్యేక సంరక్షణ యూనిట్ (NICU).',
      hi: 'इनक्यूबेटर निगरानी के साथ विशेष नवजात गहन देखभाल इकाई।',
    },
    keywords: ['neonatal', 'nicu', 'newborn', 'baby'],
  },
  {
    id: 'hosp_3f_private_rooms',
    floor: '3F',
    x: 750,
    y: 278,
    connectTo: '3F_h_se2',
    name: { en: 'Private Rooms', te: 'ప్రైవేట్ గదులు', hi: 'प्राइवेट कमरे' },
    category: 'ward',
    description: {
      en: 'Single-occupancy patient suites with attendant seating and en-suite washrooms.',
      te: 'అటెండెంట్ సౌకర్యాలతో కూడిన సింగిల్ ప్రైవేట్ పేషెంట్ గదులు.',
      hi: 'अटेंडेंट बैठने और संलग्न शौचालय वाले एकल प्राइवेट कमरे।',
    },
    keywords: ['private room', 'deluxe', 'suite', 'room'],
  },
  {
    id: 'hosp_3f_nursing',
    floor: '3F',
    x: 660,
    y: 316,
    connectTo: '3F_h_se1',
    name: { en: 'Nursing Stations (3F)', te: 'నర్సింగ్ స్టేషన్లు (3F)', hi: 'नर्सिंग स्टेशन (3F)' },
    category: 'facility',
    description: {
      en: 'Central surgical & inpatient care coordination desk on Third Floor.',
      te: 'మూడవ అంతస్తు ఇన్‌పేషెంట్ మరియు సర్జరీ నర్సింగ్ స్టేషన్.',
      hi: 'तीसरी मंजिल का सर्जिकल और इनपेशेंट नर्सिंग स्टेशन।',
    },
    keywords: ['nursing', 'nurse', 'reception', 'help'],
  },
  {
    id: 'hosp_3f_waiting',
    floor: '3F',
    x: 498,
    y: 256,
    connectTo: '3F_h_wait_front',
    name: { en: 'Waiting Lounge (3F)', te: 'వెయిటింగ్ లాంజ్ (3F)', hi: 'वेटिंग लाउंज (3F)' },
    category: 'facility',
    description: {
      en: 'Family waiting lounge for Surgery, ICU, and Maternity visitors.',
      te: 'సర్జరీ, ఐసియు మరియు మెటర్నిటీ సందర్శకుల కోసం వెయిటింగ్ లాంజ్.',
      hi: 'सर्जरी, आईसीयू और मातृत्व आगंतुकों के लिए पारिवारिक प्रतीक्षा लाउंज।',
    },
    keywords: ['waiting', 'lounge', 'family'],
  },
  {
    id: 'hosp_3f_restrooms',
    floor: '3F',
    x: 658,
    y: 226,
    connectTo: '3F_h_ne1',
    name: { en: 'Restrooms (3F)', te: 'రెస్ట్‌రూమ్‌లు (3F)', hi: 'रेस्टरूम (3F)' },
    category: 'facility',
    description: {
      en: 'Wheelchair-accessible visitor restrooms near Third Floor Waiting Lounge.',
      te: 'మూడవ అంతస్తు వెయిటింగ్ లాంజ్ సమీపంలో వీల్‌చైర్ అనుకూల రెస్ట్‌రూమ్‌లు.',
      hi: 'तीसरी मंजिल वेटिंग लाउंज के पास सुगम आगंतुक शौचालय।',
    },
    keywords: ['restroom', 'washroom', 'toilet', 'bathroom'],
    isRestroom: true,
  },
];

// Add shared Main Lifts, Stairs, and Emergency Exits to all 4 Hospital floors
for (const f of FLOORS) {
  hospitalPlaceSeeds.push(
    {
      id: `hosp_${f.toLowerCase()}_lifts`,
      floor: f,
      x: 426,
      y: 202,
      connectTo: `${f}_h_lift_j`,
      existingNodeId: `${f}_main_lifts`,
      name: {
        en: `Main Lifts (${f})`,
        te: `ప్రధాన లిఫ్ట్‌లు (${f})`,
        hi: `मुख्य लिफ्ट (${f})`,
      },
      category: 'transit',
      description: {
        en: 'Spacious wheelchair & stretcher accessible central hospital elevators connecting GF–3F.',
        te: 'GF నుండి 3F వరకు కలిపే వీల్‌చైర్ మరియు స్ట్రెచర్ అనుకూల ప్రధాన లిఫ్ట్‌లు.',
        hi: 'GF से 3F तक जाने वाली व्हीलचेयर और स्ट्रेचर अनुकूल मुख्य अस्पताल लिफ्ट।',
      },
      keywords: ['lift', 'elevator', 'wheelchair', 'accessible', 'main lifts'],
      wheelchairAccessible: true,
      isLift: true,
    },
    {
      id: `hosp_${f.toLowerCase()}_stairs`,
      floor: f,
      x: 505,
      y: 168,
      connectTo: `${f}_h_stairs_j`,
      existingNodeId: `${f}_main_stairs`,
      name: {
        en: `Main Stairs (${f})`,
        te: `ప్రధాన మెట్లు (${f})`,
        hi: `मुख्य सीढ़ियाँ (${f})`,
      },
      category: 'transit',
      description: {
        en: 'Central stairwell connecting GF, 1F, 2F, and 3F. Not wheelchair accessible.',
        te: 'GF, 1F, 2F మరియు 3F అంతస్తులను కలిపే సెంట్రల్ మెట్లు.',
        hi: 'GF, 1F, 2F और 3F को जोड़ने वाली केंद्रीय सीढ़ियाँ।',
      },
      keywords: ['stairs', 'staircase', 'steps'],
      wheelchairAccessible: false,
    },
    {
      id: `hosp_${f.toLowerCase()}_exit_north`,
      floor: f,
      x: 334,
      y: 128,
      connectTo: `${f}_h_n_exit_j`,
      existingNodeId: `${f}_exit_north`,
      name: {
        en: `Emergency Exit North (${f})`,
        te: `అత్యవసర నిష్క్రమణ ఉత్తరం (${f})`,
        hi: `आपातकालीन निकास उत्तर (${f})`,
      },
      category: 'exit',
      description: {
        en: 'North wing emergency exit route with fire-rated egress.',
        te: 'ఉత్తర విభాగం అత్యవసర నిష్క్రమణ ద్వారం.',
        hi: 'उत्तरी विंग आपातकालीन निकास द्वार।',
      },
      keywords: ['emergency exit', 'fire exit', 'safe exit', 'north exit'],
      wheelchairAccessible: true,
      isEmergencyExit: true,
    },
    {
      id: `hosp_${f.toLowerCase()}_exit_east`,
      floor: f,
      x: 872,
      y: 252,
      connectTo: `${f}_h_e_end`,
      existingNodeId: `${f}_exit_east`,
      name: {
        en: `Emergency Exit East (${f})`,
        te: `అత్యవసర నిష్క్రమణ తూర్పు (${f})`,
        hi: `आपातकालीन निकास पूर्व (${f})`,
      },
      category: 'exit',
      description: {
        en: 'East wing emergency exit leading to safe outdoor assembly point.',
        te: 'తూర్పు విభాగం అత్యవసర నిష్క్రమణ ద్వారం.',
        hi: 'पूर्वी विंग आपातकालीन निकास द्वार।',
      },
      keywords: ['emergency exit', 'fire exit', 'safe exit', 'east exit'],
      wheelchairAccessible: true,
      isEmergencyExit: true,
    }
  );

  if (f !== 'GF') {
    hospitalPlaceSeeds.push({
      id: `hosp_${f.toLowerCase()}_exit_west`,
      floor: f,
      x: 96,
      y: 254,
      connectTo: `${f}_h_w_end`,
      existingNodeId: `${f}_exit_west`,
      name: {
        en: `Emergency Exit West (${f})`,
        te: `అత్యవసర నిష్క్రమణ పడమర (${f})`,
        hi: `आपातकालीन निकास पश्चिम (${f})`,
      },
      category: 'exit',
      description: {
        en: 'West wing emergency exit stairwell serving upper clinical wings.',
        te: 'పశ్చిమ విభాగం అత్యవసర నిష్క్రమణ ద్వారం.',
        hi: 'पश्चिमी विंग आपातकालीन निकास द्वार।',
      },
      keywords: ['emergency exit', 'fire exit', 'safe exit', 'west exit'],
      wheelchairAccessible: true,
      isEmergencyExit: true,
    });
  }
}

const {
  nodes: hospitalNodes,
  edges: hospitalEdges,
  places: hospitalPlaces,
} = attachPlacesToGraph(baseHospitalNodes, baseHospitalEdges, hospitalPlaceSeeds);

export const HOSPITAL_DATASET: BuildingDataset = {
  id: 'hospital',
  name: {
    en: 'City Care Hospital',
    te: 'సిటీ కేర్ హాస్పిటల్',
    hi: 'सिटी केयर हॉस्पिटल',
  },
  tagline: {
    en: '4 Levels · Emergency, Speciality Clinics, Diagnostics & Surgery',
    te: '4 అంతస్తులు · ఎమర్జెన్సీ, క్లినిక్‌లు, డయాగ్నోస్టిక్స్ & సర్జరీ',
    hi: '4 मंजिलें · आपातकाल, विशेषज्ञ क्लिनिक, डायग्नोस्टिक्स और सर्जरी',
  },
  viewBoxWidth: 1000,
  viewBoxHeight: 545,
  defaultStartPlaceId: 'hosp_gf_main_entrance',
  floors: [
    {
      id: 'GF',
      order: 0,
      shortName: { en: 'GF', te: 'GF', hi: 'GF' },
      fullName: { en: 'Ground Floor (GF)', te: 'గ్రౌండ్ ఫ్లోర్ (GF)', hi: 'भूतल (GF)' },
      subtitle: {
        en: 'Emergency & General Services',
        te: 'అత్యవసర & సాధారణ సేవలు',
        hi: 'आपातकालीन और सामान्य सेवाएं',
      },
      imageUrl: '/assets/maps/hosp_gf.png',
    },
    {
      id: '1F',
      order: 1,
      shortName: { en: '1F', te: '1F', hi: '1F' },
      fullName: { en: 'First Floor (1F)', te: 'మొదటి అంతస్తు (1F)', hi: 'पहली मंजिल (1F)' },
      subtitle: {
        en: 'Consultation & Speciality Clinics',
        te: 'కన్సల్టేషన్ & స్పెషాలిటీ క్లినిక్‌లు',
        hi: 'परामर्श और विशेषज्ञ क्लिनिक',
      },
      imageUrl: '/assets/maps/hosp_1f.png',
    },
    {
      id: '2F',
      order: 2,
      shortName: { en: '2F', te: '2F', hi: '2F' },
      fullName: { en: 'Second Floor (2F)', te: 'రెండవ అంతస్తు (2F)', hi: 'दूसरी मंजिल (2F)' },
      subtitle: {
        en: 'Diagnostics & Treatment',
        te: 'డయాగ్నోస్టిక్స్ & చికిత్స',
        hi: 'डायग्नोस्टिक्स और उपचार',
      },
      imageUrl: '/assets/maps/hosp_2f.png',
    },
    {
      id: '3F',
      order: 3,
      shortName: { en: '3F', te: '3F', hi: '3F' },
      fullName: { en: 'Third Floor (3F)', te: 'మూడవ అంతస్తు (3F)', hi: 'तीसरी मंजिल (3F)' },
      subtitle: {
        en: 'Patient Care & Surgery',
        te: 'పేషెంట్ కేర్ & శస్త్రచికిత్స',
        hi: 'रोगी देखभाल और सर्जरी',
      },
      imageUrl: '/assets/maps/hosp_3f.png',
    },
  ],
  places: hospitalPlaces,
  nodes: hospitalNodes,
  edges: hospitalEdges,
  emergencyScenarios: [
    {
      id: 'hosp_gf_east_blocked',
      title: {
        en: 'Blocked Corridor near GF Diagnostics & East Exit',
        te: 'GF డయాగ్నోస్టిక్స్ వద్ద మూసివేసిన కారిడార్ డెమో',
        hi: 'GF डायग्नोस्टिक्स के पास अवरुद्ध गलियारा (डेमो)',
      },
      alertBanner: {
        en: 'SIMULATED ALERT: Corridor blockage and hazard near GF East Diagnostics & Emergency Exit East. Routing visitors safely away to Emergency Exit North.',
        te: 'డెమో హెచ్చరిక: GF తూర్పు డయాగ్నోస్టిక్స్ మరియు తూర్పు ఎగ్జిట్ మార్గం మూసివేయబడింది. ఉత్తర అత్యవసర నిష్క్రమణకు సురక్షిత మార్గం చూపబడుతోంది.',
        hi: 'डेमो अलर्ट: GF पूर्व डायग्नोस्टिक्स और पूर्वी निकास अवरुद्ध हैं। आगंतुकों को सुरक्षित रूप से उत्तरी आपातकालीन निकास की ओर ले जाया जा रहा है।',
      },
      severity: 'critical',
      affectedFloors: ['GF'],
      dangerZones: [
        {
          id: 'dz_hosp_gf_east',
          floor: 'GF',
          x: 815,
          y: 235,
          radius: 82,
          label: {
            en: 'Blocked East Corridor (GF)',
            te: 'మూసివేసిన తూర్పు కారిడార్ (GF)',
            hi: 'अवरुद्ध पूर्वी गलियारा (GF)',
          },
          description: {
            en: 'Simulated corridor obstruction blocking GF Basic Laboratory and Emergency Exit East.',
            te: 'GF బేసిక్ ల్యాబ్ మరియు తూర్పు ఎగ్జిట్‌ను నిరోధించే డెమో అడ్డంకి.',
            hi: 'GF बेसिक लैब और पूर्वी निकास को अवरुद्ध करने वाला सिमुलेटेड अवरोध।',
          },
          blockedNodeIds: ['GF_h_e_end', 'GF_exit_east', 'GF_h_se2'],
          blockedEdgePairs: [
            ['GF_h_se1', 'GF_h_se2'],
            ['GF_h_ne3', 'GF_h_e_end'],
          ],
        },
      ],
    },
    {
      id: 'hosp_2f_lab_hazard',
      title: {
        en: 'Simulated Hazard in 2F Laboratory & Dialysis Wing',
        te: '2F ల్యాబ్ & డయాలసిస్ విభాగంలో ప్రమాద డెమో',
        hi: '2F प्रयोगशाला विंग में सिमुलेटेड खतरा',
      },
      alertBanner: {
        en: 'SIMULATED ALERT: Chemical spill containment active in 2F Northeast Laboratory corridor. Avoid East corridor; evacuate via Emergency Exit North or West.',
        te: 'డెమో హెచ్చరిక: 2F ఈశాన్య ల్యాబొరేటరీ కారిడార్‌లో రసాయన ప్రమాదం. తూర్పు మార్గాన్ని తప్పించి ఉత్తర లేదా పడమర ఎగ్జిట్ ఉపయోగించండి.',
        hi: 'डेमो अलर्ट: 2F उत्तर-पूर्व प्रयोगशाला गलियारे में खतरा। पूर्वी गलियारे से बचें और उत्तर या पश्चिम निकास का उपयोग करें।',
      },
      severity: 'high',
      affectedFloors: ['2F'],
      dangerZones: [
        {
          id: 'dz_hosp_2f_lab',
          floor: '2F',
          x: 685,
          y: 185,
          radius: 88,
          label: {
            en: 'Containment Zone (2F Lab Wing)',
            te: 'నియంత్రణ ప్రాంతం (2F ల్యాబ్ వింగ్)',
            hi: 'प्रतिबंधित क्षेत्र (2F लैब विंग)',
          },
          description: {
            en: 'Simulated lab spill isolating 2F Pathology, Blood Testing, and Dialysis corridor.',
            te: '2F పాథాలజీ మరియు డయాలసిస్ కారిడార్‌ను నిరోధించే డెమో ప్రాంతం.',
            hi: '2F पैथोलॉजी और डायलिसिस गलियारे को अवरुद्ध करने वाला सिमुलेटेड क्षेत्र।',
          },
          blockedNodeIds: ['2F_h_ne2', '2F_h_ne3', '2F_exit_east'],
          blockedEdgePairs: [
            ['2F_h_ne1', '2F_h_ne2'],
            ['2F_h_se1', '2F_h_ne2'],
          ],
        },
      ],
    },
  ],
};
