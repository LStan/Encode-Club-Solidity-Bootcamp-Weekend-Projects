import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../../styles/Navbar.module.css";
export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <img className={styles.smartbnb_logo} src="/smartbnb-logo.svg"></img>
      <ConnectButton />
    </nav>
  );
}
