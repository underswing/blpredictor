import {useProfileStore} from "../store/profileStore.ts";
import {useNavigate} from "react-router-dom";
import s from "./TableView.module.css";
import {useEffect, useRef, useState} from "react";
import {IoMdGlobe} from "react-icons/io";
import {useMapStore} from "../store/mapStore.ts";
import TableRow from "./TableRow.tsx";
import {fetchRankedMaps} from "../services/api-backend.ts";
import {getPotentialPP} from "../common/ppUtil.ts";
import {IBLRankedMap} from "../common/model.ts";
import {useScoreStore} from "../store/scoreStore.ts";

const TableView = () => {
    const {profile} = useProfileStore();
    const navigate = useNavigate();
    const {maps, metadata} = useMapStore();
    const {scores} = useScoreStore();
    const unplayedScrollDiv = useRef<HTMLDivElement>(null);
    const [mapPage, setMapPage] = useState(1);
    const [mapsLoading, setMapsLoading] = useState(false);
    const [fixedAcc] = useState(0.94);
    const [sortedMaps, setSortedMaps] = useState<IBLRankedMap[]>([]);

    useEffect(() => {
        if(!profile) return;

        const simplified = scores.map(s => s.score.pp);
        maps.forEach(m => {
            m.ppInfo = getPotentialPP(fixedAcc, m.difficulty.passRating, m.difficulty.accRating, m.difficulty.techRating);
        });
        const sortedMaps = maps.sort((m1, m2) => m2.ppInfo.totalPP - m1.ppInfo.totalPP);
        sortedMaps.forEach((m => {
            //scenario if score was in playerscores
            const ppBefore = profile.pp;
            let ppAfter = 0;
            const scenario = [...simplified, m.ppInfo.totalPP].sort((a, b) => b - a);
            scenario.forEach(((s, i) => {
                ppAfter += s * Math.pow(0.965, i)
            }));
            const index = simplified.findIndex(existingPP => existingPP <= m.ppInfo.totalPP);
            const calculatedIndex = index === -1 ? simplified.length : index;
            m.potentialWeighted = m.ppInfo.totalPP * Math.pow(0.965, calculatedIndex);
            m.potentialWeightedChange = ppAfter - ppBefore;
        }));
        setSortedMaps(sortedMaps);
    }, [fixedAcc, maps, profile, scores]);

    const handleScroll = async () => {
        const sd = unplayedScrollDiv.current;
        if(!sd || mapsLoading || !metadata) return;
        const isAtBottom = sd.scrollHeight - sd.offsetHeight <= sd.scrollTop + 30;
        const hasMore = (metadata.page - 1) * 32 < metadata.total;
        if(isAtBottom && hasMore) {
            setMapsLoading(true);
            await fetchRankedMaps(false, mapPage + 1);
            setMapPage((prev) => prev + 1);
            setMapsLoading(false);
        }
    }

    useEffect(() => {
        if (!(profile)) {
            navigate("/");
            return;
        }
    }, [navigate, profile]);

    if (!(profile)) {
        return <></>;
    }

    return (
        <div>
            <div id={s.navContainer}>
                <button onClick={() => navigate("/")}>Back</button>
            </div>
            <div id={s.profileContainer}>
                <div className={s.profileCard}>
                    <img src={profile.avatar} alt={"avatar"} className={s.avatar}/>
                    <div className={s.profileStats}>
                        <h2>{profile.name}</h2>
                        <p>{profile.pp.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}<span>pp</span></p>
                        <div className={s.statsRow}>
                            <p><IoMdGlobe/><span>#</span>{profile.rank.toLocaleString()}</p>
                            <span>-</span>
                            <p><img src={`https://beatleader.xyz/assets/flags/${profile.country.toLowerCase()}.png`}
                                    alt={"Local: "}/><span>#</span>{profile.countryRank}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div id={s.tableView}>
                <div id={s.notPlayed} onScroll={handleScroll} ref={unplayedScrollDiv}>
                    {sortedMaps.map(((m, i) => <TableRow acc={0.94} key={i} map={m} index={i}/>))}
                </div>
            </div>
        </div>
    );
};

export default TableView;