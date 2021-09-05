import firebase from '../services/firebaseConnection';
import { GetStaticProps } from 'next'
import Head from 'next/head'
import styles from '../styles/styles.module.scss'
import { useState } from 'react';

type Data = {
  id: string;
  lastDonate: Date;
  image: string;
  donate: boolean
}

interface HomeProps {
  data: string;
}

export default function Home({ data }: HomeProps) {
  const [donaters, setDonaters] = useState<Data[]>(JSON.parse(data));

  return (
    <>
      <Head>
        <title>Board - Organizando suas tarefas</title>
      </Head>
      <main className={styles.contentContainer}>
        <img src="/images/board-user.svg" alt="Ferramenta board" />

        <section className={styles.callToAction}>
          <h1>Uma ferramenta para seu dia a dia... Escreva, planeja e organize-se!</h1>
          <p>
            <span>100% Gratuito</span> e online
          </p>
        </section>
        {donaters.length !== 0 && <h3>Apoiadores: </h3>}
        <div className={styles.donaters}>
          {donaters.map(item => (
            <img
              key={item.image}
              src={item.image}
              alt="Usuario 1" />
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const donaters = await firebase.firestore().collection('users').get();

  const data = JSON.stringify(donaters.docs.map(donater => {
    return {
      id: donater.id,
      ...donater.data(),
    }
  }));

  return {
    props: {
      data,
    },
    revalidate: 60 * 60 // atualiza a cada 1h
  }
}
