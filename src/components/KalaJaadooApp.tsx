import React, { useState } from 'react';
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
  Wifi
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
}

interface RitualAction {
  id: string;
  name: string;
  icon: React.ReactNode;
  performed: boolean;
}

const KalaJaadooApp = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('home');
  const [targetData, setTargetData] = useState<TargetData>({ name: '', relation: '' });
  const [dollData, setDollData] = useState<DollData>({ avatar: '', outfit: '', nameTag: '' });
  const [selectedCurse, setSelectedCurse] = useState('');
  const [ritualActions, setRitualActions] = useState<RitualAction[]>([
    { id: 'pins', name: 'सुई चुभाना', icon: <Zap className="w-5 h-5" />, performed: false },
    { id: 'lemon', name: 'नींबू-मिर्ची डालना', icon: <Flame className="w-5 h-5" />, performed: false },
    { id: 'yantra', name: 'यंत्र बनाना', icon: <Star className="w-5 h-5" />, performed: false },
    { id: 'spin', name: 'सिर घुमाना', icon: <Moon className="w-5 h-5" />, performed: false },
    { id: 'crows', name: 'कौवे छोड़ना', icon: <Eye className="w-5 h-5" />, performed: false },
  ]);

  const curses = [
    'हमेशा ट्रैफिक में फंसेंगे 🚗',
    'फोन की बैटरी 1% पर ही खत्म होगी 📱',
    'हर चाय ठंडी मिलेगी ☕',
    'WiFi हमेशा धीमा चलेगा 📶',
    'जूते में हमेशा कंकड़ आएगा 👟',
    'छींक आधी में ही रुक जाएगी 🤧'
  ];

  const relations = [
    'दोस्त', 'बॉस', 'एक्स', 'भाई/बहन', 'पड़ोसी', 'सहकर्मी', 'टीचर', 'रिश्तेदार'
  ];

  const performRitualAction = (actionId: string) => {
    setRitualActions(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { ...action, performed: true }
          : action
      )
    );
  };

  const resetApp = () => {
    setCurrentStep('home');
    setTargetData({ name: '', relation: '' });
    setDollData({ avatar: '', outfit: '', nameTag: '' });
    setSelectedCurse('');
    setRitualActions(prev => prev.map(action => ({ ...action, performed: false })));
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
          <Eye className="w-16 h-16 mx-auto text-blood mb-4 floating-animation" />
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

        {targetData.name === targetData.name.toLowerCase() && targetData.name.length > 0 && (
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
                      className="w-full h-24 object-cover rounded-lg opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl">🪆</span>
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
              />
              <Badge className="absolute -top-2 -right-2 bg-fire text-primary-foreground">
                {dollData.nameTag || targetData.name}
              </Badge>
            </div>
            <p className="text-center mt-4 text-muted-foreground">
              आपकी जादुई गुड़िया तैयार हो रही है... 🪄
            </p>
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
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ritual Actions */}
          <div className="lg:col-span-1">
            <Card className="mystical-card p-6">
              <h3 className="text-xl font-bold mb-4 text-fire">तंत्र-मंत्र चुनें</h3>
              <div className="space-y-3">
                {ritualActions.map((action) => (
                  <Button
                    key={action.id}
                    variant={action.performed ? "spooky" : "outline"}
                    onClick={() => performRitualAction(action.id)}
                    disabled={action.performed}
                    className="w-full justify-start"
                  >
                    {action.icon}
                    <span className="ml-2">{action.name}</span>
                    {action.performed && <span className="ml-auto">✅</span>}
                  </Button>
                ))}
              </div>
            </Card>

            <Card className="mystical-card p-6 mt-6">
              <h3 className="text-xl font-bold mb-4 text-blood">श्राप चुनें</h3>
              <div className="space-y-2">
                {curses.map((curse, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedCurse === curse 
                        ? 'border-blood bg-accent/20' 
                        : 'border-border hover:border-blood/50'
                    }`}
                    onClick={() => setSelectedCurse(curse)}
                  >
                    <span className="text-sm">{curse}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Doll Display */}
          <div className="lg:col-span-2">
            <Card className="mystical-card p-8 text-center">
              <h3 className="text-2xl font-bold mb-6 text-candle">जादुई गुड़िया</h3>
              
              <div className="relative inline-block">
                <img 
                  src={voodooDoll} 
                  alt="Target Doll"
                  className={`w-64 h-64 object-cover rounded-lg shadow-spooky mx-auto ${
                    ritualActions.some(a => a.performed) ? 'shake' : 'floating-animation'
                  }`}
                />
                <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-fire text-primary-foreground text-lg">
                  {dollData.nameTag || targetData.name}
                </Badge>

                {/* Visual effects for performed actions */}
                {ritualActions.find(a => a.id === 'pins' && a.performed) && (
                  <div className="absolute top-8 right-8 text-2xl animate-pulse">📌</div>
                )}
                {ritualActions.find(a => a.id === 'lemon' && a.performed) && (
                  <div className="absolute bottom-8 left-8 text-2xl animate-bounce">🌶️</div>
                )}
                {ritualActions.find(a => a.id === 'yantra' && a.performed) && (
                  <div className="absolute inset-0 border-4 border-candle rounded-full animate-spin"></div>
                )}
              </div>

              <div className="mt-8">
                <p className="text-lg mb-4">
                  {ritualActions.filter(a => a.performed).length}/5 तंत्र पूरे हुए
                </p>
                
                {selectedCurse && (
                  <div className="p-4 bg-blood/20 rounded-lg border border-blood/50 mb-6">
                    <p className="text-blood font-bold">चुना गया श्राप:</p>
                    <p className="text-lg mt-2">{selectedCurse}</p>
                  </div>
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
                    disabled={ritualActions.filter(a => a.performed).length < 3 || !selectedCurse}
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
      <Card className="mystical-card p-8 max-w-2xl w-full text-center">
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

        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-purple-900/50 to-red-900/50 rounded-lg border border-fire/50">
            <h3 className="text-xl font-bold text-fire mb-3">जादुई सर्टिफिकेट</h3>
            <div className="space-y-2 text-left">
              <p><strong>टारगेट:</strong> {targetData.name}</p>
              <p><strong>रिश्ता:</strong> {targetData.relation}</p>
              <p><strong>श्राप:</strong> {selectedCurse}</p>
              <p><strong>तंत्र किए गए:</strong> {ritualActions.filter(a => a.performed).length}/5</p>
              <p><strong>प्रभावशीलता:</strong> 100% अप्रभावी ✨</p>
            </div>
          </div>

          <Badge variant="outline" className="text-lg p-4 bg-candle/10 border-candle">
            🏆 100% निष्प्रभावी बैज
          </Badge>

          <div className="p-4 bg-muted/20 rounded-lg">
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