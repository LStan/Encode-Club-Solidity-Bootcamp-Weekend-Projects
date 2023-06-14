import { useNotification } from "@web3uikit/core";
import { Modal, Input, Text, Button, Card } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNetwork, useSigner } from "wagmi";
import { getSmartBnbContract } from "../assets/utils";

function UserRentals() {
  const { data: signer } = useSigner();
  const { chain, chains } = useNetwork();
  const [isVisible, setVisible] = useState(false);
  const [userRentals, setUserRentals] = useState([]);
  const notify = useNotification();

  useEffect(() => {
    let walletAddress;
    (async () => {
      walletAddress = await signer.getAddress();
    })();
    async function fetchRentals() {
      try {
        const smartBnbContract = getSmartBnbContract(signer, chain);
        const filter = smartBnbContract.filters.NewBookAdded(walletAddress);
        console.log(filter);
        let events = await smartBnbContract.queryFilter(filter);
        console.log(events);
        // setUserRentals(events);
        let rentals = [];
        for (let event of events) {
          const imgUrl = `https://ipfs.io/ipfs/${event.args.imgUrl}`;
          const city = event.args.city;
          const startDate = new Date(event.args.bookDateStart * 1000);
          const endDate = new Date(event.args.bookDateEnd * 1000);
          const numDays = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          // console.log(numDays);
          const start = startDate.toJSON().slice(0, 10);
          rentals.push({ imgUrl, city, start, numDays });
        }
        setUserRentals(rentals);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRentals();
  }, [isVisible]);

  return (
    <>
      {/* TODO add style */}
      <Button color="error" auto ghost onPress={() => setVisible(true)}>
        Your Stays
      </Button>
      {/* <button onClick={() => setVisible(true)}>Stay Here</button> */}

      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={isVisible}
        width="700px"
        onClose={() => setVisible(false)}
      >
        <Modal.Header>
          <Text id="modal-title" b size={18}>
            Your Stays
          </Text>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {userRentals &&
              userRentals.map((rental, index) => {
                return (
                  <div style={{ width: "200px" }} key={index}>
                    <Card
                    // isDisabled
                    // title={e.attributes.city}
                    // description={`${e.attributes.datesBooked[0]} for ${e.attributes.datesBooked.length} Days`}
                    >
                      <div>
                        <img width="180px" src={rental.imgUrl} />
                      </div>
                      <div>
                        {rental.city}
                      </div>
                      <div>
                        {`${rental.start} for ${rental.numDays} days`}
                      </div>
                    </Card>
                  </div>
                );
              })}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default UserRentals;