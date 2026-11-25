import {
  BuildingDataset,
  FloorId,
  NavEdge,
  NavNode,
} from '../types/navigation';
import { attachPlacesToGraph, PlaceSeed } from './buildingGraphBuilder';

const FLOORS: FloorId[] = ['GF', '1F', '2F', '3F'];

function buildMallCorridorGraph(): { nodes: NavNode[]; edges: NavEdge[] } {
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
    // Shared architectural corridor skeleton on every mall floor (viewBox 1000 x 747)
    // Left outer perimeter corridor
    addNode({ id: `${f}_c_nw`, floor: f, x: 142, y: 238, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_c_wl`, floor: f, x: 112, y: 335, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_c_sw`, floor: f, x: 152, y: 388, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_c_exitc_j`, floor: f, x: 162, y: 472, kind: 'corridor', wheelchairAccessible: true });

    // Top main promenade corridor (y = 238)
    addNode({ id: `${f}_c_top_l1`, floor: f, x: 232, y: 238, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_c_top_l2`, floor: f, x: 355, y: 238, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_c_top_c`, floor: f, x: 488, y: 238, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_c_top_r1`, floor: f, x: 645, y: 238, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_c_top_r2`, floor: f, x: 785, y: 238, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_c_ne`, floor: f, x: 858, y: 238, kind: 'corridor', wheelchairAccessible: true });

    // Middle-left vertical corridor (x = 232, between Reception/ATMs and inner stores)
    addNode({ id: `${f}_c_ml_mid`, floor: f, x: 232, y: 310, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_c_ml_bot`, floor: f, x: 232, y: 388, kind: 'corridor', wheelchairAccessible: true });

    // Central spine & atrium corridor
    addNode({ id: `${f}_c_atrium_n`, floor: f, x: 488, y: 295, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_c_atrium_c`, floor: f, x: 488, y: 388, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_c_mid_l`, floor: f, x: 365, y: 388, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_c_mid_r`, floor: f, x: 675, y: 388, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_c_mr_top`, floor: f, x: 675, y: 305, kind: 'corridor', wheelchairAccessible: true });

    // Right outer corridor
    addNode({ id: `${f}_c_el`, floor: f, x: 852, y: 335, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_c_se`, floor: f, x: 838, y: 388, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_c_exitd_j`, floor: f, x: 838, y: 478, kind: 'corridor', wheelchairAccessible: true });

    // Lower promenade (y = 498 on GF, y = 556 on 1F-3F)
    const lowerY = f === 'GF' ? 488 : 562;
    addNode({ id: `${f}_c_bot_l`, floor: f, x: 262, y: lowerY, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_c_bot_c`, floor: f, x: 492, y: lowerY, kind: 'corridor', wheelchairAccessible: true });
    addNode({ id: `${f}_c_bot_r`, floor: f, x: 705, y: lowerY, kind: 'corridor', wheelchairAccessible: true });

    // Vertical transit nodes on every floor
    addNode({
      id: `${f}_lift_a`,
      floor: f,
      x: 74,
      y: 344,
      kind: 'lift',
      wheelchairAccessible: true,
      label: { en: 'Lifts (A)', te: 'లిఫ్ట్‌లు (A)', hi: 'लिफ्ट (A)' },
    });
    addNode({
      id: `${f}_lift_b`,
      floor: f,
      x: 888,
      y: 342,
      kind: 'lift',
      wheelchairAccessible: true,
      label: { en: 'Lifts (B)', te: 'లిఫ్ట్‌లు (B)', hi: 'लिफ्ट (B)' },
    });
    addNode({
      id: `${f}_esc_n`,
      floor: f,
      x: 488,
      y: 192,
      kind: 'escalator',
      wheelchairAccessible: false,
      label: { en: 'North Escalators', te: 'ఉత్తర ఎస్కలేటర్లు', hi: 'उत्तरी एस्केलेटर' },
    });
    addNode({
      id: `${f}_esc_c`,
      floor: f,
      x: f === 'GF' ? 492 : 585,
      y: f === 'GF' ? 425 : 322,
      kind: 'escalator',
      wheelchairAccessible: false,
      label: { en: 'Central Escalators', te: 'సెంట్రల్ ఎస్కలేటర్లు', hi: 'सेंट्रल एस्केलेटर' },
    });
    addNode({
      id: `${f}_stairs_a`,
      floor: f,
      x: 120,
      y: 190,
      kind: 'stairs',
      wheelchairAccessible: false,
      label: { en: 'Stairs A', te: 'మెట్లు A', hi: 'सीढ़ियाँ A' },
    });
    addNode({
      id: `${f}_stairs_b`,
      floor: f,
      x: 880,
      y: 190,
      kind: 'stairs',
      wheelchairAccessible: false,
      label: { en: 'Stairs B', te: 'మెట్లు B', hi: 'सीढ़ियाँ B' },
    });
    addNode({
      id: `${f}_stairs_c`,
      floor: f,
      x: 112,
      y: 448,
      kind: 'stairs',
      wheelchairAccessible: false,
      label: { en: 'Stairs C', te: 'మెట్లు C', hi: 'सीढ़ियाँ C' },
    });
    addNode({
      id: `${f}_stairs_d`,
      floor: f,
      x: 888,
      y: 448,
      kind: 'stairs',
      wheelchairAccessible: false,
      label: { en: 'Stairs D', te: 'మెట్లు D', hi: 'सीढ़ियाँ D' },
    });

    // Emergency Exits A, B, C, D on every floor
    addNode({
      id: `${f}_exit_a`,
      floor: f,
      x: 136,
      y: 162,
      kind: 'exit',
      wheelchairAccessible: true,
      label: { en: 'Emergency Exit A', te: 'అత్యవసర నిష్క్రమణ A', hi: 'आपातकालीन निकास A' },
    });
    addNode({
      id: `${f}_exit_b`,
      floor: f,
      x: 864,
      y: 162,
      kind: 'exit',
      wheelchairAccessible: true,
      label: { en: 'Emergency Exit B', te: 'అత్యవసర నిష్క్రమణ B', hi: 'आपातकालीन निकास B' },
    });
    addNode({
      id: `${f}_exit_c`,
      floor: f,
      x: 154,
      y: 484,
      kind: 'exit',
      wheelchairAccessible: true,
      label: { en: 'Emergency Exit C', te: 'అత్యవసర నిష్క్రమణ C', hi: 'आपातकालीन निकास C' },
    });
    addNode({
      id: `${f}_exit_d`,
      floor: f,
      x: 846,
      y: 484,
      kind: 'exit',
      wheelchairAccessible: true,
      label: { en: 'Emergency Exit D', te: 'అత్యవసర నిష్క్రమణ D', hi: 'आपातकालीन निकास D' },
    });

    // Corridor connections (strictly walkable halls)
    addEdge(`${f}_c_nw`, `${f}_c_top_l1`);
    addEdge(`${f}_c_top_l1`, `${f}_c_top_l2`);
    addEdge(`${f}_c_top_l2`, `${f}_c_top_c`);
    addEdge(`${f}_c_top_c`, `${f}_c_top_r1`);
    addEdge(`${f}_c_top_r1`, `${f}_c_top_r2`);
    addEdge(`${f}_c_top_r2`, `${f}_c_ne`);

    addEdge(`${f}_c_nw`, `${f}_c_wl`);
    addEdge(`${f}_c_wl`, `${f}_c_sw`);
    addEdge(`${f}_c_sw`, `${f}_c_exitc_j`);

    addEdge(`${f}_c_top_l1`, `${f}_c_ml_mid`);
    addEdge(`${f}_c_ml_mid`, `${f}_c_ml_bot`);
    addEdge(`${f}_c_sw`, `${f}_c_ml_bot`);
    addEdge(`${f}_c_ml_bot`, `${f}_c_mid_l`);
    addEdge(`${f}_c_mid_l`, `${f}_c_atrium_c`);

    addEdge(`${f}_c_top_c`, `${f}_c_atrium_n`);
    addEdge(`${f}_c_atrium_n`, `${f}_c_atrium_c`);

    addEdge(`${f}_c_top_r1`, `${f}_c_mr_top`);
    addEdge(`${f}_c_mr_top`, `${f}_c_mid_r`);
    addEdge(`${f}_c_atrium_c`, `${f}_c_mid_r`);
    addEdge(`${f}_c_mid_r`, `${f}_c_se`);

    addEdge(`${f}_c_ne`, `${f}_c_el`);
    addEdge(`${f}_c_el`, `${f}_c_se`);
    addEdge(`${f}_c_se`, `${f}_c_exitd_j`);

    // Lower promenade connections
    addEdge(`${f}_c_exitc_j`, `${f}_c_bot_l`);
    addEdge(`${f}_c_bot_l`, `${f}_c_bot_c`);
    addEdge(`${f}_c_bot_c`, `${f}_c_bot_r`);
    addEdge(`${f}_c_bot_r`, `${f}_c_exitd_j`);
    addEdge(`${f}_c_atrium_c`, `${f}_c_bot_c`);

    // Connect vertical transit nodes
    addEdge(`${f}_c_wl`, `${f}_lift_a`, 'corridor', true);
    addEdge(`${f}_c_el`, `${f}_lift_b`, 'corridor', true);
    addEdge(`${f}_c_top_c`, `${f}_esc_n`, 'corridor', false);
    if (f === 'GF') {
      addEdge(`${f}_c_atrium_c`, `${f}_esc_c`, 'corridor', false);
      addEdge(`${f}_c_bot_c`, `${f}_esc_c`, 'corridor', false);
    } else {
      addEdge(`${f}_c_atrium_n`, `${f}_esc_c`, 'corridor', false);
      addEdge(`${f}_c_atrium_c`, `${f}_esc_c`, 'corridor', false);
    }

    // Connect exits and stairs
    addEdge(`${f}_c_nw`, `${f}_stairs_a`, 'corridor', false);
    addEdge(`${f}_c_nw`, `${f}_exit_a`, 'corridor', true);
    addEdge(`${f}_c_ne`, `${f}_stairs_b`, 'corridor', false);
    addEdge(`${f}_c_ne`, `${f}_exit_b`, 'corridor', true);
    addEdge(`${f}_c_exitc_j`, `${f}_stairs_c`, 'corridor', false);
    addEdge(`${f}_c_exitc_j`, `${f}_exit_c`, 'corridor', true);
    addEdge(`${f}_c_exitd_j`, `${f}_stairs_d`, 'corridor', false);
    addEdge(`${f}_c_exitd_j`, `${f}_exit_d`, 'corridor', true);
  }

  // Inter-floor vertical edges (GF <-> 1F <-> 2F <-> 3F)
  for (let i = 0; i < FLOORS.length - 1; i++) {
    const f1 = FLOORS[i];
    const f2 = FLOORS[i + 1];
    addEdge(`${f1}_lift_a`, `${f2}_lift_a`, 'lift', true, 120);
    addEdge(`${f1}_lift_b`, `${f2}_lift_b`, 'lift', true, 120);
    addEdge(`${f1}_esc_n`, `${f2}_esc_n`, 'escalator', false, 100);
    addEdge(`${f1}_esc_c`, `${f2}_esc_c`, 'escalator', false, 100);
    addEdge(`${f1}_stairs_a`, `${f2}_stairs_a`, 'stairs', false, 130);
    addEdge(`${f1}_stairs_b`, `${f2}_stairs_b`, 'stairs', false, 130);
    addEdge(`${f1}_stairs_c`, `${f2}_stairs_c`, 'stairs', false, 130);
    addEdge(`${f1}_stairs_d`, `${f2}_stairs_d`, 'stairs', false, 130);
  }

  return { nodes, edges };
}

