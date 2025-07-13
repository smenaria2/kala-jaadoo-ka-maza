import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Skull, 
  Flame, 
  Moon, 
  Zap, 
  Heart, 
  Eye, 
  Star,
  Coffee,
  Car,
  Smartphone,
  Clock,
  Wifi,
  Upload,
  Camera,
  Volume2,
  Trophy,
  Target,
  Timer,
  Share2,
  Download
} from 'lucide-react';
import heroImage from '@/assets/hero-mystical.jpg';
import voodooDoll from '@/assets/voodoo-doll.jpg';

type AppStep = 'home' | 'target' | 'doll' | 'ritual' | 'result';

interface TargetData {
  name: string;
  relation: string;
  photo?: string;
}

interface DollData {
  avatar: string;
  outfit: string;
  nameTag: string;
  facePhoto?: string;
}

interface RitualAction {
  id: string;
  name: string;
  icon: React.ReactNode;
  performed: boolean;
  sound?: string;
  points: number;
}

const KalaJaadooApp = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('home');
  const [targetData, setTargetData] = useState<TargetData>({ name: '', relation: '' });
  const [dollData, setDollData] = useState<DollData>({ avatar: '', outfit: '', nameTag: '' });
  const [selectedCurse, setSelectedCurse] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [pinPositions, setPinPositions] = useState<{x: number, y: number, id: number}[]>([]);
  const [lemonCount, setLemonCount] = useState(0);
  const [curseScrolling, setCurseScrolling] = useState(false);
  const [scrollingCurses, setScrollingCurses] = useState<string[]>([]);
  const [dollVariant, setDollVariant] = useState(1);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const curseScrollRef = useRef<NodeJS.Timeout | null>(null);
  
  const [ritualActions, setRitualActions] = useState<RitualAction[]>([
    { 
      id: 'pins', 
      name: 'सुई चुभाना', 
      icon: <Zap className="w-5 h-5" />, 
      performed: false,
      sound: 'cry',
      points: 20
    },
    { 
      id: 'lemon', 
      name: 'नींबू-मिर्ची डालना', 
      icon: <Flame className="w-5 h-5" />, 
      performed: false,
      sound: 'fire',
      points: 15
    },
    { 
      id: 'yantra', 
      name: 'यंत्र बनाना', 
      icon: <Star className="w-5 h-5" />, 
      performed: false,
      sound: 'mystical',
      points: 25
    },
    { 
      id: 'spin', 
      name: 'सिर घुमाना', 
      icon: <Moon className="w-5 h-5" />, 
      performed: false,
      sound: 'whoosh',
      points: 10
    },
    { 
      id: 'crows', 
      name: 'कौवे छोड़ना', 
      icon: <Eye className="w-5 h-5" />, 
      performed: false,
      sound: 'crow',
      points: 30
    },
  ]);

  // More Indian curses
  const curses = [
    'हर रोज ऑटो वाला ज्यादा पैसे मांगेगा 🛺',
    'गर्मी में हमेशा AC खराब होगा 🌡️',
    'बारिश में हर छाता टूटेगा ☂️',
    'हर दाल में नमक कम होगा 🍛',
    'सब्जी हमेशा महंगी मिलेगी 🥬',
    'ट्रेन हमेशा लेट होगी 🚂',
    'हर पान में चूना ज्यादा होगा 🌿',
    'गलियारे में हमेशा कुत्ता भौकेगा 🐕',
    'हर चायवाला बासी चाय देगा ☕',
    'सिनेमा हॉल में आगे लंबा आदमी बैठेगा 🎬',
    'माँ हमेशा पड़ोसी से तुलना करेगी 👩‍👦',
    'वाई-फाई हमेशा "connecting" दिखाएगा 📶',
    'फ़ोन की बैटरी हमेशा 1% पर मरेगी 🔋',
    'हर एप्प crash होते रहेगा 📱',
    'सभी जूते में कंकड़ आते रहेंगे 👟',
    'चाबी हमेशा गलत जेब में होगी 🗝️',
    'हर रोज़ किसी न किसी चीज़ की कतार में खड़े होना पड़ेगा 🚶‍♀️',
    'सारी चॉकलेट पिघली हुई मिलेगी 🍫',
    'हर सेल्फी blur आएगी 🤳',
    'सारे नूडल्स टूटे हुए मिलेंगे 🍜'
  ];

  const relations = [
    'दोस्त', 'बॉस', 'एक्स', 'भाई/बहन', 'पड़ोसी', 'सहकर्मी', 'टीचर', 'रिश्तेदार', 'साला', 'ससुर'
  ];

  // Sound effects simulation
  const playSound = (soundType: string) => {
    if (!soundEnabled) return;
    
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    switch (soundType) {
      case 'cry':
        // Simulate cry sound with oscillator
        const cryOscillator = audioContext.createOscillator();
        const cryGain = audioContext.createGain();
        cryOscillator.connect(cryGain);
        cryGain.connect(audioContext.destination);
        cryOscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        cryOscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.5);
        cryGain.gain.setValueAtTime(0.3, audioContext.currentTime);
        cryGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        cryOscillator.start();
        cryOscillator.stop(audioContext.currentTime + 0.5);
        break;
      case 'fire':
        // Simulate fire crackling
        const fireOscillator = audioContext.createOscillator();
        const fireGain = audioContext.createGain();
        fireOscillator.connect(fireGain);
        fireGain.connect(audioContext.destination);
        fireOscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        fireOscillator.type = 'sawtooth';
        fireGain.gain.setValueAtTime(0.2, audioContext.currentTime);
        fireGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        fireOscillator.start();
        fireOscillator.stop(audioContext.currentTime + 0.3);
        break;
      default:
        console.log(`Playing ${soundType} sound effect`);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target?.result as string;
        setTargetData(prev => ({ ...prev, photo: photoUrl }));
        setDollData(prev => ({ ...prev, facePhoto: photoUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const performRitualAction = (actionId: string) => {
    const action = ritualActions.find(a => a.id === actionId);
    if (action && !action.performed) {
      // Play sound effect
      if (action.sound) {
        playSound(action.sound);
      }
      
      // Add points
      setTotalScore(prev => prev + action.points);
      
      // Mark as performed
      setRitualActions(prev => 
        prev.map(a => 
          a.id === actionId 
            ? { ...a, performed: true }
            : a
        )
      );
    }
  };

  // Timer and game mechanics
  const startGameTimer = useCallback(() => {
    setGameActive(true);
    setTimeLeft(30);
    setTotalScore(0);
    setPinPositions([]);
    setLemonCount(0);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameActive(false);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const generateRandomPins = useCallback(() => {
    if (!gameActive) return;
    
    const newPins = Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 80 + 10, // 10-90% of container width
      y: Math.random() * 80 + 10, // 10-90% of container height
    }));
    
    setPinPositions(newPins);
    
    // Remove pins after 2 seconds
    setTimeout(() => {
      setPinPositions([]);
    }, 2000);
  }, [gameActive]);

  const hitPin = (pinId: number) => {
    setPinPositions(prev => prev.filter(p => p.id !== pinId));
    setTotalScore(prev => prev + 10);
    playSound('cry');
  };

  const placeLemon = () => {
    if (!gameActive) return;
    setLemonCount(prev => prev + 1);
    setTotalScore(prev => prev + 5);
    playSound('fire');
  };

  // Curse selection with scrolling animation
  const startCurseSelection = () => {
    setCurseScrolling(true);
    setScrollingCurses([...curses]);
    
    let scrollCount = 0;
    const maxScrolls = 30 + Math.floor(Math.random() * 20); // 30-50 scrolls
    
    curseScrollRef.current = setInterval(() => {
      setScrollingCurses(prev => {
        const shuffled = [...prev];
        // Move first item to end
        const first = shuffled.shift();
        if (first) shuffled.push(first);
        return shuffled;
      });
      
      scrollCount++;
      if (scrollCount >= maxScrolls) {
        if (curseScrollRef.current) clearInterval(curseScrollRef.current);
        setCurseScrolling(false);
        // Select the first curse from final position
        setSelectedCurse(scrollingCurses[0]);
      }
    }, 100); // Fast scrolling
  };

  // Update doll appearance based on selection
  useEffect(() => {
    if (dollData.avatar) {
      const avatarNum = parseInt(dollData.avatar.split('-')[1]) || 1;
      setDollVariant(avatarNum);
    }
  }, [dollData.avatar]);

  const shareResult = async () => {
    const shareData = {
      title: 'काला जादू सर्टिफिकेट',
      text: `मैंने ${targetData.name} पर जादू किया है! स्कोर: ${totalScore} 😈`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('शेयर लिंक कॉपी हो गया!');
    }
  };

  const downloadCertificate = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 400;

    // Draw certificate background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 600, 400);
    
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('काला जादू सर्टिफिकेट', 300, 50);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText(`टारगेट: ${targetData.name}`, 300, 100);
    ctx.fillText(`श्राप: ${selectedCurse}`, 300, 130);
    ctx.fillText(`स्कोर: ${totalScore}`, 300, 160);
    ctx.fillText('प्रभावशीलता: 100% अप्रभावी', 300, 190);

    const link = document.createElement('a');
    link.download = `kala-jaadoo-${targetData.name}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (curseScrollRef.current) clearInterval(curseScrollRef.current);
    };
  }, []);

  const resetApp = () => {
    setCurrentStep('home');
    setTargetData({ name: '', relation: '' });
    setDollData({ avatar: '', outfit: '', nameTag: '' });
    setSelectedCurse('');
    setTotalScore(0);
    setTimeLeft(30);
    setGameActive(false);
    setPinPositions([]);
    setLemonCount(0);
    setCurseScrolling(false);
    setRitualActions(prev => prev.map(action => ({ ...action, performed: false })));
    if (timerRef.current) clearInterval(timerRef.current);
    if (curseScrollRef.current) clearInterval(curseScrollRef.current);
  };

  const renderHome = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="floating-animation mb-8">
          <Skull className="w-20 h-20 mx-auto text-fire mb-4" />
        </div>
        
        <h1 className="text-6xl font-bold mb-6 spooky-text bg-gradient-to-r from-fire to-candle bg-clip-text text-transparent">
          काला जादू सिमुलेटर
        </h1>
        
        <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
          मज़ाकिया तंत्र-मंत्र और नकली जादू के साथ अपने दोस्तों को डराएं! 
          पूरी तरह से मनोरंजन के लिए बनाया गया है।
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="mystical-card p-6">
            <Heart className="w-12 h-12 text-blood mb-4 mx-auto" />
            <h3 className="text-lg font-bold mb-2">टारगेट चुनें</h3>
            <p className="text-sm text-muted-foreground">किसी भी व्यक्ति को चुनें</p>
          </Card>
          
          <Card className="mystical-card p-6">
            <Star className="w-12 h-12 text-candle mb-4 mx-auto" />
            <h3 className="text-lg font-bold mb-2">गुड़िया बनाएं</h3>
            <p className="text-sm text-muted-foreground">अपनी वूडू डॉल तैयार करें</p>
          </Card>
          
          <Card className="mystical-card p-6">
            <Flame className="w-12 h-12 text-fire mb-4 mx-auto pulse-glow" />
            <h3 className="text-lg font-bold mb-2">जादू करें</h3>
            <p className="text-sm text-muted-foreground">मज़ेदार तंत्र-मंत्र करें</p>
          </Card>
        </div>

        <Button 
          onClick={() => setCurrentStep('target')} 
          size="lg" 
          variant="mystical"
          className="text-xl px-8 py-4"
        >
          जादू शुरू करें 🔮
        </Button>

        <div className="mt-12 p-4 mystical-card rounded-lg">
          <p className="text-sm text-muted-foreground italic">
            ⚠️ <strong>अस्वीकरण:</strong> यह ऐप पूरी तरह से मनोरंजन के लिए है। 
            कोई भी वास्तविक जादू नहीं किया जाता। जादू से याद आया, आपने आज पानी पिया है ना? 💧
          </p>
        </div>
      </div>
    </div>
  );

  const renderTargetForm = () => (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="mystical-card p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <Target className="w-16 h-16 mx-auto text-blood mb-4 floating-animation" />
          <h2 className="text-3xl font-bold spooky-text">टारगेट की जानकारी</h2>
          <p className="text-muted-foreground mt-2">किस पर करना है जादू?</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">नाम *</Label>
            <Input
              id="name"
              value={targetData.name}
              onChange={(e) => setTargetData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="टारगेट का नाम डालें..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="relation">रिश्ता</Label>
            <Select
              value={targetData.relation}
              onValueChange={(value) => setTargetData(prev => ({ ...prev, relation: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="रिश्ता चुनें..." />
              </SelectTrigger>
              <SelectContent>
                {relations.map((relation) => (
                  <SelectItem key={relation} value={relation}>
                    {relation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Photo Upload */}
          <div>
            <Label>फोटो अपलोड करें (वैकल्पिक)</Label>
            <div className="mt-2">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => photoInputRef.current?.click()}
                className="w-full"
              >
                <Camera className="w-4 h-4 mr-2" />
                {targetData.photo ? 'फोटो बदलें' : 'फोटो चुनें'}
              </Button>
              {targetData.photo && (
                <div className="mt-3 text-center">
                  <img
                    src={targetData.photo}
                    alt="Target"
                    className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-fire"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    यह चेहरा गुड़िया पर लगेगा 😈
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between pt-2">
            <Label>आवाज़ चालू करें</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={soundEnabled ? 'text-fire' : 'text-muted-foreground'}
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep('home')}
              className="flex-1"
            >
              वापस
            </Button>
            <Button 
              variant="mystical" 
              onClick={() => setCurrentStep('doll')}
              disabled={!targetData.name}
              className="flex-1"
            >
              आगे बढ़ें
            </Button>
          </div>
        </div>

        {targetData.name.toLowerCase() === 'myself' || targetData.name.toLowerCase() === 'खुद' && (
          <div className="mt-6 p-4 bg-accent/20 rounded-lg border border-blood/50">
            <p className="text-center text-blood font-bold">
              🪞 काला जादू हमेशा वापस आता है... अपना ही नाम डाला है? 😈
            </p>
          </div>
        )}
      </Card>
    </div>
  );

  const renderDollCreation = () => (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="mystical-card p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <Star className="w-16 h-16 mx-auto text-candle mb-4 pulse-glow" />
          <h2 className="text-3xl font-bold spooky-text">गुड़िया तैयार करें</h2>
          <p className="text-muted-foreground mt-2">{targetData.name} की वूडू डॉल बनाएं</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <Label>गुड़िया का अवतार</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {[1, 2, 3, 4].map((num) => (
                  <div
                    key={num}
                    className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                      dollData.avatar === `avatar-${num}` 
                        ? 'border-fire shadow-spooky' 
                        : 'border-border hover:border-fire/50'
                    }`}
                    onClick={() => setDollData(prev => ({ ...prev, avatar: `avatar-${num}` }))}
                  >
                    <img 
                      src={voodooDoll} 
                      alt={`Avatar ${num}`}
                      className={`w-full h-24 object-cover rounded-lg transition-all ${
                        dollData.avatar === `avatar-${num}` ? 'opacity-100 scale-105' : 'opacity-80'
                      }`}
                      style={{
                        filter: dollData.avatar === `avatar-${num}` 
                          ? `hue-rotate(${num * 90}deg) brightness(1.2)` 
                          : `hue-rotate(${num * 90}deg) brightness(0.8)`
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-2xl transition-all ${
                        dollData.avatar === `avatar-${num}` ? 'scale-125' : ''
                      }`}>
                        {num === 1 ? '🪆' : num === 2 ? '👹' : num === 3 ? '🧙‍♀️' : '💀'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="outfit">पोशाक</Label>
              <Select
                value={dollData.outfit}
                onValueChange={(value) => setDollData(prev => ({ ...prev, outfit: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="पोशाक चुनें..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kurta">कुर्ता 👔</SelectItem>
                  <SelectItem value="saree">साड़ी 🥻</SelectItem>
                  <SelectItem value="suit">सूट 🤵</SelectItem>
                  <SelectItem value="dhoti">धोती 🕴️</SelectItem>
                  <SelectItem value="monster">राक्षस 👹</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="nameTag">नाम टैग</Label>
              <Input
                id="nameTag"
                value={dollData.nameTag}
                onChange={(e) => setDollData(prev => ({ ...prev, nameTag: e.target.value }))}
                placeholder={`${targetData.name} Monster`}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <img 
                src={voodooDoll} 
                alt="Voodoo Doll"
                className="w-48 h-48 object-cover rounded-lg shadow-mystical floating-animation"
                style={{
                  filter: `hue-rotate(${dollVariant * 90}deg) brightness(1.1)`,
                  transform: dollData.outfit ? 'scale(1.05)' : 'scale(1)'
                }}
              />
              
              {/* Display uploaded photo as doll face */}
              {dollData.facePhoto && (
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                  <img
                    src={dollData.facePhoto}
                    alt="Doll Face"
                    className="w-16 h-16 rounded-full object-cover border-2 border-fire shadow-glow"
                  />
                </div>
              )}
              
              {/* Outfit indicator */}
              {dollData.outfit && (
                <div className="absolute bottom-2 right-2 text-2xl">
                  {dollData.outfit === 'kurta' ? '👔' : 
                   dollData.outfit === 'saree' ? '🥻' : 
                   dollData.outfit === 'suit' ? '🤵' : 
                   dollData.outfit === 'dhoti' ? '🕴️' : '👹'}
                </div>
              )}
              
              <Badge className="absolute -top-2 -right-2 bg-fire text-primary-foreground">
                {dollData.nameTag || targetData.name}
              </Badge>
            </div>
            <p className="text-center mt-4 text-muted-foreground">
              आपकी जादुई गुड़िया तैयार हो रही है... 🪄
            </p>
            {dollData.facePhoto && (
              <p className="text-center mt-2 text-fire text-sm font-bold">
                चेहरा लग गया! अब जादू और भी प्रभावी होगा! 😈
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep('target')}
            className="flex-1"
          >
            वापस
          </Button>
          <Button 
            variant="mystical" 
            onClick={() => setCurrentStep('ritual')}
            disabled={!dollData.avatar}
            className="flex-1"
          >
            जादू करने चलें
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderRitual = () => (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Flame className="w-20 h-20 mx-auto text-fire mb-4 pulse-glow" />
          <h2 className="text-4xl font-bold spooky-text">काला जादू शुरू करें</h2>
          <p className="text-muted-foreground mt-2">
            {targetData.name} पर तंत्र-मंत्र करने का समय आ गया है! 😈
          </p>
          
          {/* Timer and Score Display */}
          <div className="mt-4 flex justify-center gap-4">
            <Badge className={`text-lg px-4 py-2 ${gameActive ? 'bg-blood' : 'bg-fire'} text-primary-foreground`}>
              <Timer className="w-5 h-5 mr-2" />
              समय: {timeLeft}s
            </Badge>
            <Badge className="bg-fire text-primary-foreground text-lg px-4 py-2">
              <Trophy className="w-5 h-5 mr-2" />
              स्कोर: {totalScore}
            </Badge>
          </div>

          {!gameActive && timeLeft === 30 && (
            <Button
              onClick={startGameTimer}
              className="mt-4 bg-fire hover:bg-fire/90 text-white"
              size="lg"
            >
              30 सेकंड का खेल शुरू करें! ⏰
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Game Controls */}
          <div className="lg:col-span-1">
            {gameActive && (
              <Card className="mystical-card p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-fire">तुरंत करें!</h3>
                <div className="space-y-3">
                  <Button
                    onClick={generateRandomPins}
                    className="w-full bg-blood hover:bg-blood/90"
                    disabled={pinPositions.length > 0}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    सुई फेंकें ({totalScore} अंक)
                  </Button>
                  <Button
                    onClick={placeLemon}
                    className="w-full bg-candle hover:bg-candle/90"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    नींबू रखें ({lemonCount})
                  </Button>
                </div>
              </Card>
            )}

            <Card className="mystical-card p-6">
              <h3 className="text-xl font-bold mb-4 text-blood">श्राप चुनें</h3>
              
              {!selectedCurse && (
                <Button
                  onClick={startCurseSelection}
                  disabled={curseScrolling}
                  className="w-full mb-4 bg-blood hover:bg-blood/90"
                >
                  {curseScrolling ? 'श्राप चुना जा रहा है...' : 'रैंडम श्राप चुनें 🎲'}
                </Button>
              )}

              {curseScrolling && (
                <div className="mb-4 p-4 border border-blood rounded-lg bg-blood/10 overflow-hidden">
                  <div className="animate-bounce text-center text-sm text-blood font-bold">
                    {scrollingCurses[0]}
                  </div>
                </div>
              )}

              {selectedCurse && !curseScrolling && (
                <div className="p-4 bg-blood/20 rounded-lg border border-blood/50">
                  <p className="text-blood font-bold">चुना गया श्राप:</p>
                  <p className="text-sm mt-2">{selectedCurse}</p>
                </div>
              )}
            </Card>
          </div>

          {/* Interactive Doll Display */}
          <div className="lg:col-span-2">
            <Card className="mystical-card p-8 text-center">
              <h3 className="text-2xl font-bold mb-6 text-candle">जादुई गुड़िया</h3>
              
              <div className="relative inline-block">
                <img 
                  src={voodooDoll} 
                  alt="Target Doll"
                  className={`w-64 h-64 object-cover rounded-lg shadow-spooky mx-auto ${
                    gameActive ? 'animate-pulse' : 'floating-animation'
                  }`}
                  style={{
                    filter: `hue-rotate(${dollVariant * 90}deg) brightness(1.1)`
                  }}
                />
                
                {/* Display uploaded photo as doll face */}
                {dollData.facePhoto && (
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                    <img
                      src={dollData.facePhoto}
                      alt="Doll Face"
                      className="w-20 h-20 rounded-full object-cover border-2 border-fire shadow-glow"
                    />
                  </div>
                )}
                
                {/* Moving Pins */}
                {pinPositions.map((pin) => (
                  <div
                    key={pin.id}
                    className="absolute cursor-pointer text-2xl animate-bounce hover:scale-125 transition-transform"
                    style={{ 
                      left: `${pin.x}%`, 
                      top: `${pin.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => hitPin(pin.id)}
                  >
                    📌
                  </div>
                ))}

                {/* Lemon indicators */}
                {Array.from({ length: Math.min(lemonCount, 8) }, (_, i) => (
                  <div
                    key={i}
                    className="absolute text-xl"
                    style={{
                      left: `${20 + (i % 4) * 15}%`,
                      bottom: `${10 + Math.floor(i / 4) * 15}%`
                    }}
                  >
                    🍋
                  </div>
                ))}
                
                <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-fire text-primary-foreground text-lg">
                  {dollData.nameTag || targetData.name}
                </Badge>
              </div>

              <div className="mt-8">
                {gameActive && (
                  <p className="text-lg mb-4 text-fire font-bold">
                    जल्दी! सुइयों को टैप करें और नींबू रखते जाएं! 🔥
                  </p>
                )}
                
                {!gameActive && timeLeft === 0 && (
                  <p className="text-lg mb-4 text-candle">
                    समय खत्म! अब श्राप चुनें और जादू पूरा करें!
                  </p>
                )}

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep('doll')}
                    className="flex-1"
                  >
                    वापस
                  </Button>
                  <Button 
                    variant="ritual" 
                    onClick={() => setCurrentStep('result')}
                    disabled={!selectedCurse || (gameActive || timeLeft === 30)}
                    className="flex-1"
                  >
                    जादू पूरा करें 🔥
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResult = () => (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="mystical-card p-8 max-w-3xl w-full text-center">
        <div className="mb-8">
          <div className="relative inline-block">
            <Star className="w-24 h-24 mx-auto text-candle mb-4 pulse-glow" />
            <div className="absolute inset-0 animate-spin">
              <Flame className="w-6 h-6 text-fire" />
            </div>
          </div>
          <h2 className="text-4xl font-bold spooky-text mb-4">जादू सफल! 🎉</h2>
          <p className="text-xl text-muted-foreground">
            {targetData.name} पर काला जादू पूरा हो गया है!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Final Doll Display */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-candle mb-4">अंतिम गुड़िया</h3>
            <div className="relative inline-block">
              <img 
                src={voodooDoll} 
                alt="Final Doll"
                className="w-48 h-48 object-cover rounded-lg shadow-mystical"
                style={{
                  filter: `hue-rotate(${dollVariant * 90}deg) brightness(1.2) saturate(1.5)`
                }}
              />
              
              {/* Display uploaded photo as doll face */}
              {dollData.facePhoto && (
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                  <img
                    src={dollData.facePhoto}
                    alt="Final Doll Face"
                    className="w-16 h-16 rounded-full object-cover border-2 border-fire shadow-glow"
                  />
                </div>
              )}

              {/* Effects based on actions */}
              <div className="absolute top-2 right-2 text-2xl">📌</div>
              <div className="absolute bottom-2 left-2 text-2xl">🍋</div>
              <div className="absolute inset-0 border-2 border-candle rounded-full opacity-50"></div>
              
              <Badge className="absolute -top-2 -right-2 bg-fire text-primary-foreground">
                {dollData.nameTag || targetData.name}
              </Badge>
            </div>
          </div>

          {/* Certificate */}
          <div className="text-left">
            <div className="p-6 bg-gradient-to-r from-purple-900/50 to-red-900/50 rounded-lg border border-fire/50">
              <h3 className="text-xl font-bold text-fire mb-3 text-center">जादुई सर्टिफिकेट</h3>
              <div className="space-y-2">
                <p><strong>टारगेट:</strong> {targetData.name}</p>
                <p><strong>रिश्ता:</strong> {targetData.relation}</p>
                <p><strong>श्राप:</strong> {selectedCurse}</p>
                <p><strong>सुई हिट्स:</strong> {Math.floor(totalScore / 10)} बार</p>
                <p><strong>नींबू रखे:</strong> {lemonCount} नग</p>
                <p><strong>कुल स्कोर:</strong> {totalScore} अंक</p>
                <p><strong>प्रभावशीलता:</strong> 
                  <span className="text-candle font-bold">
                    {' '}{totalScore > 100 ? 'अति प्रभावी' : totalScore > 50 ? 'प्रभावी' : 'कम प्रभावी'} 
                    (100% अप्रभावी) ✨
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Score Badge */}
        <div className="mb-6">
          <Badge className={`text-xl px-6 py-3 ${
            totalScore > 100 ? 'bg-fire' : totalScore > 50 ? 'bg-candle' : 'bg-blood'
          } text-primary-foreground`}>
            <Trophy className="w-6 h-6 mr-2" />
            फाइनल स्कोर: {totalScore}
          </Badge>
        </div>

        <Badge variant="outline" className="text-lg p-4 bg-candle/10 border-candle mb-6">
          🏆 100% निष्प्रभावी बैज
        </Badge>

        {/* Share Options */}
        <div className="flex gap-3 justify-center mb-6">
          <Button 
            onClick={shareResult}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            शेयर करें
          </Button>
          <Button 
            onClick={downloadCertificate}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            सर्टिफिकेट डाउनलोड
          </Button>
        </div>

        <div className="p-4 bg-muted/20 rounded-lg mb-6">
          <p className="text-sm text-muted-foreground italic">
            📢 <strong>याद रखें:</strong> यह सब मज़ाक था! कोई वास्तविक जादू नहीं हुआ है। 
            अब जाकर {targetData.name} से दोस्ती कर लें! 😄
          </p>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep('ritual')}
            className="flex-1"
          >
            दोबारा करें
          </Button>
          <Button 
            variant="mystical" 
            onClick={resetApp}
            className="flex-1"
          >
            नया जादू करें
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'home': return renderHome();
      case 'target': return renderTargetForm();
      case 'doll': return renderDollCreation();
      case 'ritual': return renderRitual();
      case 'result': return renderResult();
      default: return renderHome();
    }
  };

  return <div className="min-h-screen bg-mystical">{renderCurrentStep()}</div>;
};

export default KalaJaadooApp;