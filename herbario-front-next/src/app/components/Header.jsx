import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
  
      <nav className={styles.nav}>
        <a href="/herbario" className={styles.navLink}>Herbário</a>
        <a href="/projeto" className={styles.navLink}>Projeto</a>
        <a href="/parceiros" className={styles.navLink}>Parceiros</a>
        <a href="/sites" className={styles.navLink}>Sites de apoio</a>
      </nav>
      
    </header>
  );
}