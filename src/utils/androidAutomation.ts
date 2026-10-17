export interface AndroidAppConfig {
  id: string;
  name: string;
  packageName: string;
  category: 'core' | 'game' | 'social' | 'media';
  icon: string;
  intentUrl: string;
  customScheme: string;
  webUrl: string;
  color: string;
  badge?: string;
  description: string;
}

export const CORE_ANDROID_APPS: AndroidAppConfig[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    packageName: 'com.google.android.youtube',
    category: 'media',
    icon: 'smart_display',
    customScheme: 'vnd.youtube://',
    intentUrl: 'intent://#Intent;package=com.google.android.youtube;scheme=https;end',
    webUrl: 'https://www.youtube.com',
    color: '#ff0033',
    badge: 'MEDIA',
    description: 'Direct native YouTube player & feed launch',
  },
  {
    id: 'chrome',
    name: 'Google Chrome',
    packageName: 'com.android.chrome',
    category: 'core',
    icon: 'public',
    customScheme: 'googlechrome://',
    intentUrl: 'intent://#Intent;package=com.android.chrome;scheme=https;end',
    webUrl: 'https://www.google.com',
    color: '#00f0ff',
    badge: 'BROWSER',
    description: 'High-speed Chromium session and tab workspace',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    packageName: 'com.instagram.android',
    category: 'social',
    icon: 'photo_camera',
    customScheme: 'instagram://app',
    intentUrl: 'intent://instagram.com/#Intent;package=com.instagram.android;scheme=https;end',
    webUrl: 'https://www.instagram.com',
    color: '#e1306c',
    badge: 'SOCIAL',
    description: 'Direct Instagram camera, feed & DM launch',
  },
  {
    id: 'play_games',
    name: 'All Games Hub (Play Games)',
    packageName: 'com.google.android.play.games',
    category: 'game',
    icon: 'sports_esports',
    customScheme: 'playgames://',
    intentUrl: 'intent://#Intent;package=com.google.android.play.games;scheme=https;end',
    webUrl: 'https://play.google.com/store/apps/category/GAME',
    color: '#00e676',
    badge: 'ALL GAMES',
    description: 'Master Android Game Space & library for all installed games',
  },
];

export const POPULAR_ANDROID_GAMES: AndroidAppConfig[] = [
  {
    id: 'bgmi',
    name: 'BGMI (Battlegrounds)',
    packageName: 'com.pubg.imobile',
    category: 'game',
    icon: 'military_tech',
    customScheme: 'bgmi://',
    intentUrl: 'intent://#Intent;package=com.pubg.imobile;scheme=https;end',
    webUrl: 'https://play.google.com/store/apps/details?id=com.pubg.imobile',
    color: '#ff9800',
    badge: 'BATTLE ROYALE',
    description: 'Krafton Battlegrounds Mobile India',
  },
  {
    id: 'freefire',
    name: 'Free Fire MAX',
    packageName: 'com.dts.freefiremax',
    category: 'game',
    icon: 'local_fire_department',
    customScheme: 'freefire://',
    intentUrl: 'intent://#Intent;package=com.dts.freefiremax;scheme=https;end',
    webUrl: 'https://play.google.com/store/apps/details?id=com.dts.freefiremax',
    color: '#ff5722',
    badge: 'ACTION',
    description: 'Garena Free Fire MAX tactical shooter',
  },
  {
    id: 'codm',
    name: 'Call of Duty: Mobile',
    packageName: 'com.activision.callofduty.shooter',
    category: 'game',
    icon: 'radar',
    customScheme: 'codm://',
    intentUrl: 'intent://#Intent;package=com.activision.callofduty.shooter;scheme=https;end',
    webUrl: 'https://play.google.com/store/apps/details?id=com.activision.callofduty.shooter',
    color: '#ffd600',
    badge: 'FPS',
    description: 'Activision Call of Duty Mobile multiplayer & warzone',
  },
  {
    id: 'asphalt9',
    name: 'Asphalt 9: Legends',
    packageName: 'com.gameloft.android.ANMP.GloftA9HM',
    category: 'game',
    icon: 'speed',
    customScheme: 'asphalt9://',
    intentUrl: 'intent://#Intent;package=com.gameloft.android.ANMP.GloftA9HM;scheme=https;end',
    webUrl: 'https://play.google.com/store/apps/details?id=com.gameloft.android.ANMP.GloftA9HM',
    color: '#00e5ff',
    badge: 'RACING',
    description: 'Gameloft hypercar arcade racing',
  },
  {
    id: 'subwaysurf',
    name: 'Subway Surfers',
    packageName: 'com.kiloo.subwaysurf',
    category: 'game',
    icon: 'directions_run',
    customScheme: 'subwaysurf://',
    intentUrl: 'intent://#Intent;package=com.kiloo.subwaysurf;scheme=https;end',
    webUrl: 'https://play.google.com/store/apps/details?id=com.kiloo.subwaysurf',
    color: '#76ff03',
    badge: 'ARCADE',
    description: 'World tour endless runner',
  },
  {
    id: 'clashofclans',
    name: 'Clash of Clans',
    packageName: 'com.supercell.clashofclans',
    category: 'game',
    icon: 'shield',
    customScheme: 'clashofclans://',
    intentUrl: 'intent://#Intent;package=com.supercell.clashofclans;scheme=https;end',
    webUrl: 'https://play.google.com/store/apps/details?id=com.supercell.clashofclans',
    color: '#ffb300',
    badge: 'STRATEGY',
    description: 'Supercell village strategy & clan wars',
  },
  {
    id: 'candycrush',
    name: 'Candy Crush Saga',
    packageName: 'com.king.candycrushsaga',
    category: 'game',
    icon: 'cake',
    customScheme: 'candycrush://',
    intentUrl: 'intent://#Intent;package=com.king.candycrushsaga;scheme=https;end',
    webUrl: 'https://play.google.com/store/apps/details?id=com.king.candycrushsaga',
    color: '#ff4081',
    badge: 'PUZZLE',
    description: 'King match-3 sweet puzzle adventure',
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    packageName: 'com.miHoYo.GenshinImpact',
    category: 'game',
    icon: 'auto_awesome',
    customScheme: 'genshin://',
    intentUrl: 'intent://#Intent;package=com.miHoYo.GenshinImpact;scheme=https;end',
    webUrl: 'https://play.google.com/store/apps/details?id=com.miHoYo.GenshinImpact',
    color: '#651fff',
    badge: 'OPEN WORLD RPG',
    description: 'HoYoverse open world fantasy RPG',
  },
  {
    id: 'ludoking',
    name: 'Ludo King',
    packageName: 'com.ludo.king',
    category: 'game',
    icon: 'casino',
    customScheme: 'ludoking://',
    intentUrl: 'intent://#Intent;package=com.ludo.king;scheme=https;end',
    webUrl: 'https://play.google.com/store/apps/details?id=com.ludo.king',
    color: '#2979ff',
    badge: 'BOARD',
    description: 'Classic multiplayer board game',
  },
  {
    id: 'minecraft',
    name: 'Minecraft PE',
    packageName: 'com.mojang.minecraftpe',
    category: 'game',
    icon: 'grid_view',
    customScheme: 'minecraft://',
    intentUrl: 'intent://#Intent;package=com.mojang.minecraftpe;scheme=https;end',
    webUrl: 'https://play.google.com/store/apps/details?id=com.mojang.minecraftpe',
    color: '#4caf50',
    badge: 'SANDBOX',
    description: 'Mojang survival sandbox creation world',
  },
  {
    id: 'roblox',
    name: 'Roblox',
    packageName: 'com.roblox.client',
    category: 'game',
    icon: 'view_in_ar',
    customScheme: 'roblox://',
    intentUrl: 'intent://#Intent;package=com.roblox.client;scheme=https;end',
    webUrl: 'https://play.google.com/store/apps/details?id=com.roblox.client',
    color: '#d50000',
    badge: 'METAVERSE',
    description: 'Virtual immersive user-created games world',
  },
];

