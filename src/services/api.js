// API service using VITE_API_BASE_URL with transparent offline fallback & simulation

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Local storage keys
const STORAGE_REPORTS_KEY = 'pashu_livestock_reports_v2';
const STORAGE_HERDS_KEY = 'pashu_livestock_herds_v2';
const STORAGE_OUTBREAKS_KEY = 'pashu_livestock_outbreaks_v2';

// Realistic initial dataset for Maharashtra Livestock Surveillance
const INITIAL_REPORTS = [
  {
    id: "MH-2026-REP-8812",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    animalType: "cattle",
    ageYears: 4,
    symptoms: ["fever", "mouth_blisters", "hoof_blisters", "drooling", "lameness", "reduced_milk"],
    daysSinceOnset: 2,
    vaccinationStatus: "no",
    photoUrl: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80",
    location: {
      lat: 18.5204,
      lng: 73.8567,
      village: "Khadakwasla",
      block: "Haveli",
      district: "Pune"
    },
    language: "mr",
    farmer: {
      name: "Tukaram G. Shinde",
      phone: "+91 98224 51092",
      farmSize: "6 Cattle, 3 Buffaloes"
    },
    prediction: {
      disease: "Foot-and-Mouth Disease (FMD) / खुरखुर व तोंडखुरी",
      diseaseCode: "FMD",
      confidence: 94,
      urgency: "critical",
      evidence: [
        "Concurrent mouth ulcerations and interdigital hoof vesicles",
        "Excessive ropy salivation and severe lameness",
        "Unvaccinated status with acute onset (2 days)",
        "3 similar suspected cases reported in Haveli block within 7 days"
      ],
      advisories: {
        en: "Strictly isolate infected cattle. Apply potassium permanganate (1:1000) or boro-glycerine to mouth ulcers. Disinfect sheds with 4% sodium carbonate. Do not move cattle to local weekly bazaars.",
        mr: "आजारी जनावराला तातडीने स्वतंत्र गोठ्यात बांधा. तोंडातील फोडांवर पोटॅशियम परमँगनेट (१:१०००) द्रावण किंवा बोरोग्लिसरीन लावा. गोठा ४% सोडियम कार्बोनेटने निर्जंतुक करा. जनावरांना आठवडी बाजारात नेणे टाळा.",
        hi: "संक्रमित पशु को तुरंत अलग बांधें। मुंह के छालों पर पोटाश या बोरो-ग्लिसरीन लगाएं। बाड़े को कीटाणुरहित करें। पशु हाट में न ले जाएं।"
      }
    },
    status: "Sample Collected",
    vetNotes: "Field officer Dr. Kulkarni collected vesicular fluid & epithelial tags. Sent to DIL Pune Lab."
  },
  {
    id: "MH-2026-REP-8809",
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    animalType: "cattle",
    ageYears: 3,
    symptoms: ["fever", "skin_lesions", "swelling", "reduced_milk", "nasal_discharge"],
    daysSinceOnset: 3,
    vaccinationStatus: "no",
    photoUrl: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80",
    location: {
      lat: 17.6805,
      lng: 74.0183,
      village: "Koregaon",
      block: "Koregaon",
      district: "Satara"
    },
    language: "mr",
    farmer: {
      name: "Dnyaneshwar Pawar",
      phone: "+91 94231 78440",
      farmSize: "4 Cattle"
    },
    prediction: {
      disease: "Lumpy Skin Disease (LSD) / लंपी चर्मरोग",
      diseaseCode: "LSD",
      confidence: 91,
      urgency: "high",
      evidence: [
        "Generalized firm cutaneous nodules (2-5cm) over neck and body",
        "High pyrexia (104°F) with edema in brisket area",
        "Vector season (monsoon/post-monsoon fly infestation)",
        "Unvaccinated herd"
      ],
      advisories: {
        en: "Isolate affected cow. Apply neem oil/antiseptic sprays to ruptured nodules to prevent maggot infestation. Vector control with mosquito nets and fly repellents.",
        mr: "बाधित जनावराला मच्छरदाणीत/वेगळे ठेवा. जखमांवर कडुनिंबाचे तेल किंवा अँटीसेप्टिक स्प्रे लावा जेणेकरून किडे पडणार नाहीत. गोमाश्या व डास नियंत्रणासाठी धूर करा.",
        hi: "पशु को अन्य मवेशियों से अलग करें। घाव पर नीम का तेल लगाएं। मक्खियों और मच्छरों से बचाव करें।"
      }
    },
    status: "Reviewed",
    vetNotes: "Verified symptoms via tele-triage. Advisory dispatched to VD Koregaon."
  },
  {
    id: "MH-2026-REP-8798",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    animalType: "buffalo",
    ageYears: 5,
    symptoms: ["fever", "swelling", "labored_breathing", "lethargy"],
    daysSinceOnset: 1,
    vaccinationStatus: "no",
    photoUrl: null,
    location: {
      lat: 19.1383,
      lng: 74.6988,
      village: "Rahuri",
      block: "Rahuri",
      district: "Ahmednagar"
    },
    language: "mr",
    farmer: {
      name: "Suresh Baburao Ghadge",
      phone: "+91 97655 43102",
      farmSize: "8 Buffaloes"
    },
    prediction: {
      disease: "Hemorrhagic Septicemia (HS) / घटसर्प",
      diseaseCode: "HS",
      confidence: 88,
      urgency: "critical",
      evidence: [
        "Severe submandibular & throat edema with respiratory distress",
        "Hyperacute onset in heavy buffalo",
        "Unvaccinated status in endemic low-lying riverbank zone"
      ],
      advisories: {
        en: "CRITICAL: Immediate intravenous antibiotic therapy required (Oxytetracycline/Sulfonamides by registered vet). Isolate immediately and do not stress the animal.",
        mr: "अति-गंभीर: पशुवैद्यकांकडून ताबडतोब ॲन्टीबायोटिक इंजेक्शन उपचार सुरू करा. जनावराला हालचाल न करता थंड सावलीत ठेवा.",
        hi: "अत्यंत गंभीर: तुरंत पशु चिकित्सक से संपर्क कर एंटीबायोटिक उपचार शुरू कराएं।"
      }
    },
    status: "Escalated",
    vetNotes: "Emergency mobile vet van dispatched from Rahuri taluka hospital."
  },
  {
    id: "MH-2026-REP-8775",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    animalType: "goat",
    ageYears: 2,
    symptoms: ["fever", "mouth_blisters", "nasal_discharge", "eye_discharge", "diarrhea", "coughing"],
    daysSinceOnset: 4,
    vaccinationStatus: "no",
    photoUrl: null,
    location: {
      lat: 17.6599,
      lng: 75.9064,
      village: "Mohol",
      block: "Mohol",
      district: "Solapur"
    },
    language: "mr",
    farmer: {
      name: "Ananda Mahadev Jadhav",
      phone: "+91 91588 23091",
      farmSize: "22 Goats, 5 Sheep"
    },
    prediction: {
      disease: "Peste des Petits Ruminants (PPR) / शेळ्यांमधील देवी किंवा घटसर्प",
      diseaseCode: "PPR",
      confidence: 93,
      urgency: "high",
      evidence: [
        "Erosive stomatitis, muco-purulent ocular discharge and profuse diarrhea",
        "High morbidity in young goat herd",
        "No prior PPR vaccine logged"
      ],
      advisories: {
        en: "Isolate sick goats. Administer supportive fluids, oral electrolytes and broad-spectrum antibiotics to prevent secondary pneumonia. Ring vaccinate all neighboring flocks.",
        mr: "आजारी शेळ्या वेगळ्या करा. डिहायड्रेशन रोखण्यासाठी इलेक्ट्रॉल पाणी द्या. पशुवैद्यकीय सल्ल्याने औषधोपचार करा व गावातील सर्व शेळ्यांचे PPR लसीकरण पूर्ण करा.",
        hi: "बीमार बकरियों को झुंड से अलग करें। ओआरएस का घोल दें और तुरंत पशु डॉक्टर से टीका लगवाएं।"
      }
    },
    status: "Lab Confirmed",
    vetNotes: "PCR positive for PPR lineage IV. Ring vaccination initiated in 5km radius."
  },
  {
    id: "MH-2026-REP-8742",
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    animalType: "cattle",
    ageYears: 6,
    symptoms: ["fever", "lameness", "swelling", "lethargy"],
    daysSinceOnset: 2,
    vaccinationStatus: "yes",
    photoUrl: null,
    location: {
      lat: 16.7050,
      lng: 74.2433,
      village: "Uchgaon",
      block: "Karveer",
      district: "Kolhapur"
    },
    language: "mr",
    farmer: {
      name: "Vishwas Patil",
      phone: "+91 98901 11234",
      farmSize: "5 Cattle"
    },
    prediction: {
      disease: "Black Quarter (BQ) / फऱ्या रोग",
      diseaseCode: "BQ",
      confidence: 85,
      urgency: "high",
      evidence: [
        "Crepitating, painful swelling over hindquarter gluteal muscles",
        "Lameness and high fever",
        "Recent pasture grazing after early unseasonal showers"
      ],
      advisories: {
        en: "Administer high-dose Procaine Penicillin under veterinary care. Incise swelling only under antiseptic precautions. Dispose carcasses safely without skinning.",
        mr: "त्वरित पेनिसिलिन इंजेक्शन उपचार सुरू करा. मृत जनावराची कातडी न काढता चुन्याच्या साहाय्याने खोल जमिनीत पुरा.",
        hi: "तुरंत पशु चिकित्सक द्वारा पेनिसिलिन का टीका लगवाएं। मृत पशु की खाल न उतारें और गहरे गड्ढे में दबाएं।"
      }
    },
    status: "Resolved",
    vetNotes: "Early therapeutic intervention successful. Animal recovered; booster dose administered."
  },
  {
    id: "MH-2026-REP-8720",
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    animalType: "cattle",
    ageYears: 4,
    symptoms: ["reduced_appetite", "reduced_milk", "lethargy"],
    daysSinceOnset: 1,
    vaccinationStatus: "yes",
    photoUrl: null,
    location: {
      lat: 19.9975,
      lng: 73.7898,
      village: "Sinnar",
      block: "Sinnar",
      district: "Nashik"
    },
    language: "mr",
    farmer: {
      name: "Pandurang Kakade",
      phone: "+91 93700 89452",
      farmSize: "2 Cattle"
    },
    prediction: {
      disease: "Ruminal Acidosis / साधे अपचन व आहार बदल",
      diseaseCode: "INDIGESTION",
      confidence: 76,
      urgency: "low",
      evidence: [
        "Mild appetite reduction without blisters, high fever, or lesions",
        "Vaccination is up to date (FMD/LSD/BQ)",
        "Single isolated case with normal respiratory rate"
      ],
      advisories: {
        en: "Provide digestive tonics (yeast, sodium bicarbonate solution) and dry fodder. Monitor temperature for next 24 hours.",
        mr: "जनावराला खाण्याचा सोडा (५० ग्रॅम) कोमट पाण्यात द्या, सुका चारा द्या. २४ तास लक्ष ठेवा.",
        hi: "पशु को मीठा सोडा और सूखा चारा दें। २४ घंटे तापमान पर नजर रखें।"
      }
    },
    status: "Resolved",
    vetNotes: "Dietary advice given. Resolved on oral buffer therapy."
  }
];

