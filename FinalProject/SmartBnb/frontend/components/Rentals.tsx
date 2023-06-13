import { Modal, Input, useNotification } from "@web3uikit/core";
import { useEffect, useState } from "react";
import { useNetwork, useSigner } from "wagmi";
import { getSmartBnbContract, LISTING_FEE } from "../assets/utils";
import { ethers } from "ethers";
import StayHere from "./StayHere";

function Rentals() {
  const { data: signer } = useSigner();
  const { chain, chains } = useNetwork();

  const [rentalsList, setRentalsList] = useState([
    {
      id: 0,
      name: "",
      city: "",
      lat: "",
      long: "",
      description: "",
      imgUrl: "",
      maxGuests: 0,
      pricePerDay: 0,
    },
  ]);

  useEffect(() => {
    async function getRentals() {
      // TODO get rentals from the contract
      const rentals = [
        {
          id: 0,
          name: "Apartment in China Town",
          city: "New York",
          lat: "40.716862",
          long: "-73.999005",
          description: "2 Beds • 2 Rooms • Wifi • Kitchen • Living Area",
          imgUrl: "QmYJ5gudjXz9kfbicexS4H7GVvY1ZGAWRUCaqS8sGawjo2",
          maxGuests: 3,
          pricePerDay: 0.001,
        },
        {
          id: 1,
          name: "Luxury Suite in Victorian House",
          city: "London",
          lat: "51.53568",
          long: "-0.20565",
          description: "1 Beds • 1 Rooms • Bathtub • Wifi",
          imgUrl: "Qmek4kfSzwX2iX9BkswMo2HHLwbQxZbdBTerbF9FSQPJzJ",
          maxGuests: 2,
          pricePerDay: 0.015,
        },
      ];
      console.log(rentals);

      setRentalsList(rentals);
    }

    getRentals();
  }, []);

  return (
    <>
      {rentalsList &&
        rentalsList.map((rental, i) => {
          return (
            <>
              {/* TODO build a card from the data*/}
              <div>
                {rental.name}
                {rental.city}
                {rental.description}
                {`https://ipfs.io/${rental.imgUrl}`}
                {rental.maxGuests}
                {rental.pricePerDay}
                <StayHere rental={rental} />
              </div>
            </>
          );
        })}
    </>
  );
}

export default Rentals;
