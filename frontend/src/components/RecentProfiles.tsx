import {useEffect, useState} from "react";
import {RecentProfile} from "../common/model.ts";
import {clearRecentProfiles, getRecentProfiles} from "../utils/localStorage.ts";
import s from "./Home.module.css";

interface props {
    onClick: (id: string) => void;
}

const RecentProfiles = (props: props) => {
    const [recents, setRecents] = useState<RecentProfile[]>([]);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = () => {
        setRecents(getRecentProfiles());
    }

    const clearProfiles = () => {
        clearRecentProfiles();
        fetchProfiles();
    }

    if(recents.length === 0) return null;

    return (
        <div id={s.bottomRight}>
            <div className={s.historyTitle}>
                <p>Recently Viewed</p>
                <button onClick={() => clearProfiles()}>Clear</button>
            </div>
            <div>
                {recents.map(p => {
                    return <div onClick={() => props.onClick(p.id)} key={p.id} className={s.profile}>
                        <img src={p.pfpUrl} alt={p.username}/>
                        <p><span style={{color: "rgb(159,159,159)"}}>#{p.rank.toLocaleString()}</span> {p.username}</p>
                    </div>
                })}
            </div>
        </div>
    );
};

export default RecentProfiles;