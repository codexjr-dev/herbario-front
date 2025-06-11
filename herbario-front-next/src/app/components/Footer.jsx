import styles from './Footer.module.css';


export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>Desenvolvido por ORBE Design e Codex Jr.</p>
        <p>Apoio da Universidade Federal de Campina Grande (UFCG)</p>
      </div>
    </footer>
  );
}