import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const copy = {
  en: {
    eyebrow: 'Maharashtra Livestock Surveillance & Health Network',
    title: 'Detect earlier. Respond faster. Protect every herd.',
    intro: 'PashuSwasthya connects farmers and veterinary teams in one calm, intelligent field network for reporting symptoms, triaging risk, tracking outbreaks, and coordinating care.',
    cta: 'Get started',
    ctaHint: 'Choose your workspace in seconds',
    live: 'Live field intelligence',
    online: 'Network online',
    signals: 'Signals today',
    response: 'Avg. response',
    careTitle: "Today's care pulse",
    careFirst: 'Symptoms reported',
    careFirstMeta: '12 villages · updated now',
    careSecond: 'Veterinary review',
    careSecondMeta: '8 cases · in progress',
    careThird: 'Risk map sync',
    careThirdMeta: '48 villages connected',
    activeLabel: 'Active',
    farmerTitle: 'I am a farmer',
    farmerDesc: 'Report symptoms, keep your herd record close, and follow every case from your phone.',
    vetTitle: 'I am a veterinary officer',
    vetDesc: 'Review incoming cases, see emerging clusters, and coordinate timely field action.',
    choose: 'Choose your workspace',
    secure: 'A simple identity check keeps your workspace focused.',
    nameLabel: 'Your name',
    namePlaceholder: 'Enter your name',
    phoneLabel: 'Mobile number',
    phonePlaceholder: '10-digit mobile number',
    continue: 'Continue to workspace',
    back: 'Back to role selection',
    required: 'Please enter your name and a valid mobile number.',
    whatTitle: 'One network for the moments that matter',
    whatText: 'From the first unusual symptom in a village to a coordinated veterinary response, PashuSwasthya turns field observations into action-ready information.',
    feature1Title: 'Real-time monitoring',
    feature1Text: 'Keep a living view of reports, urgency, status, and response activity across the field.',
    feature2Title: 'Early-warning alerts',
    feature2Text: 'Surface high-risk symptoms and possible disease clusters before they become wider outbreaks.',
    feature3Title: 'Geospatial outbreak tracking',
    feature3Text: 'Use maps, locations, herd records, and case intelligence to focus the next best action.',
    whyTitle: 'Why faster visibility matters',
    whyText: 'Healthy livestock protects household income, food security, and the wider public-health chain. Better information at the right time helps teams isolate risk, reach farmers sooner, and keep livelihoods moving.',
    why1: 'Faster outbreak response',
    why2: 'Protected farmer livelihoods',
    why3: 'Stronger public-health readiness',
    howTitle: 'From signal to solution',
    how1: 'A farmer captures a symptom, photo, location, and urgency.',
    how2: 'Veterinary teams see the right case context and risk pattern.',
    how3: 'Field action, follow-up, and herd protection stay connected.',
    helpline: '24×7 veterinary helpline',
    badge: 'Built for Maharashtra livestock care',
    navOverview: 'Overview',
    navCapabilities: 'Capabilities',
    navImpact: 'Impact',
  },
  mr: {
    eyebrow: 'महाराष्ट्र पशुधन रोग पाळत व आरोग्य नेटवर्क',
    title: 'लवकर ओळखा. जलद प्रतिसाद द्या. प्रत्येक कळपाचे रक्षण करा.',
    intro: 'पशुस्वास्थ्य शेतकरी आणि पशुवैद्यकीय पथकांना एका बुद्धिमान नेटवर्कमध्ये जोडते—लक्षणे नोंदवा, धोका समजून घ्या, उद्रेकाचा मागोवा घ्या आणि उपचार समन्वयित करा.',
    cta: 'सुरुवात करा',
    ctaHint: 'काही सेकंदांत आपले कार्यक्षेत्र निवडा',
    live: 'थेट क्षेत्रीय माहिती',
    online: 'नेटवर्क सुरू',
    signals: 'आजचे संकेत',
    response: 'सरासरी प्रतिसाद',
    careTitle: 'आजची काळजी स्थिती',
    careFirst: 'लक्षणे नोंदवली',
    careFirstMeta: '१२ गावे · आत्ताच अद्ययावत',
    careSecond: 'पशुवैद्यकीय तपासणी',
    careSecondMeta: '८ प्रकरणे · सुरू आहे',
    careThird: 'धोका नकाशा समक्रमित',
    careThirdMeta: '४८ गावे जोडलेली',
    activeLabel: 'सक्रिय',
    farmerTitle: 'मी शेतकरी आहे',
    farmerDesc: 'लक्षणे नोंदवा, पशुधनाची नोंद जवळ ठेवा आणि आपल्या फोनवरून प्रत्येक अहवालाचा मागोवा घ्या.',
    vetTitle: 'मी पशुवैद्यकीय अधिकारी आहे',
    vetDesc: 'नवीन प्रकरणे तपासा, उद्रेकाचे समूह ओळखा आणि वेळेवर क्षेत्रीय कृती करा.',
    choose: 'आपले कार्यक्षेत्र निवडा',
    secure: 'सोप्या ओळख पडताळणीमुळे आपले कार्यक्षेत्र केंद्रित राहते.',
    nameLabel: 'आपले नाव',
    namePlaceholder: 'आपले नाव लिहा',
    phoneLabel: 'मोबाईल क्रमांक',
    phonePlaceholder: '१० अंकी मोबाईल क्रमांक',
    continue: 'कार्यक्षेत्रात जा',
    back: 'भूमिका निवडीकडे परत',
    required: 'कृपया आपले नाव आणि योग्य मोबाईल क्रमांक भरा.',
    whatTitle: 'महत्त्वाच्या क्षणांसाठी एकच नेटवर्क',
    whatText: 'गावातील पहिल्या असामान्य लक्षणापासून समन्वयित पशुवैद्यकीय प्रतिसादापर्यंत, पशुस्वास्थ्य क्षेत्रीय निरीक्षणाला कृतीयोग्य माहितीमध्ये बदलते.',
    feature1Title: 'रिअल-टाइम पाळत',
    feature1Text: 'अहवाल, तातडी, स्थिती आणि क्षेत्रीय प्रतिसादाची सतत अद्ययावत माहिती पाहा.',
    feature2Title: 'लवकर इशारे',
    feature2Text: 'मोठा उद्रेक होण्यापूर्वी गंभीर लक्षणे आणि संभाव्य रोगसमूह ओळखा.',
    feature3Title: 'नकाशावर उद्रेकाचा मागोवा',
    feature3Text: 'नकाशे, ठिकाणे, पशुधन नोंदी आणि प्रकरणांची माहिती वापरून योग्य कृती करा.',
    whyTitle: 'जलद माहिती का महत्त्वाची आहे',
    whyText: 'निरोगी पशुधनामुळे कुटुंबाचे उत्पन्न, अन्नसुरक्षा आणि सार्वजनिक आरोग्य साखळी सुरक्षित राहते. योग्य वेळी मिळालेली माहिती धोका वेगळा करण्यास, शेतकऱ्यांपर्यंत लवकर पोहोचण्यास आणि उपजीविका टिकवण्यास मदत करते.',
    why1: 'उद्रेकाला जलद प्रतिसाद',
    why2: 'शेतकऱ्यांच्या उपजीविकेचे संरक्षण',
    why3: 'सार्वजनिक आरोग्याची तयारी',
    howTitle: 'संकेतापासून उपायापर्यंत',
    how1: 'शेतकरी लक्षण, फोटो, ठिकाण आणि तातडी नोंदवतो.',
    how2: 'पशुवैद्यकीय पथकाला योग्य प्रकरण आणि धोक्याचा नमुना दिसतो.',
    how3: 'क्षेत्रीय कृती, पाठपुरावा आणि पशुधन संरक्षण जोडलेले राहते.',
    helpline: '२४×७ पशुवैद्यकीय हेल्पलाइन',
    badge: 'महाराष्ट्रातील पशुधन सेवांसाठी',
    navOverview: 'आढावा',
    navCapabilities: 'क्षमता',
    navImpact: 'परिणाम',
  },
  hi: {
    eyebrow: 'महाराष्ट्र पशुधन स्वास्थ्य नेटवर्क',
    title: 'जल्दी पहचानें। तेज़ मदद दें। हर झुंड बचाएं।',
    intro: 'किसानों और पशु चिकित्सा टीमों को जोड़कर लक्षण, जोखिम और उपचार की जानकारी एक जगह मिलती है।',
    cta: 'आगे बढ़ें',
    ctaHint: 'अपनी भूमिका चुनें',
    live: 'लाइव निगरानी',
    online: 'नेटवर्क चालू',
    signals: 'आज की रिपोर्ट',
    response: 'औसत समय',
    careTitle: 'आज की स्थिति',
    careFirst: 'लक्षण रिपोर्ट',
    careFirstMeta: '१२ गांव · अभी अपडेट',
    careSecond: 'डॉक्टर की समीक्षा',
    careSecondMeta: '८ मामले · जारी',
    careThird: 'जोखिम मानचित्र',
    careThirdMeta: '४८ गांव जुड़े हैं',
    activeLabel: 'सक्रिय',
    farmerTitle: 'मैं किसान हूँ',
    farmerDesc: 'लक्षण भेजें और अपनी रिपोर्ट का हाल देखें।',
    vetTitle: 'मैं पशु अधिकारी हूँ',
    vetDesc: 'मामले देखें और समय पर फील्ड मदद दें।',
    choose: 'अपनी भूमिका चुनें',
    secure: 'सिर्फ कुछ जानकारी देकर अपना कार्यक्षेत्र खोलें।',
    nameLabel: 'आपका नाम',
    namePlaceholder: 'अपना नाम लिखें',
    phoneLabel: 'मोबाइल नंबर',
    phonePlaceholder: '10 अंकों का मोबाइल नंबर',
    continue: 'कार्यस्थल पर जाएं',
    back: 'भूमिका चयन पर वापस जाएं',
    required: 'नाम और 10 अंकों का मोबाइल नंबर भरें।',
    whatTitle: 'ज़रूरत के समय एक नेटवर्क',
    whatText: 'पहले लक्षण से लेकर पशु चिकित्सा मदद तक, पूरी जानकारी एक जगह जुड़ी रहती है।',
    feature1Title: 'लाइव निगरानी',
    feature1Text: 'रिपोर्ट और फील्ड स्थिति एक जगह देखें।',
    feature2Title: 'जल्दी चेतावनी',
    feature2Text: 'जोखिम बढ़ने से पहले संकेत पहचानें।',
    feature3Title: 'नक्शे पर मामले',
    feature3Text: 'स्थान और मामलों के आधार पर सही मदद भेजें।',
    whyTitle: 'जल्दी जानकारी क्यों ज़रूरी है',
    whyText: 'स्वस्थ पशुधन परिवार की आय और गांव की सुरक्षा बचाता है। सही समय पर सूचना मिलने से टीमें जोखिम रोकती हैं और किसानों तक जल्दी पहुंचती हैं।',
    why1: 'जल्दी कार्रवाई',
    why2: 'किसान की आय सुरक्षित',
    why3: 'गांव की बेहतर तैयारी',
    howTitle: 'रिपोर्ट से मदद तक',
    how1: 'किसान लक्षण और फोटो भेजता है।',
    how2: 'टीम मामला और जोखिम देखती है।',
    how3: 'मदद और फॉलो-अप जुड़ा रहता है।',
    helpline: '24×7 हेल्पलाइन',
    badge: 'महाराष्ट्र पशुधन सेवाओं के लिए',
    navOverview: 'अवलोकन',
    navCapabilities: 'क्षमताएं',
    navImpact: 'प्रभाव',
  },
};

