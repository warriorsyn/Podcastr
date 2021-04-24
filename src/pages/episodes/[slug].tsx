import { GetStaticPaths, GetStaticProps } from "next"
import Image from 'next/image';
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";


import { api } from "../../services/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import styles from './episode.module.scss';

interface File {
    url: string;
    type: string;
    duration: number;
}
  
interface EpisodesResponse {
    id: string;
    title: string;
    members: string;
    published_at: string;
    thumbnail: string;
    description: string;
    file: File;
}
  
interface EspiodesFormated {
    id: string;
    title: string;
    members: string;
    publishedAt: string;
    thumbnail: string;
    description: string;
    file: File;
    duration: number;
    durationAsString: string;
    url: string;
}
  
type EpisodeProps = {
    episode: EspiodesFormated
}

export default function Episode({ episode }: EpisodeProps) {
    return (
       <div className={styles.episode}>
           <div className={styles.thumbnailContainer}>
               <button type="button">
                   <img src="/arrow-left.svg" alt="Voltar"/>
               </button>

               <Image width={700} height={160} src={episode.thumbnail} alt="Thumbnail" objectFit="cover"/>
                <button>
                    <img src="/play.svg" alt="Tocar episódio"/>
                </button>
           </div>

           <header>
               <h1>{episode.title}</h1>
               <span>{episode.members}</span>
               <span>{episode.publishedAt}</span>
               <span>{episode.durationAsString}</span>
           </header>

           <div className={styles.description}  dangerouslySetInnerHTML={{ __html: episode.description }} />
       </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}
export const getStaticProps: GetStaticProps = async (context) => {
    const { slug } = context.params;

    const { data } = await api.get<EpisodesResponse>(`/episodes/${slug}`);

    const episode =  {
        ...data,
        publishedAt: format(parseISO(data.published_at), 'd MM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(data.file.duration),
        url: data.file.url
      }
    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24 // 24 hours
    }
}