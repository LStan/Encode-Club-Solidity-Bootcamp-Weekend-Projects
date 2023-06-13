import styles from "../styles/Home.module.css";
import PageBody from "../components/PageBody";
import AddRental from "../components/AddRental";
import Rentals from "../components/Rentals";

export default function Home() {
  return (
    <div>
      <Rentals />
      <AddRental />
    </div>
  );
}
