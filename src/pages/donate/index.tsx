import Head from 'next/head'
import styles from './styles.module.scss'

export default function Donate() {
  return (
    <>
    <Head>
      <title>Ajude a plataforma board ficar online!</title>
    </Head>
    <main className={styles.container}>
      <img src="/images/rocket.svg" alt="Seja apoiado" />

      <div className={styles.vip}>
        <img src="https://avatars.githubusercontent.com/u/47211806?v=4" alt="Imagem do Apoiador" />
        <span>Parabéns coê é um novo apoiador</span>
      </div>

      <h1>Seja um apoiador deste projeto 🏆</h1>
      <h3>Contribua com apenas <span>R$ 1,00</span></h3>
      <strong>Apareça em nossa home, tenha funcionalidades exclusivas.</strong>
     
      </main>
    </>
  );
}