import React, { useState, useRef } from 'react';
import { Download, Code2, Quote, Lightbulb, Megaphone, Sparkles, Linkedin, Layers, BookOpen, Wand2, Copy, Check, Loader2, ChevronLeft, ChevronRight, Plus, Trash2, Image as ImageIcon, X, Upload, Brain, Sigma, GitCompare, Calendar, TrendingUp, Network, Zap, RefreshCw } from 'lucide-react';

const themes = {
  terminal: {
    name: 'Terminal',
    swatch: ['#0a0e1a', '#00ff88'],
    bgGradient: ['#0a0e1a', '#1a1f3a'],
    text: '#ffffff',
    muted: '#94a3b8',
    accent: '#00ff88',
    accent2: '#00d4ff',
    cardBg: 'rgba(0,0,0,0.4)',
    isDark: true,
  },
  cosmic: {
    name: 'Cosmic',
    swatch: ['#667eea', '#f093fb'],
    bgGradient: ['#667eea', '#764ba2', '#f093fb'],
    text: '#ffffff',
    muted: '#e9d5ff',
    accent: '#ffd700',
    accent2: '#ff79c6',
    cardBg: 'rgba(0,0,0,0.25)',
    isDark: true,
  },
  ocean: {
    name: 'Ocean',
    swatch: ['#0ea5e9', '#1e3a8a'],
    bgGradient: ['#0ea5e9', '#1e3a8a'],
    text: '#ffffff',
    muted: '#cbd5e1',
    accent: '#22d3ee',
    accent2: '#a78bfa',
    cardBg: 'rgba(0,0,0,0.3)',
    isDark: true,
  },
  sunset: {
    name: 'Sunset',
    swatch: ['#ff6b6b', '#ffa07a'],
    bgGradient: ['#ff6b6b', '#f06595', '#ffa07a'],
    text: '#ffffff',
    muted: '#ffe5e0',
    accent: '#ffd166',
    accent2: '#ffffff',
    cardBg: 'rgba(0,0,0,0.25)',
    isDark: true,
  },
  minimal: {
    name: 'Minimal',
    swatch: ['#ffffff', '#000000'],
    bgGradient: ['#ffffff', '#f5f5f5'],
    text: '#0a0a0a',
    muted: '#737373',
    accent: '#0066ff',
    accent2: '#ef4444',
    cardBg: 'rgba(0,0,0,0.04)',
    isDark: false,
  },
  paper: {
    name: 'Paper',
    swatch: ['#fef3c7', '#92400e'],
    bgGradient: ['#fef9e7', '#fef3c7'],
    text: '#1c1917',
    muted: '#78716c',
    accent: '#dc2626',
    accent2: '#0369a1',
    cardBg: 'rgba(0,0,0,0.03)',
    isDark: false,
  },
};

const templateList = [
  { key: 'thumbnail', name: 'Quick AI', icon: Zap, group: 'quick' },
  { key: 'concept', name: 'ML Concept', icon: Brain, group: 'ml' },
  { key: 'formula', name: 'Formula', icon: Sigma, group: 'ml' },
  { key: 'compare', name: 'VS', icon: GitCompare, group: 'ml' },
  { key: 'day', name: 'Day Log', icon: Calendar, group: 'ml' },
  { key: 'curve', name: 'Curve', icon: TrendingUp, group: 'ml' },
  { key: 'network', name: 'Network', icon: Network, group: 'ml' },
  { key: 'code', name: 'Code', icon: Code2, group: 'basic' },
  { key: 'quote', name: 'Quote', icon: Quote, group: 'basic' },
  { key: 'tips', name: 'Tips', icon: Lightbulb, group: 'basic' },
  { key: 'announce', name: 'Announce', icon: Megaphone, group: 'basic' },
  { key: 'explainer', name: 'Explain', icon: BookOpen, group: 'basic' },
  { key: 'carousel', name: 'Carousel', icon: Layers, group: 'basic' },
];

const wrapText = (text, maxChars) => {
  if (!text) return [''];
  const lines = [];
  text.split('\n').forEach(paragraph => {
    if (!paragraph) { lines.push(''); return; }
    const words = paragraph.split(' ');
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      if (testLine.length <= maxChars) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
  });
  return lines;
};

const defaultCarousel = [
  { type: 'cover', title: '5 Python tricks every dev should know', subtitle: 'Swipe to level up →' },
  { type: 'tip', number: 1, heading: 'List comprehensions', body: 'Replace 5-line loops with one elegant line.' },
  { type: 'tip', number: 2, heading: 'Walrus operator', body: 'Assign and check in one go. Cleaner while loops.' },
  { type: 'cta', title: 'Found this useful?', subtitle: 'Follow for more AI & coding tips' },
];