const { nodes: baseMallNodes, edges: baseMallEdges } = buildMallCorridorGraph();

const mallPlaceSeeds: PlaceSeed[] = [
  // Ground Floor (GF)
  {
    id: 'mall_gf_main_entrance',
    floor: 'GF',
    x: 492,
    y: 622,
    connectTo: 'GF_c_bot_c',
    name: { en: 'Main Entrance', te: 'ప్రధాన ప్రవేశ ద్వారం', hi: 'मुख्य प्रवेश द्वार' },
    category: 'entrance',
    description: {
      en: 'Primary ground-floor mall entrance leading directly into security screening and the central promenade.',
      te: 'భద్రతా తనిఖీ మరియు సెంట్రల్ ప్రొమెనేడ్‌కు దారితీసే ప్రధాన గ్రౌండ్-ఫ్లోర్ ప్రవేశ ద్వారం.',
      hi: 'मुख्य भूतल मॉल प्रवेश द्वार जो सीधे सुरक्षा जांच और केंद्रीय गलियारे की ओर जाता है।',
    },
    keywords: ['entrance', 'entry', 'main gate', 'start', 'door'],
    isQRCheckpoint: true,
    qrCode: 'NVQ-MALL-GF-ENTRY',
  },
  {
    id: 'mall_gf_security',
    floor: 'GF',
    x: 492,
    y: 558,
    connectTo: 'GF_c_bot_c',
    name: { en: 'Security Checking', te: 'భద్రతా తనిఖీ', hi: 'सुरक्षा जांच' },
    category: 'facility',
    description: {
      en: 'Visitor bag screening and step-free accessibility gate at the main entrance lobby.',
      te: 'ప్రధాన ప్రవేశ లాబీలో సందర్శకుల భద్రతా తనిఖీ మరియు వీల్‌చైర్ యాక్సెస్ గేట్.',
      hi: 'मुख्य प्रवेश लॉबी में आगंतुक बैग स्क्रीनिंग और सुगम प्रवेश द्वार।',
    },
    keywords: ['security', 'check', 'gate', 'screening'],
  },
  {
    id: 'mall_gf_parking',
    floor: 'GF',
    x: 745,
    y: 480,
    connectTo: 'GF_c_bot_r',
    name: { en: 'Parking Access', te: 'పార్కింగ్ యాక్సెస్', hi: 'पार्किंग पहुँच' },
    category: 'entrance',
    description: {
      en: 'Direct step-free corridor to basement car and two-wheeler parking levels.',
      te: 'బేస్‌మెంట్ కారు మరియు ద్విచక్ర వాహన పార్కింగ్ స్థాయిలకు నేరుగా వెళ్లే మార్గం.',
      hi: 'बेसमेंट कार और दोपहिया पार्किंग स्तरों के लिए सीधा सुगम गलियारा।',
    },
    keywords: ['parking', 'car', 'valet', 'garage', 'basement'],
  },
  {
    id: 'mall_gf_zudio',
    floor: 'GF',
    x: 252,
    y: 212,
    connectTo: 'GF_c_top_l1',
    name: { en: 'Zudio', te: 'జూడియో', hi: 'ज़ूडियो' },
    category: 'store',
    description: {
      en: 'Trendy everyday fashion, footwear, and beauty essentials at accessible prices.',
      te: 'అందుబాటు ధరలలో ఫ్యాషన్ దుస్తులు, పాదరక్షలు మరియు బ్యూటీ ఉత్పత్తులు.',
      hi: 'किफायती कीमतों पर ट्रेंडी फैशन, फुटवियर और ब्यूटी उत्पाद।',
    },
    keywords: ['zudio', 'fashion', 'clothes', 'apparel', 'shopping'],
  },
  {
    id: 'mall_gf_max',
    floor: 'GF',
    x: 382,
    y: 212,
    connectTo: 'GF_c_top_l2',
    name: { en: 'Max', te: 'మ్యాక్స్', hi: 'मैक्स' },
    category: 'store',
    description: {
      en: 'Family fashion store featuring menswear, womenswear, kids clothing, and accessories.',
      te: 'పురుషులు, మహిళలు మరియు పిల్లల ఫ్యాషన్ దుస్తులు లభించే స్టోర్.',
      hi: 'पुरुषों, महिलाओं और बच्चों के कपड़ों और एक्सेसरीज़ का फैशन स्टोर।',
    },
    keywords: ['max', 'fashion', 'clothing', 'family', 'wear'],
  },
  {
    id: 'mall_gf_reliance_smart',
    floor: 'GF',
    x: 688,
    y: 218,
    connectTo: 'GF_c_top_r1',
    name: { en: 'Reliance Smart Bazaar', te: 'రిలయన్స్ స్మార్ట్ బజార్', hi: 'रिलायंस स्मार्ट बाज़ार' },
    category: 'store',
    description: {
      en: 'Full-service supermarket for fresh groceries, household supplies, and daily essentials.',
      te: 'తాజా కిరాణా సరుకులు, గృహోపకరణాలు మరియు రోజువారీ అవసరాల సూపర్ మార్కెట్.',
      hi: 'ताज़ा किराना, घरेलू सामान और दैनिक आवश्यकताओं का सुपरमार्केट।',
    },
    keywords: ['reliance', 'smart bazaar', 'grocery', 'supermarket', 'hypermarket'],
    isQRCheckpoint: true,
    qrCode: 'NVQ-MALL-GF-SMART',
  },
  {
    id: 'mall_gf_miniso',
    floor: 'GF',
    x: 260,
    y: 256,
    connectTo: 'GF_c_ml_mid',
    name: { en: 'Miniso', te: 'మినిసో', hi: 'मिनिसो' },
    category: 'store',
    description: {
      en: 'Japanese-inspired lifestyle goods, plush toys, stationery, and travel accessories.',
      te: 'లైఫ్‌స్టైల్ వస్తువులు, బొమ్మలు, స్టేషనరీ మరియు ట్రావెల్ యాక్సెసరీలు.',
      hi: 'लाइफस्टाइल सामान, खिलौने, स्टेशनरी और ट्रैवल एक्सेसरीज़।',
    },
    keywords: ['miniso', 'gifts', 'toys', 'lifestyle', 'stationery'],
  },
  {
    id: 'mall_gf_apollo',
    floor: 'GF',
    x: 332,
    y: 368,
    connectTo: 'GF_c_mid_l',
    name: { en: 'Apollo Pharmacy', te: 'అపోలో ఫార్మసీ', hi: 'अपोलो फार्मेसी' },
    category: 'pharmacy',
    description: {
      en: 'Licensed pharmacy offering prescription medicines, first-aid kits, and wellness care.',
      te: 'మందులు, ప్రథమ చికిత్స సామగ్రి మరియు ఆరోగ్య సంరక్షణ ఉత్పత్తులు లభించే ఫార్మసీ.',
      hi: 'दवाइयों, प्राथमिक चिकित्सा और स्वास्थ्य देखभाल उत्पादों के लिए विश्वसनीय फार्मेसी।',
    },
    keywords: ['apollo', 'pharmacy', 'medicine', 'chemist', 'medical', 'drugstore', 'first aid'],
  },
  {
    id: 'mall_gf_haldirams',
    floor: 'GF',
    x: 745,
    y: 358,
    connectTo: 'GF_c_mr_top',
    name: { en: "Haldiram's", te: 'హల్దీరామ్స్', hi: 'हल्दीराम' },
    category: 'dining',
    description: {
      en: 'Traditional Indian sweets, chaat, snacks, and vegetarian family dining.',
      te: 'సంప్రదాయ భారతీయ స్వీట్లు, చాట్, స్నాక్స్ మరియు శాఖాహార భోజనం.',
      hi: 'पारंपरिक भारतीय मिठाइयाँ, चाट, स्नैक्स और शाकाहारी भोजन।',
    },
    keywords: ['haldiram', 'sweets', 'snacks', 'indian food', 'chaat', 'dining'],
  },
  {
    id: 'mall_gf_body_shop',
    floor: 'GF',
    x: 256,
    y: 464,
    connectTo: 'GF_c_ml_bot',
    name: { en: 'The Body Shop', te: 'ది బాడీ షాప్', hi: 'द बॉडी शॉप' },
    category: 'store',
    description: {
      en: 'Ethically sourced skincare, fragrances, bath, and natural body care products.',
      te: 'సహజమైన చర్మ సంరక్షణ, సుగంధ ద్రవ్యాలు మరియు బాడీ కేర్ ఉత్పత్తులు.',
      hi: 'प्राकृतिक स्किनकेयर, सुगंध और बॉडी केयर उत्पाद।',
    },
    keywords: ['body shop', 'cosmetics', 'skincare', 'beauty', 'perfume'],
  },
  {
    id: 'mall_gf_lenskart',
    floor: 'GF',
    x: 380,
    y: 464,
    connectTo: 'GF_c_mid_l',
    name: { en: 'Lenskart', te: 'లెన్స్‌కార్ట్', hi: 'लेंसकार्ट' },
    category: 'store',
    description: {
      en: 'Eyeglasses, sunglasses, contact lenses, and complimentary computerised eye tests.',
      te: 'కళ్లద్దాలు, సన్ గ్లాసెస్, కాంటాక్ట్ లెన్స్‌లు మరియు ఉచిత కంటి పరీక్ష.',
      hi: 'चश्मे, धूप के चश्मे, कॉन्टैक्ट लेंस और मुफ्त आँखों की जांच।',
    },
    keywords: ['lenskart', 'glasses', 'eyewear', 'optical', 'sunglasses'],
  },
  {
    id: 'mall_gf_starbucks',
    floor: 'GF',
    x: 620,
    y: 464,
    connectTo: 'GF_c_mid_r',
    name: { en: 'Starbucks (GF)', te: 'స్టార్‌బక్స్ (GF)', hi: 'स्टारबक्स (GF)' },
    category: 'dining',
    description: {
      en: 'Specialty handcrafted espresso beverages, cold brews, and freshly baked pastries.',
      te: 'ప్రత్యేక కాఫీ పానీయాలు, కోల్డ్ బ్రూస్ మరియు బేకరీ పదార్థాలు.',
      hi: 'स्पेशलिटी कॉफी, कोल्ड ब्रू और ताज़ी पेस्ट्री।',
    },
    keywords: ['starbucks', 'coffee', 'cafe', 'tea', 'bakery'],
  },
  {
    id: 'mall_gf_reception',
    floor: 'GF',
    x: 175,
    y: 297,
    connectTo: 'GF_c_ml_mid',
    name: { en: 'Reception (GF)', te: 'రిసెప్షన్ (GF)', hi: 'रिसेप्शन (GF)' },
    category: 'facility',
    description: {
      en: 'Ground floor concierge desk for mall directories, wheelchair loan, and lost & found.',
      te: 'మాల్ సమాచారం, వీల్‌చైర్ సహాయం మరియు హెల్ప్ డెస్క్.',
      hi: 'मॉल की जानकारी, व्हीलचेयर सहायता और हेल्प डेस्क।',
    },
    keywords: ['reception', 'help desk', 'info', 'concierge'],
  },
  {
    id: 'mall_gf_atms',
    floor: 'GF',
    x: 170,
    y: 366,
    connectTo: 'GF_c_ml_mid',
    name: { en: 'ATMs (GF)', te: 'ఏటీఎంలు (GF)', hi: 'एटीएम (GF)' },
    category: 'facility',
    description: {
      en: '24-hour multi-bank ATM bay located next to the West reception corridor.',
      te: 'వెస్ట్ రిసెప్షన్ పక్కన ఉన్న 24 గంటల మల్టీ-బ్యాంక్ ఏటీఎం కేంద్రం.',
      hi: 'वेस्ट रिसेप्शन के पास 24 घंटे उपलब्ध मल्टी-बैंक एटीएम।',
    },
    keywords: ['atm', 'cash', 'bank', 'money'],
  },
  {
    id: 'mall_gf_restrooms_sw',
    floor: 'GF',
    x: 145,
    y: 414,
    connectTo: 'GF_c_sw',
    name: { en: 'Restrooms (GF West)', te: 'రెస్ట్‌రూమ్‌లు (GF వెస్ట్)', hi: 'रेस्टरूम (GF पश्चिम)' },
    category: 'facility',
    description: {
      en: 'Accessible washrooms with baby changing station near Southwest corridor.',
      te: 'నైరుతి కారిడార్ వద్ద వీల్‌చైర్ అనుకూల రెస్ట్‌రూమ్‌లు.',
      hi: 'दक्षिण-पश्चिम गलियारे के पास सुगम शौचालय।',
    },
    keywords: ['restroom', 'washroom', 'toilet', 'bathroom', 'wc'],
    isRestroom: true,
  },
  {
    id: 'mall_gf_restrooms_entry',
    floor: 'GF',
    x: 322,
    y: 562,
    connectTo: 'GF_c_bot_l',
    name: { en: 'Restrooms (Main Lobby)', te: 'రెస్ట్‌రూమ్‌లు (మెయిన్ లాబీ)', hi: 'रेस्टरूम (मुख्य लॉबी)' },
    category: 'facility',
    description: {
      en: 'Wheelchair-accessible public washrooms beside the ground floor main entrance.',
      te: 'ప్రధాన ప్రవేశ ద్వారం పక్కన ఉన్న వీల్‌చైర్ అనుకూల వాష్‌రూమ్‌లు.',
      hi: 'मुख्य प्रवेश द्वार के पास व्हीलचेयर-अनुकूल शौचालय।',
    },
    keywords: ['restroom', 'washroom', 'toilet', 'bathroom'],
    isRestroom: true,
  },

  // First Floor (1F)
  {
    id: 'mall_1f_zara',
    floor: '1F',
    x: 230,
    y: 197,
    connectTo: '1F_c_top_l1',
    name: { en: 'Zara', te: 'జారా', hi: 'ज़ारा' },
    category: 'store',
    description: {
      en: 'Contemporary European apparel, seasonal collections, and fashion accessories.',
      te: 'ఆధునిక ఫ్యాషన్ దుస్తులు, సీజనల్ కలెక్షన్లు మరియు యాక్సెసరీలు.',
      hi: 'समकालीन यूरोपीय परिधान, मौसमी कलेक्शन और फैशन एक्सेसरीज़।',
    },
    keywords: ['zara', 'fashion', 'clothes', 'apparel', 'boutique'],
  },
  {
    id: 'mall_1f_hm',
    floor: '1F',
    x: 356,
    y: 199,
    connectTo: '1F_c_top_l2',
    name: { en: 'H&M', te: 'హెచ్&ఎమ్', hi: 'एच एंड एम' },
    category: 'store',
    description: {
      en: 'Modern casualwear, formalwear, denim, and sustainable fashion essentials.',
      te: 'ఆధునిక క్యాజువల్, ఫార్మల్ దుస్తులు మరియు డెనిమ్ కలెక్షన్లు.',
      hi: 'आधुनिक कैज़ुअल, फॉर्मल और डेनिम फैशन परिधान।',
    },
    keywords: ['hm', 'h&m', 'fashion', 'clothing', 'wear'],
  },
  {
    id: 'mall_1f_shoppers_stop',
    floor: '1F',
    x: 635,
    y: 196,
    connectTo: '1F_c_top_r1',
    name: { en: 'Shoppers Stop', te: 'షాపర్స్ స్టాప్', hi: 'शॉपर्स स्टॉप' },
    category: 'store',
    description: {
      en: 'Multi-brand department store for premium apparel, watches, cosmetics, and handbags.',
      te: 'ప్రీమియం దుస్తులు, గడియారాలు, సౌందర్య సాధనాల మల్టీ-బ్రాండ్ స్టోర్.',
      hi: 'प्रीमियम परिधान, घड़ियाँ, कॉस्मेटिक्स और हैंडबैग का मल्टी-ब्रांड स्टोर।',
    },
    keywords: ['shoppers stop', 'department store', 'watches', 'fashion', 'beauty'],
    isQRCheckpoint: true,
    qrCode: 'NVQ-MALL-1F-ATRIUM',
  },
  {
    id: 'mall_1f_westside',
    floor: '1F',
    x: 782,
    y: 197,
    connectTo: '1F_c_top_r2',
    name: { en: 'Westside', te: 'వెస్ట్‌సైడ్', hi: 'वेस्टसाइड' },
    category: 'store',
    description: {
      en: 'Ethnic wear, western fashion, footwear, and curated home decor collections.',
      te: 'సంప్రదాయ మరియు ఆధునిక దుస్తులు, పాదరక్షలు మరియు గృహాలంకరణ.',
      hi: 'एथनिक वियर, वेस्टर्न फैशन, फुटवियर और होम डेकोर।',
    },
    keywords: ['westside', 'ethnic', 'fashion', 'home', 'clothes'],
  },
  {
    id: 'mall_1f_levis',
    floor: '1F',
    x: 295,
    y: 294,
    connectTo: '1F_c_ml_mid',
    name: { en: "Levi's", te: 'లెవీస్', hi: 'लिवाइस' },
    category: 'store',
    description: {
      en: 'Iconic denim jeans, jackets, graphic tees, and casual accessories.',
      te: 'ప్రసిద్ధ డెనిమ్ జీన్స్, జాకెట్లు మరియు క్యాజువల్ దుస్తులు.',
      hi: 'प्रतिष्ठित डेनिम जींस, जैकेट और कैज़ुअल कपड़े।',
    },
    keywords: ['levis', 'denim', 'jeans', 'casual'],
  },
  {
    id: 'mall_1f_lifestyle',
    floor: '1F',
    x: 378,
    y: 358,
    connectTo: '1F_c_mid_l',
    name: { en: 'Lifestyle', te: 'లైఫ్‌స్టైల్', hi: 'लाइफस्टाइल' },
    category: 'store',
    description: {
      en: 'Leading apparel, footwear, beauty, and accessories flagship store.',
      te: 'దుస్తులు, పాదరక్షలు, బ్యూటీ మరియు యాక్సెసరీల ప్రధాన స్టోర్.',
      hi: 'कपड़े, फुटवियर, ब्यूटी और एक्सेसरीज़ का प्रमुख स्टोर।',
    },
    keywords: ['lifestyle', 'fashion', 'clothing', 'shoes'],
  },
  {
    id: 'mall_1f_puma',
    floor: '1F',
    x: 748,
    y: 336,
    connectTo: '1F_c_mr_top',
    name: { en: 'Puma', te: 'పూమా', hi: 'प्यूमा' },
    category: 'store',
    description: {
      en: 'Athletic footwear, running gear, sportswear, and active lifestyle apparel.',
      te: 'క్రీడా పాదరక్షలు, రన్నింగ్ గేర్ మరియు స్పోర్ట్స్‌వేర్.',
      hi: 'एथलेटिक फुटवियर, रनिंग गियर और स्पोर्ट्सवियर।',
    },
    keywords: ['puma', 'sports', 'shoes', 'sneakers', 'athletic'],
  },
  {
    id: 'mall_1f_nike',
    floor: '1F',
    x: 356,
    y: 502,
    connectTo: '1F_c_mid_l',
    name: { en: 'Nike', te: 'నైకీ', hi: 'नाइकी' },
    category: 'store',
    description: {
      en: 'Performance sneakers, training apparel, basketball gear, and sports equipment.',
      te: 'స్పోర్ట్స్ షూస్, ట్రైనింగ్ దుస్తులు మరియు క్రీడా పరికరాలు.',
      hi: 'परफॉर्मेंस स्नीकर्स, ट्रेनिंग परिधान और स्पोर्ट्स गियर।',
    },
    keywords: ['nike', 'shoes', 'sneakers', 'sports', 'running'],
  },
  {
    id: 'mall_1f_lifestyle_boutique',
    floor: '1F',
    x: 685,
    y: 510,
    connectTo: '1F_c_mid_r',
    name: { en: 'Lifestyle Boutique', te: 'లైఫ్‌స్టైల్ బొటిక్', hi: 'लाइफस्टाइल बुटीक' },
    category: 'store',
    description: {
      en: 'Curated designer fashion, luxury accessories, and artisanal home accents.',
      te: 'డిజైనర్ ఫ్యాషన్, లగ్జరీ యాక్సెసరీలు మరియు గృహాలంకరణ వస్తువులు.',
      hi: 'क्यूरेटेड डिज़ाइनर फैशन, लक्ज़री एक्सेसरीज़ और होम एक्सेंट्स।',
    },
    keywords: ['lifestyle boutique', 'boutique', 'designer', 'luxury'],
  },
  {
    id: 'mall_1f_reception',
    floor: '1F',
    x: 175,
    y: 297,
    connectTo: '1F_c_ml_mid',
    name: { en: 'Reception (1F)', te: 'రిసెప్షన్ (1F)', hi: 'रिसेप्शन (1F)' },
    category: 'facility',
    description: {
      en: 'First floor visitor assistance desk near Lifts (A).',
      te: 'లిఫ్ట్‌లు (A) వద్ద మొదటి అంతస్తు సమాచార కేంద్రం.',
      hi: 'लिफ्ट (A) के पास पहली मंजिल का आगंतुक सहायता डेस्क।',
    },
    keywords: ['reception', 'help', 'info'],
  },
  {
    id: 'mall_1f_atms',
    floor: '1F',
    x: 170,
    y: 366,
    connectTo: '1F_c_ml_mid',
    name: { en: 'ATMs (1F)', te: 'ఏటీఎంలు (1F)', hi: 'एटीएम (1F)' },
    category: 'facility',
    description: {
      en: 'Cash withdrawal ATM kiosk adjacent to First Floor Reception.',
      te: 'మొదటి అంతస్తు రిసెప్షన్ పక్కన ఉన్న ఏటీఎం కేంద్రం.',
      hi: 'पहली मंजिल रिसेप्शन के पास एटीएम कियोस्क।',
    },
    keywords: ['atm', 'cash', 'bank'],
  },
  {
    id: 'mall_1f_restrooms',
    floor: '1F',
    x: 145,
    y: 414,
    connectTo: '1F_c_sw',
    name: { en: 'Restrooms (1F)', te: 'రెస్ట్‌రూమ్‌లు (1F)', hi: 'रेस्टरूम (1F)' },
    category: 'facility',
    description: {
      en: 'Wheelchair-accessible restrooms located in the Southwest wing on 1F.',
      te: '1F నైరుతి విభాగంలో వీల్‌చైర్ అనుకూల రెస్ట్‌రూమ్‌లు.',
      hi: '1F के दक्षिण-पश्चिम विंग में व्हीलचेयर-अनुकूल शौचालय।',
    },
    keywords: ['restroom', 'washroom', 'toilet', 'bathroom'],
    isRestroom: true,
  },

  // Second Floor (2F)
  {
    id: 'mall_2f_croma',
    floor: '2F',
    x: 228,
    y: 199,
    connectTo: '2F_c_top_l1',
    name: { en: 'Croma', te: 'క్రోమా', hi: 'क्रोमा' },
    category: 'store',
    description: {
      en: 'Multi-brand electronics superstore for TVs, laptops, appliances, and smart home gear.',
      te: 'టీవీలు, ల్యాప్‌టాప్‌లు, గృహోపకరణాలు మరియు ఎలక్ట్రానిక్స్ సూపర్‌స్టోర్.',
      hi: 'टीवी, लैपटॉप, उपकरणों और स्मार्ट होम गैजेट्स का इलेक्ट्रॉनिक्स सुपरस्टोर।',
    },
    keywords: ['croma', 'electronics', 'laptop', 'tv', 'appliances'],
  },
  {
    id: 'mall_2f_apple',
    floor: '2F',
    x: 356,
    y: 152,
    connectTo: '2F_c_top_l2',
    name: { en: 'Apple Store', te: 'ఆపిల్ స్టోర్', hi: 'एप्पल स्टोर' },
    category: 'store',
    description: {
      en: 'Authorized Apple experience center for iPhone, Mac, iPad, Watch, and technical support.',
      te: 'ఐఫోన్, మ్యాక్, ఐప్యాడ్ మరియు సాంకేతిక సహాయం కోసం ఆపిల్ స్టోర్.',
      hi: 'आईफोन, मैक, आईपैड और तकनीकी सहायता के लिए अधिकृत एप्पल स्टोर।',
    },
    keywords: ['apple', 'iphone', 'macbook', 'ipad', 'tech', 'electronics'],
    isQRCheckpoint: true,
    qrCode: 'NVQ-MALL-2F-TECH',
  },
  {
    id: 'mall_2f_bowling',
    floor: '2F',
    x: 635,
    y: 199,
    connectTo: '2F_c_top_r1',
    name: { en: 'Bowling Zone', te: 'బౌలింగ్ జోన్', hi: 'बॉलिंग ज़ोन' },
    category: 'entertainment',
    description: {
      en: 'Six-lane glow bowling alley with lounge seating and group party lanes.',
      te: 'లాంజ్ సీటింగ్‌తో కూడిన ఆరు-లేన్ గ్లో బౌలింగ్ అల్లే.',
      hi: 'लाउंज सीटिंग के साथ सिक्स-लेन ग्लो बॉलिंग एली।',
    },
    keywords: ['bowling', 'games', 'entertainment', 'fun', 'lanes'],
  },
  {
    id: 'mall_2f_reliance_digital',
    floor: '2F',
    x: 782,
    y: 204,
    connectTo: '2F_c_top_r2',
    name: { en: 'Reliance Digital', te: 'రిలయన్స్ డిజిటల్', hi: 'रिलायंस डिजिटल' },
    category: 'store',
    description: {
      en: 'Smartphones, cameras, home appliances, and personal computing showroom.',
      te: 'స్మార్ట్‌ఫోన్‌లు, కెమెరాలు మరియు గృహ ఎలక్ట్రానిక్స్ షోరూమ్.',
      hi: 'स्मार्टफोन, कैमरे और घरेलू इलेक्ट्रॉनिक्स का शोरूम।',
    },
    keywords: ['reliance digital', 'electronics', 'mobile', 'camera', 'tech'],
  },
  {
    id: 'mall_2f_console_hub',
    floor: '2F',
    x: 290,
    y: 368,
    connectTo: '2F_c_ml_bot',
    name: { en: 'Console & Gadget Hub', te: 'కన్సోల్ & గ్యాడ్జెట్ హబ్', hi: 'कंसोल और गैजेट हब' },
    category: 'store',
    description: {
      en: 'Gaming consoles, controllers, VR headsets, drones, and smart accessories.',
      te: 'గేమింగ్ కన్సోల్స్, కంట్రోలర్లు, VR హెడ్‌సెట్లు మరియు స్మార్ట్ గ్యాడ్జెట్లు.',
      hi: 'गेमिंग कंसोल, कंट्रोलर, वीआर हेडसेट और स्मार्ट गैजेट्स।',
    },
    keywords: ['console', 'gadget', 'gaming', 'playstation', 'xbox', 'tech'],
  },
  {
    id: 'mall_2f_bose',
    floor: '2F',
    x: 380,
    y: 360,
    connectTo: '2F_c_mid_l',
    name: { en: 'Bose Audio', te: 'బోస్ ఆడియో', hi: 'बोस ऑडियो' },
    category: 'store',
    description: {
      en: 'Noise-cancelling headphones, soundbars, and acoustic listening studio.',
      te: 'నాయిస్-క్యాన్సిలింగ్ హెడ్‌ఫోన్‌లు, సౌండ్‌బార్‌లు మరియు ఆడియో స్టూడియో.',
      hi: 'नॉइज़-कैंसलिंग हेडफोन, साउंडबार और प्रीमियम ऑडियो स्टूडियो।',
    },
    keywords: ['bose', 'audio', 'speakers', 'headphones', 'sound'],
  },
  {
    id: 'mall_2f_kids_play',
    floor: '2F',
    x: 352,
    y: 502,
    connectTo: '2F_c_mid_l',
    name: { en: 'Kids Play Zone', te: 'కిడ్స్ ప్లే జోన్', hi: 'किड्स प्ले ज़ोन' },
    category: 'entertainment',
    description: {
      en: 'Supervised indoor soft-play park, slides, and ball pit for young children.',
      te: 'చిన్న పిల్లల కోసం సురక్షితమైన ఇండోర్ ప్లే పార్క్ మరియు స్లైడ్‌లు.',
      hi: 'छोटे बच्चों के लिए सुरक्षित इनडोर सॉफ्ट-प्ले पार्क और स्लाइड्स।',
    },
    keywords: ['kids', 'play zone', 'children', 'family', 'fun'],
  },
  {
    id: 'mall_2f_gaming_arcade',
    floor: '2F',
    x: 612,
    y: 472,
    connectTo: '2F_c_mid_r',
    name: { en: 'Gaming & VR Arcade', te: 'గేమింగ్ & VR ఆర్కేడ్', hi: 'गेमिंग और VR आर्केड' },
    category: 'entertainment',
    description: {
      en: 'Immersive virtual reality arenas, racing simulators, and multiplayer arcade machines.',
      te: 'వర్చువల్ రియాలిటీ గేమ్స్, రేసింగ్ సిమ్యులేటర్లు మరియు ఆర్కేడ్ మెషీన్లు.',
      hi: 'वर्चुअल रियलिटी एरीना, रेसिंग सिमुलेटर और मल्टीप्लेयर आर्केड गेम्स।',
    },
    keywords: ['gaming', 'vr', 'arcade', 'virtual reality', 'entertainment'],
  },
  {
    id: 'mall_2f_reception',
    floor: '2F',
    x: 175,
    y: 297,
    connectTo: '2F_c_ml_mid',
    name: { en: 'Reception (2F)', te: 'రిసెప్షన్ (2F)', hi: 'रिसेप्शन (2F)' },
    category: 'facility',
    description: {
      en: 'Second floor guest information and arcade card assistance desk.',
      te: 'రెండవ అంతస్తు సమాచార మరియు సహాయ కేంద్రం.',
      hi: 'दूसरी मंजिल का आगंतुक सूचना और सहायता डेस्क।',
    },
    keywords: ['reception', 'help', 'info'],
  },
  {
    id: 'mall_2f_atms',
    floor: '2F',
    x: 170,
    y: 366,
    connectTo: '2F_c_ml_mid',
    name: { en: 'ATMs (2F)', te: 'ఏటీఎంలు (2F)', hi: 'एटीएम (2F)' },
    category: 'facility',
    description: {
      en: 'Second floor ATM bay located opposite Console & Gadget Hub.',
      te: 'రెండవ అంతస్తు ఏటీఎం కేంద్రం.',
      hi: 'दूसरी मंजिल पर स्थित एटीएम कियोस्क।',
    },
    keywords: ['atm', 'cash', 'bank'],
  },
  {
    id: 'mall_2f_restrooms',
    floor: '2F',
    x: 145,
    y: 414,
    connectTo: '2F_c_sw',
    name: { en: 'Restrooms (2F)', te: 'రెస్ట్‌రూమ్‌లు (2F)', hi: 'रेस्टरूम (2F)' },
    category: 'facility',
    description: {
      en: 'Accessible family restrooms near Kids Play Zone and Lifts (A).',
      te: 'కిడ్స్ ప్లే జోన్ మరియు లిఫ్ట్‌లు (A) సమీపంలో వీల్‌చైర్ అనుకూల రెస్ట్‌రూమ్‌లు.',
      hi: 'किड्स प्ले ज़ोन और लिफ्ट (A) के पास सुगम पारिवारिक शौचालय।',
    },
    keywords: ['restroom', 'washroom', 'toilet', 'bathroom'],
    isRestroom: true,
  },

  // Third Floor (3F)
  {
    id: 'mall_3f_cinema',
    floor: '3F',
    x: 305,
    y: 148,
    connectTo: '3F_c_top_l2',
    name: { en: 'Multiplex Cinema', te: 'మల్టీప్లెక్స్ సినిమా', hi: 'मल्टीप्लेक्स सिनेमा' },
    category: 'entertainment',
    description: {
      en: 'Multi-screen Dolby Atmos cinema auditoriums with accessible seating rows.',
      te: 'డాల్బీ అట్మాస్ సౌండ్ మరియు వీల్‌చైర్ సీటింగ్‌తో కూడిన మల్టీ-స్క్రీన్ సినిమా హాల్స్.',
      hi: 'डॉल्बी एटमॉस और सुगम सीटिंग वाले मल्टी-स्क्रीन सिनेमा हॉल।',
    },
    keywords: ['cinema', 'multiplex', 'movie', 'theater', 'film', 'imax'],
  },
  {
    id: 'mall_3f_box_office',
    floor: '3F',
    x: 332,
    y: 362,
    connectTo: '3F_c_mid_l',
    name: { en: 'Box Office & Lounge', te: 'బాక్స్ ఆఫీస్ & లాంజ్', hi: 'बॉक्स ऑफिस और लाउंज' },
    category: 'entertainment',
    description: {
      en: 'Cinema ticketing counters, gourmet popcorn bar, and pre-show waiting lounge.',
      te: 'సినిమా టికెట్ కౌంటర్లు, స్నాక్స్ బార్ మరియు వెయిటింగ్ లాంజ్.',
      hi: 'सिनेमा टिकट काउंटर, पॉपकॉर्न बार और वेटिंग लाउंज।',
    },
    keywords: ['box office', 'tickets', 'lounge', 'cinema', 'popcorn'],
  },
  {
    id: 'mall_3f_food_court',
    floor: '3F',
    x: 682,
    y: 206,
    connectTo: '3F_c_top_r1',
    name: { en: 'Food Court', te: 'ఫుడ్ కోర్ట్', hi: 'फूड कोर्ट' },
    category: 'dining',
    description: {
      en: 'Spacious central dining hall with multi-cuisine counters and family seating.',
      te: 'వివిధ వంటకాల కౌంటర్లు మరియు కుటుంబ సీటింగ్‌తో విశాలమైన ఫుడ్ కోర్ట్.',
      hi: 'विभिन्न व्यंजनों के काउंटरों और पारिवारिक बैठने की व्यवस्था वाला विशाल फूड कोर्ट।',
    },
    keywords: ['food court', 'food', 'eat', 'dining', 'lunch', 'dinner', 'restaurant'],
    isQRCheckpoint: true,
    qrCode: 'NVQ-MALL-3F-FOOD',
  },
  {
    id: 'mall_3f_kfc',
    floor: '3F',
    x: 595,
    y: 148,
    connectTo: '3F_c_top_r1',
    name: { en: 'KFC', te: 'కెఎఫ్‌సి', hi: 'केएफसी' },
    category: 'dining',
    description: {
      en: 'Quick-service fried chicken, burgers, and combo meals inside the Food Court.',
      te: 'ఫుడ్ కోర్ట్ లోపల ఫ్రైడ్ చికెన్, బర్గర్లు మరియు కాంబో భోజనం.',
      hi: 'फूड कोर्ट के अंदर फ्राइड चिकन, बर्गर और कॉम्बो मील्स।',
    },
    keywords: ['kfc', 'chicken', 'burger', 'fast food', 'food court'],
  },
  {
    id: 'mall_3f_dominos',
    floor: '3F',
    x: 770,
    y: 272,
    connectTo: '3F_c_top_r2',
    name: { en: "Domino's", te: 'డొమినోస్', hi: 'डोमिनोज़' },
    category: 'dining',
    description: {
      en: 'Freshly baked pizzas, garlic breadsticks, and pasta counter near East Food Court.',
      te: 'తాజా పిజ్జాలు, గార్లిక్ బ్రెడ్ మరియు పాస్తా కౌంటర్.',
      hi: 'ताज़ा बेक किए गए पिज़्ज़ा, गार्लिक ब्रेड और पास्ता काउंटर।',
    },
    keywords: ['dominos', 'pizza', 'italian', 'food'],
  },
  {
    id: 'mall_3f_pizza_hut',
    floor: '3F',
    x: 652,
    y: 462,
    connectTo: '3F_c_mid_r',
    name: { en: 'Pizza Hut', te: 'పిజ్జా హట్', hi: 'पिज़्ज़ा हट' },
    category: 'dining',
    description: {
      en: 'Pan pizzas, sides, and dine-in seating adjacent to Barbeque Nation.',
      te: 'పాన్ పిజ్జాలు మరియు డైన్-ఇన్ రెస్టారెంట్.',
      hi: 'पैन पिज़्ज़ा और डाइन-इन रेस्तरां।',
    },
    keywords: ['pizza hut', 'pizza', 'dining', 'food'],
  },
  {
    id: 'mall_3f_starbucks',
    floor: '3F',
    x: 262,
    y: 492,
    connectTo: '3F_c_ml_bot',
    name: { en: 'Starbucks (3F Terrace)', te: 'స్టార్‌బక్స్ (3F)', hi: 'स्टारबक्स (3F)' },
    category: 'dining',
    description: {
      en: 'Spacious coffeehouse lounge with panoramic seating near Multiplex Box Office.',
      te: 'మల్టీప్లెక్స్ సమీపంలో విశాలమైన కాఫీ లాంజ్.',
      hi: 'मल्टीप्लेक्स बॉक्स ऑफिस के पास विशाल कॉफी लाउंज।',
    },
    keywords: ['starbucks', 'coffee', 'cafe', 'lounge'],
  },
  {
    id: 'mall_3f_haldirams',
    floor: '3F',
    x: 774,
    y: 326,
    connectTo: '3F_c_mid_r',
    name: { en: "Haldiram's (3F)", te: 'హల్దీరామ్స్ (3F)', hi: 'हल्दीराम (3F)' },
    category: 'dining',
    description: {
      en: 'Express Indian snacks, thalis, and dessert counter on the dining level.',
      te: 'భారతీయ స్నాక్స్, థాలీలు మరియు డెజర్ట్ కౌంటర్.',
      hi: 'भारतीय स्नैक्स, थाली और मिठाई काउंटर।',
    },
    keywords: ['haldiram', 'indian', 'sweets', 'thali', 'food'],
  },
  {
    id: 'mall_3f_bbq_nation',
    floor: '3F',
    x: 495,
    y: 472,
    connectTo: '3F_c_atrium_c',
    name: { en: 'Barbeque Nation', te: 'బార్బెక్యూ నేషన్', hi: 'बार्बेक्यू नेशन' },
    category: 'dining',
    description: {
      en: 'Live-on-the-table grill buffet restaurant for family and group celebrations.',
      te: 'లైవ్ గ్రిల్ బఫే మరియు ఫ్యామిలీ డైనింగ్ రెస్టారెంట్.',
      hi: 'लाइव-ऑन-टेबल ग्रिल बुफे और पारिवारिक डाइनिंग रेस्तरां।',
    },
    keywords: ['barbeque nation', 'bbq', 'buffet', 'grill', 'dinner', 'restaurant'],
  },
  {
    id: 'mall_3f_ccd',
    floor: '3F',
    x: 776,
    y: 435,
    connectTo: '3F_c_se',
    name: { en: 'Café Coffee Day', te: 'కేఫ్ కాఫీ డే', hi: 'कैफे कॉफी डे' },
    category: 'dining',
    description: {
      en: 'Indian coffeehouse serving hot cappuccinos, cold coffees, and sandwiches.',
      te: 'హాట్ కాఫీ, కోల్డ్ కాఫీ మరియు శాండ్‌విచ్‌లు లభించే కాఫీ హౌస్.',
      hi: 'कैपुचिनो, कोल्ड कॉफी और सैंडविच परोसने वाला कैफे।',
    },
    keywords: ['ccd', 'cafe coffee day', 'coffee', 'cafe', 'snacks'],
  },
  {
    id: 'mall_3f_reception',
    floor: '3F',
    x: 175,
    y: 297,
    connectTo: '3F_c_ml_mid',
    name: { en: 'Reception (3F)', te: 'రిసెప్షన్ (3F)', hi: 'रिसेप्शन (3F)' },
    category: 'facility',
    description: {
      en: 'Third floor concierge desk near Multiplex Cinema and Lifts (A).',
      te: 'సినిమా మరియు లిఫ్ట్‌లు (A) వద్ద మూడవ అంతస్తు రిసెప్షన్.',
      hi: 'सिनेमा और लिफ्ट (A) के पास तीसरी मंजिल का रिसेप्शन।',
    },
    keywords: ['reception', 'help', 'info'],
  },
  {
    id: 'mall_3f_atms',
    floor: '3F',
    x: 170,
    y: 366,
    connectTo: '3F_c_ml_mid',
    name: { en: 'ATMs (3F)', te: 'ఏటీఎంలు (3F)', hi: 'एटीएम (3F)' },
    category: 'facility',
    description: {
      en: 'Third floor ATM counter beside Box Office & Lounge.',
      te: 'బాక్స్ ఆఫీస్ పక్కన ఉన్న మూడవ అంతస్తు ఏటీఎం.',
      hi: 'बॉक्स ऑफिस और लाउंज के बगल में तीसरी मंजिल का एटीएम।',
    },
    keywords: ['atm', 'cash', 'bank'],
  },
  {
    id: 'mall_3f_restrooms',
    floor: '3F',
    x: 145,
    y: 414,
    connectTo: '3F_c_sw',
    name: { en: 'Restrooms (3F)', te: 'రెస్ట్‌రూమ్‌లు (3F)', hi: 'रेस्टरूम (3F)' },
    category: 'facility',
    description: {
      en: 'Accessible washrooms serving the Cinema and Food Court level.',
      te: 'సినిమా మరియు ఫుడ్ కోర్ట్ అంతస్తు కోసం వీల్‌చైర్ అనుకూల రెస్ట్‌రూమ్‌లు.',
      hi: 'सिनेमा और फूड कोर्ट मंजिल के लिए सुगम शौचालय।',
    },
    keywords: ['restroom', 'washroom', 'toilet', 'bathroom'],
    isRestroom: true,
  },
];

