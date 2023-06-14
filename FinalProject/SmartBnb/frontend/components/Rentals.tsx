import { Modal, Input, useNotification } from "@web3uikit/core";
import { useEffect, useState } from "react";
import { useNetwork, useSigner } from "wagmi";
import { getSmartBnbContract, LISTING_FEE } from "../assets/utils";
import { ethers } from "ethers";
import StayHere from "./StayHere";
import { Card, Col, Grid, Row, Text } from "@nextui-org/react";

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
      <Grid.Container gap={2} justify="flex-start">
        {rentalsList &&
          rentalsList.map((rental, i) => {
            return (
              <>
                {/* TODO build a card from the data*/}
                <Grid xs={6} sm={3} key={i}>
                  <Card css={{ mw: "400px" }}>
                    <Card.Header>
                      <Col>
                        <Text b>{rental.name}</Text>
                        <br/>
                        <Text b>{rental.city}</Text>
                        <br/>
                        <Text b>{rental.description}</Text>
                      </Col>
                    </Card.Header>
                    <Card.Divider />
                    <Card.Body>
                      <Card.Image
                        src={`https://ipfs.io/ipfs/${rental.imgUrl}`}
                        objectFit="cover"
                        width="100%"
                        height={140}
                        alt={rental.name}
                      /> 
                    </Card.Body>
                    <Card.Divider />
                    <Card.Footer css={{ justifyItems: "flex-start" }}>
                      <Row wrap="wrap" justify="space-between" align="center">
                        <Text css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                          Maximum Guest: {rental.maxGuests}
                        </Text>
                        <Text css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                          Price: {rental.pricePerDay}
                        </Text>
                      </Row>
                      <StayHere rental={rental} />
                    </Card.Footer>
                  </Card>
                </Grid>
              </>
            );
          })}
        </Grid.Container>
    </>
  );
}

export default Rentals;
