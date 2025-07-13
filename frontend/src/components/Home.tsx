import s from "./Home.module.css";
import {FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {fetchPlayerScores, fetchProfile, fetchRankedMaps} from "../services/api-backend.ts";
import RecentProfiles from "./RecentProfiles.tsx";

const Home = () => {
    const [profileID, setProfileID] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [tooltip, setTooltip] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await handleSearch(profileID);
    }

    const handleSearch = async (id: string) => {
        if(loading) return;
        id = id.trim();
        if(!id) {
            setError("Please enter your profile ID!");
            return;
        }

        if(!/^\d+$/.test(id)) {
            setError("ID must be valid! (e.g. 76561198355956083)");
            return;
        }

        setLoading(true);
        setError("");
        setTooltip("Fetching BL Profile Data...");
        const profile = await fetchProfile(id);
        if(profile.error || profile.player === undefined) {
            setError(profile.error);
            setLoading(false);
            setTooltip("");
            return;
        }

        setTooltip("Fetching BL Ranked Maps...");
        const mapErr = await fetchRankedMaps(true);
        if(mapErr) {
            setError(mapErr);
            setLoading(false);
            setTooltip("");
            return;
        }

        for(let i = 0; i * 100 < profile.player.scoreStats.rankedPlayCount; i++) {
            setTooltip(`Fetching Played Maps (${i + 1}/${Math.floor(profile.player.scoreStats.rankedPlayCount / 100) + 1})`);
            const scoreErr = await fetchPlayerScores(id, i + 1, i === 0);
            if(scoreErr) {
                setError(scoreErr);
                setLoading(false);
                setTooltip("");
                return;
            }
        }

        navigate("/table");
        toast.success("Finished loading BeatLeader data!");
    }

    return (
        <div id={s.mainContainer}>
            <div id={s.main}>
                <div className={s.title}>
                    <h1>Giv BeatLeader Data</h1>
                    <img src="/src/assets/car.png" alt={"car"}/>
                </div>
                <form id={s.controlWrapper} onSubmit={handleSubmit}>
                    <div id={s.inputWrapper}>
                        <input
                            disabled={loading}
                            value={profileID}
                            onChange={v => setProfileID(v.target.value)}
                            className={`${s.blid} ${error ? s.error : ""}`}
                            placeholder={"BeatLeader Profile ID"}
                            autoFocus={true}
                        />
                        {error && <p className={s.errorMessage}>{error}</p>}
                        {tooltip && <p className={s.tooltip}>{tooltip}</p>}
                    </div>
                    <button type={"submit"} disabled={loading || !profileID} className={s.go}>SEARCH</button>
                </form>
            </div>
            <RecentProfiles onClick={handleSearch}/>
        </div>
    );
};

export default Home;