import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import styles from './Layout.module.css';

export default function Layout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main} id="main-content" role="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}