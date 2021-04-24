import { Header } from '../components/Header'
import { Player } from '../components/Player';
import PlayerProvider from '../context/PlayerContext';
import styles from '../styles/app.module.scss';

import '../styles/global.scss'
import Contexts from '../utils/contexts';

function MyApp({ Component, pageProps }) {
  return (
   <Contexts components={[PlayerProvider]}>
      <div className={styles.wrapper}>
      <main>
        <Header/>
        <Component {...pageProps} />
      </main>
      <Player />
    </div>
   </Contexts>
  )
}

export default MyApp
