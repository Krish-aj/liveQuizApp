import { FaRegUser } from "react-icons/fa"

type props ={
    sno: number;
    name:string;
    points:number;
    image?:string;
}

function Card({sno, name, points, image}:props){
    return(
         <div className="flex justify-between items-center w-full max-w-96 bg-base/60 ring-1 ring-white/10 mb-4 rounded-xl text-white px-4">
    <div className="flex gap-4 my-5 w-5/12">
        <p className="text-white/50 font-display">{sno}.</p>
        <h3 className="font-medium text-white/90 truncate">{name}</h3>
    </div>
    <div>
        <p className="font-display font-bold tabular-nums text-white/80">{points}</p>
    </div>
    <div>
        <div className="bg-panel-2 p-1 rounded-full ring-1 ring-white/10">
            {image ? (
                <img
                    src={image}
                    alt={image}
                    className="w-8 h-8 rounded-full object-cover"
                />
            ) : (
                <FaRegUser className="text-white/60 text-3xl" />
            )}
        </div>
    </div>
</div>
    );
}

export default Card;
