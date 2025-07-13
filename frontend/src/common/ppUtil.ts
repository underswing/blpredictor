import {IPPInfo} from "./model.ts";

const pointList2 = [
    [1.0, 7.424], [0.999, 6.241], [0.9975, 5.158], [0.995, 4.01],
    [0.9925, 3.241], [0.99, 2.7], [0.9875, 2.303], [0.985, 2.007],
    [0.9825, 1.786], [0.98, 1.618], [0.9775, 1.49], [0.975, 1.392],
    [0.9725, 1.315], [0.97, 1.256], [0.965, 1.167], [0.96, 1.094],
    [0.955, 1.039], [0.95, 1.0], [0.94, 0.931], [0.93, 0.867],
    [0.92, 0.813], [0.91, 0.768], [0.9, 0.729], [0.875, 0.65],
    [0.85, 0.581], [0.825, 0.522], [0.8, 0.473], [0.75, 0.404],
    [0.7, 0.345], [0.65, 0.296], [0.6, 0.256], [0.0, 0.0]
];

const Curve2 = (acc: number) => {
    let i = 0;
    while (i < pointList2.length && pointList2[i][0] > acc) {
        i++;
    }

    if (i === 0) return pointList2[0][1];
    if (i === pointList2.length) return pointList2[pointList2.length - 1][1];

    const [x1, y1] = pointList2[i - 1];
    const [x2, y2] = pointList2[i];
    const t = (acc - x1) / (x2 - x1);
    return y1 + t * (y2 - y1);
};

const Inflate = (pp: number) => (650 * Math.pow(pp, 1.3)) / Math.pow(650, 1.3);

export const getPotentialPP = (accuracy: number, passRating: number, accRating: number, techRating: number): IPPInfo => {
    let passPP = 15.2 * Math.exp(Math.pow(passRating, 1 / 2.62)) - 30;
    if (!isFinite(passPP) || passPP < 0) passPP = 0;

    const accPP = Curve2(accuracy) * accRating * 34;
    const techPP = Math.exp(1.9 * accuracy) * 1.08 * techRating;

    const totalPP = Inflate(passPP + accPP + techPP);
    const inflation = totalPP / (passPP + accPP + techPP);

    return {
        totalPP,
        passPP: passPP * inflation,
        accPP: accPP * inflation,
        techPP: techPP * inflation
    };
};