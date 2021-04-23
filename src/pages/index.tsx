import { GetStaticProps } from "next";
import Image from "next/image";
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { api } from "../services/api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import styles from './home.module.scss';

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


type HomeProps = {
  latestEpisodes: EspiodesFormated[],
  allEpisodes: EspiodesFormated[]
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  return (
   <div className={styles.homepage}>
     <section className={styles.latestEpisodes}> 
      <h2>Últimos lançamentos</h2>

      <ul>
        { latestEpisodes.map(episode => (
          <li key={episode.id}>

            <Image width={192} height={192} src={episode.thumbnail} alt={episode.title} objectFit="cover"/>

            <div className={styles.episodeDetails}>
              <a href="">{episode.title}</a>
              <p>{episode.members}</p>
              <span>{episode.publishedAt}</span>
              <span>{episode.durationAsString}</span>
            </div>

            <button>
              <img src="/play-green.svg" alt="Tocando"/>
            </button>
            
          </li>
        )) }
      </ul>
     </section>

     <section className={styles.allEpisodes}>

     </section>
   </div>
  )
}


export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get<EpisodesResponse[]>('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });


  const episodes = data.map(item => {
    return {
      ...item,
      publishedAt: format(parseISO(item.published_at), 'd MM yy', { locale: ptBR }),
      duration: Number(item.file.duration),
      durationAsString: convertDurationToTimeString(item.file.duration),
      url: item.file.url
    }
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);
 
  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8
  }
}