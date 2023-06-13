import styles from "../styles/Home.module.css";
import PageBody from "../components/PageBody";
import AddRental from "../components/AddRental";
import { NotificationProvider } from "@web3uikit/core";

export default function Home() {
  return (
    <div>
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header_container}>
            <h1>Smart BnB</h1>
          </header>
          <div className={styles.buttons_container}>
            <PageBody></PageBody>
          </div>
          <div className={styles.footer}>Group 4</div>
        </div>
      </main>
      <NotificationProvider>
        <AddRental></AddRental>
      </NotificationProvider>
    </div>
  );
}