const features = [
  { number: '01', icon: '◉', key: 'feature1' },
  { number: '02', icon: '⌁', key: 'feature2' },
  { number: '03', icon: '◎', key: 'feature3' },
];

export default function LandingPage({ darkMode = false, onToggleTheme = () => {} }) {
  const { lang, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const text = useMemo(() => copy[lang] || copy.en, [lang]);
  const titleParts = useMemo(() => text.title.split(/(?<=\.|।)\s+/), [text.title]);
  const revealRoot = useRef(null);

  useEffect(() => {
    const root = revealRoot.current;
    if (!root) return undefined;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    }), { threshold: 0.14 });
    root.querySelectorAll('.landing-reveal').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({ x: ((event.clientX - rect.left) / rect.width - 0.5) * 2, y: ((event.clientY - rect.top) / rect.height - 0.5) * 2 });
  };

  const goToAccess = () => navigate('/access');

  return (
    <main ref={revealRoot} className={`relative z-10 min-h-screen overflow-hidden landing-page landing-lang-${lang}`} onPointerMove={handlePointerMove}>
      <div className="landing-mesh" aria-hidden="true"><span className="mesh-orb mesh-orb-one" /><span className="mesh-orb mesh-orb-two" /><span className="mesh-orb mesh-orb-three" /><span className="mesh-grid" /></div>
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 pt-5 sm:px-8">
        <div className="flex items-center gap-3 landing-reveal is-visible">
          <div className="landing-mark">✦</div><div><p className="text-sm font-black tracking-tight text-white">PashuSwasthya</p><p className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Field intelligence</p></div>
        </div>
        <div className="landing-nav-links">
          <a href="#overview">{text.navOverview}</a><a href="#capabilities">{text.navCapabilities}</a><a href="#impact">{text.navImpact}</a><button onClick={goToAccess}>{text.cta} ↗</button>
        </div>
        <div className="flex items-center gap-2 landing-reveal is-visible">
          <select aria-label="Select Language" value={lang} onChange={(event) => changeLanguage(event.target.value)} className="landing-control">
            <option value="mr">मराठी (MR)</option><option value="en">English (EN)</option><option value="hi">हिंदी (HI)</option>
          </select>
          <button onClick={onToggleTheme} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} className="landing-control landing-theme">{darkMode ? '☀️ Light' : '🌙 Dark'}</button>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[1fr_.88fr] lg:items-center lg:gap-16 lg:pb-32 lg:pt-20">
        <div className="landing-reveal is-visible">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-950/30 px-3 py-1.5 text-[11px] font-black uppercase tracking-[.14em] text-emerald-300"><span className="live-dot" /> {text.badge}</div>
          <p className="mb-5 text-sm font-black uppercase tracking-[.25em] text-cyan-300">{text.eyebrow}</p>
          <h1 className="landing-title max-w-4xl text-white">{titleParts.map((part, index) => <span key={part} className={`block landing-title-line landing-delay-${index}`}>{part}</span>)}</h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">{text.intro}</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button onClick={goToAccess} className="landing-cta group">{text.cta}<span className="landing-cta-arrow">↗</span></button>
            <span className="text-xs font-bold text-slate-500">{text.ctaHint}</span>
          </div>
        </div>

        <div className="landing-reveal is-visible landing-delay-2" style={{ transform: `perspective(1100px) rotateY(${pointer.x * 2.2}deg) rotateX(${pointer.y * -1.5}deg)` }}>
          <div className="care-pulse-card">
            <div className="care-pulse-top"><div><p className="care-kicker">{text.live}</p><h2>{text.careTitle}</h2></div><span className="status-pill"><span className="live-dot" /> {text.activeLabel}</span></div>
            <div className="care-pulse-summary"><div className="care-pulse-icon">✚</div><div><strong>04:18</strong><span>{text.response}</span></div><div className="care-wave" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div></div>
            <div className="care-activity"><div className="care-row"><span className="care-row-icon care-green">✓</span><div><strong>{text.careFirst}</strong><small>{text.careFirstMeta}</small></div><b>12</b></div><div className="care-row"><span className="care-row-icon care-blue">↗</span><div><strong>{text.careSecond}</strong><small>{text.careSecondMeta}</small></div><b>08</b></div><div className="care-row"><span className="care-row-icon care-amber">⌖</span><div><strong>{text.careThird}</strong><small>{text.careThirdMeta}</small></div><b>48</b></div></div>
            <div className="care-footer"><span><span className="live-dot" /> {text.online}</span><span>·</span><span>1962 {text.helpline}</span></div>
          </div>
        </div>
      </section>

      <section id="overview" className="landing-reveal relative z-10 mx-auto max-w-7xl scroll-mt-8 px-5 pb-24 sm:px-8 lg:pb-32">
        <div className="grid gap-8 border-y border-white/10 py-12 md:grid-cols-[.75fr_1.25fr] md:items-end md:gap-16"><p className="text-sm font-black uppercase tracking-[.22em] text-emerald-300">01 / {text.whatTitle}</p><p className="max-w-3xl text-xl font-semibold leading-9 text-slate-200 sm:text-2xl">{text.whatText}</p></div>
      </section>

      <section id="capabilities" className="relative z-10 mx-auto max-w-7xl scroll-mt-8 px-5 pb-24 sm:px-8 lg:pb-32"><div className="mb-9 landing-reveal"><p className="text-sm font-black uppercase tracking-[.22em] text-cyan-300">02 / Core capabilities</p></div><div className="grid gap-4 md:grid-cols-3">{features.map((feature, index) => <article key={feature.key} className={`landing-feature landing-reveal landing-stagger-${index + 1}`}><div className="flex items-start justify-between"><span className="feature-icon">{feature.icon}</span><span className="text-xs font-black tracking-[.2em] text-slate-600">{feature.number}</span></div><h2 className="mt-12 text-xl font-black text-white">{text[`${feature.key}Title`]}</h2><p className="mt-3 text-sm leading-7 text-slate-400">{text[`${feature.key}Text`]}</p><div className="feature-line" /></article>)}</div></section>

      <section id="impact" className="relative z-10 border-y border-white/10 bg-white/[.02] py-24 sm:py-28"><div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-24"><div className="landing-reveal"><p className="text-sm font-black uppercase tracking-[.22em] text-rose-300">03 / Why it matters</p><h2 className="mt-5 max-w-xl text-4xl font-black leading-tight text-white sm:text-5xl">{text.whyTitle}</h2></div><div className="landing-reveal landing-delay-1"><p className="text-lg leading-9 text-slate-300">{text.whyText}</p><div className="mt-8 grid gap-3 sm:grid-cols-3">{[text.why1, text.why2, text.why3].map((item, index) => <div key={item} className="why-chip"><span>0{index + 1}</span>{item}</div>)}</div></div></div></section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32"><div className="mb-10 landing-reveal"><p className="text-sm font-black uppercase tracking-[.22em] text-amber-300">04 / {text.howTitle}</p></div><div className="grid gap-5 md:grid-cols-3">{[text.how1, text.how2, text.how3].map((item, index) => <div key={item} className="how-step landing-reveal" style={{ transitionDelay: `${index * 90}ms` }}><span>0{index + 1}</span><p>{item}</p>{index < 2 && <b>→</b>}</div>)}</div></section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-28 sm:px-8"><div className="landing-handoff"><div className="landing-reveal"><p className="text-sm font-black uppercase tracking-[.22em] text-emerald-300">05 / Access</p><h2 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl">{text.choose}</h2><p className="mt-5 max-w-lg leading-8 text-slate-400">{text.secure}</p><a href="tel:1962" className="mt-8 inline-flex items-center gap-3 text-sm font-black text-rose-300 transition hover:text-rose-200"><span className="helpline-icon">☎</span>{text.helpline}: 1962</a></div><div className="handoff-card landing-reveal landing-delay-1"><span className="handoff-index">05</span><div><p>{text.ctaHint}</p><strong>{text.cta}</strong></div><button onClick={goToAccess} className="handoff-button">↗</button></div></div></section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-7 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs font-bold text-slate-600 sm:flex-row sm:items-center sm:justify-between"><span>© PashuSwasthya · Maharashtra Livestock Network</span><span>Reports · Maps · Herds · Response</span></div></footer>
    </main>
  );
}