const INITIAL_OUTBREAKS = [
  {
    id: "OB-MH-2026-001",
    diseaseName: "Foot-and-Mouth Disease (FMD)",
    village: "Khadakwasla & Donje",
    block: "Haveli",
    district: "Pune",
    casesCount: 14,
    firstReported: "2026-08-22",
    status: "Active",
    radiusKm: 5,
    containmentAction: "Ring vaccination deployed; weekly livestock cattle market at Manchar restricted."
  },
  {
    id: "OB-MH-2026-002",
    diseaseName: "Lumpy Skin Disease (LSD)",
    village: "Koregaon & Rahimatpur",
    block: "Koregaon",
    district: "Satara",
    casesCount: 9,
    firstReported: "2026-08-24",
    status: "Active",
    radiusKm: 8,
    containmentAction: "Goat pox vaccine booster drives initiated; anti-fly fogging conducted."
  },
  {
    id: "OB-MH-2026-003",
    diseaseName: "Peste des Petits Ruminants (PPR)",
    village: "Mohol & Anavali",
    block: "Mohol",
    district: "Solapur",
    casesCount: 18,
    firstReported: "2026-08-20",
    status: "Contained",
    radiusKm: 10,
    containmentAction: "1,200 sheep & goats vaccinated; migration flock checkpost established."
  }
];

