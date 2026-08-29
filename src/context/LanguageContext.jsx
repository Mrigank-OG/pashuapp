import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Nav & Common
    appTitle: "PashuSwasthya",
    appSubtitle: "Livestock Health Surveillance (Govt. of MH)",
    farmerPortal: "Farmer Portal",
    vetPortal: "Vet Officer Portal",
    switchMode: "Switch Mode",
    language: "Language",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    submit: "Submit Report",
    submitting: "Submitting & Analyzing...",
    optional: "(Optional)",
    close: "Close",
    back: "Back",
    refresh: "Refresh",
    
    // Farmer Nav
    navReport: "Report Sickness",
    navMyReports: "My Past Reports",
    navMyHerd: "My Herd",

    // Vet Nav
    navDashboard: "Dashboard",
    navMap: "GIS Outbreak Map",
    navCases: "Case Registry",
    navOutbreaks: "Outbreak Alerts",
    navHerds: "Herd Lookup",

    // Report Form
    reportTitle: "Livestock Health Rapid Report",
    reportSubtitle: "Report sick animals immediately for early veterinary response and containment.",
    animalType: "Animal Species",
    selectAnimal: "Select Species",
    cattle: "Cattle (गाय)",
    buffalo: "Buffalo (म्हैस)",
    goat: "Goat (शेळी)",
    sheep: "Sheep (मेंढी)",
    ageYears: "Animal Age (Years)",
    agePlaceholder: "e.g. 3",
    symptomsTitle: "Select Symptoms Observed",
    symptomsSubtitle: "Tap all symptoms you see on your animal:",
    daysSinceOnset: "Days Since Symptoms Started",
    vaccinationStatus: "Vaccination Status",
    vaccinatedYes: "Vaccinated (Yes)",
    vaccinatedNo: "Unvaccinated (No)",
    vaccinatedUnsure: "Unsure / Unknown",
    photoUploadTitle: "Upload Photo of Animal / Lesion",
    photoUploadDesc: "Clear photos of mouth, hooves, or skin help vets triage faster.",
    takeOrUpload: "Take photo or browse",
    photoAttached: "Photo attached",
    locationTitle: "Location Details",
    locationDesc: "Auto-detect GPS or enter village name manually.",
    detectLocation: "Use My Current GPS",
    gpsDetected: "GPS location captured",
    village: "Village",
    villagePlaceholder: "e.g. Shindewadi",
    block: "Taluka / Block",
    blockPlaceholder: "e.g. Haveli",
    district: "District",
    districtPlaceholder: "e.g. Pune",

    // Symptoms List
    symptom_fever: "Fever / Warm Body",
    symptom_mouth_blisters: "Mouth Blisters / Ulcers",
    symptom_hoof_blisters: "Hoof Blisters / Lesions",
    symptom_lameness: "Lameness / Limping",
    symptom_drooling: "Excessive Salivation / Drooling",
    symptom_skin_lesions: "Skin Nodules / Lesions",
    symptom_swelling: "Body / Neck Swelling",
    symptom_nasal_discharge: "Nasal Discharge",
    symptom_eye_discharge: "Eye Discharge / Tearing",
    symptom_diarrhea: "Diarrhea / Loose Dung",
    symptom_coughing: "Coughing",
    symptom_labored_breathing: "Labored / Fast Breathing",
    symptom_reduced_appetite: "Reduced Feed Intake",
    symptom_lethargy: "Lethargy / Dullness",
    symptom_reduced_milk: "Sudden Milk Drop",

    // Result Screen
    resultTitle: "Preliminary AI Health Assessment",
    predictedDisease: "Predicted Condition",
    confidence: "Confidence Level",
    urgencyLevel: "Urgency Level",
    evidenceTitle: "Clinical Evidence & Observations",
    advisoryTitle: "Immediate Advisory & Quarantine Guidelines",
    helplineText: "Emergency Vet Helpline (Pashu Sanjeevani): 1962",
    viewInReports: "View in My Reports",
    reportAnother: "Report Another Animal",
    highUrgencyNotice: "Veterinary Officer has been notified. Keep animal isolated in shade away from other livestock.",

    // Urgency Badges
    urgency_low: "Low Urgency",
    urgency_moderate: "Moderate Urgency",
    urgency_high: "High Urgency",
    urgency_critical: "Critical Outbreak Risk",

    // Status Badges
    status_pending: "Pending Review",
    status_reviewed: "Reviewed by Vet",
    status_sample_collected: "Sample Collected",
    status_lab_confirmed: "Lab Confirmed",
    status_escalated: "Escalated to HQ",
    status_resolved: "Resolved / Treated",

    // Herd
    myHerdTitle: "My Livestock Registry",
    myHerdSubtitle: "Keep records of your registered cattle, buffalo, goats, and sheep.",
    addAnimal: "Add New Animal",
    addVaccination: "Add Vaccine Record",
    animalTag: "Ear Tag / ID",
    animalName: "Name / Identifier",
    species: "Species",
    lastVaccine: "Last Vaccine",
    vaccineHistory: "Vaccination Log",
    noVaccines: "No vaccination records logged yet.",
    noAnimals: "No animals registered yet. Add your first animal above!",

    // My Reports
    myReportsTitle: "My Submitted Disease Reports",
    myReportsSubtitle: "Track status updates and field visits from local veterinary officers.",
    noReports: "You have not submitted any disease reports yet.",
    reportedOn: "Reported on",
    caseId: "Case ID",

    // Vet Dashboard & Views
    totalReportsToday: "Total Reports Today",
    activeOutbreaks: "Active Outbreak Zones",
    activeOutbreakClusters: "Active Outbreak Clusters",
    highCriticalCases: "High & Critical Cases",
    avgResponseTime: "Avg Response Time",
    recentActivity: "Live Field Surveillance Feed",
    filterByUrgency: "Filter Urgency",
    filterByStatus: "Filter Status",
    filterByDisease: "Filter Disease",
    searchPlaceholder: "Search case ID, village, owner...",
    caseDetails: "Case Investigation Details",
    updateStatus: "Update Investigation Status",
    outbreakCluster: "Outbreak Cluster",
    containmentStatus: "Containment Status",
    casesCount: "Reported Cases",
    firstReported: "First Reported",
  },
  mr: {
    // Nav & Common
    appTitle: "पशुस्वास्थ्य",
    appSubtitle: "पशु रोग पाळत व नियंत्रण प्रणाली (महाराष्ट्र शासन)",
    farmerPortal: "शेतकरी पोर्टल",
    vetPortal: "पशुवैद्यकीय अधिकारी पोर्टल",
    switchMode: "मोड बदला",
    language: "भाषा",
    loading: "लोड होत आहे...",
    save: "जतन करा",
    cancel: "रद्द करा",
    submit: "तक्रार / अहवाल पाठवा",
    submitting: "तपासणी सुरू आहे...",
    optional: "(ऐच्छिक)",
    close: "बंद करा",
    back: "मागे",
    refresh: "ताजे करा",

    // Farmer Nav
    navReport: "आजार नोंदवा",
    navMyReports: "माझे अहवाल",
    navMyHerd: "माझी जनावरे",

    // Vet Nav
    navDashboard: "डॅशबोर्ड",
    navMap: "नकाशा (GIS Map)",
    navCases: "प्रकरणे नोंदवही",
    navOutbreaks: "रोग उद्रेक इशारे",
    navHerds: "कळप शोध",

    // Report Form
    reportTitle: "पशु आजार त्वरित अहवाल",
    reportSubtitle: "रोग प्रसार रोखण्यासाठी आणि त्वरित उपचारासाठी आजारी जनावराची माहिती नोंदवा.",
    animalType: "जनावराचा प्रकार",
    selectAnimal: "प्रकार निवडा",
    cattle: "गाय (Cattle)",
    buffalo: "म्हैस (Buffalo)",
    goat: "शेळी (Goat)",
    sheep: "मेंढी (Sheep)",
    ageYears: "जनावराचे वय (वर्षे)",
    agePlaceholder: "उदा. ३",
    symptomsTitle: "दिसणारी लक्षणे निवडा",
    symptomsSubtitle: "तुमच्या जनावरात दिसणाऱ्या सर्व लक्षणांवर स्पर्श करा:",
    daysSinceOnset: "लक्षणे किती दिवसांपासून आहेत?",
    vaccinationStatus: "लसीकरण स्थिती",
    vaccinatedYes: "लस टोचली आहे (होय)",
    vaccinatedNo: "लस टोचलेली नाही (नाही)",
    vaccinatedUnsure: "माहित नाही / खात्री नाही",
    photoUploadTitle: "जनावराचा किंवा जखमेचा फोटो जोडा",
    photoUploadDesc: "तोंड, खूर किंवा त्वचेचे स्पष्ट फोटो डॉक्टरांना अचूक निदानासाठी मदत करतात.",
    takeOrUpload: "फोटो काढा किंवा निवडा",
    photoAttached: "फोटो जोडला गेला आहे",
    locationTitle: "ठिकाण / गावाचा तपशील",
    locationDesc: "आपोआप जीपीएस शोधा किंवा गावाचे नाव टाका.",
    detectLocation: "माझे चालू GPS स्थान मिळवा",
    gpsDetected: "GPS स्थान यशस्वीरित्या मिळाले",
    village: "गाव",
    villagePlaceholder: "उदा. शिंदेवाडी",
    block: "तालुका",
    blockPlaceholder: "उदा. हवेली",
    district: "जिल्हा",
    districtPlaceholder: "उदा. पुणे",

    // Symptoms List
    symptom_fever: "ताप / अंग गरम असणे",
    symptom_mouth_blisters: "तोंडात फोड / चट्टे (Mouth Blisters)",
    symptom_hoof_blisters: "खुरात फोड / जखमा (Hoof Blisters)",
    symptom_lameness: "लंगडणे (Lameness)",
    symptom_drooling: "लाळ गळणे (Drooling)",
    symptom_skin_lesions: "त्वचेवर गाठी / फोड (Lumpy Skin)",
    symptom_swelling: "गळा / अंगाला सूज (Swelling)",
    symptom_nasal_discharge: "नाकातून स्राव / पाणी वाहणे",
    symptom_eye_discharge: "डोळ्यातून पाणी / घाण",
    symptom_diarrhea: "हगवण / पातळ शेण (Diarrhea)",
    symptom_coughing: "खोकला (Coughing)",
    symptom_labored_breathing: "श्वास घेण्यास त्रास / धाप लागणे",
    symptom_reduced_appetite: "चारा न खाणे / भूक मंदावणे",
    symptom_lethargy: "सुस्त पडणे / अशक्तपणा",
    symptom_reduced_milk: "दूध उत्पादनात अचानक घट",

    // Result Screen
    resultTitle: "प्राथमिक कृत्रिम बुद्धिमत्ता (AI) निदान",
    predictedDisease: "संभाव्य आजार",
    confidence: "निदान अचूकता (Confidence)",
    urgencyLevel: "गंभीरता पातळी",
    evidenceTitle: "निदानाची कारणे व पुरावे",
    advisoryTitle: "त्वरित करावयाचे उपाय व काळजी",
    helplineText: "तातडीची पशुवैद्यकीय मदत (पशु संजीवनी हेल्पलाईन): १९६२",
    viewInReports: "माझे अहवालात पहा",
    reportAnother: "दुसऱ्या जनावराची नोंद करा",
    highUrgencyNotice: "तालुका पशुवैद्यकीय अधिकाऱ्यांना माहिती पाठवली आहे. आजारी जनावराला इतर जनावरांपासून ताबडतोब वेगळे बांधा.",

    // Urgency Badges
    urgency_low: "कमी तीव्रता (Low)",
    urgency_moderate: "मध्यम तीव्रता (Moderate)",
    urgency_high: "उच्च तीव्रता (High)",
    urgency_critical: "अति-गंभीर उद्रेक धोका (Critical)",

    // Status Badges
    status_pending: "प्रलंबित (Pending)",
    status_reviewed: "डॉक्टरांनी तपासले (Reviewed)",
    status_sample_collected: "नमुना गोळा केला (Sample Collected)",
    status_lab_confirmed: "प्रयोगशाळा पुष्टी (Lab Confirmed)",
    status_escalated: "वरिष्ठांकडे पाठवले (Escalated)",
    status_resolved: "उपचार पूर्ण / दुरुस्त (Resolved)",

    // Herd
    myHerdTitle: "माझी पशुधन नोंदवही",
    myHerdSubtitle: "आपल्या गोठ्यातील गायी, म्हशी, शेळ्या आणि मेंढ्यांची संपूर्ण नोंद ठेवा.",
    addAnimal: "नवीन जनावर जोडा",
    addVaccination: "लसीकरण नोंद करा",
    animalTag: "कानाचा टॅग / बिल्ला क्र.",
    animalName: "नाव / ओळख",
    species: "प्रजाती",
    lastVaccine: "शेवटची लस",
    vaccineHistory: "लसीकरण इतिहास",
    noVaccines: "अद्याप कोणतीही लस नोंदवलेली नाही.",
    noAnimals: "अद्याप कोणतीही जनावरे नोंदवलेली नाहीत. वरून नवीन जनावर जोडा.",

    // My Reports
    myReportsTitle: "मी नोंदवलेले आजार अहवाल",
    myReportsSubtitle: "पशुवैद्यकीय अधिकाऱ्यांच्या प्रत्यक्ष भेटी व उपचारांची सद्यस्थिती.",
    noReports: "तुम्ही अद्याप कोणताही अहवाल नोंदवला नाही.",
    reportedOn: "नोंदणी तारीख",
    caseId: "केस क्र.",

    // Vet Dashboard & Views
    totalReportsToday: "आजचे एकूण अहवाल",
    activeOutbreaks: "सक्रिय उद्रेक क्षेत्रे",
    activeOutbreakClusters: "सक्रिय उद्रेक समूह",
    highCriticalCases: "गंभीर व अति-गंभीर रुग्ण",
    avgResponseTime: "सरासरी प्रतिसाद वेळ",
    recentActivity: "थेट पाळत व हालचाली फीड",
    filterByUrgency: "तीव्रतेनुसार फिल्टर",
    filterByStatus: "स्थितीनुसार फिल्टर",
    filterByDisease: "रोगानुसार फिल्टर",
    searchPlaceholder: "केस आयडी, गाव, शेतकरी शोधा...",
    caseDetails: "तपासणी व उपचार तपशील",
    updateStatus: "तपासणी स्थिती बदला",
    outbreakCluster: "उद्रेक समूह",
    containmentStatus: "नियंत्रण स्थिती",
    casesCount: "नोंदवलेली प्रकरणे",
    firstReported: "पहिली नोंद",
  },
  hi: {
    // Nav & Common
    appTitle: "पशुस्वास्थ्य",
    appSubtitle: "पशु रोग निगरानी एवं नियंत्रण प्रणाली (महाराष्ट्र सरकार)",
    farmerPortal: "किसान पोर्टल",
    vetPortal: "पशु चिकित्सा अधिकारी पोर्टल",
    switchMode: "मोड बदलें",
    language: "भाषा",
    loading: "लोड हो रहा है...",
    save: "सुरक्षित करें",
    cancel: "रद्द करें",
    submit: "रिपोर्ट भेजें",
    submitting: "विश्लेषण जारी है...",
    optional: "(वैकल्पिक)",
    close: "बंद करें",
    back: "पीछे",
    refresh: "रिफ्रेश",

    // Farmer Nav
    navReport: "बीमारी दर्ज करें",
    navMyReports: "मेरी पिछली रिपोर्ट्स",
    navMyHerd: "मेरे पशु (झुंड)",

    // Vet Nav
    navDashboard: "डैशबोर्ड",
    navMap: "जीआईएस मानचित्र",
    navCases: "केस रजिस्टर",
    navOutbreaks: "प्रकोप चेतावनी",
    navHerds: "पशु खोज",

    // Report Form
    reportTitle: "पशु रोग त्वरित रिपोर्ट",
    reportSubtitle: "बीमारी फैलने से रोकने और तुरंत उपचार के लिए बीमार पशु की सूचना दर्ज करें।",
    animalType: "पशु का प्रकार",
    selectAnimal: "प्रकार चुनें",
    cattle: "गाय (Cattle)",
    buffalo: "भैंस (Buffalo)",
    goat: "बकरी (Goat)",
    sheep: "भेड़ (Sheep)",
    ageYears: "पशु की आयु (वर्ष)",
    agePlaceholder: "जैसे 3",
    symptomsTitle: "दिखाई देने वाले लक्षण चुनें",
    symptomsSubtitle: "अपने पशु में दिखने वाले सभी लक्षणों पर टैप करें:",
    daysSinceOnset: "लक्षण कितने दिनों से हैं?",
    vaccinationStatus: "टीकाकरण की स्थिति",
    vaccinatedYes: "टीका लगाया गया है (हाँ)",
    vaccinatedNo: "टीका नहीं लगाया (नहीं)",
    vaccinatedUnsure: "पता नहीं / अनिश्चित",
    photoUploadTitle: "पशु या घाव का फोटो अपलोड करें",
    photoUploadDesc: "मुंह, खुर या त्वचा की स्पष्ट तस्वीर डॉक्टरों को सही पहचान में मदद करती है।",
    takeOrUpload: "फोटो खींचें या चुनें",
    photoAttached: "फोटो जोड़ दिया गया है",
    locationTitle: "स्थान / गांव का विवरण",
    locationDesc: "जीपीएस स्वतः खोजें या गांव का नाम लिखें।",
    detectLocation: "वर्तमान जीपीएस स्थान का उपयोग करें",
    gpsDetected: "जीपीएस स्थान सफलतापूर्वक मिला",
    village: "गांव",
    villagePlaceholder: "जैसे शिंदेवाडी",
    block: "तहसील / ब्लॉक",
    blockPlaceholder: "जैसे हवेली",
    district: "जिला",
    districtPlaceholder: "जैसे पुणे",

    // Symptoms List
    symptom_fever: "बुखार / शरीर गर्म होना",
    symptom_mouth_blisters: "मुंह में छाले / घाव (Mouth Blisters)",
    symptom_hoof_blisters: "खुर में छाले / घाव (Hoof Blisters)",
    symptom_lameness: "लंगड़ापन (Lameness)",
    symptom_drooling: "लार टपकना (Drooling)",
    symptom_skin_lesions: "त्वचा पर गांठें / छाले (Lumpy Skin)",
    symptom_swelling: "गले या शरीर पर सूजन (Swelling)",
    symptom_nasal_discharge: "नाक से पानी बहना",
    symptom_eye_discharge: "आंखों से स्राव / आंसू",
    symptom_diarrhea: "दस्त / पतला गोबर (Diarrhea)",
    symptom_coughing: "खांसी (Coughing)",
    symptom_labored_breathing: "सांस लेने में तकलीफ / हांफना",
    symptom_reduced_appetite: "चारा कम खाना / भूख की कमी",
    symptom_lethargy: "सुस्ती / कमजोरी",
    symptom_reduced_milk: "दूध उत्पादन में अचानक गिरावट",

    // Result Screen
    resultTitle: "प्रारंभिक एआई (AI) स्वास्थ्य आकलन",
    predictedDisease: "संभावित बीमारी",
    confidence: "सटीकता दर (Confidence)",
    urgencyLevel: "गंभीरता स्तर",
    evidenceTitle: "आकलन के मुख्य कारण व साक्ष्य",
    advisoryTitle: "त्वरित सलाह एवं एकांतवास दिशानिर्देश",
    helplineText: "आपातकालीन पशु चिकित्सा हेल्पलाइन (पशु संजीवनी): 1962",
    viewInReports: "मेरी रिपोर्ट्स में देखें",
    reportAnother: "अन्य पशु की रिपोर्ट करें",
    highUrgencyNotice: "पशु चिकित्सा अधिकारी को सूचित कर दिया गया है। बीमार पशु को अन्य मवेशियों से तुरंत अलग रखें।",

    // Urgency Badges
    urgency_low: "कम गंभीरता (Low)",
    urgency_moderate: "मध्यम गंभीरता (Moderate)",
    urgency_high: "उच्च गंभीरता (High)",
    urgency_critical: "अति-गंभीर प्रकोप खतरा (Critical)",

    // Status Badges
    status_pending: "लंबित (Pending)",
    status_reviewed: "समीक्षा पूर्ण (Reviewed)",
    status_sample_collected: "सैंपल एकत्र किया (Sample Collected)",
    status_lab_confirmed: "लैब पुष्टि (Lab Confirmed)",
    status_escalated: "उच्च स्तर पर भेजा (Escalated)",
    status_resolved: "समाधान / स्वस्थ (Resolved)",

    // Herd
    myHerdTitle: "मेरी पशुधन रजिस्ट्री",
    myHerdSubtitle: "अपनी गाय, भैंस, बकरी और भेड़ों का संपूर्ण रिकॉर्ड रखें।",
    addAnimal: "नया पशु जोड़ें",
    addVaccination: "टीकाकरण रिकॉर्ड जोड़ें",
    animalTag: "कान का टैग / आईडी",
    animalName: "नाम / पहचान",
    species: "प्रजाति",
    lastVaccine: "अंतिम टीका",
    vaccineHistory: "टीकाकरण लॉग",
    noVaccines: "अभी तक कोई टीकाकरण रिकॉर्ड नहीं है।",
    noAnimals: "अभी तक कोई पशु पंजीकृत नहीं है। ऊपर नया पशु जोड़ें।",

    // My Reports
    myReportsTitle: "मेरी दर्ज की गई रिपोर्ट्स",
    myReportsSubtitle: "पशु चिकित्सा अधिकारियों की जांच और उपचार की स्थिति देखें।",
    noReports: "आपने अभी तक कोई रिपोर्ट दर्ज नहीं की है।",
    reportedOn: "रिपोर्ट तिथि",
    caseId: "केस आईडी",

    // Vet Dashboard & Views
    totalReportsToday: "आज की कुल रिपोर्ट्स",
    activeOutbreaks: "सक्रिय प्रकोप क्षेत्र",
    activeOutbreakClusters: "सक्रिय प्रकोप समूह",
    highCriticalCases: "उच्च एवं गंभीर मामले",
    avgResponseTime: "औसत प्रतिक्रिया समय",
    recentActivity: "लाइव फील्ड गतिविधि फीड",
    filterByUrgency: "गंभीरता अनुसार फ़िल्टर",
    filterByStatus: "स्थिति अनुसार फ़िल्टर",
    filterByDisease: "रोग अनुसार फ़िल्टर",
    searchPlaceholder: "केस आईडी, गांव, किसान खोजें...",
    caseDetails: "केस जांच विवरण",
    updateStatus: "जांच स्थिति बदलें",
    outbreakCluster: "प्रकोप समूह",
    containmentStatus: "रोकथाम स्थिति",
    casesCount: "रिपोर्ट किए गए केस",
    firstReported: "प्रथम रिपोर्टिंग",
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('pashu_lang') || 'mr';
  });

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      localStorage.setItem('pashu_lang', newLang);
    }
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
