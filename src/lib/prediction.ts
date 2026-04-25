
export interface Signal {
  id: string;
  time: string; // HH:mm format
  interval: string; // e.g., "2:28 - 2:29"
  odds: string; // e.g., "30x - 70x"
  probability: number; // 0-100
  type: 'PINK' | 'BIG';
}

/**
 * Generates deterministic signals based on the current date and hour.
 * This ensures the user sees consistent "predictions" that feel calculated.
 */
export function generateSignals(date: Date): Signal[] {
  const signals: Signal[] = [];
  const currentHour = date.getHours();
  
  // Use the date as a seed for pseudo-randomness
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  
  // Generate 8-12 signals per hour for faster results
  for (let h = currentHour; h <= currentHour + 2; h++) {
    const hourSeed = seed + h;
    const numSignals = 8 + (hourSeed % 5); // 8 to 12 signals
    
    const minutes: number[] = [];
    for (let i = 0; i < numSignals; i++) {
      let min = (hourSeed * (i + 1) * 13) % 60;
      // Avoid duplicates
      while (minutes.includes(min)) {
        min = (min + 3) % 60;
      }
      minutes.push(min);
    }
    
    minutes.sort((a, b) => a - b).forEach(min => {
      const displayHour = h % 24;
      const timeStr = `${displayHour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      const nextMin = (min + 1) % 60;
      const nextHour = nextMin === 0 ? (displayHour + 1) : displayHour;
      const intervalStr = `${timeStr} - ${nextHour % 24}:${nextMin.toString().padStart(2, '0')}`;
      
      // Conservative odds range: 10x to 50x MAX for high accuracy
      const roll = (hourSeed * min * 13) % 100;
      let baseOdds: number;
      let maxOdds: number;

      if (roll < 50) {
        // Safe Bracket (10-25x)
        baseOdds = 10 + (roll % 10);
        maxOdds = baseOdds + 5 + (roll % 10);
      } else if (roll < 85) {
        // Standard Bracket (20-40x)
        baseOdds = 20 + (roll % 10);
        maxOdds = baseOdds + 8 + (roll % 12);
      } else {
        // Peak Bracket (35-50x MAX)
        baseOdds = 35 + (roll % 5);
        maxOdds = Math.min(50, baseOdds + 10 + (roll % 5));
      }
      
      signals.push({
        id: `${h}-${min}`,
        time: timeStr,
        interval: intervalStr,
        odds: `${baseOdds.toFixed(0)}x --- ${maxOdds.toFixed(0)}x`,
        probability: 98 + (hourSeed % 2), // 98% - 99% certainty
        type: 'PINK'
      });
    });
  }
  
  return signals;
}
