import {IPlayerResponseFull} from "../common/model.ts";
import {create} from "zustand/react";

type ProfileStoreType =  {
    profile?: IPlayerResponseFull;
    setProfile: (profile?: IPlayerResponseFull) => void;
}

export const useProfileStore = create<ProfileStoreType>((set) => ({
    profile: undefined,
    setProfile: (profile) => set({profile})
}))