const INITIAL_HERDS = [
  {
    ownerName: "Tukaram G. Shinde",
    village: "Khadakwasla",
    block: "Haveli",
    district: "Pune",
    phone: "+91 98224 51092",
    animals: [
      {
        tagId: "MH-12-8812",
        name: "Kapila (GIR Cow)",
        species: "Cattle",
        age: 4,
        vaccinations: [
          { vaccine: "FMD (Foot & Mouth)", date: "2025-09-15", nextDue: "2026-03-15" },
          { vaccine: "Lumpy Skin Booster", date: "2025-10-10", nextDue: "2026-10-10" }
        ]
      },
      {
        tagId: "MH-12-8813",
        name: "Laxmi (Murrah Buffalo)",
        species: "Buffalo",
        age: 5,
        vaccinations: [
          { vaccine: "HS (Hemorrhagic Septicemia)", date: "2025-06-20", nextDue: "2026-06-20" }
        ]
      }
    ]
  },
  {
    ownerName: "Dnyaneshwar Pawar",
    village: "Koregaon",
    block: "Koregaon",
    district: "Satara",
    phone: "+91 94231 78440",
    animals: [
      {
        tagId: "MH-11-4401",
        name: "Gauri (Dangi Cow)",
        species: "Cattle",
        age: 3,
        vaccinations: [
          { vaccine: "Brucellosis S19", date: "2024-04-12", nextDue: "Lifetime" }
        ]
      }
    ]
  }
];