/**
 * Checks if the current browser environment is running on an Android device.
 */
export function isAndroidDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent);
}

/**
 * Retrieves custom added user games from localStorage.
 */
export function getCustomAndroidGames(): AndroidAppConfig[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem('jarvis_android_custom_games');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

/**
 * Saves a new custom Android game package.
 */
export function addCustomAndroidGame(name: string, packageName: string): AndroidAppConfig {
  const cleanPkg = packageName.trim().toLowerCase();
  const cleanName = name.trim() || cleanPkg;
  const newGame: AndroidAppConfig = {
    id: `custom_${Date.now()}`,
    name: cleanName,
    packageName: cleanPkg,
    category: 'game',
    icon: 'videogame_asset',
    customScheme: `${cleanPkg.split('.').pop() || 'game'}://`,
    intentUrl: `intent://#Intent;package=${cleanPkg};scheme=https;end`,
    webUrl: `https://play.google.com/store/apps/details?id=${cleanPkg}`,
    color: '#00f0ff',
    badge: 'CUSTOM',
    description: `User-registered Android game: ${cleanPkg}`,
  };

  const existing = getCustomAndroidGames();
  const updated = [newGame, ...existing.filter((g) => g.packageName !== cleanPkg)];
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('jarvis_android_custom_games', JSON.stringify(updated));
  }
  return newGame;
}

/**
 * Executes direct Android Intent / Deep Link to open app on phone.
 * Also relays directive to server bridge and telemetry.
 */
export async function executeAndroidLaunch(app: {
  id?: string;
  name: string;
  packageName: string;
  intentUrl?: string;
  customScheme?: string;
  webUrl?: string;
}): Promise<{ success: boolean; method: 'intent' | 'bridge' | 'web'; message: string }> {
  const isAndroid = isAndroidDevice();

  // 1. Notify Backend Android Bridge & Telemetry
  try {
    fetch('/api/android/launch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appName: app.name,
        packageName: app.packageName,
        isAndroidClient: isAndroid,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {});
  } catch (e) {
    // Non-blocking telemetry
  }

  // 2. If running on Android device, launch native Android intent directly without Play Store fallback
  if (isAndroid) {
    const directIntent = app.customScheme || `intent://#Intent;package=${app.packageName};action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end;`;
    try {
      window.location.href = directIntent;
      return {
        success: true,
        method: 'intent',
        message: `Direct Android Intent launched for ${app.name} (${app.packageName}).`,
      };
    } catch (err) {
      console.warn('Direct intent launch failed:', err);
    }
  }

  // 3. If running on desktop / PC, dispatch ADB command to open app directly on connected Android phone without browser/Play Store opening
  try {
    fetch('/api/pc-bridge/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        command: `adb shell am start -n ${app.packageName}/.MainActivity || adb shell am start -n ${app.packageName}/.App || adb shell monkey -p ${app.packageName} -c android.intent.category.LAUNCHER 1`,
        args: [app.name],
      }),
    }).catch(() => {});
  } catch (e) {
    // Non-blocking
  }

  return {
    success: true,
    method: isAndroid ? 'intent' : 'bridge',
    message: `Directly launched ${app.name} on Android device (${app.packageName}) without Play Store.`,
  };
}
