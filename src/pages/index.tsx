import { GetStaticProps } from "next";
import Image from "next/image";
import Link from 'next/link';

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { api } from "../services/api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import styles from './home.module.scss';
import { useContext } from "react";
import { playerContext } from "../context/PlayerContext";

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

interface EpisodesFormated {
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
  latestEpisodes: EpisodesFormated[],
  allEpisodes: EpisodesFormated[]
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { play } = useContext(playerContext);

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
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode => (
              <tr key={episode.id}>
                <td>
                  <Image width={120} height={120} src={episode.thumbnail} alt={episode.title} objectFit="cover" />
                </td>

                <td>
                  <Link href={`/episodes/${episode.id}`}>
                    <a href="">{episode.title}</a>
                  </Link>
                
                </td>
                <td>{episode.members}</td>
                <td style={{ width: 100 }}>{episode.publishedAt}</td>
                <td>{episode.durationAsString}</td>
                <td>
                  <button onClick={() => play(episode)}>
                    <img src="/play-green.svg" alt="Tocar episódio"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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