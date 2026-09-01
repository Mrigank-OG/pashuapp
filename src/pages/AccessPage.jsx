import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const accessCopy = {
  en: {
    protocol: 'ACCESS PROTOCOL',
    eyebrow: 'PashuSwasthya field network',
    title: 'Enter the network',
    sub: 'Choose your role to open the workspace built for your day-to-day livestock health work.',
    farmer: 'Farmer',
    vet: 'Veterinary officer',
    farmerShort: 'Report and protect',
    vetShort: 'Review and respond',
    identity: 'IDENTITY DETAILS',
    name: 'Full name',
    namePlaceholder: 'Your name',
    phone: 'Mobile number',
    phonePlaceholder: '10-digit mobile number',
    continue: 'INITIALIZE WORKSPACE',
    back: 'Back to landing',
    change: 'Change role',
    help: 'Need help? Call 1962',
    note: 'Your selected role is remembered on this device so repeat visits can be faster.',
    required: 'Enter your name and a valid 10-digit mobile number to continue.',
    footer: 'Maharashtra livestock health network',
    mark: 'PS',
    live: 'Realtime surveillance active',
  },
  mr: {
    protocol: 'प्रवेश प्रक्रिया',
    eyebrow: 'पशुस्वास्थ्य क्षेत्रीय नेटवर्क',
    title: 'नेटवर्कमध्ये प्रवेश करा',
    sub: 'आपल्या दैनंदिन पशुधन आरोग्य कामासाठी योग्य कार्यक्षेत्र निवडा.',
    farmer: 'शेतकरी',
    vet: 'पशुवैद्यकीय अधिकारी',
    farmerShort: 'नोंदवा आणि संरक्षण करा',
    vetShort: 'तपासा आणि प्रतिसाद द्या',
    identity: 'ओळख तपशील',
    name: 'पूर्ण नाव',
    namePlaceholder: 'आपले नाव',
    phone: 'मोबाईल क्रमांक',
    phonePlaceholder: '१० अंकी मोबाईल क्रमांक',
    continue: 'कार्यक्षेत्र सुरू करा',
    back: 'लँडिंगकडे परत',
    change: 'भूमिका बदला',
    help: 'मदतीसाठी १९६२ वर कॉल करा',
    note: 'पुढील भेट जलद व्हावी म्हणून निवडलेली भूमिका या उपकरणावर जतन केली जाते.',
    required: 'पुढे जाण्यासाठी आपले नाव आणि योग्य १० अंकी मोबाईल क्रमांक भरा.',
    footer: 'महाराष्ट्र पशुधन आरोग्य नेटवर्क',
    mark: 'पशु',
    live: 'रिअलटाइम पाळत सुरू',
  },
  hi: {
    protocol: 'प्रवेश',
    eyebrow: 'पशुधन स्वास्थ्य नेटवर्क',
    title: 'वर्कस्पेस खोलें',
    sub: 'भूमिका चुनें और आगे बढ़ें।',
    farmer: 'किसान',
    vet: 'पशु अधिकारी',
    farmerShort: 'रिपोर्ट भेजें',
    vetShort: 'मामले संभालें',
    identity: 'अपनी जानकारी',
    name: 'नाम',
    namePlaceholder: 'अपना नाम',
    phone: 'मोबाइल',
    phonePlaceholder: '10 अंकों का नंबर',
    continue: 'वर्कस्पेस खोलें',
    back: 'वापस',
    change: 'भूमिका बदलें',
    help: 'मदद: 1962',
    note: 'आपकी भूमिका इस डिवाइस पर सुरक्षित रहती है।',
    required: 'नाम और 10 अंकों का मोबाइल नंबर भरें।',
    footer: 'महाराष्ट्र पशुधन नेटवर्क',
    mark: 'पशु',
    live: 'निगरानी चालू',
  },
};

export default function AccessPage({ darkMode = false, onToggleTheme = () => {} }) {
  const { lang, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const text = useMemo(() => accessCopy[lang] || accessCopy.en, [lang]);
  const [role, setRole] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const enterWorkspace = () => {
    if (!role || !name.trim() || !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      setError(text.required);
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    localStorage.setItem('pashu_role', role);
    localStorage.setItem('pashu_session', JSON.stringify({ name: name.trim(), phone: cleanPhone, role }));
    navigate(role === 'vet' ? '/dashboard' : '/report', { replace: true });
  };

  return (
    <main className={`access-page access-lang-${lang}`}>
      <div className="access-topbar">
        <button className="access-brand" onClick={() => navigate('/')} aria-label={text.back}><span className="access-brand-mark">✦</span><span><strong>PashuSwasthya</strong><small>{text.eyebrow}</small></span></button>
        <div className="access-top-actions"><select aria-label="Select Language" value={lang} onChange={(event) => changeLanguage(event.target.value)} className="access-language"><option value="mr">मराठी</option><option value="en">English</option><option value="hi">हिंदी</option></select><button onClick={onToggleTheme} className="access-theme" aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>{darkMode ? '☀️' : '◐'}</button></div>
      </div>
      <section className="access-shell">
        <div className="access-brand-panel"><div className="access-panel-top"><span className="access-wordmark">{text.mark}</span><span className="access-live"><i /> {text.live}</span></div><div className="access-signal-mark"><span /><span /><span /><span /><span /><span /></div><div className="access-panel-bottom"><p>{text.protocol}</p><h1>{text.title}</h1><div className="access-meta"><span>MH · 1962</span><span>FIELD / HEALTH</span></div></div></div>
        <div className="access-form-panel"><div className="access-form-heading"><p>{text.protocol}</p><span /><small>01 / 02</small></div><h2>{text.title}</h2><p className="access-form-sub">{text.sub}</p><div className="access-rule" /><div className="access-role-label">{text.identity}</div><div className="access-role-grid"><button onClick={() => { setRole('farmer'); setError(''); }} className={`access-role ${role === 'farmer' ? 'selected farmer' : ''}`}><span>🌾</span><strong>{text.farmer}</strong><small>{text.farmerShort}</small></button><button onClick={() => { setRole('vet'); setError(''); }} className={`access-role ${role === 'vet' ? 'selected vet' : ''}`}><span>🩺</span><strong>{text.vet}</strong><small>{text.vetShort}</small></button></div><div className="access-fields"><label>{text.name}<input value={name} onChange={(event) => { setName(event.target.value); setError(''); }} placeholder={text.namePlaceholder} /></label><label>{text.phone}<input value={phone} onChange={(event) => { setPhone(event.target.value); setError(''); }} inputMode="numeric" placeholder={text.phonePlaceholder} /></label></div>{error && <p className="access-error">{error}</p>}<button onClick={enterWorkspace} className="access-submit">{text.continue}<span>↗</span></button><div className="access-bottom-links"><button onClick={() => navigate('/')} className="access-back">← {text.back}</button>{role && <button onClick={() => { setRole(null); setError(''); }} className="access-change">{text.change}</button>}</div><p className="access-note">{text.note}</p><div className="access-footer"><span>{text.help}</span><span>{text.footer}</span></div></div>
      </section>
    </main>
  );
}
