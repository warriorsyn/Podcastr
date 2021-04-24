import { createContext, useState } from "react";

interface Episode {
    title: string;
    members: string;
    thumbnail: string;
    duration: string;
    url: string;
}

type PlayerContextData = {
    episodeList: Array<Episode>;
    currentEpisodeIndex: number;
    play: (episode: any) => void;
}

export const playerContext = createContext({} as PlayerContextData);

export default function PlayerProvider({ children }) {

    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);

    function play(episode: any) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
    }

    return (
        <playerContext.Provider value={{ episodeList, currentEpisodeIndex, play}}>
            {children}
        </playerContext.Provider>
    ) 
}

