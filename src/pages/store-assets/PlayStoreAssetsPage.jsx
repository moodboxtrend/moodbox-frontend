import { useState, useRef } from 'react';
import { Download, Sparkles, Smartphone, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

const SCREENSHOTS = [
  {
    id: 'joke',
    title: 'Laugh Daily',
    subtitle: 'Enjoy unlimited jokes in Hindi & English — fun for everyone!',
    badge: 'JOKES & MEMES',
    bgGradient: ['#FF8C42', '#FFD166'],
    icon: '😂',
    sampleTitle: 'मजेदार हिंदी जोक्स & चुटकुले',
    sampleBody: 'पत्नी: "तुम मुझसे कितना प्यार करते हो?"\nपति: "जितना सचिन क्रिकेट से करते हैं!"\nपत्नी: "तो फिर मुझे रिटायर क्यों नहीं करते?" 😂',
  },
  {
    id: 'recipe',
    title: 'Cook Better',
    subtitle: 'Discover tasty recipes with step-by-step guides & ingredients.',
    badge: 'FOOD & RECIPES',
    bgGradient: ['#FF4E7A', '#FF8FA3'],
    icon: '🍲',
    sampleTitle: 'स्वादिष्ट पनीर बटर मसाला रेसिपी',
    sampleBody: '• 200g Fresh Paneer Cubes\n• 2 Butter Cubes & Tomato Gravy\n• Top with Kasuri Methi & serve hot!',
  },
  {
    id: 'story',
    title: 'Read Stories',
    subtitle: 'Explore amazing love stories, motivational & moral reads.',
    badge: 'STORIES & NOVELS',
    bgGradient: ['#6D4AFF', '#A78BFA'],
    icon: '📚',
    sampleTitle: 'सफलता का सच्चा मार्ग',
    sampleBody: 'जीवन में सफल होने के लिए भाग्य से ज्यादा निरंतर कड़ी मेहनत और सकारात्मक सोच महत्वपूर्ण है...',
  },
  {
    id: 'wallpaper',
    title: '4K Wallpapers',
    subtitle: 'High resolution wallpapers - Download & set in one tap.',
    badge: 'HD WALLPAPERS',
    bgGradient: ['#06B6D4', '#67E8F9'],
    icon: '🖼️',
    sampleTitle: 'Ultra HD Aesthetic Wallpapers',
    sampleBody: '• 1-Tap Download to Phone Gallery\n• Instant Set on Home & Lock Screen\n• Daily Trending Ultra HD Wallpapers',
  },
  {
    id: 'video',
    title: 'Trending Reels',
    subtitle: 'Watch short videos & reels non-stop in HD quality.',
    badge: 'SHORT VIDEOS',
    bgGradient: ['#10B981', '#6EE7B7'],
    icon: '▶️',
    sampleTitle: 'Trending Short Videos & Reels',
    sampleBody: 'Swipe up for endless entertaining videos, funny clips, status reels & viral shorts.',
  },
  {
    id: 'overview',
    title: 'All-in-One Box',
    subtitle: 'Fun, Food, Stories & Entertainment Hub in one place.',
    badge: 'MOODBOX HUB',
    bgGradient: ['#8B5CF6', '#C4B5FD'],
    icon: '🎁',
    sampleTitle: 'MoodBox - All in One Entertainment',
    sampleBody: 'Explore Jokes, Recipes, Stories, Wallpapers and Videos in one sleek, modern app!',
  },
];

export default function PlayStoreAssetsPage() {
  const [downloading, setDownloading] = useState(false);
  const bannerRef = useRef(null);
  const screenshotRefs = useRef([]);

  // Download DOM Element as high-res PNG using html-to-image
  const handleDownloadBanner = async () => {
    if (!bannerRef.current) return;
    try {
      toast.loading('Generating 1024x500 Feature Graphic...');
      const dataUrl = await toPng(bannerRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        canvasWidth: 1024,
        canvasHeight: 500,
      });
      const link = document.createElement('a');
      link.download = 'MoodBox_PlayStore_Feature_Graphic_1024x500.png';
      link.href = dataUrl;
      link.click();
      toast.dismiss();
      toast.success('Downloaded Feature Graphic (1024x500)');
    } catch (err) {
      toast.dismiss();
      toast.error('Failed to download Feature Graphic');
    }
  };

  const handleDownloadScreenshot = async (idx, item) => {
    const el = screenshotRefs.current[idx];
    if (!el) return;
    try {
      toast.loading(`Generating Screenshot #${idx + 1}...`);
      const dataUrl = await toPng(el, {
        cacheBust: true,
        pixelRatio: 3,
        canvasWidth: 1080,
        canvasHeight: 1920,
      });
      const link = document.createElement('a');
      link.download = `MoodBox_PlayStore_Screenshot_${item.id}_1080x1920.png`;
      link.href = dataUrl;
      link.click();
      toast.dismiss();
      toast.success(`Downloaded ${item.title} Screenshot (1080x1920)`);
    } catch (err) {
      toast.dismiss();
      toast.error(`Failed to download Screenshot #${idx + 1}`);
    }
  };

  const handleDownloadAll = async () => {
    setDownloading(true);
    toast.loading('Downloading all 7 Play Store assets...');
    try {
      await handleDownloadBanner();
      for (let i = 0; i < SCREENSHOTS.length; i++) {
        await new Promise((r) => setTimeout(r, 400));
        await handleDownloadScreenshot(i, SCREENSHOTS[i]);
      }
      toast.dismiss();
      toast.success('All 7 Play Store Assets downloaded successfully!');
    } catch (e) {
      toast.dismiss();
      toast.error('Batch download interrupted');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Play Store Launch Kit"
        description="Official high-resolution Google Play Store Feature Graphic and 6 Promotional Screenshots"
        actions={
          <Button onClick={handleDownloadAll} disabled={downloading} className="shadow-lg">
            <Download className="h-4 w-4 mr-2" />
            {downloading ? 'Generating Kit…' : 'Download All 7 Assets'}
          </Button>
        }
      />

      {/* Feature Graphic Banner Section */}
      <Card className="p-6 mb-8 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-primary border-primary">
              1024 x 500 px
            </Badge>
            <span className="font-semibold text-base">Google Play Feature Graphic Banner</span>
          </div>
          <Button variant="secondary" onClick={handleDownloadBanner}>
            <Download className="h-4 w-4 mr-2" /> Download Banner (1024x500)
          </Button>
        </div>

        {/* 1024x500 Feature Graphic Container */}
        <div className="overflow-x-auto pb-2">
          <div
            ref={bannerRef}
            className="rounded-2xl p-12 flex items-center justify-between relative overflow-hidden shrink-0 shadow-2xl"
            style={{
              width: '1024px',
              height: '500px',
              background: 'linear-gradient(135deg, #0D0B1A 0%, #1B1830 50%, #2D2459 100%)',
            }}
          >
            {/* Background Glow Aura */}
            <div
              className="absolute -left-20 -top-20 w-[450px] h-[450px] rounded-full pointer-events-none opacity-40 blur-3xl"
              style={{ background: 'radial-gradient(circle, #6D4AFF 0%, transparent 70%)' }}
            />

            {/* Left Content */}
            <div className="z-10 max-w-[620px]">
              <div className="flex items-center gap-4 mb-4">
                <img src="/moodbox.png" alt="MoodBox Logo" className="h-20 w-20 rounded-2xl shadow-2xl object-cover" />
                <h2 className="text-6xl font-extrabold text-white tracking-tight">
                  Mood<span className="text-[#A78BFA]">Box</span>
                </h2>
              </div>
              <p className="text-2xl font-bold text-[#E2D9F3] mb-6">
                Fun. Food. Stories. All in One Box ❤️
              </p>
              <div className="flex flex-wrap gap-3 text-sm font-bold text-[#C4B5FD]">
                <span className="bg-white/10 px-4 py-2 rounded-full border border-white/10">😂 Jokes</span>
                <span className="bg-white/10 px-4 py-2 rounded-full border border-white/10">🍲 Recipes</span>
                <span className="bg-white/10 px-4 py-2 rounded-full border border-white/10">📚 Stories</span>
                <span className="bg-white/10 px-4 py-2 rounded-full border border-white/10">🖼️ Wallpapers</span>
                <span className="bg-white/10 px-4 py-2 rounded-full border border-white/10">▶️ Videos</span>
              </div>
            </div>

            {/* Right Side Branding Card */}
            <div className="z-10 h-56 w-56 rounded-3xl bg-[#6D4AFF]/20 border border-white/20 backdrop-blur-md flex items-center justify-center p-4 shadow-2xl">
              <img src="/moodbox.png" alt="MoodBox App Icon" className="h-40 w-40 rounded-2xl object-cover shadow-2xl" />
            </div>
          </div>
        </div>
      </Card>

      {/* 6 Screenshots Section */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">6 Play Store Promotional Screenshots</h3>
          <p className="text-xs text-muted-foreground">
            Standard 1080 x 1920 phone screenshots showcasing your app features to Play Store users.
          </p>
        </div>
        <Badge variant="secondary">1080 x 1920 px</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SCREENSHOTS.map((item, idx) => (
          <Card key={item.id} className="p-5 flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="text-xs font-bold">
                  #{idx + 1} {item.badge}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => handleDownloadScreenshot(idx, item)}>
                  <Download className="h-4 w-4 mr-1" /> PNG
                </Button>
              </div>

              {/* 1080 x 1920 Screenshot DOM Container (Captured via html-to-image) */}
              <div className="overflow-hidden rounded-2xl shadow-lg border border-white/10">
                <div
                  ref={(el) => (screenshotRefs.current[idx] = el)}
                  style={{
                    width: '360px',
                    height: '640px',
                    background: `linear-gradient(135deg, ${item.bgGradient[0]} 0%, ${item.bgGradient[1]} 100%)`,
                  }}
                  className="p-5 flex flex-col justify-between relative overflow-hidden select-none shrink-0"
                >
                  {/* Top Text Header */}
                  <div className="text-center pt-2 px-1">
                    <span className="text-[11px] font-extrabold tracking-wider text-white uppercase bg-black/30 px-3.5 py-1 rounded-full border border-white/20">
                      {item.badge}
                    </span>
                    <h4 className="text-2xl font-black text-white mt-1.5 drop-shadow-md">{item.title}</h4>
                    <p className="text-xs text-white/95 font-medium px-2 mt-0.5 leading-snug">{item.subtitle}</p>
                  </div>

                  {/* Middle Category Icon Badge Container */}
                  <div className="flex items-center justify-center py-2">
                    <div className="h-16 w-16 rounded-2xl bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-3xl shadow-xl">
                      {item.icon}
                    </div>
                  </div>

                  {/* Simulated Phone Screen Card */}
                  <div className="bg-[#120F1D] rounded-2xl p-3.5 text-white shadow-2xl space-y-2.5 border border-white/10 shrink-0">
                    {/* Phone Bar Header */}
                    <div className="bg-[#1B1830] rounded-xl p-2.5 flex items-center gap-2">
                      <img src="/moodbox.png" alt="MoodBox Logo" className="h-6 w-6 rounded-lg object-cover" />
                      <span className="font-bold text-xs text-white">MoodBox</span>
                    </div>

                    {/* Sample Content Box */}
                    <div className="bg-[#262042] rounded-xl p-3 space-y-1">
                      <div className="font-extrabold text-xs text-white flex items-center gap-1.5">
                        <span>{item.icon}</span>
                        <span>{item.sampleTitle}</span>
                      </div>
                      <p className="text-[11px] text-white/90 whitespace-pre-line leading-relaxed font-normal">
                        {item.sampleBody}
                      </p>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="bg-[#6D4AFF] rounded-xl p-2 text-center text-xs font-bold text-white shadow-md">
                      🎁 Open in MoodBox App
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-4"
              variant="outline"
              onClick={() => handleDownloadScreenshot(idx, item)}
            >
              <Download className="h-4 w-4 mr-2" /> Download Screenshot #{idx + 1}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
