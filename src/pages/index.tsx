import { GetStaticProps } from "next";
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { api } from "../services/api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

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
  episodes: EspiodesFormated[]
}

export default function Home(props: HomeProps) {
  return (
   <div>
     <h1>Index</h1>
    <p>{JSON.stringify(props.episodes)}</p>
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

  console.log(episodes)
 

 
  return {
    props: {
      episodes
    },
    revalidate: 60 * 60 * 8
  }
}