// Helper to initialize local storage
function getStoredData(key, defaultData) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(item);
  } catch {
    return defaultData;
  }
}

function saveStoredData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

// Rule-based diagnostic inference engine (Simulating Backend ML model)
export function evaluateDiseaseSymptoms(symptoms = [], animalType = "cattle", vaccinationStatus = "no") {
  const symSet = new Set(symptoms);
  
  // 1. Foot and Mouth Disease (FMD)
  if (symSet.has("mouth_blisters") || (symSet.has("hoof_blisters") && symSet.has("drooling")) || (symSet.has("fever") && symSet.has("lameness") && symSet.has("drooling"))) {
    return {
      disease: "Foot-and-Mouth Disease (FMD) / खुरखुर व तोंडखुरी",
      diseaseCode: "FMD",
      confidence: symSet.has("mouth_blisters") && symSet.has("hoof_blisters") ? 96 : 89,
      urgency: "critical",
      evidence: [
        "Blisters/ulcers in mouth, tongue, or interdigital hoof space",
        "Profuse frothy/ropy salivation and pronounced lameness",
        vaccinationStatus === "no" ? "Unvaccinated status elevates susceptibility" : "Vaccine breakthrough or waning titer suspected",
        "Highly contagious viral pattern; requires quarantine within 24h"
      ],
      advisories: {
        en: "Quarantine infected animals immediately. Wash mouth lesions with 1:1000 potassium permanganate and hooves with 4% sodium carbonate. Alert local Livestock Development Officer (LDO).",
        mr: "आजारी जनावराला तातडीने इतर जनावरांपासून वेगळे बांधा. तोंडातील जखमांवर पोटॅशियम परमँगनेटचे पाणी लावा आणि पायांवर ४% सोड्याचे पाणी टाका. तात्काळ पशुवैद्यकीय अधिकाऱ्यांना बोलवा.",
        hi: "संक्रमित पशु को तुरंत अलग करें। मुंह में पोटैशियम परमैंगनेट का घोल लगाएं और पैरों को साफ रखें। पशु डॉक्टर को तत्काल सूचित करें।"
      }
    };
  }

  // 2. Lumpy Skin Disease (LSD)
  if (symSet.has("skin_lesions") || (symSet.has("swelling") && symSet.has("fever") && animalType === "cattle")) {
    return {
      disease: "Lumpy Skin Disease (LSD) / लंपी चर्मरोग",
      diseaseCode: "LSD",
      confidence: symSet.has("skin_lesions") ? 93 : 84,
      urgency: "high",
      evidence: [
        "Cutaneous nodules and circumscribed skin eruptions",
        "Enlarged lymph nodes and pyrexia",
        "Vector-borne transmission via flies, ticks, and mosquitoes",
        "Drop in lactation and general lethargy"
      ],
      advisories: {
        en: "Isolate in a clean shed under mosquito nets. Apply neem leaf paste/antiseptic oils on nodules. Disinfect shed perimeter with neem smoke.",
        mr: "जनावराला डास-माशांपासून वाचवण्यासाठी मच्छरदाणी लावा. गाठींवर कडुनिंबाचा पाला व हळदीचा लेप लावा. गोठ्यात कडुनिंबाचा धूर करा.",
        hi: "पशु को मच्छरदानी में रखें। गाठों पर नीम का लेप या एंटीसेप्टिक लगाएं और बाड़े में नीम का धुआं करें।"
      }
    };
  }

  // 3. Peste des Petits Ruminants (PPR) for Goats/Sheep
  if ((animalType === "goat" || animalType === "sheep") && (symSet.has("diarrhea") || symSet.has("mouth_blisters") || symSet.has("nasal_discharge"))) {
    return {
      disease: "Peste des Petits Ruminants (PPR) / शेळ्यांमधील आजार (PPR)",
      diseaseCode: "PPR",
      confidence: 91,
      urgency: "high",
      evidence: [
        "Ocular-nasal discharges accompanied by mouth erosions and enteritis",
        "High morbidity risk in small ruminant populations",
        "Risk of rapid spreading across the flock"
      ],
      advisories: {
        en: "Isolate infected goats/sheep immediately. Administer ORS electrolyte hydration solution. Request emergency PPR flock ring vaccination from taluka vet dispensary.",
        mr: "आजारी शेळ्या-मेंढ्या तातडीने वेगळ्या करा. सतत ओआरएस किंवा गुळ-मिठाचे पाणी पाजा. पशुवैद्यकीय दवाखान्यातून त्वरित लसीकरण करून घ्या.",
        hi: "बीमार बकरियों को तुरंत अलग करें। ओआरएस का घोल दें और तुरंत पशु चिकित्सक से संपर्क करें।"
      }
    };
  }

  // 4. Hemorrhagic Septicemia (HS) or Black Quarter (BQ)
  if (symSet.has("swelling") && symSet.has("labored_breathing") && symSet.has("fever")) {
    return {
      disease: "Suspected Hemorrhagic Septicemia (HS) / घटसर्प",
      diseaseCode: "HS",
      confidence: 87,
      urgency: "critical",
      evidence: [
        "Submandibular throat swelling causing dyspnea and high body heat",
        "Hyperacute bacterial infection with rapid course",
        "Immediate veterinary intervention required within hours"
      ],
      advisories: {
        en: "EMERGENCY: Call Government Mobile Veterinary Van (1962). Do not force feed or transport the animal. Keep in a well-ventilated, shaded shed.",
        mr: "अति-तातडी: टोल फ्री १९६२ वर कॉल करून पशुवैद्यकीय रुग्णवाहिका बोलवा. जनावराला हालचाल करू देऊ नका व सावलीत ठेवा.",
        hi: "आपातकालीन: 1962 पर कॉल करें। पशु को छायादार स्थान पर रखें और तुरंत इलाज शुरू कराएं।"
      }
    };
  }

  // 5. Default General Infection / Indigestion
  return {
    disease: symSet.has("fever") ? "Non-Specific Febrile Infection / सामान्य संसर्गजन्य ताप" : "Digestive Upset / सामान्य पचन विकार",
    diseaseCode: "GENERAL",
    confidence: 75,
    urgency: symSet.has("fever") ? "moderate" : "low",
    evidence: [
      symSet.size > 0 ? `${symSet.size} mild non-specific clinical symptoms observed` : "Isolated clinical symptoms",
      "No pathognomonic vesicle, blister, or nodule patterns detected",
      "Monitor closely over the next 24-48 hours"
    ],
    advisories: {
      en: "Ensure clean fresh drinking water, digestible green and dry fodder. If symptoms persist beyond 24 hours, contact the village Livestock Supervisor.",
      mr: "जनावराला स्वच्छ पिण्याचे पाणी आणि सुपाच्य चारा द्या. २४ तासांत फरक न पडल्यास गावातील पशुधन पर्यवेक्षकांना दाखवा.",
      hi: "पशु को साफ पानी और सुपाच्य चारा दें। 24 घंटे में सुधार न होने पर पशु डॉक्टर को दिखाएं।"
    }
  };
}

