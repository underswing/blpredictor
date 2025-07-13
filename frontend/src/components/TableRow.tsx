import s from "./TableView.module.css";
import {IBLRankedMap} from "../common/model.ts";
import {PiClock, PiMetronomeFill, PiStar} from "react-icons/pi";

interface props {
    map: IBLRankedMap,
    index: number,
    acc: number
}

const TableRow = (p: props) => {
    return (
        <div className={s.tableRow}>
            <div className={s.rowLeft}>
                <img src={p.map.song.coverImage} alt={"cover"}/>
                <div className={s.rowSubInfo}>
                    <p>{p.index + 1}. {p.map.song.name} <span>-</span> {p.map.song.author}</p>
                    <p>{p.map.song.mapper}</p>
                    <p>{p.map.difficulty.difficultyName}</p>
                </div>
            </div>
            <div className={s.rowMiddle}>
                <p>Potential</p>
                <p>{(p.acc * 100).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}<span>%</span></p>
                <div>
                    <p>{p.map.ppInfo.totalPP.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}<span>pp</span></p>
                    <p><span>(+</span>{p.map.potentialWeightedChange.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}<span>)</span></p>
                </div>
            </div>
            <div className={s.rowRight}>
                <p><PiStar/>{p.map.difficulty.stars.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                })}</p>
                <p>
                    <PiClock/>{Math.floor(p.map.song.duration / 60)}:{(p.map.song.duration % 60).toLocaleString("en-US", {
                    minimumIntegerDigits: 2,
                    useGrouping: false
                })}</p>
                <p><PiMetronomeFill/>{p.map.song.bpm.toLocaleString("en-US", {
                    maximumFractionDigits: 2
                })}</p>
            </div>
        </div>
    );
};

export default TableRow;