// Add shared vertical connectors & emergency exits as searchable clickable places on every floor
for (const f of FLOORS) {
  mallPlaceSeeds.push(
    {
      id: `mall_${f.toLowerCase()}_lift_a`,
      floor: f,
      x: 74,
      y: 344,
      connectTo: `${f}_c_wl`,
      existingNodeId: `${f}_lift_a`,
      name: {
        en: `Lifts A (${f})`,
        te: `లిఫ్ట్‌లు A (${f})`,
        hi: `लिफ्ट A (${f})`,
      },
      category: 'transit',
      description: {
        en: 'Wheelchair-accessible West elevator bank serving GF, 1F, 2F, and 3F.',
        te: 'GF, 1F, 2F మరియు 3F అంతస్తులను కలిపే వీల్‌చైర్-అనుకూల వెస్ట్ లిఫ్ట్‌లు.',
        hi: 'GF, 1F, 2F और 3F को जोड़ने वाली व्हीलचेयर-अनुकूल पश्चिम लिफ्ट।',
      },
      keywords: ['lift', 'elevator', 'wheelchair', 'accessible', 'lifts a'],
      wheelchairAccessible: true,
      isLift: true,
    },
    {
      id: `mall_${f.toLowerCase()}_lift_b`,
      floor: f,
      x: 888,
      y: 342,
      connectTo: `${f}_c_el`,
      existingNodeId: `${f}_lift_b`,
      name: {
        en: `Lifts B (${f})`,
        te: `లిఫ్ట్‌లు B (${f})`,
        hi: `लिफ्ट B (${f})`,
      },
      category: 'transit',
      description: {
        en: 'Wheelchair-accessible East elevator bank connecting all four mall levels.',
        te: 'నాలుగు అంతస్తులను కలిపే వీల్‌చైర్-అనుకూల ఈస్ట్ లిఫ్ట్‌లు.',
        hi: 'सभी चार मंजिलों को जोड़ने वाली व्हीलचेयर-अनुकूल पूर्व लिफ्ट।',
      },
      keywords: ['lift', 'elevator', 'wheelchair', 'accessible', 'lifts b'],
      wheelchairAccessible: true,
      isLift: true,
    },
    {
      id: `mall_${f.toLowerCase()}_escalators`,
      floor: f,
      x: 488,
      y: 192,
      connectTo: `${f}_c_top_c`,
      existingNodeId: `${f}_esc_n`,
      name: {
        en: `Escalators (${f})`,
        te: `ఎస్కలేటర్లు (${f})`,
        hi: `एस्केलेटर (${f})`,
      },
      category: 'transit',
      description: {
        en: 'Central express escalators between floors. Not suitable for wheelchairs.',
        te: 'అంతస్తుల మధ్య సెంట్రల్ ఎస్కలేటర్లు. వీల్‌చైర్‌లకు అనుకూలం కాదు.',
        hi: 'मंजिलों के बीच केंद्रीय एस्केलेटर। व्हीलचेयर के लिए उपयुक्त नहीं।',
      },
      keywords: ['escalator', 'stairs', 'up', 'down'],
      wheelchairAccessible: false,
    },
    {
      id: `mall_${f.toLowerCase()}_exit_a`,
      floor: f,
      x: 136,
      y: 162,
      connectTo: `${f}_c_nw`,
      existingNodeId: `${f}_exit_a`,
      name: {
        en: `Emergency Exit A (${f})`,
        te: `అత్యవసర నిష్క్రమణ A (${f})`,
        hi: `आपातकालीन निकास A (${f})`,
      },
      category: 'exit',
      description: {
        en: 'Northwest emergency fire exit with stairwell and ground-level egress.',
        te: 'వాయువ్య అత్యవసర అగ్ని నిష్క్రమణ ద్వారం.',
        hi: 'उत्तर-पश्चिम आपातकालीन निकास द्वार।',
      },
      keywords: ['emergency exit', 'exit a', 'fire exit', 'safe exit', 'stairs'],
      wheelchairAccessible: true,
      isEmergencyExit: true,
    },
    {
      id: `mall_${f.toLowerCase()}_exit_b`,
      floor: f,
      x: 864,
      y: 162,
      connectTo: `${f}_c_ne`,
      existingNodeId: `${f}_exit_b`,
      name: {
        en: `Emergency Exit B (${f})`,
        te: `అత్యవసర నిష్క్రమణ B (${f})`,
        hi: `आपातकालीन निकास B (${f})`,
      },
      category: 'exit',
      description: {
        en: 'Northeast emergency exit adjacent to East stairwell.',
        te: 'ఈశాన్య అత్యవసర నిష్క్రమణ ద్వారం.',
        hi: 'उत्तर-पूर्व आपातकालीन निकास द्वार।',
      },
      keywords: ['emergency exit', 'exit b', 'fire exit', 'safe exit', 'stairs'],
      wheelchairAccessible: true,
      isEmergencyExit: true,
    },
    {
      id: `mall_${f.toLowerCase()}_exit_c`,
      floor: f,
      x: 154,
      y: 484,
      connectTo: `${f}_c_exitc_j`,
      existingNodeId: `${f}_exit_c`,
      name: {
        en: `Emergency Exit C (${f})`,
        te: `అత్యవసర నిష్క్రమణ C (${f})`,
        hi: `आपातकालीन निकास C (${f})`,
      },
      category: 'exit',
      description: {
        en: 'Southwest emergency exit beside West restrooms and stairwell.',
        te: 'నైరుతి అత్యవసర నిష్క్రమణ ద్వారం.',
        hi: 'दक्षिण-पश्चिम आपातकालीन निकास द्वार।',
      },
      keywords: ['emergency exit', 'exit c', 'fire exit', 'safe exit', 'stairs'],
      wheelchairAccessible: true,
      isEmergencyExit: true,
    },
    {
      id: `mall_${f.toLowerCase()}_exit_d`,
      floor: f,
      x: 846,
      y: 484,
      connectTo: `${f}_c_exitd_j`,
      existingNodeId: `${f}_exit_d`,
      name: {
        en: `Emergency Exit D (${f})`,
        te: `అత్యవసర నిష్క్రమణ D (${f})`,
        hi: `आपातकालीन निकास D (${f})`,
      },
      category: 'exit',
      description: {
        en: 'Southeast emergency exit with direct outdoor assembly access.',
        te: 'ఆగ్నేయ అత్యవసర నిష్క్రమణ ద్వారం.',
        hi: 'दक्षिण-पूर्व आपातकालीन निकास द्वार।',
      },
      keywords: ['emergency exit', 'exit d', 'fire exit', 'safe exit', 'stairs'],
      wheelchairAccessible: true,
      isEmergencyExit: true,
    }
  );
}

