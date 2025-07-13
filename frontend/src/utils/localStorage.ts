import {RecentProfile} from "../common/model.ts";

const STORAGE_KEY = 'recentProfiles';

export function saveRecentProfile(profile: RecentProfile) {
    const MAX_RECENTS = 5;
    const existing = localStorage.getItem(STORAGE_KEY);
    let recents: RecentProfile[] = existing ? JSON.parse(existing) : [];

    recents = recents.filter(p => p.id !== profile.id);
    recents.unshift(profile);
    recents = recents.slice(0, MAX_RECENTS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(recents));
}

export function getRecentProfiles(): RecentProfile[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

export function clearRecentProfiles(): void {
    localStorage.removeItem(STORAGE_KEY);
}