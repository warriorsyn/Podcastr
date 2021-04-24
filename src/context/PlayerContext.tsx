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
    isPlaying: boolean;
    play: (episode: any) => void;
    tooglePlay: () => void;
    setPlayingState: (state: boolean) => void;
}

export const playerContext = createContext({} as PlayerContextData);

export default function PlayerProvider({ children }) {

    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    function play(episode: any) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function tooglePlay() {
        setIsPlaying(!isPlaying);
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state)
    }

    return (
        <playerContext.Provider value={{ episodeList, currentEpisodeIndex, play, isPlaying, tooglePlay, setPlayingState }}>
            {children}
        </playerContext.Provider>
    ) 
}