const {
  nodes: mallNodes,
  edges: mallEdges,
  places: mallPlaces,
} = attachPlacesToGraph(baseMallNodes, baseMallEdges, mallPlaceSeeds);

export const MALL_DATASET: BuildingDataset = {
  id: 'mall',
  name: {
    en: 'Navique Shopping Mall',
    te: 'నావిక్ షాపింగ్ మాల్',
    hi: 'नाविक शॉपिंग मॉल',
  },
  tagline: {
    en: '4 Floors · Retail, Dining, Cinema & Family Entertainment',
    te: '4 అంతస్తులు · షాపింగ్, డైనింగ్, సినిమా & వినోదం',
    hi: '4 मंजिलें · शॉपिंग, डाइनिंग, सिनेमा और मनोरंजन',
  },
  viewBoxWidth: 1000,
  viewBoxHeight: 747,
  defaultStartPlaceId: 'mall_gf_main_entrance',
  floors: [
    {
      id: 'GF',
      order: 0,
      shortName: { en: 'GF', te: 'GF', hi: 'GF' },
      fullName: { en: 'Ground Floor (GF)', te: 'గ్రౌండ్ ఫ్లోర్ (GF)', hi: 'भूतल (GF)' },
      subtitle: {
        en: 'Hypermarket, Pharmacy, Essentials & Main Entrance',
        te: 'హైపర్‌మార్కెట్, ఫార్మసీ, నిత్యావసరాలు & ప్రధాన ద్వారం',
        hi: 'हाइपरमार्केट, फार्मेसी, आवश्यक वस्तुएं और मुख्य प्रवेश',
      },
      imageUrl: '/assets/maps/mall_gf.png',
    },
    {
      id: '1F',
      order: 1,
      shortName: { en: '1F', te: '1F', hi: '1F' },
      fullName: { en: 'First Floor (1F)', te: 'మొదటి అంతస్తు (1F)', hi: 'पहली मंजिल (1F)' },
      subtitle: {
        en: 'Apparel, Sportswear & Lifestyle Boutiques',
        te: 'ఫ్యాషన్ దుస్తులు, స్పోర్ట్స్‌వేర్ & లైఫ్‌స్టైల్',
        hi: 'परिधान, स्पोर्ट्सवियर और लाइफस्टाइल बुटीक',
      },
      imageUrl: '/assets/maps/mall_1f.png',
    },
    {
      id: '2F',
      order: 2,
      shortName: { en: '2F', te: '2F', hi: '2F' },
      fullName: { en: 'Second Floor (2F)', te: 'రెండవ అంతస్తు (2F)', hi: 'दूसरी मंजिल (2F)' },
      subtitle: {
        en: 'Electronics, Bowling, Kids Play & VR Arcade',
        te: 'ఎలక్ట్రానిక్స్, బౌలింగ్, కిడ్స్ ప్లే & VR ఆర్కేడ్',
        hi: 'इलेक्ट्रॉनिक्स, बॉलिंग, किड्स प्ले और VR आर्केड',
      },
      imageUrl: '/assets/maps/mall_2f.png',
    },
    {
      id: '3F',
      order: 3,
      shortName: { en: '3F', te: '3F', hi: '3F' },
      fullName: { en: 'Third Floor (3F)', te: 'మూడవ అంతస్తు (3F)', hi: 'तीसरी मंजिल (3F)' },
      subtitle: {
        en: 'Multiplex Cinema, Food Court & Fine Dining',
        te: 'మల్టీప్లెక్స్ సినిమా, ఫుడ్ కోర్ట్ & డైనింగ్',
        hi: 'मल्टीप्लेक्स सिनेमा, फूड कोर्ट और फाइन डाइनिंग',
      },
      imageUrl: '/assets/maps/mall_3f.png',
    },
  ],
  places: mallPlaces,
  nodes: mallNodes,
  edges: mallEdges,
  emergencyScenarios: [
    {
      id: 'mall_food_court_fire',
      title: {
        en: 'Simulated Fire near 3F Food Court',
        te: '3F ఫుడ్ కోర్ట్ వద్ద అగ్ని ప్రమాద డెమో',
        hi: '3F फूड कोर्ट के पास सिमुलेटेड आग',
      },
      alertBanner: {
        en: 'SIMULATED ALERT: Kitchen fire reported near 3F Food Court & Exit B. East top corridor and Exit B (3F) are unsafe. Routing to nearest safe exit.',
        te: 'డెమో హెచ్చరిక: 3F ఫుడ్ కోర్ట్ & ఎగ్జిట్ B వద్ద అగ్ని ప్రమాదం. తూర్పు కారిడార్ అసురక్షితం. సురక్షిత నిష్క్రమణకు మార్గం చూపబడుతోంది.',
        hi: 'डेमो अलर्ट: 3F फूड कोर्ट और निकास B के पास आग की सूचना। पूर्वी गलियारा और निकास B अवरुद्ध हैं। निकटतम सुरक्षित निकास का मार्ग दिखाया जा रहा है।',
      },
      severity: 'critical',
      affectedFloors: ['3F'],
      dangerZones: [
        {
          id: 'dz_mall_3f_food',
          floor: '3F',
          x: 720,
          y: 195,
          radius: 105,
          label: {
            en: 'Fire & Smoke Zone (3F Food Court)',
            te: 'అగ్ని & పొగ ప్రాంతం (3F ఫుడ్ కోర్ట్)',
            hi: 'आग और धुआँ क्षेत्र (3F फूड कोर्ट)',
          },
          description: {
            en: 'Simulated kitchen fire blocking 3F Food Court, Northeast corridor, and Emergency Exit B.',
            te: '3F ఫుడ్ కోర్ట్ మరియు ఎగ్జిట్ B మార్గాన్ని నిరోధించే డెమో ప్రమాద ప్రాంతం.',
            hi: '3F फूड कोर्ट और आपातकालीन निकास B को अवरुद्ध करने वाला सिमुलेटेड खतरा क्षेत्र।',
          },
          blockedNodeIds: ['3F_c_top_r1', '3F_c_top_r2', '3F_c_ne', '3F_exit_b', '3F_stairs_b'],
          blockedEdgePairs: [
            ['3F_c_top_c', '3F_c_top_r1'],
            ['3F_c_mr_top', '3F_c_top_r1'],
          ],
        },
      ],
    },
    {
      id: 'mall_gf_entrance_smoke',
      title: {
        en: 'Simulated Smoke near GF Main Entrance',
        te: 'GF ప్రధాన ద్వారం వద్ద పొగ హెచ్చరిక డెమో',
        hi: 'GF मुख्य प्रवेश के पास सिमुलेटेड धुआँ',
      },
      alertBanner: {
        en: 'SIMULATED ALERT: Electrical smoke detected near GF Security Checking & Central Escalators. Main Entrance is closed; please evacuate via Emergency Exits A, B, C, or D.',
        te: 'డెమో హెచ్చరిక: GF సెక్యూరిటీ చెకింగ్ వద్ద పొగ గుర్తించబడింది. ప్రధాన ద్వారం మూసివేయబడింది; అత్యవసర నిష్క్రమణ A, B, C లేదా D ఉపయోగించండి.',
        hi: 'डेमो अलर्ट: GF सुरक्षा जांच के पास धुआँ देखा गया है। मुख्य प्रवेश बंद है; कृपया आपातकालीन निकास A, B, C या D से बाहर निकलें।',
      },
      severity: 'high',
      affectedFloors: ['GF'],
      dangerZones: [
        {
          id: 'dz_mall_gf_entry',
          floor: 'GF',
          x: 492,
          y: 432,
          radius: 82,
          label: {
            en: 'Smoke Hazard (GF Central Atrium)',
            te: 'పొగ ప్రమాదం (GF సెంట్రల్ ఏట్రియం)',
            hi: 'धुआँ खतरा (GF सेंट्रल एट्रियम)',
          },
          description: {
            en: 'Simulated smoke blocking GF Central Atrium, Security Checking, and South Escalators. Perimeter corridors to Exits A–D remain open.',
            te: 'GF సెంట్రల్ ఏట్రియం మరియు సెక్యూరిటీ చెకింగ్‌ను నిరోధించే డెమో పొగ ప్రాంతం. ఎగ్జిట్ A–D మార్గాలు తెరిచి ఉన్నాయి.',
            hi: 'GF सेंट्रल एट्रियम और सुरक्षा जांच को अवरुद्ध करने वाला सिमुलेटेड धुआँ क्षेत्र। निकास A–D के बाहरी गलियारे खुले हैं।',
          },
          blockedNodeIds: ['GF_c_atrium_c', 'GF_esc_c', 'node_mall_gf_security'],
          blockedEdgePairs: [
            ['GF_c_atrium_c', 'GF_c_bot_c'],
            ['GF_c_atrium_n', 'GF_c_atrium_c'],
          ],
        },
      ],
    },
  ],
};
