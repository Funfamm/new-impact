
import { Submission, SiteConfig, Movie, SlideAsset } from "../types";
import { driveService } from "./googleDriveService";

// --- DEFAULTS ---
const DEFAULT_MOVIES: Movie[] = Array.from({ length: 8 }).map((_, i) => ({
    id: `mov-${i}`,
    title: [
      'Neon Genesis', 'Cyber Soul', 'The Algorithm', 'Binary Sunset', 
      'Silicon Dreams', 'Data Heist', 'Virtual Reality', 'Chrome Heart'
    ][i],
    genre: i % 3 === 0 ? 'Sci-Fi' : i % 3 === 1 ? 'Action' : 'Drama',
    year: 2024 + Math.floor(i/4),
    description: 'In a world dominated by AI, one rogue program decides to rewrite history.',
    thumbnail: `https://picsum.photos/seed/${i + 50}/400/600`,
    videoUrl: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4' 
}));

const DEFAULT_CONFIG: SiteConfig = {
  landingSlides: [
    { id: '1', name: "CYBER SOUL", url: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop", color: "#bc13fe" },
    { id: '2', name: "NEON HORIZON", url: "https://images.unsplash.com/photo-1535016120720-40c6874c3b13?q=80&w=2664&auto=format&fit=crop", color: "#00f3ff" },
    { id: '3', name: "CHROME HEART", url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=2574&auto=format&fit=crop", color: "#ffffff" },
    { id: '4', name: "VELOCITY", url: "https://images.unsplash.com/photo-1614726365723-49faaa5f26c3?q=80&w=2670&auto=format&fit=crop", color: "#ff0055" }
  ],
  castingSlides: [
    { id: 'c1', name: "Slide 1", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop", color: "#fff", quote: "UNLEASH YOUR POTENTIAL" },
    { id: 'c2', name: "Slide 2", url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop", color: "#fff", quote: "THE WORLD IS WATCHING" },
    { id: 'c3', name: "Slide 3", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop", color: "#fff", quote: "BECOME THE ICON" }
  ],
  movies: DEFAULT_MOVIES
};

// --- BACKEND STATE ---
let inMemoryConfig: SiteConfig | null = null;

// Initialize: Load from Local, then Try Drive
export const initializeBackend = async (): Promise<SiteConfig> => {
    // 1. Load Local Cache immediately for speed
    const local = localStorage.getItem('site_config');
    if (local) {
        inMemoryConfig = JSON.parse(local);
    } else {
        inMemoryConfig = DEFAULT_CONFIG;
    }

    // 2. If signed in, try to sync from Drive
    if (driveService.accessToken) {
        console.log("[Backend] Checking Drive for updates...");
        const driveData = await driveService.loadConfigFromDrive();
        if (driveData) {
            console.log("[Backend] Synced from Drive.");
            inMemoryConfig = driveData;
            // Update local cache
            localStorage.setItem('site_config', JSON.stringify(driveData));
        } else {
            console.log("[Backend] No config on Drive, uploading local...");
            await driveService.saveConfigToDrive(inMemoryConfig);
        }
    }

    return inMemoryConfig!;
}

export const getSiteConfig = (): SiteConfig => {
  if (!inMemoryConfig) {
    const stored = localStorage.getItem('site_config');
    inMemoryConfig = stored ? JSON.parse(stored) : DEFAULT_CONFIG;
  }
  return inMemoryConfig!;
};

export const saveSiteConfig = async (config: SiteConfig) => {
  inMemoryConfig = config;
  // 1. Save Local
  localStorage.setItem('site_config', JSON.stringify(config));
  
  // 2. Save to Drive (Async)
  if (driveService.accessToken) {
      await driveService.saveConfigToDrive(config);
  }
};

// --- FILE HANDLING ---

const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const uploadToDriveSimulation = async (handle: string, files: File[]): Promise<{ name: string, url: string, type: string }[]> => {
    setTimeout(() => console.log(`[Background Upload] Processing ${files.length} files for ${handle}...`), 0);
    
    const uploadedFiles: { name: string, url: string, type: string }[] = [];
    
    for (const file of files) {
        try {
            const dataUrl = await fileToDataURL(file);
            uploadedFiles.push({
                name: file.name,
                url: dataUrl,
                type: file.type
            });
        } catch (e) {
            console.error("File conversion failed", e);
        }
    }
    return uploadedFiles;
};

export const sendConfirmationEmail = async (email: string, name: string, type: 'casting' | 'sponsor' = 'casting'): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`[Email Service] 📨 Email successfully delivered to: ${email}`);
            console.log(`[Email Service] Subject: ${type === 'casting' ? 'Casting Confirmation' : 'Sponsorship Received'}`);
            resolve();
        }, 100); 
    });
};

export const saveSubmission = async (submission: Submission): Promise<void> => {
    setTimeout(() => {
        const existing = JSON.parse(localStorage.getItem('submissions') || '[]');
        existing.unshift(submission);
        
        // Storage Limit Protection (Local Storage is roughly 5MB)
        if (JSON.stringify(existing).length > 4500000) { 
            while(JSON.stringify(existing).length > 4000000) {
                existing.pop();
            }
        }
        
        localStorage.setItem('submissions', JSON.stringify(existing));
    }, 0);
};

export const getSubmissions = (): Submission[] => {
    return JSON.parse(localStorage.getItem('submissions') || '[]');
};
