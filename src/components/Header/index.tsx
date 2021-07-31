/* eslint-disable @next/next/link-passhref */
import Link from 'next/link';
import styles from './styles.module.scss';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <img src="./images/logo.svg" alt="Logo Meu Board" />
        </Link>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/board" >
            <a>Meu board</a>
          </Link>
        </nav>
        <button>Entrar com o github</button>
      </div>
    </header>
  );
}