// API Service Methods
export const api = {
  // 1. Submit Report
  async submitReport(payload) {
    // Attempt actual POST if BASE_URL configured
    if (BASE_URL) {
      try {
        const res = await fetch(`${BASE_URL}/api/reports`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          // Also sync to local reports cache
          const existing = getStoredData(STORAGE_REPORTS_KEY, INITIAL_REPORTS);
          saveStoredData(STORAGE_REPORTS_KEY, [data, ...existing]);
          return data;
        }
      } catch (err) {
        console.warn("Backend API not reachable, using intelligent local evaluation fallback:", err);
      }
    }

    // Fallback simulation
    const prediction = evaluateDiseaseSymptoms(payload.symptoms, payload.animalType, payload.vaccinationStatus);
    const newReport = {
      id: `MH-2026-REP-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      animalType: payload.animalType,
      ageYears: Number(payload.ageYears),
      symptoms: payload.symptoms || [],
      daysSinceOnset: Number(payload.daysSinceOnset) || 1,
      vaccinationStatus: payload.vaccinationStatus || 'unsure',
      photoUrl: payload.photoUrl || null,
      location: payload.location || { lat: 18.5204, lng: 73.8567, village: "Pune", block: "Haveli", district: "Pune" },
      language: payload.language || "mr",
      farmer: {
        name: "Local Livestock Farmer",
        phone: "+91 98XXX XXXXX",
        farmSize: `${payload.animalType.toUpperCase()}`
      },
      prediction,
      status: "Pending",
      vetNotes: "Report recorded. Auto-queued for veterinary review."
    };

    const existing = getStoredData(STORAGE_REPORTS_KEY, INITIAL_REPORTS);
    saveStoredData(STORAGE_REPORTS_KEY, [newReport, ...existing]);
    return newReport;
  },

  // 2. Get All Reports
  async getReports() {
    if (BASE_URL) {
      try {
        const res = await fetch(`${BASE_URL}/api/reports`);
        if (res.ok) {
          const data = await res.json();
          saveStoredData(STORAGE_REPORTS_KEY, data);
          return data;
        }
      } catch (err) {
        console.warn("Backend not available, using local cache:", err);
      }
    }
    return getStoredData(STORAGE_REPORTS_KEY, INITIAL_REPORTS);
  },

  // 3. Get Report by ID
  async getReportById(id) {
    if (BASE_URL) {
      try {
        const res = await fetch(`${BASE_URL}/api/reports/${id}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn("Backend not reachable for single report:", err);
      }
    }
    const reports = getStoredData(STORAGE_REPORTS_KEY, INITIAL_REPORTS);
    return reports.find(r => r.id === id) || null;
  },

  // 4. Update Report Status (PATCH /api/reports/:id/status)
  async updateReportStatus(id, newStatus, vetNotes = "") {
    if (BASE_URL) {
      try {
        const res = await fetch(`${BASE_URL}/api/reports/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus, vetNotes })
        });
        if (res.ok) {
          const updated = await res.json();
          const reports = getStoredData(STORAGE_REPORTS_KEY, INITIAL_REPORTS);
          const idx = reports.findIndex(r => r.id === id);
          if (idx !== -1) {
            reports[idx] = updated;
            saveStoredData(STORAGE_REPORTS_KEY, reports);
          }
          return updated;
        }
      } catch (err) {
        console.warn("PATCH API error, falling back locally:", err);
      }
    }

    const reports = getStoredData(STORAGE_REPORTS_KEY, INITIAL_REPORTS);
    const idx = reports.findIndex(r => r.id === id);
    if (idx !== -1) {
      reports[idx].status = newStatus;
      if (vetNotes) reports[idx].vetNotes = vetNotes;
      saveStoredData(STORAGE_REPORTS_KEY, [...reports]);
      return reports[idx];
    }
    return null;
  },

  // 5. Get Outbreak Alerts
  async getOutbreaks() {
    if (BASE_URL) {
      try {
        const res = await fetch(`${BASE_URL}/api/outbreaks`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn("Outbreaks API error:", err);
      }
    }
    return getStoredData(STORAGE_OUTBREAKS_KEY, INITIAL_OUTBREAKS);
  },

  // 6. Get Herds Registry
  async getHerds(searchQuery = "") {
    if (BASE_URL) {
      try {
        const url = searchQuery ? `${BASE_URL}/api/herds?q=${encodeURIComponent(searchQuery)}` : `${BASE_URL}/api/herds`;
        const res = await fetch(url);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn("Herds API error:", err);
      }
    }
    const herds = getStoredData(STORAGE_HERDS_KEY, INITIAL_HERDS);
    if (!searchQuery.trim()) return herds;
    const q = searchQuery.toLowerCase().trim();
    return herds.filter(h => 
      h.ownerName.toLowerCase().includes(q) ||
      h.village.toLowerCase().includes(q) ||
      h.district.toLowerCase().includes(q) ||
      h.animals.some(a => a.tagId.toLowerCase().includes(q) || a.name.toLowerCase().includes(q))
    );
  },

  // 7. Add Animal to Herd
  async addAnimalToHerd(animal) {
    const herds = getStoredData(STORAGE_HERDS_KEY, INITIAL_HERDS);
    // Add to default farmer herd (first record) or create new
    if (herds.length > 0) {
      herds[0].animals.unshift({
        tagId: animal.tagId || `MH-${Math.floor(100000 + Math.random() * 900000)}`,
        name: animal.name || "Animal",
        species: animal.species || "Cattle",
        age: Number(animal.age) || 2,
        vaccinations: []
      });
      saveStoredData(STORAGE_HERDS_KEY, herds);
      return herds[0];
    }
    return null;
  },

  // 8. Add Vaccination Record
  async addVaccinationRecord(tagId, vaccineRecord) {
    const herds = getStoredData(STORAGE_HERDS_KEY, INITIAL_HERDS);
    for (const herd of herds) {
      const animal = herd.animals.find(a => a.tagId === tagId);
      if (animal) {
        animal.vaccinations.unshift({
          vaccine: vaccineRecord.vaccine,
          date: vaccineRecord.date || new Date().toISOString().split('T')[0],
          nextDue: vaccineRecord.nextDue || "6 Months"
        });
        saveStoredData(STORAGE_HERDS_KEY, herds);
        return animal;
      }
    }
    return null;
  }
};
