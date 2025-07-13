import axios from "axios";
import {IPlayerResponseFull, IRankedMapsResponse, IScoresResponse} from "../common/model.ts";
import apiClient from "./api-client.ts";
import {useProfileStore} from "../store/profileStore.ts";
import {useMapStore} from "../store/mapStore.ts";
import {useScoreStore} from "../store/scoreStore.ts";
import {saveRecentProfile} from "../utils/localStorage.ts";

export async function fetchProfile(id: string): Promise<{player?: IPlayerResponseFull, error: string}> {
    const {setProfile} = useProfileStore.getState();
    setProfile(undefined);
    try {
        const req = await apiClient.get<{player?: IPlayerResponseFull, error?: string}>(`/profile/${id}`);
        const profile = req.data;
        setProfile(profile.player);
        if(profile.player) {
            saveRecentProfile({id: profile.player.id, pfpUrl: profile.player.avatar, username: profile.player.name, rank: profile.player.rank});
        }
        return {error: "", player: profile.player};
    } catch(error) {
        console.error(error);
        let msg;
        if(axios.isAxiosError(error)) {
            msg = error.code === "ERR_NETWORK" ? "Can't reach backend server!" : "Unknown backend error!";
            if(error.status === 404) msg = "User not found!";
        } else {
            msg = "An unexpected error occured.";
        }
        return {error: msg, player: undefined};
    }
}

export async function fetchRankedMaps(initial: boolean, page: number = 1) {
    const {setMaps, setMetadata, maps} = useMapStore.getState();
    try {
        const req = await apiClient.get<IRankedMapsResponse>(`/ranked?page=${page}&count=32`);
        const data = req.data.data;
        if(initial) setMaps(data?.maps ?? []);
        else setMaps([...maps, ...(data?.maps ?? [])]);
        setMetadata(data?.metadata);
        return "";
    } catch(error) {
        console.error(error);
        setMaps([]);
        setMetadata(undefined);
        let msg;
        if(axios.isAxiosError(error)) {
            msg = error.code === "ERR_NETWORK" ? "Can't reach backend server!" : "Unknown backend error!";
            if(error.status === 500) msg = "Internal Server Error! Please contact underswing on discord!";
        } else {
            msg = "An unexpected error occured.";
        }
        return msg;
    }
}

export async function fetchPlayerScores(id: string, page: number, initial: boolean) {
    const {setScores, setMetadata, scores} = useScoreStore.getState();
    try {
        const req = await apiClient.get<IScoresResponse>(`/scores/${id}?page=${page}`);
        const data = req.data.data;
        if(initial) setScores(data.data);
        else setScores([...scores, ...(data.data)]);
        setMetadata(data.metadata);
        return "";
    } catch(error) {
        console.error(error);
        let msg;
        if(axios.isAxiosError(error)) {
            msg = error.code === "ERR_NETWORK" ? "Can't reach backend server!" : "Unknown backend error!";
            if(error.status === 500) msg = "Internal Server Error! Please contact underswing on discord!";
        } else {
            msg = "An unexpected error occured.";
        }
        return msg;
    }
}