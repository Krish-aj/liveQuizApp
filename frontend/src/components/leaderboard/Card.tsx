import type { } from "react"

type props = {
    sno: number;
    name: string;
    points: number;
}

function Card({ sno, name, points }: props) {
    return (
        <div className="flex justify-between items-center w-full max-w-96 bg-base/60 ring-1 ring-white/10 mb-4 rounded-xl text-white px-4">
            <div className="flex gap-4 my-5 w-5/12">
                <p className="text-white/50 font-display">{sno}.</p>
                <h3 className="font-medium text-white/90 truncate">{name}</h3>
            </div>
            <div>
                <p className="font-display font-bold tabular-nums text-white/80">{points}</p>
            </div>
        </div>
    );
}

export default Card;