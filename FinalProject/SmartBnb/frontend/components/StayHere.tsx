import { Modal, useNotification } from "@web3uikit/core";
import { useState } from "react";
import { useNetwork, useSigner } from "wagmi";
import { getSmartBnbContract } from "../assets/utils";
import { ethers } from "ethers";

function StayHere({ rental }) {
  const [isVisible, setVisible] = useState(false);
  const notify = useNotification();

  // TODO some useStates for dates

  const { data: signer } = useSigner();
  const { chain, chains } = useNetwork();

  const book = async () => {
    try {
      notify({
        type: "info",
        title: "Trying to book...",
        position: "topL",
      });

      // TODO smartBnbContract.bookDates with rental.id and value rental.pricePerDay * numDays

      console.log("OK");
      notify({
        type: "success",
        message: `You are going to ${rental.city}!`,
        title: "Booking Succesful",
        position: "topL",
      });
    } catch (error) {
      console.log(error);
      notify({
        type: "error",
        message: `${error.reason}`,
        title: "Booking Failed",
        position: "topL",
      });
    }
  };

  return (
    <>
      {/* TODO add style */}
      <button onClick={() => setVisible(true)}>Stay Here</button>

      <Modal
        onCloseButtonPressed={() => setVisible(false)}
        hasCancel={false}
        title="Choose dates"
        isVisible={isVisible}
        okButtonColor="red"
        okText="Rent"
        width="400px"
        onOk={book}
      >
        {/* TODO add DatePickers */}
      </Modal>
    </>
  );
}

export default StayHere;
