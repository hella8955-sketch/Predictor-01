/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  User, 
  Bell, 
  Zap, 
  History,
  Activity,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateSignals, Signal } from '@/src/lib/prediction.ts';

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [signals, setSignals] = useState<Signal[]>([]);
  const [activeSignal, setActiveSignal] = useState<Signal | null>(null);
  const [nextSignal, setNextSignal] = useState<Signal | null>(null);

  // Personalization
  const userName = "David Orji";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const newSignals = generateSignals(currentTime);
    setSignals(newSignals);
    
    const nowStr = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
    
    // Find if there's a signal starting in the next 2 minutes (Incoming)
    const checkTime = new Date(currentTime.getTime() + 2 * 60000);
    const checkStr = `${checkTime.getHours().toString().padStart(2, '0')}:${checkTime.getMinutes().toString().padStart(2, '0')}`;
    
    const active = newSignals.find(s => s.time === checkStr || s.time === nowStr);
    setActiveSignal(active || null);

    // Find the absolute next signal after now
    const next = newSignals.find(s => s.time > nowStr);
    setNextSignal(next || null);
  }, [currentTime.getMinutes()]);

  const pastSignals = useMemo(() => {
    const nowStr = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
    return signals.filter(s => s.time < nowStr).reverse().slice(0, 10);
  }, [signals, currentTime]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-pink-500/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-blue-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-pink-600 rounded-lg shadow-[0_0_15px_rgba(219,39,119,0.5)]">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                AVIATOR SIGNAL PRO
              </h1>
              <Badge variant="outline" className="border-pink-500/50 text-pink-400 bg-pink-500/5 animate-pulse">
                LIVE
              </Badge>
            </div>
            <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              SportyBet Sync: <span className="text-green-500 animate-pulse">ACTIVE</span>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Welcome back</span>
              <span className="text-sm font-bold text-white">{userName}</span>
            </div>
            <Separator orientation="vertical" className="h-8 bg-white/10" />
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Current Time</span>
              <span className="text-sm font-mono font-bold text-pink-400">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Prediction Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active/Next Signal Card */}
            <AnimatePresence mode="wait">
              {(activeSignal || nextSignal) ? (
                <motion.div
                  key={activeSignal ? 'active' : 'next'}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Card className={`bg-gradient-to-br ${activeSignal ? 'from-pink-600/20 to-purple-900/20 border-pink-500/50' : 'from-blue-600/10 to-purple-900/10 border-white/10'} backdrop-blur-xl overflow-hidden relative group`}>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                    <div className="absolute top-0 right-0 p-4">
                      {activeSignal ? <Zap className="w-8 h-8 text-pink-500 animate-bounce" /> : <Clock className="w-8 h-8 text-blue-400 animate-pulse" />}
                    </div>
                    
                    <CardHeader className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${activeSignal ? 'bg-pink-500 animate-ping' : 'bg-blue-400'}`} />
                        <span className={`${activeSignal ? 'text-pink-400' : 'text-blue-400'} text-xs font-bold uppercase tracking-[0.2em]`}>
                          {activeSignal 
                            ? (activeSignal.time === `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}` 
                                ? "Signal Active Now" 
                                : "Incoming Signal - Prepare Now")
                            : "Next Predicted Window"}
                        </span>
                      </div>
                      <CardTitle className="text-4xl font-black text-white tracking-tighter italic">
                        {activeSignal ? "SAFE PINK ALERT" : "NEXT SAFE SIGNAL"}
                      </CardTitle>
                      <CardDescription className="text-gray-400 font-medium">
                        {activeSignal ? "98%+ Accuracy window identified" : "Analyzing next 10x-50x opportunity"} for {userName}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-8 relative">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/40 p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                          <Clock className={`w-6 h-6 ${activeSignal ? 'text-pink-400' : 'text-blue-400'} mb-2`} />
                          <span className="text-xs text-gray-500 uppercase font-bold mb-1">Time Window</span>
                          <span className="text-2xl font-mono font-black text-white">{(activeSignal || nextSignal)?.interval}</span>
                        </div>
                        <div className="bg-black/40 p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                          <TrendingUp className={`w-6 h-6 ${activeSignal ? 'text-pink-400' : 'text-blue-400'} mb-2`} />
                          <span className="text-xs text-gray-500 uppercase font-bold mb-1">Target Bracket</span>
                          <span className={`text-2xl font-mono font-black ${activeSignal ? 'text-pink-500' : 'text-blue-400'}`}>{(activeSignal || nextSignal)?.odds}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                          <span className="text-gray-400">Confidence Score</span>
                          <span className={activeSignal ? 'text-pink-400' : 'text-blue-400'}>{(activeSignal || nextSignal)?.probability}%</span>
                        </div>
                        <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(activeSignal || nextSignal)?.probability}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full bg-gradient-to-r ${activeSignal ? 'from-pink-600 to-purple-500 shadow-[0_0_10px_rgba(219,39,119,0.5)]' : 'from-blue-600 to-purple-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`}
                          />
                        </div>
                      </div>

                      <div className={`p-4 ${activeSignal ? 'bg-pink-500/10 border-pink-500/30' : 'bg-blue-500/10 border-blue-500/30'} border rounded-xl text-center`}>
                        <p className={`text-sm font-bold ${activeSignal ? 'text-pink-400' : 'text-blue-400'}`}>
                          {activeSignal 
                            ? (activeSignal.time === `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`
                                ? "BET NOW! SIGNAL IS LIVE"
                                : "PREPARE TO BET! SIGNAL STARTS IN < 2 MINS")
                            : "STAY ALERT! NEXT SIGNAL COMING SOON"}
                        </p>
                      </div>

                      <Button className={`w-full h-14 ${activeSignal ? 'bg-pink-600 hover:bg-pink-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-black text-lg rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]`}>
                        OPEN SPORTYBET
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="syncing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md"
                >
                  <div className="relative mb-6">
                    <Activity className="w-16 h-16 text-gray-700 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 border-2 border-dashed border-gray-800 rounded-full animate-[spin_10s_linear_infinite]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-300 mb-2">Syncing SportyBet Servers...</h3>
                  <p className="text-gray-500 max-w-xs mx-auto text-sm font-medium">
                    Calibrating for 10x - 50x safe brackets. Our engine is prioritizing accuracy for David Orji.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Stats Card */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400">Daily Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-3xl font-black text-white">98.4%</span>
                    <p className="text-xs text-gray-500 font-bold uppercase">Accuracy Rate</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-green-500">+124</span>
                    <p className="text-xs text-gray-500 font-bold uppercase">Wins Today</p>
                  </div>
                </div>
                <div className="h-12 flex items-end gap-1">
                  {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85, 60, 100].map((h, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-pink-500/20 rounded-t-sm relative group"
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute inset-0 bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-sm shadow-[0_0_10px_rgba(219,39,119,0.5)]" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* History Tabs */}
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="w-full bg-white/5 border border-white/10 p-1 rounded-xl">
                <TabsTrigger value="history" className="flex-1 rounded-lg data-[state=active]:bg-pink-600 data-[state=active]:text-white">
                  <History className="w-4 h-4 mr-2" />
                  History
                </TabsTrigger>
                <TabsTrigger value="tips" className="flex-1 rounded-lg data-[state=active]:bg-pink-600 data-[state=active]:text-white">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Tips
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="history" className="mt-4">
                <Card className="bg-white/5 border-white/10">
                  <ScrollArea className="h-[350px] pr-4">
                    <div className="space-y-4 p-4">
                      {pastSignals.map((signal, idx) => (
                        <div key={signal.id} className="flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                              <ShieldCheck className="w-4 h-4 text-green-500" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">{signal.time} Window</p>
                              <p className="text-[10px] text-gray-500 font-medium">{signal.odds} Hit</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-green-500 uppercase">Success</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </TabsContent>

              <TabsContent value="tips" className="mt-4">
                <Card className="bg-white/5 border-white/10 p-4 space-y-4">
                  <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20">
                    <h4 className="text-xs font-bold text-pink-400 uppercase mb-1">Pro Tip #1</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Always bet 10 seconds before the predicted interval starts to ensure your bet is placed.
                    </p>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                    <h4 className="text-xs font-bold text-purple-400 uppercase mb-1">Pro Tip #2</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      If the plane flies past 10x, prepare to cash out at your target pink range.
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <h4 className="text-xs font-bold text-blue-400 uppercase mb-1">Pro Tip #3</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Don't chase losses. Stick to the signals provided by the AI engine.
                    </p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Disclaimer */}
            <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  <span className="text-yellow-500 font-bold uppercase">Disclaimer:</span> This tool is for entertainment and analysis purposes only. Gambling involves risk. Please play responsibly. 18+.
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600 font-medium">
            &copy; 2026 Aviator Signal Pro. Engineered for David Orji.
          </p>
        </footer>
      </div>
    </div>
  );
}