export default function LinkedInPostDesigner() {
  const [template, setTemplate] = useState('thumbnail');
  const [themeKey, setThemeKey] = useState('cosmic');
  
  // Quick Thumbnail state
  const [thumbnailIdea, setThumbnailIdea] = useState('Why squared error fails for logistic regression');
  const [thumbnailVariants, setThumbnailVariants] = useState([]);
  const [activeVariant, setActiveVariant] = useState(0);
  const [generatingThumbnail, setGeneratingThumbnail] = useState(false);
  
  // Basic templates
  const [title, setTitle] = useState('5 Python tricks every dev should know');
  const [subtitle, setSubtitle] = useState('Save hours of coding time every week');
  const [code, setCode] = useState(`# Filter and transform in one line
nums = [x*2 for x in data if x > 0]

# Walrus for cleaner loops
while (line := f.readline()):
    process(line)`);
  const [quote, setQuote] = useState('The best AI engineers aren\'t the ones who write the most code. They\'re the ones who know which code not to write.');
  const [tips, setTips] = useState('Use AI for boilerplate, not architecture\nReview every line of generated code\nWrite tests before letting AI refactor');
  const [announceTitle, setAnnounceTitle] = useState('Just shipped my first AI app');
  const [announceBody, setAnnounceBody] = useState('Built it in 48 hours using Claude and Next.js.');
  const [explainCode, setExplainCode] = useState(`async def fetch_with_retry(url, max=3):
    for i in range(max):
        try:
            return await fetch(url)
        except:
            await sleep(2 ** i)`);
  const [explainTitle, setExplainTitle] = useState('Exponential backoff in 6 lines');
  const [explainPoints, setExplainPoints] = useState('Tries up to 3 times before giving up\nWaits 1s, 2s, 4s between retries\nPerfect for flaky API calls');
  
  // ML-specific templates
  const [conceptName, setConceptName] = useState('Cost Function');
  const [conceptCategory, setConceptCategory] = useState('LOGISTIC REGRESSION');
  const [conceptDef, setConceptDef] = useState('Measures how wrong the model predictions are. Tells the algorithm what to minimize during training.');
  const [conceptKey1, setConceptKey1] = useState('Lower cost = better fit');
  const [conceptKey2, setConceptKey2] = useState('Gives learning direction');
  const [conceptKey3, setConceptKey3] = useState('Drives gradient descent');
  
  const [formulaTitle, setFormulaTitle] = useState('Cross-Entropy Loss');
  const [formulaSubtitle, setFormulaSubtitle] = useState('Logistic Regression Cost Function');
  const [formulaLatex, setFormulaLatex] = useState('J(θ) = -[y·log(h) + (1-y)·log(1-h)]');
  const [formulaExplain, setFormulaExplain] = useState('Penalizes confident wrong predictions strongly. Standard loss for binary classification.');
  
  const [compareTitle, setCompareTitle] = useState('Why Cross-Entropy beats Squared Error');
  const [compareLeftLabel, setCompareLeftLabel] = useState('Squared Error');
  const [compareLeftPoints, setCompareLeftPoints] = useState('Non-convex curve\nHard for gradient descent\nGets stuck locally\nWeak gradients');
  const [compareRightLabel, setCompareRightLabel] = useState('Cross-Entropy');
  const [compareRightPoints, setCompareRightPoints] = useState('Convex & smooth\nFast convergence\nStrong gradients\nProbabilistic meaning');
  
  const [dayNumber, setDayNumber] = useState('185');
  const [dayChallenge, setDayChallenge] = useState('Learning in Public');
  const [dayTopic, setDayTopic] = useState('Cost Function for Logistic Regression');
  const [dayInsight, setDayInsight] = useState('The wrong cost function can make learning fail completely. Small mathematical choices create big performance differences.');
  const [dayTags, setDayTags] = useState('Machine Learning · Andrew Ng · Cross-Entropy');
  
  const [curveTitle, setCurveTitle] = useState('The Sigmoid Function');
  const [curveSubtitle, setCurveSubtitle] = useState('Squashes any input into 0-1 probability');
  const [curveType, setCurveType] = useState('sigmoid');
  const [curveNote, setCurveNote] = useState('σ(z) = 1 / (1 + e^-z)');
  
  const [networkTitle, setNetworkTitle] = useState('Neural Network Architecture');
  const [networkSubtitle, setNetworkSubtitle] = useState('How information flows through layers');
  const [networkLayers, setNetworkLayers] = useState('4,6,6,3,1');
  const [networkLabels, setNetworkLabels] = useState('Input,Hidden,Hidden,Hidden,Output');
  
  const [author, setAuthor] = useState('Your Name');
  const [handle, setHandle] = useState('AI Engineer · Learning in Public');
  
  // Image
  const [userImage, setUserImage] = useState(null);
  const [imageLayout, setImageLayout] = useState('hero');
  const [imageOpacity, setImageOpacity] = useState(1);
  const fileInputRef = useRef(null);
  
  // Code block image (replaces code text in Code/Explainer templates)
  const [codeImage, setCodeImage] = useState(null);
  const codeImageInputRef = useRef(null);
  
  // Profile photo
  const [profilePhoto, setProfilePhoto] = useState(null);
  const profilePhotoInputRef = useRef(null);
  
  // Carousel
  const [slides, setSlides] = useState(defaultCarousel);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // AI
  const [caption, setCaption] = useState('');
  const [generatingCaption, setGeneratingCaption] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatingExplain, setGeneratingExplain] = useState(false);
  const [tone, setTone] = useState('Professional');
  const [aiError, setAiError] = useState('');
  
  const svgRef = useRef(null);
  const theme = themes[themeKey];
  
  const downloadPng = () => {
    const svg = svgRef.current;
    if (!svg) {
      setAiError('Preview not ready. Please wait a moment.');
      return;
    }
    
    try {
      // Clone the SVG and ensure all required namespaces are set
      const clonedSvg = svg.cloneNode(true);
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
      clonedSvg.setAttribute('width', '1200');
      clonedSvg.setAttribute('height', '1200');
      
      // Convert any href attributes on image tags to xlink:href for compatibility
      const images = clonedSvg.querySelectorAll('image');
      images.forEach(imgEl => {
        const href = imgEl.getAttribute('href');
        if (href) {
          imgEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', href);
        }
      });
      
      const svgString = new XMLSerializer().serializeToString(clonedSvg);
      // Use base64 data URL instead of blob URL — works reliably in iframes
      const svgBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
      
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          // White or theme-colored background
          ctx.fillStyle = theme.isDark ? '#000000' : '#ffffff';
          ctx.fillRect(0, 0, 1200, 1200);
          ctx.drawImage(img, 0, 0, 1200, 1200);
          
          // Use toDataURL — more reliable than toBlob in sandboxed iframes
          const dataUrl = canvas.toDataURL('image/png', 1.0);
          
          const a = document.createElement('a');
          a.href = dataUrl;
          const suffix = template === 'carousel' ? `slide-${currentSlide + 1}` : template;
          a.download = `linkedin-${suffix}-${Date.now()}.png`;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          
          setTimeout(() => {
            document.body.removeChild(a);
          }, 100);
          
          setAiError('');
        } catch (err) {
          console.error('Canvas export error:', err);
          // Fallback: open the image in a new tab
          try {
            const dataUrl = canvas.toDataURL('image/png');
            const w = window.open();
            if (w) {
              w.document.write(`<img src="${dataUrl}" /><p>Right-click the image and choose "Save Image As..." to download.</p>`);
            } else {
              setAiError('Download blocked. Please try right-clicking the preview and "Save Image As".');
            }
          } catch (e2) {
            setAiError('Could not export. The uploaded image may be blocking export — try removing it.');
          }
        }
      };
      
      img.onerror = (err) => {
        console.error('SVG load error:', err);
        setAiError('Could not render the design. Try removing any uploaded image and try again.');
      };
      
      img.src = svgBase64;
    } catch (err) {
      console.error('Download error:', err);
      setAiError('Download failed. Please try again.');
    }
  };
  
  const downloadAllSlides = async () => {
    for (let i = 0; i < slides.length; i++) {
      setCurrentSlide(i);
      await new Promise(r => setTimeout(r, 400));
      downloadPng();
      await new Promise(r => setTimeout(r, 200));
    }
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setAiError('Image too large. Max 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => { setUserImage(ev.target.result); setAiError(''); };
    reader.readAsDataURL(file);
  };
  
  const handleCodeImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setAiError('Image too large. Max 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => { setCodeImage(ev.target.result); setAiError(''); };
    reader.readAsDataURL(file);
  };
  
  const removeCodeImage = () => {
    setCodeImage(null);
    if (codeImageInputRef.current) codeImageInputRef.current.value = '';
  };
  
  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setAiError('Profile photo too large. Max 3MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => { setProfilePhoto(ev.target.result); setAiError(''); };
    reader.readAsDataURL(file);
  };
  
  const removeProfilePhoto = () => {
    setProfilePhoto(null);
    if (profilePhotoInputRef.current) profilePhotoInputRef.current.value = '';
  };
  
  const removeImage = () => {
    setUserImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const getCurrentContent = () => {
    switch (template) {
      case 'thumbnail': {
        const v = thumbnailVariants[activeVariant];
        if (!v) return `Idea: ${thumbnailIdea}`;
        return `Idea: ${thumbnailIdea}\nStyle: ${v.style}\nHook: ${v.hook}\nSubline: ${v.subline}\nContext: ${v.context}`;
      }
      case 'concept': return `Concept: ${conceptName} (${conceptCategory})\nDefinition: ${conceptDef}\nKey points: ${conceptKey1}, ${conceptKey2}, ${conceptKey3}`;
      case 'formula': return `Formula: ${formulaTitle}\nSubtitle: ${formulaSubtitle}\nEquation: ${formulaLatex}\nExplanation: ${formulaExplain}`;
      case 'compare': return `Comparison: ${compareTitle}\n${compareLeftLabel}: ${compareLeftPoints}\n${compareRightLabel}: ${compareRightPoints}`;
      case 'day': return `Day ${dayNumber} - ${dayChallenge}\nTopic: ${dayTopic}\nInsight: ${dayInsight}`;
      case 'curve': return `Curve: ${curveTitle} (${curveType})\nSubtitle: ${curveSubtitle}\nFormula: ${curveNote}`;
      case 'network': return `Neural Network: ${networkTitle}\nLayers: ${networkLayers}\nLabels: ${networkLabels}`;
      case 'code': return `Title: ${title}\nCode:\n${code}`;
      case 'quote': return `Quote: ${quote}`;
      case 'tips': return `Title: ${title}\nTips: ${tips}`;
      case 'announce': return `Headline: ${announceTitle}\nBody: ${announceBody}`;
      case 'explainer': return `Title: ${explainTitle}\nCode: ${explainCode}\nPoints: ${explainPoints}`;
      case 'carousel': return slides.map((s, i) => `Slide ${i+1}: ${s.title || s.heading || ''}`).join('\n');
      default: return '';
    }
  };
  
  const generateCaption = async () => {
    setGeneratingCaption(true); setAiError(''); setCaption('');
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{
            role: "user",
            content: `You are a LinkedIn growth expert writing for an AI/ML creator. Write a high-engagement caption for this graphic.

Tone: ${tone}
Author: ${handle}

Graphic content:
${getCurrentContent()}

Style guide (match this format):
- Start with emoji + DAY counter or hook (if relevant)
- Short paragraphs (1-2 sentences max) with line breaks
- Use → arrows for bullet points (not • or -)
- Use 📌 for section headers if doing a deep-dive style
- Include "Key Takeaways" section
- End with engagement question
- Add 5-8 relevant hashtags
- 200-400 words for educational content
- No excessive emojis

Output ONLY the caption text, no preamble.`
          }]
        })
      });
      const data = await response.json();
      const text = data.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
      setCaption(text);
    } catch (e) {
      setAiError('Failed to generate caption.');
    }
    setGeneratingCaption(false);
  };
  
  const explainCodeAI = async () => {
    setGeneratingExplain(true); setAiError('');
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Analyze this code for a LinkedIn explainer card.\n\nCode:\n${explainCode}\n\nRespond ONLY with valid JSON:\n{"title": "5-8 word catchy title", "points": ["point 1", "point 2", "point 3", "point 4"]}\n\nPoints under 60 chars each, beginner-friendly.`
          }]
        })
      });
      const data = await response.json();
      const text = data.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim().replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(text);
      if (parsed.title) setExplainTitle(parsed.title);
      if (parsed.points) setExplainPoints(parsed.points.join('\n'));
    } catch (e) {
      setAiError('Failed to analyze code.');
    }
    setGeneratingExplain(false);
  };
  
  const copyCaption = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // ============================================
  // QUICK AI THUMBNAIL GENERATOR
  // ============================================
  const generateThumbnails = async () => {
    if (!thumbnailIdea.trim()) return;
    setGeneratingThumbnail(true);
    setAiError('');
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [{
            role: "user",
            content: `You are a LinkedIn thumbnail designer specializing in scroll-stopping graphics for AI/ML/coding content. The user gave this idea/topic:

"${thumbnailIdea}"

Generate 4 DIFFERENT thumbnail variations using these proven scroll-stopping formats. Each must work as a standalone LinkedIn graphic.

Return ONLY valid JSON (no markdown, no preamble):
{
  "variants": [
    {
      "style": "shock",
      "hook": "STOP USING SQUARED ERROR",
      "subline": "for logistic regression",
      "context": "Here's why →"
    },
    {
      "style": "question",
      "hook": "Why does ML fail 90% of the time?",
      "subline": "It's not what you think",
      "context": "Hint: math choices matter"
    },
    {
      "style": "stat",
      "hook": "10x",
      "subline": "faster convergence",
      "context": "with the right cost function"
    },
    {
      "style": "reveal",
      "hook": "I learned cost functions",
      "subline": "so you don't have to",
      "context": "5-minute read"
    }
  ]
}

Rules:
- "shock": ALL CAPS, 3-5 powerful words, like a wake-up call
- "question": Provocative question that makes people stop and think
- "stat": Big number/multiplier (10x, 90%, 3 hours, etc) with context
- "reveal": Personal/story-driven, "I did X so you don't have to" pattern
- Hook must be SHORT (under 35 chars). Subline under 30 chars. Context under 25 chars.
- Make them SPECIFIC to the user's topic, not generic
- Use power words: STOP, NEVER, WHY, HOW, SECRET, TRUTH, MISTAKE, etc
- Be punchy. Every word must earn its place.`
          }]
        })
      });
      const data = await response.json();
      const text = data.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim()
        .replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(text);
      if (parsed.variants && Array.isArray(parsed.variants)) {
        setThumbnailVariants(parsed.variants);
        setActiveVariant(0);
      }
    } catch (e) {
      setAiError('Failed to generate thumbnails. Please try again.');
    }
    setGeneratingThumbnail(false);
  };
  
  const updateSlide = (index, updates) => {
    setSlides(slides.map((s, i) => i === index ? { ...s, ...updates } : s));
  };
  
  const addSlide = () => {
    if (slides.length >= 10) return;
    const newSlide = { type: 'tip', number: slides.filter(s => s.type === 'tip').length + 1, heading: 'New tip', body: 'Add content' };
    setSlides([...slides.slice(0, -1), newSlide, slides[slides.length - 1]]);
    setCurrentSlide(slides.length - 1);
  };
  
  const deleteSlide = (index) => {
    if (slides.length <= 2) return;
    setSlides(slides.filter((_, i) => i !== index));
    setCurrentSlide(Math.min(currentSlide, slides.length - 2));
  };
  
  const renderBackground = () => {
    const grad = theme.bgGradient;
    return (
      <>
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            {grad.map((c, i) => <stop key={i} offset={`${(i / (grad.length - 1)) * 100}%`} stopColor={c} />)}
          </linearGradient>
          <radialGradient id="glowAccent" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={theme.accent} stopOpacity="0.4" />
            <stop offset="100%" stopColor={theme.accent} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glowAccent2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={theme.accent2} stopOpacity="0.35" />
            <stop offset="100%" stopColor={theme.accent2} stopOpacity="0" />
          </radialGradient>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={theme.text} strokeOpacity="0.04" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="1200" height="1200" fill="url(#bgGrad)" />
        <rect width="1200" height="1200" fill="url(#grid)" />
        <circle cx="100" cy="100" r="400" fill="url(#glowAccent)" />
        <circle cx="1100" cy="1100" r="450" fill="url(#glowAccent2)" />
      </>
    );
  };
  
  const renderUserImage = () => {
    if (!userImage) return null;
    if (imageLayout === 'background') {
      return (
        <g>
          <image href={userImage} x="0" y="0" width="1200" height="1200" preserveAspectRatio="xMidYMid slice" opacity={imageOpacity * 0.3} />
          <rect width="1200" height="1200" fill={theme.bgGradient[0]} fillOpacity="0.6" />
        </g>
      );
    }
    if (imageLayout === 'hero') {
      return (
        <g>
          <defs><clipPath id="heroClip"><rect x="80" y="120" width="1040" height="320" rx="24" /></clipPath></defs>
          <rect x="80" y="120" width="1040" height="320" rx="24" fill={theme.cardBg} />
          <image href={userImage} x="80" y="120" width="1040" height="320" preserveAspectRatio="xMidYMid slice" clipPath="url(#heroClip)" opacity={imageOpacity} />
        </g>
      );
    }
    if (imageLayout === 'split') {
      return (
        <g>
          <defs><clipPath id="splitClip"><rect x="600" y="0" width="600" height="1200" /></clipPath></defs>
          <image href={userImage} x="600" y="0" width="600" height="1200" preserveAspectRatio="xMidYMid slice" clipPath="url(#splitClip)" opacity={imageOpacity} />
        </g>
      );
    }
    if (imageLayout === 'inline') {
      return (
        <g>
          <defs><clipPath id="inlineClip"><rect x="440" y="540" width="320" height="320" rx="160" /></clipPath></defs>
          <circle cx="600" cy="700" r="170" fill={theme.cardBg} stroke={theme.accent} strokeWidth="6" />
          <image href={userImage} x="440" y="540" width="320" height="320" preserveAspectRatio="xMidYMid slice" clipPath="url(#inlineClip)" opacity={imageOpacity} />
        </g>
      );
    }
    return null;
  };
  
  const renderFooter = (compact = false) => (
    <g>
      <line x1="80" y1="1060" x2="1120" y2="1060" stroke={theme.text} strokeOpacity="0.15" strokeWidth="2" />
      {profilePhoto ? (
        <>
          <defs>
            <clipPath id="profileClip">
              <circle cx="110" cy="1115" r="26" />
            </clipPath>
          </defs>
          <circle cx="110" cy="1115" r="28" fill={theme.accent} />
          <image
            href={profilePhoto}
            x="84"
            y="1089"
            width="52"
            height="52"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#profileClip)"
          />
        </>
      ) : (
        <>
          <circle cx="110" cy="1115" r="22" fill={theme.accent} />
          <text x="110" y="1124" fontSize="24" fontWeight="700" fill={theme.isDark ? '#000' : '#fff'} textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">
            {author.charAt(0).toUpperCase()}
          </text>
        </>
      )}
      <text x="150" y="1108" fontSize="26" fontWeight="700" fill={theme.text} fontFamily="system-ui, -apple-system, sans-serif">{author}</text>
      <text x="150" y="1138" fontSize="20" fill={theme.muted} fontFamily="system-ui, -apple-system, sans-serif">{handle}</text>
      <g transform="translate(1060, 1098)">
        <rect width="40" height="40" rx="6" fill="#0A66C2" />
        <text x="20" y="28" fontSize="24" fontWeight="700" fill="#fff" textAnchor="middle">in</text>
      </g>
    </g>
  );
  
  // ========================================
  // QUICK AI THUMBNAIL - 4 scroll-stopping styles
  // ========================================
  const renderThumbnail = () => {
    const variant = thumbnailVariants[activeVariant];
    if (!variant) {
      return (
        <>
          <g transform="translate(600, 480)">
            <circle r="120" fill={theme.cardBg} stroke={theme.accent} strokeWidth="4" strokeDasharray="8 8" />
            <text y="20" fontSize="80" textAnchor="middle">⚡</text>
          </g>
          <text x="600" y="720" fontSize="56" fontWeight="900" fill={theme.text} textAnchor="middle" fontFamily="system-ui, sans-serif">
            Quick AI Thumbnail
          </text>
          <text x="600" y="780" fontSize="28" fill={theme.muted} textAnchor="middle" fontFamily="system-ui, sans-serif">
            Type your idea → Get 4 designs in seconds
          </text>
          <text x="600" y="830" fontSize="22" fill={theme.muted} textAnchor="middle" fontFamily="system-ui, sans-serif">
            Powered by Claude AI ✨
          </text>
          {renderFooter()}
        </>
      );
    }
    
    const { style, hook, subline, context } = variant;
    const hookLines = wrapText(hook || '', 18);
    
    // SHOCK STYLE - All caps, massive, urgent
    if (style === 'shock') {
      return (
        <>
          <g opacity="0.15">
            <text x="100" y="200" fontSize="180" fill={theme.accent}>⚠</text>
            <text x="950" y="1050" fontSize="160" fill={theme.accent2}>!</text>
          </g>
          <g transform="translate(80, 200)">
            <rect width="280" height="60" rx="30" fill="#ef4444" />
            <text x="140" y="40" fontSize="24" fontWeight="900" fill="#fff" textAnchor="middle" letterSpacing="3">
              🛑 WAIT
            </text>
          </g>
          {hookLines.slice(0, 4).map((line, i) => (
            <text key={i} x="80" y={400 + i * 130} fontSize="140" fontWeight="900" fill={theme.text} fontFamily="system-ui, sans-serif" letterSpacing="-4">
              {line.toUpperCase()}
            </text>
          ))}
          <rect x="80" y={440 + hookLines.length * 130} width="200" height="10" fill={theme.accent} />
          {subline && (
            <text x="80" y={520 + hookLines.length * 130} fontSize="42" fontWeight="600" fill={theme.muted} fontFamily="system-ui, sans-serif">
              {subline}
            </text>
          )}
          {context && (
            <g transform="translate(80, 980)">
              <rect width="500" height="56" rx="28" fill={theme.accent} />
              <text x="250" y="38" fontSize="26" fontWeight="800" fill={theme.isDark ? '#000' : '#fff'} textAnchor="middle">
                {context}
              </text>
            </g>
          )}
          {renderFooter()}
        </>
      );
    }
    
    // QUESTION STYLE - Provocative, curiosity-driven
    if (style === 'question') {
      return (
        <>
          <text x="80" y="320" fontSize="320" fontFamily="Georgia, serif" fill={theme.accent} fillOpacity="0.5" fontWeight="900">?</text>
          <g transform="translate(80, 200)">
            <rect width="200" height="50" rx="25" fill={theme.accent2} fillOpacity="0.2" stroke={theme.accent2} strokeWidth="2" />
            <text x="100" y="33" fontSize="20" fontWeight="800" fill={theme.accent2} textAnchor="middle" letterSpacing="3">
              💭 THINK
            </text>
          </g>
          {hookLines.slice(0, 4).map((line, i) => (
            <text key={i} x="80" y={500 + i * 110} fontSize="100" fontWeight="900" fill={theme.text} fontFamily="system-ui, sans-serif" letterSpacing="-2">
              {line}
            </text>
          ))}
          <g transform={`translate(80, ${550 + hookLines.length * 110})`}>
            <rect width="6" height="120" fill={theme.accent} />
            {subline && (
              <text x="30" y="50" fontSize="40" fontWeight="600" fill={theme.muted} fontFamily="system-ui, sans-serif" fontStyle="italic">
                {subline}
              </text>
            )}
            {context && (
              <text x="30" y="100" fontSize="28" fontWeight="500" fill={theme.accent2} fontFamily="system-ui, sans-serif">
                → {context}
              </text>
            )}
          </g>
          {renderFooter()}
        </>
      );
    }
    
    // STAT STYLE - Massive number/multiplier
    if (style === 'stat') {
      const statValue = hook || '10x';
      const isShortStat = statValue.length <= 6;
      return (
        <>
          <g opacity="0.08">
            <circle cx="600" cy="600" r="500" fill="none" stroke={theme.accent} strokeWidth="2" />
            <circle cx="600" cy="600" r="400" fill="none" stroke={theme.accent} strokeWidth="2" />
            <circle cx="600" cy="600" r="300" fill="none" stroke={theme.accent} strokeWidth="2" />
          </g>
          <g transform="translate(80, 200)">
            <rect width="240" height="50" rx="25" fill={theme.accent} />
            <text x="120" y="33" fontSize="22" fontWeight="900" fill={theme.isDark ? '#000' : '#fff'} textAnchor="middle" letterSpacing="3">
              📊 BY THE NUMBERS
            </text>
          </g>
          <text 
            x="600" 
            y={isShortStat ? "650" : "620"} 
            fontSize={isShortStat ? "420" : "260"} 
            fontWeight="900" 
            fill={theme.accent} 
            textAnchor="middle" 
            fontFamily="system-ui, sans-serif" 
            letterSpacing="-12"
          >
            {statValue}
          </text>
          {subline && (
            <text x="600" y="780" fontSize="56" fontWeight="800" fill={theme.text} textAnchor="middle" fontFamily="system-ui, sans-serif" letterSpacing="-1">
              {subline}
            </text>
          )}
          {context && (
            <text x="600" y="850" fontSize="30" fontWeight="500" fill={theme.muted} textAnchor="middle" fontFamily="system-ui, sans-serif">
              {context}
            </text>
          )}
          <g transform="translate(540, 920)">
            <line x1="0" y1="0" x2="120" y2="0" stroke={theme.accent} strokeWidth="4" />
          </g>
          {renderFooter()}
        </>
      );
    }
    
    // REVEAL STYLE - Personal story/journey
    if (style === 'reveal') {
      return (
        <>
          <g opacity="0.12">
            <path d="M 100 1100 Q 300 900 500 950 T 900 850 T 1100 700" fill="none" stroke={theme.accent} strokeWidth="6" strokeLinecap="round" />
            <circle cx="1100" cy="700" r="20" fill={theme.accent} />
          </g>
          <g transform="translate(80, 200)">
            <rect width="200" height="50" rx="25" fill={theme.accent2} />
            <text x="100" y="33" fontSize="22" fontWeight="900" fill={theme.isDark ? '#000' : '#fff'} textAnchor="middle" letterSpacing="3">
              ✨ STORY
            </text>
          </g>
          {hookLines.slice(0, 3).map((line, i) => (
            <text key={i} x="80" y={380 + i * 110} fontSize="96" fontWeight="900" fill={theme.text} fontFamily="system-ui, sans-serif" letterSpacing="-2">
              {line}
            </text>
          ))}
          <g transform={`translate(80, ${440 + hookLines.length * 110})`}>
            <rect width="1040" height="180" rx="20" fill={theme.cardBg} stroke={theme.accent2} strokeOpacity="0.4" strokeWidth="3" />
            {subline && (
              <text x="40" y="70" fontSize="48" fontWeight="800" fill={theme.accent} fontFamily="system-ui, sans-serif">
                {subline}
              </text>
            )}
            {context && (
              <g transform="translate(40, 110)">
                <circle cx="14" cy="20" r="8" fill={theme.accent2} />
                <text x="40" y="28" fontSize="28" fontWeight="500" fill={theme.muted} fontFamily="system-ui, sans-serif" fontStyle="italic">
                  {context}
                </text>
              </g>
            )}
          </g>
          {renderFooter()}
        </>
      );
    }
    
    return null;
  };
  
  // ========================================
  // ML CONCEPT CARD - Beautiful concept visualization
  // ========================================
  const renderConcept = () => {
    const nameLines = wrapText(conceptName, 16);
    const defLines = wrapText(conceptDef, 36);
    return (
      <>
        {/* Decorative neural network nodes in corner */}
        <g opacity="0.15">
          <circle cx="1050" cy="180" r="20" fill={theme.accent} />
          <circle cx="1100" cy="240" r="14" fill={theme.accent2} />
          <circle cx="1020" cy="280" r="10" fill={theme.accent} />
          <line x1="1050" y1="180" x2="1100" y2="240" stroke={theme.accent} strokeWidth="2" />
          <line x1="1050" y1="180" x2="1020" y2="280" stroke={theme.accent} strokeWidth="2" />
          <line x1="1100" y1="240" x2="1020" y2="280" stroke={theme.accent} strokeWidth="2" />
        </g>
        
        {/* Category badge */}
        <g transform="translate(80, 130)">
          <rect width={conceptCategory.length * 14 + 60} height="44" rx="22" fill={theme.accent} fillOpacity="0.15" stroke={theme.accent} strokeWidth="2" />
          <circle cx="28" cy="22" r="6" fill={theme.accent} />
          <text x="50" y="29" fontSize="20" fontWeight="800" fill={theme.accent} fontFamily="system-ui, sans-serif" letterSpacing="2">
            {conceptCategory}
          </text>
        </g>
        
        {/* Concept name - HUGE */}
        {nameLines.slice(0, 2).map((line, i) => (
          <text key={i} x="80" y={280 + i * 110} fontSize="120" fontWeight="900" fill={theme.text} fontFamily="system-ui, sans-serif" letterSpacing="-3">
            {line}
          </text>
        ))}
        
        {/* Decorative underline */}
        <g transform={`translate(80, ${320 + nameLines.length * 110})`}>
          <rect width="100" height="8" fill={theme.accent} />
          <rect x="120" width="40" height="8" fill={theme.accent2} />
        </g>
        
        {/* Definition card */}
        <g transform={`translate(80, ${380 + nameLines.length * 110})`}>
          <rect width="1040" height="160" rx="20" fill={theme.cardBg} stroke={theme.text} strokeOpacity="0.1" strokeWidth="2" />
          <text x="40" y="50" fontSize="18" fontWeight="700" fill={theme.accent} letterSpacing="3" fontFamily="system-ui, sans-serif">
            DEFINITION
          </text>
          {defLines.slice(0, 3).map((line, i) => (
            <text key={i} x="40" y={90 + i * 36} fontSize="28" fontWeight="500" fill={theme.text} fontFamily="system-ui, sans-serif">
              {line}
            </text>
          ))}
        </g>
        
        {/* Key points */}
        <g transform="translate(80, 870)">
          <text x="0" y="0" fontSize="20" fontWeight="700" fill={theme.accent} letterSpacing="3" fontFamily="system-ui, sans-serif">
            KEY POINTS
          </text>
          {[conceptKey1, conceptKey2, conceptKey3].map((pt, i) => (
            <g key={i} transform={`translate(${i * 350}, 30)`}>
              <rect width="320" height="120" rx="16" fill={theme.cardBg} stroke={theme.accent} strokeOpacity="0.3" strokeWidth="2" />
              <circle cx="40" cy="60" r="22" fill={theme.accent} />
              <text x="40" y="70" fontSize="24" fontWeight="800" fill={theme.isDark ? '#000' : '#fff'} textAnchor="middle">{i + 1}</text>
              {wrapText(pt, 22).slice(0, 2).map((line, j) => (
                <text key={j} x="80" y={56 + j * 28} fontSize="20" fontWeight="600" fill={theme.text} fontFamily="system-ui, sans-serif">
                  {line}
                </text>
              ))}
            </g>
          ))}
        </g>
        
        {renderFooter()}
      </>
    );
  };
  
  // ========================================
  // FORMULA CARD - Beautiful equation display
  // ========================================
  const renderFormula = () => {
    const titleLines = wrapText(formulaTitle, 22);
    const explainLines = wrapText(formulaExplain, 40);
    return (
      <>
        {/* Math symbols decoration */}
        <g opacity="0.1" fontFamily="Georgia, serif">
          <text x="100" y="200" fontSize="200" fill={theme.accent}>Σ</text>
          <text x="950" y="350" fontSize="160" fill={theme.accent2}>∂</text>
          <text x="50" y="900" fontSize="180" fill={theme.accent2}>∫</text>
          <text x="1000" y="1000" fontSize="140" fill={theme.accent}>θ</text>
        </g>
        
        {/* Badge */}
        <g transform="translate(80, 130)">
          <rect width="200" height="50" rx="25" fill={theme.accent} />
          <text x="100" y="33" fontSize="22" fontWeight="800" fill={theme.isDark ? '#000' : '#fff'} textAnchor="middle" letterSpacing="2">
            FORMULA
          </text>
        </g>
        
        {/* Title */}
        {titleLines.slice(0, 2).map((line, i) => (
          <text key={i} x="80" y={260 + i * 80} fontSize="72" fontWeight="900" fill={theme.text} fontFamily="system-ui, sans-serif" letterSpacing="-1">
            {line}
          </text>
        ))}
        
        <text x="80" y={310 + titleLines.length * 80} fontSize="28" fill={theme.muted} fontFamily="system-ui, sans-serif">
          {formulaSubtitle}
        </text>
        
        {/* The formula - centered, big, beautiful */}
        <g transform="translate(600, 620)">
          <rect x="-500" y="-110" width="1000" height="220" rx="24" fill={theme.cardBg} stroke={theme.accent} strokeOpacity="0.4" strokeWidth="3" />
          {/* Decorative corners */}
          <line x1="-480" y1="-90" x2="-440" y2="-90" stroke={theme.accent} strokeWidth="3" />
          <line x1="-480" y1="-90" x2="-480" y2="-50" stroke={theme.accent} strokeWidth="3" />
          <line x1="480" y1="90" x2="440" y2="90" stroke={theme.accent} strokeWidth="3" />
          <line x1="480" y1="90" x2="480" y2="50" stroke={theme.accent} strokeWidth="3" />
          
          <text x="0" y="20" fontSize="56" fontWeight="500" fill={theme.text} textAnchor="middle" fontFamily="'Cambria Math', Georgia, serif" fontStyle="italic">
            {formulaLatex}
          </text>
        </g>
        
        {/* Explanation */}
        <g transform="translate(80, 800)">
          <rect width="6" height="180" fill={theme.accent} />
          {explainLines.slice(0, 4).map((line, i) => (
            <text key={i} x="40" y={40 + i * 40} fontSize="28" fontWeight="500" fill={theme.text} fontFamily="system-ui, sans-serif">
              {line}
            </text>
          ))}
        </g>
        
        {renderFooter()}
      </>
    );
  };
  
  // ========================================
  // VS COMPARISON CARD - Side by side
  // ========================================
  const renderCompare = () => {
    const titleLines = wrapText(compareTitle, 28);
    const leftPoints = compareLeftPoints.split('\n').filter(p => p.trim()).slice(0, 5);
    const rightPoints = compareRightPoints.split('\n').filter(p => p.trim()).slice(0, 5);
    return (
      <>
        {/* Title */}
        {titleLines.slice(0, 2).map((line, i) => (
          <text key={i} x="600" y={170 + i * 70} fontSize="56" fontWeight="900" fill={theme.text} textAnchor="middle" fontFamily="system-ui, sans-serif" letterSpacing="-1">
            {line}
          </text>
        ))}
        
        {/* VS divider */}
        <g transform="translate(600, 600)">
          <line x1="0" y1="-280" x2="0" y2="280" stroke={theme.text} strokeOpacity="0.2" strokeWidth="2" strokeDasharray="6 8" />
          <circle r="60" fill={theme.bgGradient[0]} stroke={theme.accent} strokeWidth="4" />
          <text y="18" fontSize="44" fontWeight="900" fill={theme.accent} textAnchor="middle" fontFamily="system-ui, sans-serif">
            VS
          </text>
        </g>
        
        {/* Left side - red/wrong */}
        <g transform="translate(80, 360)">
          <rect width="460" height="80" rx="40" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="3" />
          <text x="50" y="50" fontSize="22" fill="#ef4444" fontWeight="900" letterSpacing="2">❌</text>
          <text x="100" y="52" fontSize="32" fontWeight="800" fill={theme.text} fontFamily="system-ui, sans-serif">
            {compareLeftLabel}
          </text>
          {leftPoints.map((pt, i) => (
            <g key={i} transform={`translate(0, ${130 + i * 90})`}>
              <rect width="460" height="70" rx="12" fill={theme.cardBg} />
              <line x1="0" y1="0" x2="0" y2="70" stroke="#ef4444" strokeWidth="6" />
              <text x="30" y="45" fontSize="24" fontWeight="500" fill={theme.text} fontFamily="system-ui, sans-serif">
                {pt.length > 28 ? pt.substring(0, 28) + '…' : pt}
              </text>
            </g>
          ))}
        </g>
        
        {/* Right side - green/right */}
        <g transform="translate(660, 360)">
          <rect width="460" height="80" rx="40" fill={theme.accent} fillOpacity="0.2" stroke={theme.accent} strokeWidth="3" />
          <text x="50" y="50" fontSize="22" fill={theme.accent} fontWeight="900">✓</text>
          <text x="100" y="52" fontSize="32" fontWeight="800" fill={theme.text} fontFamily="system-ui, sans-serif">
            {compareRightLabel}
          </text>
          {rightPoints.map((pt, i) => (
            <g key={i} transform={`translate(0, ${130 + i * 90})`}>
              <rect width="460" height="70" rx="12" fill={theme.cardBg} />
              <line x1="0" y1="0" x2="0" y2="70" stroke={theme.accent} strokeWidth="6" />
              <text x="30" y="45" fontSize="24" fontWeight="500" fill={theme.text} fontFamily="system-ui, sans-serif">
                {pt.length > 28 ? pt.substring(0, 28) + '…' : pt}
              </text>
            </g>
          ))}
        </g>
        
        {renderFooter()}
      </>
    );
  };
  
  // ========================================
  // DAY LOG CARD - Learning in public
  // ========================================
  const renderDay = () => {
    const topicLines = wrapText(dayTopic, 24);
    const insightLines = wrapText(dayInsight, 38);
    return (
      <>
        {/* Top: Day counter mega-display */}
        <g transform="translate(80, 140)">
          <text x="0" y="40" fontSize="32" fontWeight="700" fill={theme.muted} letterSpacing="6" fontFamily="system-ui, sans-serif">
            🚀 DAY
          </text>
          <text x="0" y="200" fontSize="220" fontWeight="900" fill={theme.text} fontFamily="system-ui, sans-serif" letterSpacing="-8">
            {dayNumber}
          </text>
          <g transform="translate(450, 100)">
            <rect width="600" height="60" rx="30" fill={theme.accent} fillOpacity="0.15" stroke={theme.accent} strokeWidth="2" />
            <text x="30" y="40" fontSize="24" fontWeight="700" fill={theme.accent} letterSpacing="2" fontFamily="system-ui, sans-serif">
              # {dayChallenge.toUpperCase()}
            </text>
          </g>
        </g>
        
        {/* Progress bar visualization */}
        <g transform="translate(80, 380)">
          <rect width="1040" height="14" rx="7" fill={theme.cardBg} />
          <rect width={Math.min(1040, (parseInt(dayNumber) || 0) / 365 * 1040)} height="14" rx="7" fill={theme.accent} />
          <text x="0" y="50" fontSize="18" fill={theme.muted} fontFamily="system-ui, sans-serif">
            {Math.min(100, Math.round((parseInt(dayNumber) || 0) / 365 * 100))}% through the year
          </text>
        </g>
        
        {/* Today's focus */}
        <g transform="translate(80, 480)">
          <text x="0" y="0" fontSize="22" fontWeight="700" fill={theme.accent} letterSpacing="4" fontFamily="system-ui, sans-serif">
            🧠 TODAY'S FOCUS
          </text>
          {topicLines.slice(0, 2).map((line, i) => (
            <text key={i} x="0" y={60 + i * 70} fontSize="60" fontWeight="900" fill={theme.text} fontFamily="system-ui, sans-serif" letterSpacing="-1">
              {line}
            </text>
          ))}
        </g>
        
        {/* Key insight */}
        <g transform={`translate(80, ${640 + topicLines.length * 70})`}>
          <rect width="1040" height={80 + insightLines.length * 40} rx="20" fill={theme.cardBg} stroke={theme.accent2} strokeOpacity="0.4" strokeWidth="2" />
          <text x="40" y="40" fontSize="18" fontWeight="700" fill={theme.accent2} letterSpacing="3">
            💡 KEY INSIGHT
          </text>
          {insightLines.slice(0, 4).map((line, i) => (
            <text key={i} x="40" y={80 + i * 36} fontSize="24" fontWeight="500" fill={theme.text} fontFamily="system-ui, sans-serif" fontStyle="italic">
              "{i === 0 ? line : line}{i === insightLines.slice(0, 4).length - 1 ? '"' : ''}
            </text>
          ))}
        </g>
        
        {/* Tags */}
        <g transform="translate(80, 1000)">
          <text x="0" y="0" fontSize="18" fill={theme.muted} fontFamily="system-ui, sans-serif">
            {dayTags}
          </text>
        </g>
        
        {renderFooter()}
      </>
    );
  };
  
  // ========================================
  // CURVE CARD - Function visualizations
  // ========================================
  const renderCurve = () => {
    const titleLines = wrapText(curveTitle, 22);
    
    // Generate curve points based on type
    const generatePath = () => {
      const points = [];
      const w = 800, h = 380;
      const cx = 200, cy = 480; // top-left of plot area
      
      for (let i = 0; i <= 100; i++) {
        const x = cx + (i / 100) * w;
        let y;
        const t = (i / 100) * 12 - 6; // -6 to 6
        
        if (curveType === 'sigmoid') {
          y = cy + h - (1 / (1 + Math.exp(-t))) * h;
        } else if (curveType === 'relu') {
          y = cy + h - Math.max(0, (t + 6) / 12) * h;
        } else if (curveType === 'tanh') {
          y = cy + h/2 - Math.tanh(t) * h/2;
        } else if (curveType === 'gaussian') {
          y = cy + h - Math.exp(-t * t / 4) * h;
        } else if (curveType === 'log') {
          // Cross-entropy: -log(x), x from 0.01 to 1
          const x01 = 0.01 + (i / 100) * 0.99;
          y = cy + Math.min(h, -Math.log(x01) * h / 5);
        } else { // convex
          y = cy + h - Math.exp(-((t)*(t))/8) * h * 0.9 - (h * 0.1);
          y = cy + ((t * t) / 36) * h;
          y = Math.max(cy, Math.min(cy + h, y));
        }
        points.push(`${x},${y}`);
      }
      return 'M ' + points.join(' L ');
    };
    
    return (
      <>
        {/* Title */}
        <g transform="translate(80, 130)">
          <rect width="180" height="44" rx="22" fill={theme.accent2} fillOpacity="0.2" stroke={theme.accent2} strokeWidth="2" />
          <text x="90" y="29" fontSize="20" fontWeight="800" fill={theme.accent2} textAnchor="middle" letterSpacing="2">
            📈 GRAPH
          </text>
        </g>
        
        {titleLines.slice(0, 2).map((line, i) => (
          <text key={i} x="80" y={250 + i * 70} fontSize="60" fontWeight="900" fill={theme.text} fontFamily="system-ui, sans-serif" letterSpacing="-1">
            {line}
          </text>
        ))}
        
        <text x="80" y={290 + titleLines.length * 70} fontSize="26" fill={theme.muted} fontFamily="system-ui, sans-serif">
          {curveSubtitle}
        </text>
        
        {/* Plot area */}
        <g>
          {/* Grid */}
          <rect x="200" y="480" width="800" height="380" fill={theme.cardBg} rx="8" />
          {[0, 1, 2, 3, 4].map(i => (
            <line key={`hg-${i}`} x1="200" y1={480 + i * 95} x2="1000" y2={480 + i * 95} stroke={theme.text} strokeOpacity="0.08" strokeWidth="1" />
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <line key={`vg-${i}`} x1={200 + i * 100} y1="480" x2={200 + i * 100} y2="860" stroke={theme.text} strokeOpacity="0.08" strokeWidth="1" />
          ))}
          
          {/* Axes */}
          <line x1="200" y1="860" x2="1000" y2="860" stroke={theme.text} strokeOpacity="0.6" strokeWidth="2" />
          <line x1="200" y1="480" x2="200" y2="860" stroke={theme.text} strokeOpacity="0.6" strokeWidth="2" />
          
          {/* Axis labels */}
          <text x="600" y="900" fontSize="20" fill={theme.muted} textAnchor="middle" fontFamily="system-ui, sans-serif" fontStyle="italic">x</text>
          <text x="170" y="675" fontSize="20" fill={theme.muted} textAnchor="middle" fontFamily="system-ui, sans-serif" fontStyle="italic">y</text>
          
          {/* The curve - with glow effect */}
          <path d={generatePath()} fill="none" stroke={theme.accent} strokeWidth="10" strokeOpacity="0.3" strokeLinecap="round" />
          <path d={generatePath()} fill="none" stroke={theme.accent} strokeWidth="5" strokeLinecap="round" />
          
          {/* Reference lines for sigmoid */}
          {curveType === 'sigmoid' && (
            <>
              <line x1="200" y1="480" x2="1000" y2="480" stroke={theme.accent2} strokeOpacity="0.5" strokeDasharray="4 4" strokeWidth="1.5" />
              <text x="1010" y="486" fontSize="18" fill={theme.accent2} fontFamily="system-ui, sans-serif">y=1</text>
              <text x="1010" y="866" fontSize="18" fill={theme.accent2} fontFamily="system-ui, sans-serif">y=0</text>
            </>
          )}
        </g>
        
        {/* Formula box */}
        <g transform="translate(80, 920)">
          <rect width="1040" height="80" rx="16" fill={theme.cardBg} stroke={theme.accent} strokeOpacity="0.4" strokeWidth="2" />
          <text x="520" y="50" fontSize="32" fontWeight="500" fill={theme.text} textAnchor="middle" fontFamily="'Cambria Math', Georgia, serif" fontStyle="italic">
            {curveNote}
          </text>
        </g>
        
        {renderFooter()}
      </>
    );
  };
  
  // ========================================
  // NEURAL NETWORK CARD - Architecture viz
  // ========================================
  const renderNetwork = () => {
    const titleLines = wrapText(networkTitle, 24);
    const layers = networkLayers.split(',').map(n => parseInt(n.trim()) || 1).slice(0, 6);
    const labels = networkLabels.split(',').map(s => s.trim());
    
    const networkX = 100, networkY = 470, networkW = 1000, networkH = 400;
    const layerSpacing = networkW / (layers.length - 1 || 1);
    
    const getNodePos = (layerIdx, nodeIdx, totalNodes) => {
      const x = networkX + layerIdx * layerSpacing;
      const y = networkY + (networkH / (totalNodes + 1)) * (nodeIdx + 1);
      return { x, y };
    };
    
    return (
      <>
        {/* Title */}
        <g transform="translate(80, 130)">
          <rect width="220" height="44" rx="22" fill={theme.accent} fillOpacity="0.2" stroke={theme.accent} strokeWidth="2" />
          <text x="110" y="29" fontSize="20" fontWeight="800" fill={theme.accent} textAnchor="middle" letterSpacing="2">
            🧠 NETWORK
          </text>
        </g>
        
        {titleLines.slice(0, 2).map((line, i) => (
          <text key={i} x="80" y={250 + i * 70} fontSize="56" fontWeight="900" fill={theme.text} fontFamily="system-ui, sans-serif" letterSpacing="-1">
            {line}
          </text>
        ))}
        
        <text x="80" y={290 + titleLines.length * 70} fontSize="26" fill={theme.muted} fontFamily="system-ui, sans-serif">
          {networkSubtitle}
        </text>
        
        {/* Network connections */}
        <g opacity="0.4">
          {layers.slice(0, -1).map((layerNodes, lIdx) => {
            const nextNodes = layers[lIdx + 1];
            const lines = [];
            for (let i = 0; i < layerNodes; i++) {
              for (let j = 0; j < nextNodes; j++) {
                const from = getNodePos(lIdx, i, layerNodes);
                const to = getNodePos(lIdx + 1, j, nextNodes);
                lines.push(
                  <line key={`${lIdx}-${i}-${j}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={theme.accent} strokeWidth="1.5" />
                );
              }
            }
            return lines;
          })}
        </g>
        
        {/* Network nodes */}
        {layers.map((nodeCount, lIdx) => {
          const isInput = lIdx === 0;
          const isOutput = lIdx === layers.length - 1;
          const color = isInput ? theme.accent2 : (isOutput ? '#ef4444' : theme.accent);
          
          return (
            <g key={lIdx}>
              {Array.from({ length: nodeCount }).map((_, nIdx) => {
                const pos = getNodePos(lIdx, nIdx, nodeCount);
                return (
                  <g key={nIdx}>
                    <circle cx={pos.x} cy={pos.y} r="22" fill={theme.bgGradient[0]} stroke={color} strokeWidth="4" />
                    <circle cx={pos.x} cy={pos.y} r="10" fill={color} fillOpacity="0.6" />
                  </g>
                );
              })}
              {/* Layer label */}
              <text x={networkX + lIdx * layerSpacing} y={networkY - 20} fontSize="22" fontWeight="700" fill={color} textAnchor="middle" fontFamily="system-ui, sans-serif">
                {labels[lIdx] || `L${lIdx + 1}`}
              </text>
              <text x={networkX + lIdx * layerSpacing} y={networkY + networkH + 50} fontSize="20" fill={theme.muted} textAnchor="middle" fontFamily="system-ui, sans-serif">
                {nodeCount} {nodeCount === 1 ? 'node' : 'nodes'}
              </text>
            </g>
          );
        })}
        
        {/* Stats */}
        <g transform="translate(80, 950)">
          <rect width="320" height="80" rx="16" fill={theme.cardBg} stroke={theme.text} strokeOpacity="0.1" strokeWidth="2" />
          <text x="20" y="32" fontSize="16" fill={theme.muted} letterSpacing="2" fontWeight="700">LAYERS</text>
          <text x="20" y="68" fontSize="32" fontWeight="900" fill={theme.text} fontFamily="system-ui, sans-serif">{layers.length}</text>
          
          <rect x="360" width="320" height="80" rx="16" fill={theme.cardBg} stroke={theme.text} strokeOpacity="0.1" strokeWidth="2" />
          <text x="380" y="32" fontSize="16" fill={theme.muted} letterSpacing="2" fontWeight="700">NEURONS</text>
          <text x="380" y="68" fontSize="32" fontWeight="900" fill={theme.text} fontFamily="system-ui, sans-serif">{layers.reduce((a, b) => a + b, 0)}</text>
          
          <rect x="720" width="320" height="80" rx="16" fill={theme.cardBg} stroke={theme.text} strokeOpacity="0.1" strokeWidth="2" />
          <text x="740" y="32" fontSize="16" fill={theme.muted} letterSpacing="2" fontWeight="700">CONNECTIONS</text>
          <text x="740" y="68" fontSize="32" fontWeight="900" fill={theme.text} fontFamily="system-ui, sans-serif">
            {layers.slice(0, -1).reduce((sum, n, i) => sum + n * layers[i + 1], 0)}
          </text>
        </g>
        
        {renderFooter()}
      </>
    );
  };
  
  // Basic templates (kept from before, condensed)
  const renderCode = () => {
    const titleLines = wrapText(title, 32);
    const codeLines = code.split('\n').slice(0, 10);
    return (
      <>
        {titleLines.slice(0, 2).map((line, i) => (
          <text key={i} x="80" y={150 + i * 70} fontSize="60" fontWeight="800" fill={theme.text} fontFamily="system-ui, sans-serif">{line}</text>
        ))}
        <text x="80" y={titleLines.length > 1 ? 290 : 220} fontSize="28" fill={theme.muted} fontFamily="system-ui, sans-serif">{subtitle}</text>
        <g>
          <rect x="80" y="340" width="1040" height="640" rx="20" fill={theme.cardBg} stroke={theme.text} strokeOpacity="0.1" strokeWidth="2" />
          <rect x="80" y="340" width="1040" height="60" rx="20" fill={theme.text} fillOpacity="0.05" />
          <circle cx="115" cy="370" r="9" fill="#ff5f56" />
          <circle cx="145" cy="370" r="9" fill="#ffbd2e" />
          <circle cx="175" cy="370" r="9" fill="#27c93f" />
          {codeImage ? (
            <>
              <defs>
                <clipPath id="codeImgClip">
                  <rect x="100" y="420" width="1000" height="540" rx="8" />
                </clipPath>
              </defs>
              <image
                href={codeImage}
                x="100"
                y="420"
                width="1000"
                height="540"
                preserveAspectRatio="xMidYMid meet"
                clipPath="url(#codeImgClip)"
              />
            </>
          ) : (
            codeLines.map((line, i) => {
              const isComment = line.trim().startsWith('#') || line.trim().startsWith('//');
              return (
                <text key={i} x="115" y={450 + i * 50} fontFamily="ui-monospace, monospace" fontSize="26" fill={isComment ? theme.accent : theme.text}>{line}</text>
              );
            })
          )}
        </g>
        {renderFooter()}
      </>
    );
  };
  
  const renderQuote = () => {
    const quoteLines = wrapText(quote, 28);
    return (
      <>
        <text x="80" y="240" fontSize="280" fontFamily="Georgia, serif" fill={theme.accent} fillOpacity="0.4" fontWeight="700">"</text>
        {quoteLines.slice(0, 6).map((line, i) => (
          <text key={i} x="80" y={400 + i * 88} fontSize="68" fontWeight="700" fill={theme.text} fontFamily="Georgia, serif">{line}</text>
        ))}
        <rect x="80" y={420 + Math.min(quoteLines.length, 6) * 88} width="80" height="6" fill={theme.accent} />
        {renderFooter()}
      </>
    );
  };
  
  const renderTips = () => {
    const titleLines = wrapText(title, 28);
    const tipsList = tips.split('\n').filter(t => t.trim()).slice(0, 5);
    return (
      <>
        <g transform="translate(80, 130)">
          <rect width="180" height="50" rx="25" fill={theme.accent} fillOpacity="0.2" stroke={theme.accent} strokeWidth="2" />
          <text x="90" y="33" fontSize="22" fontWeight="700" fill={theme.accent} textAnchor="middle">✨ TIPS</text>
        </g>
        {titleLines.slice(0, 2).map((line, i) => (
          <text key={i} x="80" y={260 + i * 70} fontSize="58" fontWeight="800" fill={theme.text} fontFamily="system-ui, sans-serif">{line}</text>
        ))}
        {tipsList.map((tip, i) => {
          const tipLines = wrapText(tip, 38);
          const yBase = 460 + i * 110;
          return (
            <g key={i}>
              <circle cx="115" cy={yBase + 5} r="28" fill={theme.accent} />
              <text x="115" y={yBase + 14} fontSize="28" fontWeight="800" fill={theme.isDark ? '#000' : '#fff'} textAnchor="middle">{i + 1}</text>
              {tipLines.slice(0, 2).map((line, j) => (
                <text key={j} x="170" y={yBase + 14 + j * 36} fontSize="32" fontWeight="500" fill={theme.text} fontFamily="system-ui, sans-serif">{line}</text>
              ))}
            </g>
          );
        })}
        {renderFooter()}
      </>
    );
  };
  
  const renderAnnounce = () => {
    const titleLines = wrapText(announceTitle, 18);
    const bodyLines = wrapText(announceBody, 42);
    return (
      <>
        <g transform="translate(80, 140)">
          <rect width="220" height="56" rx="28" fill={theme.accent} />
          <text x="110" y="38" fontSize="24" fontWeight="800" fill={theme.isDark ? '#000' : '#fff'} textAnchor="middle">🚀 SHIPPED</text>
        </g>
        {titleLines.slice(0, 4).map((line, i) => (
          <text key={i} x="80" y={310 + i * 110} fontSize="96" fontWeight="900" fill={theme.text} fontFamily="system-ui, sans-serif" letterSpacing="-2">{line}</text>
        ))}
        <rect x="80" y={340 + titleLines.length * 110} width="120" height="8" fill={theme.accent} />
        {bodyLines.slice(0, 4).map((line, i) => (
          <text key={i} x="80" y={400 + titleLines.length * 110 + i * 50} fontSize="34" fill={theme.muted} fontFamily="system-ui, sans-serif">{line}</text>
        ))}
        {renderFooter()}
      </>
    );
  };
  
  const renderExplainer = () => {
    const titleLines = wrapText(explainTitle, 26);
    const codeLines = explainCode.split('\n').slice(0, 7);
    const pointsList = explainPoints.split('\n').filter(p => p.trim()).slice(0, 4);
    return (
      <>
        <g transform="translate(80, 130)">
          <rect width="240" height="50" rx="25" fill={theme.accent2} fillOpacity="0.2" stroke={theme.accent2} strokeWidth="2" />
          <text x="120" y="33" fontSize="22" fontWeight="700" fill={theme.accent2} textAnchor="middle">📖 EXPLAINED</text>
        </g>
        {titleLines.slice(0, 2).map((line, i) => (
          <text key={i} x="80" y={250 + i * 60} fontSize="50" fontWeight="800" fill={theme.text} fontFamily="system-ui, sans-serif">{line}</text>
        ))}
        <g>
          <rect x="80" y="360" width="1040" height="320" rx="16" fill={theme.cardBg} stroke={theme.text} strokeOpacity="0.1" strokeWidth="2" />
          <rect x="80" y="360" width="1040" height="44" rx="16" fill={theme.text} fillOpacity="0.05" />
          <circle cx="110" cy="382" r="7" fill="#ff5f56" />
          <circle cx="135" cy="382" r="7" fill="#ffbd2e" />
          <circle cx="160" cy="382" r="7" fill="#27c93f" />
          {codeImage ? (
            <>
              <defs>
                <clipPath id="explainerImgClip">
                  <rect x="95" y="415" width="1010" height="255" rx="6" />
                </clipPath>
              </defs>
              <image
                href={codeImage}
                x="95"
                y="415"
                width="1010"
                height="255"
                preserveAspectRatio="xMidYMid meet"
                clipPath="url(#explainerImgClip)"
              />
            </>
          ) : (
            codeLines.map((line, i) => {
              const isComment = line.trim().startsWith('#') || line.trim().startsWith('//');
              return (
                <text key={i} x="105" y={450 + i * 32} fontFamily="ui-monospace, monospace" fontSize="22" fill={isComment ? theme.accent : theme.text}>{line}</text>
              );
            })
          )}
        </g>
        <text x="80" y="740" fontSize="22" fontWeight="700" fill={theme.accent} letterSpacing="2">KEY TAKEAWAYS</text>
        {pointsList.map((point, i) => (
          <g key={i}>
            <rect x="80" y={770 + i * 65 - 18} width="6" height="36" fill={theme.accent} />
            <text x="110" y={770 + i * 65 + 8} fontSize="26" fontWeight="500" fill={theme.text} fontFamily="system-ui, sans-serif">{point}</text>
          </g>
        ))}
        {renderFooter()}
      </>
    );
  };
  
  const renderCarousel = () => {
    const slide = slides[currentSlide];
    if (!slide) return null;
    if (slide.type === 'cover') {
      const titleLines = wrapText(slide.title || '', 18);
      return (
        <>
          {titleLines.slice(0, 4).map((line, i) => (
            <text key={i} x="80" y={350 + i * 100} fontSize="92" fontWeight="900" fill={theme.text} fontFamily="system-ui, sans-serif" letterSpacing="-2">{line}</text>
          ))}
          <text x="80" y={500 + titleLines.length * 100} fontSize="36" fill={theme.muted}>{slide.subtitle}</text>
          {renderFooter()}
          <text x="1120" y="1010" fontSize="20" fill={theme.muted} textAnchor="end">{currentSlide + 1} / {slides.length}</text>
        </>
      );
    }
    if (slide.type === 'tip') {
      const headLines = wrapText(slide.heading || '', 20);
      return (
        <>
          <circle cx="140" cy="220" r="60" fill={theme.accent} />
          <text x="140" y="240" fontSize="72" fontWeight="900" fill={theme.isDark ? '#000' : '#fff'} textAnchor="middle">{slide.number || currentSlide}</text>
          {headLines.slice(0, 3).map((line, i) => (
            <text key={i} x="80" y={400 + i * 90} fontSize="80" fontWeight="800" fill={theme.text}>{line}</text>
          ))}
          <text x="80" y={550 + headLines.length * 90} fontSize="36" fill={theme.muted}>{slide.body}</text>
          {renderFooter()}
          <text x="1120" y="1010" fontSize="20" fill={theme.muted} textAnchor="end">{currentSlide + 1} / {slides.length}</text>
        </>
      );
    }
    if (slide.type === 'cta') {
      return (
        <>
          <text x="600" y="500" fontSize="72" fontWeight="900" fill={theme.text} textAnchor="middle">{slide.title}</text>
          <text x="600" y="580" fontSize="32" fill={theme.muted} textAnchor="middle">{slide.subtitle}</text>
          {renderFooter()}
        </>
      );
    }
  };
  
  const renderTemplate = () => {
    switch (template) {
      case 'thumbnail': return renderThumbnail();
      case 'concept': return renderConcept();
      case 'formula': return renderFormula();
      case 'compare': return renderCompare();
      case 'day': return renderDay();
      case 'curve': return renderCurve();
      case 'network': return renderNetwork();
      case 'code': return renderCode();
      case 'quote': return renderQuote();
      case 'tips': return renderTips();
      case 'announce': return renderAnnounce();
      case 'explainer': return renderExplainer();
      case 'carousel': return renderCarousel();
      default: return null;
    }
  };
  
  const mlTemplates = templateList.filter(t => t.group === 'ml');
  const basicTemplates = templateList.filter(t => t.group === 'basic');
  const quickTemplates = templateList.filter(t => t.group === 'quick');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Post Studio</h1>
              <p className="text-sm text-slate-500">Beautiful ML/AI graphics for LinkedIn creators</p>
            </div>
          </div>
          <button
            onClick={template === 'carousel' ? downloadAllSlides : downloadPng}
            className="hidden md:flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold shadow-lg transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" />
            {template === 'carousel' ? 'Download All' : 'Download PNG'}
          </button>
        </div>
        
        <div className="grid lg:grid-cols-[400px_1fr] gap-6">
          <div className="space-y-5">
            {/* Templates */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="mb-3">
                <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Quick AI (just type your idea)
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {quickTemplates.map(t => {
                    const Icon = t.icon;
                    const active = template === t.key;
                    return (
                      <button key={t.key} onClick={() => setTemplate(t.key)} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${active ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md scale-105' : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'}`}>
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-semibold">{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mb-3">
                <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" /> ML & AI Templates
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {mlTemplates.map(t => {
                    const Icon = t.icon;
                    const active = template === t.key;
                    return (
                      <button key={t.key} onClick={() => setTemplate(t.key)} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${active ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-md scale-105' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-semibold">{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Basic Templates</h3>
                <div className="grid grid-cols-3 gap-2">
                  {basicTemplates.map(t => {
                    const Icon = t.icon;
                    const active = template === t.key;
                    return (
                      <button key={t.key} onClick={() => setTemplate(t.key)} className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all ${active ? 'bg-slate-900 text-white shadow-md scale-105' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>
                        <Icon className="w-4 h-4" />
                        <span className="text-[11px] font-semibold">{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Theme */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Color Theme</h3>
              <div className="grid grid-cols-6 gap-2">
                {Object.entries(themes).map(([key, t]) => (
                  <button key={key} onClick={() => setThemeKey(key)} className={`group relative aspect-square rounded-xl overflow-hidden transition-all ${themeKey === key ? 'ring-2 ring-slate-900 ring-offset-2 scale-105' : 'hover:scale-105'}`} title={t.name}>
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${t.swatch[0]}, ${t.swatch[1]})` }} />
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">{theme.name}</p>
            </div>
            
            {/* Content fields per template */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Content</h3>
              
              {template === 'thumbnail' && (
                <>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 -m-5 p-5 rounded-2xl border-b border-amber-200 mb-2">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">Quick AI Mode</h4>
                        <p className="text-xs text-slate-600">No typing, no design — just one idea</p>
                      </div>
                    </div>
                    
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">💡 What's your post about?</label>
                    <textarea
                      value={thumbnailIdea}
                      onChange={(e) => setThumbnailIdea(e.target.value)}
                      placeholder="e.g., Why squared error fails for logistic regression"
                      rows={2}
                      className="w-full px-3 py-2.5 bg-white border border-amber-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    />
                    
                    <button
                      onClick={generateThumbnails}
                      disabled={generatingThumbnail || !thumbnailIdea.trim()}
                      className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md transition-all"
                    >
                      {generatingThumbnail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {generatingThumbnail ? 'Generating 4 designs...' : thumbnailVariants.length > 0 ? '🔄 Regenerate' : '⚡ Generate 4 Designs'}
                    </button>
                  </div>
                  
                  {thumbnailVariants.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-700">✨ Pick your favorite</label>
                        <span className="text-xs text-slate-500">{activeVariant + 1} of {thumbnailVariants.length}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {thumbnailVariants.map((v, i) => {
                          const styleEmoji = { shock: '🛑', question: '💭', stat: '📊', reveal: '✨' }[v.style] || '💡';
                          const styleLabel = { shock: 'Shock', question: 'Question', stat: 'Stat', reveal: 'Story' }[v.style] || v.style;
                          return (
                            <button
                              key={i}
                              onClick={() => setActiveVariant(i)}
                              className={`p-3 rounded-xl text-left transition-all ${
                                activeVariant === i
                                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md scale-105'
                                  : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                              }`}
                            >
                              <div className="text-xs font-bold mb-1 opacity-80">{styleEmoji} {styleLabel}</div>
                              <div className="text-xs font-semibold leading-tight line-clamp-2">{v.hook}</div>
                            </button>
                          );
                        })}
                      </div>
                      
                      <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                        <p className="text-xs font-bold text-slate-700 mb-1">✏️ Fine-tune (optional)</p>
                        <Field 
                          label="Hook" 
                          value={thumbnailVariants[activeVariant]?.hook || ''} 
                          onChange={(v) => {
                            const updated = [...thumbnailVariants];
                            updated[activeVariant] = { ...updated[activeVariant], hook: v };
                            setThumbnailVariants(updated);
                          }} 
                        />
                        <Field 
                          label="Subline" 
                          value={thumbnailVariants[activeVariant]?.subline || ''} 
                          onChange={(v) => {
                            const updated = [...thumbnailVariants];
                            updated[activeVariant] = { ...updated[activeVariant], subline: v };
                            setThumbnailVariants(updated);
                          }} 
                        />
                        <Field 
                          label="Context" 
                          value={thumbnailVariants[activeVariant]?.context || ''} 
                          onChange={(v) => {
                            const updated = [...thumbnailVariants];
                            updated[activeVariant] = { ...updated[activeVariant], context: v };
                            setThumbnailVariants(updated);
                          }} 
                        />
                      </div>
                    </div>
                  )}
                  
                  {thumbnailVariants.length === 0 && !generatingThumbnail && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-900 leading-relaxed">
                        💡 <strong>How it works:</strong> Just describe your post idea above and click generate. AI will create 4 different scroll-stopping designs (Shock, Question, Stat, Story) — pick your favorite and post it!
                      </p>
                    </div>
                  )}
                </>
              )}
              
              {template === 'concept' && (
                <>
                  <Field label="Category" value={conceptCategory} onChange={setConceptCategory} />
                  <Field label="Concept Name" value={conceptName} onChange={setConceptName} />
                  <Field label="Definition" value={conceptDef} onChange={setConceptDef} multiline rows={3} />
                  <Field label="Key Point 1" value={conceptKey1} onChange={setConceptKey1} />
                  <Field label="Key Point 2" value={conceptKey2} onChange={setConceptKey2} />
                  <Field label="Key Point 3" value={conceptKey3} onChange={setConceptKey3} />
                </>
              )}
              
              {template === 'formula' && (
                <>
                  <Field label="Formula Title" value={formulaTitle} onChange={setFormulaTitle} />
                  <Field label="Subtitle" value={formulaSubtitle} onChange={setFormulaSubtitle} />
                  <Field label="Equation (use ·, ², θ, Σ, etc.)" value={formulaLatex} onChange={setFormulaLatex} mono />
                  <Field label="Explanation" value={formulaExplain} onChange={setFormulaExplain} multiline rows={3} />
                </>
              )}
              
              {template === 'compare' && (
                <>
                  <Field label="Title" value={compareTitle} onChange={setCompareTitle} />
                  <Field label="Left Label (the worse option)" value={compareLeftLabel} onChange={setCompareLeftLabel} />
                  <Field label="Left Points (one per line)" value={compareLeftPoints} onChange={setCompareLeftPoints} multiline rows={4} />
                  <Field label="Right Label (the better option)" value={compareRightLabel} onChange={setCompareRightLabel} />
                  <Field label="Right Points (one per line)" value={compareRightPoints} onChange={setCompareRightPoints} multiline rows={4} />
                </>
              )}
              
              {template === 'day' && (
                <>
                  <Field label="Day Number" value={dayNumber} onChange={setDayNumber} />
                  <Field label="Challenge Tag" value={dayChallenge} onChange={setDayChallenge} />
                  <Field label="Today's Topic" value={dayTopic} onChange={setDayTopic} multiline rows={2} />
                  <Field label="Key Insight (in your own words)" value={dayInsight} onChange={setDayInsight} multiline rows={3} />
                  <Field label="Tags (separated by ·)" value={dayTags} onChange={setDayTags} />
                </>
              )}
              
              {template === 'curve' && (
                <>
                  <Field label="Title" value={curveTitle} onChange={setCurveTitle} />
                  <Field label="Subtitle" value={curveSubtitle} onChange={setCurveSubtitle} />
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Curve Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['sigmoid', 'relu', 'tanh', 'gaussian', 'log', 'convex'].map(c => (
                        <button key={c} onClick={() => setCurveType(c)} className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize ${curveType === c ? 'bg-slate-900 text-white' : 'bg-slate-50 hover:bg-slate-100'}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Field label="Formula caption" value={curveNote} onChange={setCurveNote} mono />
                </>
              )}
              
              {template === 'network' && (
                <>
                  <Field label="Title" value={networkTitle} onChange={setNetworkTitle} />
                  <Field label="Subtitle" value={networkSubtitle} onChange={setNetworkSubtitle} />
                  <Field label="Layer Sizes (comma-separated, e.g., 4,6,6,3,1)" value={networkLayers} onChange={setNetworkLayers} />
                  <Field label="Layer Labels (comma-separated)" value={networkLabels} onChange={setNetworkLabels} />
                </>
              )}
              
              {template === 'code' && (<>
                <Field label="Title" value={title} onChange={setTitle} />
                <Field label="Subtitle" value={subtitle} onChange={setSubtitle} />
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" /> Code Block Image
                    </label>
                    {codeImage && (
                      <button onClick={removeCodeImage} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold">
                        <X className="w-3 h-3" /> Use code instead
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-blue-800 leading-snug">Upload a screenshot of your code, IDE, or any image — replaces the code block below</p>
                  
                  <input ref={codeImageInputRef} type="file" accept="image/*" onChange={handleCodeImageUpload} className="hidden" />
                  
                  {!codeImage ? (
                    <button onClick={() => codeImageInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-blue-100 border border-blue-300 rounded-lg text-xs font-semibold text-blue-900 transition-all">
                      <Upload className="w-3.5 h-3.5" /> Upload screenshot
                    </button>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border-2 border-blue-300">
                      <img src={codeImage} alt="" className="w-full h-24 object-cover" />
                      <button onClick={() => codeImageInputRef.current?.click()} className="absolute bottom-1 right-1 px-2 py-0.5 bg-white/95 rounded text-[10px] font-semibold shadow">Change</button>
                    </div>
                  )}
                </div>
                
                {!codeImage && (
                  <Field label="Code" value={code} onChange={setCode} multiline rows={6} mono />
                )}
              </>)}
              {template === 'quote' && <Field label="Quote" value={quote} onChange={setQuote} multiline rows={5} />}
              {template === 'tips' && (<>
                <Field label="Title" value={title} onChange={setTitle} />
                <Field label="Tips (one per line)" value={tips} onChange={setTips} multiline rows={5} />
              </>)}
              {template === 'announce' && (<>
                <Field label="Headline" value={announceTitle} onChange={setAnnounceTitle} multiline rows={2} />
                <Field label="Description" value={announceBody} onChange={setAnnounceBody} multiline rows={3} />
              </>)}
              {template === 'explainer' && (<>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" /> Code Block Image
                    </label>
                    {codeImage && (
                      <button onClick={removeCodeImage} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold">
                        <X className="w-3 h-3" /> Use code instead
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-blue-800 leading-snug">Upload a screenshot of your code or IDE — replaces the code block</p>
                  
                  <input ref={codeImageInputRef} type="file" accept="image/*" onChange={handleCodeImageUpload} className="hidden" />
                  
                  {!codeImage ? (
                    <button onClick={() => codeImageInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-blue-100 border border-blue-300 rounded-lg text-xs font-semibold text-blue-900 transition-all">
                      <Upload className="w-3.5 h-3.5" /> Upload screenshot
                    </button>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border-2 border-blue-300">
                      <img src={codeImage} alt="" className="w-full h-24 object-cover" />
                      <button onClick={() => codeImageInputRef.current?.click()} className="absolute bottom-1 right-1 px-2 py-0.5 bg-white/95 rounded text-[10px] font-semibold shadow">Change</button>
                    </div>
                  )}
                </div>
                
                {!codeImage && (
                  <Field label="Code" value={explainCode} onChange={setExplainCode} multiline rows={6} mono />
                )}
                <button onClick={explainCodeAI} disabled={generatingExplain || codeImage} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 disabled:opacity-60 text-white rounded-lg font-semibold text-sm shadow-md">
                  {generatingExplain ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  {generatingExplain ? 'Analyzing...' : 'AI: Explain this code'}
                </button>
                <Field label="Title" value={explainTitle} onChange={setExplainTitle} />
                <Field label="Takeaways" value={explainPoints} onChange={setExplainPoints} multiline rows={4} />
              </>)}
              {template === 'carousel' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">Slides ({slides.length}/10)</label>
                    <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
                      {slides.map((s, i) => (
                        <button key={i} onClick={() => setCurrentSlide(i)} className={`flex-shrink-0 w-10 h-10 rounded-lg text-xs font-bold ${currentSlide === i ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>{i + 1}</button>
                      ))}
                      {slides.length < 10 && <button onClick={addSlide} className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center border-2 border-dashed border-slate-300"><Plus className="w-4 h-4" /></button>}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Slide {currentSlide + 1} ({slides[currentSlide]?.type})</span>
                      {slides.length > 2 && <button onClick={() => deleteSlide(currentSlide)} className="text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>}
                    </div>
                    {slides[currentSlide]?.type === 'tip' ? (<>
                      <Field label="Number" value={String(slides[currentSlide].number || '')} onChange={(v) => updateSlide(currentSlide, { number: parseInt(v) || 1 })} />
                      <Field label="Heading" value={slides[currentSlide].heading || ''} onChange={(v) => updateSlide(currentSlide, { heading: v })} />
                      <Field label="Body" value={slides[currentSlide].body || ''} onChange={(v) => updateSlide(currentSlide, { body: v })} multiline rows={3} />
                    </>) : (<>
                      <Field label="Title" value={slides[currentSlide]?.title || ''} onChange={(v) => updateSlide(currentSlide, { title: v })} multiline rows={2} />
                      <Field label="Subtitle" value={slides[currentSlide]?.subtitle || ''} onChange={(v) => updateSlide(currentSlide, { subtitle: v })} multiline rows={2} />
                    </>)}
                  </div>
                </>
              )}
            </div>
            
            {/* Image upload */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" /> Image
                </h3>
                {userImage && <button onClick={removeImage} className="text-xs text-red-500 flex items-center gap-1 font-semibold"><X className="w-3 h-3" /> Remove</button>}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              {!userImage ? (
                <button onClick={() => fileInputRef.current?.click()} className="w-full flex flex-col items-center gap-2 p-6 bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl">
                  <Upload className="w-6 h-6 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700">Upload an image</span>
                  <span className="text-xs text-slate-500">Photo, screenshot, diagram · Max 5MB</span>
                </button>
              ) : (
                <>
                  <div className="relative rounded-lg overflow-hidden border border-slate-200">
                    <img src={userImage} alt="" className="w-full h-32 object-cover" />
                    <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 px-2.5 py-1 bg-white/95 rounded-md text-xs font-semibold shadow-md">Change</button>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">Layout</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[{ key: 'hero', label: '🖼️ Hero' }, { key: 'split', label: '📐 Split' }, { key: 'background', label: '🌫️ Background' }, { key: 'inline', label: '⭕ Circle' }].map(opt => (
                        <button key={opt.key} onClick={() => setImageLayout(opt.key)} className={`px-3 py-2 rounded-lg text-xs font-semibold ${imageLayout === opt.key ? 'bg-slate-900 text-white' : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'}`}>{opt.label}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-600">Opacity</label>
                      <span className="text-xs text-slate-500">{Math.round(imageOpacity * 100)}%</span>
                    </div>
                    <input type="range" min="0.2" max="1" step="0.05" value={imageOpacity} onChange={(e) => setImageOpacity(parseFloat(e.target.value))} className="w-full accent-slate-900" />
                  </div>
                </>
              )}
            </div>
            
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Info</h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Profile Photo</label>
                <input ref={profilePhotoInputRef} type="file" accept="image/*" onChange={handleProfilePhotoUpload} className="hidden" />
                <div className="flex items-center gap-3">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="profile" className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-sm" />
                  ) : (
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-sm" style={{ background: `linear-gradient(135deg, ${theme.swatch[0]}, ${theme.swatch[1]})` }}>
                      {author.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <button onClick={() => profilePhotoInputRef.current?.click()} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all">
                      <Upload className="w-3 h-3" />
                      {profilePhoto ? 'Change photo' : 'Upload photo'}
                    </button>
                    {profilePhoto && (
                      <button onClick={removeProfilePhoto} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all">
                        <X className="w-3 h-3" /> Remove
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">Square photos work best · Max 3MB</p>
              </div>
              
              <Field label="Name" value={author} onChange={setAuthor} />
              <Field label="Title / Tagline" value={handle} onChange={setHandle} />
            </div>
          </div>
          
          {/* Preview */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 ml-2">Preview · 1200×1200{template === 'carousel' && ` · ${currentSlide + 1}/${slides.length}`}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Linkedin className="w-3.5 h-3.5" /><span>Square</span>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square w-full rounded-xl overflow-hidden shadow-2xl ring-1 ring-slate-200">
                  <svg ref={svgRef} viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full block">
                    {renderBackground()}
                    {userImage && renderUserImage()}
                    {renderTemplate()}
                  </svg>
                </div>
                {template === 'carousel' && (<>
                  <button onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))} disabled={currentSlide === 0} className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 disabled:opacity-30 rounded-full shadow-lg flex items-center justify-center"><ChevronLeft className="w-5 h-5" /></button>
                  <button onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))} disabled={currentSlide === slides.length - 1} className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 disabled:opacity-30 rounded-full shadow-lg flex items-center justify-center"><ChevronRight className="w-5 h-5" /></button>
                </>)}
              </div>
              <div className="md:hidden mt-4">
                <button onClick={template === 'carousel' ? downloadAllSlides : downloadPng} className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl font-semibold shadow-lg">
                  <Download className="w-4 h-4" /> Download PNG
                </button>
              </div>
              
              {aiError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {aiError}
                </div>
              )}
              
              <div className="mt-3 text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5 leading-relaxed">
                💡 <strong>Tip:</strong> If download doesn't work, right-click the preview above and choose <strong>"Save image as…"</strong> to save directly.
              </div>
            </div>
            
            {/* AI Caption */}
            <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-2xl p-5 border border-purple-200 shadow-sm">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2 mb-1">
                <Wand2 className="w-4 h-4 text-purple-600" /> AI Caption Generator
              </h3>
              <p className="text-xs text-slate-500 mb-3">Generate a high-engagement LinkedIn caption matching your graphic</p>
              <div className="flex gap-2 mb-3 flex-wrap">
                {['Professional', 'Casual', 'Bold', 'Storytelling'].map(t => (
                  <button key={t} onClick={() => setTone(t)} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${tone === t ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>{t}</button>
                ))}
              </div>
              <button onClick={generateCaption} disabled={generatingCaption} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 disabled:opacity-60 text-white rounded-xl font-semibold shadow-md">
                {generatingCaption ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {generatingCaption ? 'Writing...' : caption ? 'Regenerate' : 'Generate caption with AI'}
              </button>
              {aiError && <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{aiError}</div>}
              {caption && (
                <div className="mt-3 bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-500">YOUR CAPTION</span>
                    <button onClick={copyCaption} className="flex items-center gap-1.5 px-3 py-1 bg-white text-slate-700 rounded-md text-xs font-semibold border border-slate-200">
                      {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />} {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">{caption}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, multiline, rows = 2, mono }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className={`w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none ${mono ? 'font-mono text-xs' : ''}`} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900" />
      )}
    </div>
  );
}