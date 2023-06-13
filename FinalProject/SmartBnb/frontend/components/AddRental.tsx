import { Modal, Input, useNotification } from "@web3uikit/core";
import { useState } from "react";
import styles from "../styles/AddRental.module.css";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { useNetwork, useSigner } from "wagmi";
import { getSmartBnbContract, LISTING_FEE } from "../assets/utils";
import { ethers } from "ethers";

function AddRental() {
  const [isVisible, setVisible] = useState(false);
  const notify = useNotification();

  const storage = new ThirdwebStorage();

  const [formInput, setFormInput] = useState({
    name: "",
    city: "",
    lat: "",
    long: "",
    description: "",
    imageUrl: null,
    maxGuests: 0,
    pricePerDay: 0,
  });


  const { data: signer } = useSigner();
  const { chain, chains } = useNetwork();

    const addRental = async () => {
    console.log(formInput);

    try {
      notify({
        type: "info",
        title: "Trying to book...",
        position: "topL",
      });
      const uploadUrl = await storage.upload(formInput.imageUrl, {
        uploadWithoutDirectory: true,
      });
      console.log(uploadUrl);
      const cid = uploadUrl.slice(7); // remove "ipfs://"

      const smartBnbContract = getSmartBnbContract(signer, chain);

      const tx = await smartBnbContract.addRental(
        formInput.name,
        formInput.city,
        formInput.lat,
        formInput.long,
        formInput.description,
        cid,
        formInput.maxGuests,
        ethers.utils.parseEther(formInput.pricePerDay.toFixed(18)),
        {
          value: ethers.utils.parseEther(LISTING_FEE.toFixed(18)),
        }
      );
      await tx.wait();
      console.log("OK");
      notify({
        type: "success",
        message: `You are going to ${formInput.city}!`,
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
      <div className={styles.floating_btn} onClick={() => setVisible(true)}>
        Add rental
      </div>

      <Modal
        onCloseButtonPressed={() => setVisible(false)}
        hasCancel={false}
        title="Add Your Rental"
        isVisible={isVisible}
        okButtonColor="red"
        okText="Add"
        width="700px"
        onOk={addRental}
      >
        <div
          style={{
            padding: "10px 0 10px 0",
          }}
        >
          <Input
            placeholder="Enter rental title"
            name="Property name"
            label="Property name"
            width="100%"
            type="text"
            onChange={(e) =>
              setFormInput({ ...formInput, name: e.target.value })
            }
          />
        </div>
        <div
          style={{
            padding: "10px 0 10px 0",
          }}
        >
          <Input
            placeholder="Enter your property city"
            name="Property city"
            label="Property city"
            width="100%"
            type="text"
            onChange={(e) =>
              setFormInput({ ...formInput, city: e.target.value })
            }
          />
        </div>
        <div
          style={{
            padding: "10px 0 10px 0",
          }}
        >
          <Input
            placeholder="Enter latitude"
            name="Property Latitude"
            label="Property Latitude"
            width="100%"
            type="text"
            onChange={(e) =>
              setFormInput({ ...formInput, lat: e.target.value })
            }
          />
        </div>
        <div
          style={{
            padding: "10px 0 10px 0",
          }}
        >
          <Input
            placeholder="Enter longitude"
            name="Property Longitude"
            label="Property Longitude"
            width="100%"
            type="text"
            onChange={(e) =>
              setFormInput({ ...formInput, long: e.target.value })
            }
          />
        </div>
        <div
          style={{
            padding: "10px 0 10px 0",
          }}
        >
          <Input
            placeholder="Enter a description of the place"
            name="Property Description"
            label="Property Description"
            width="100%"
            type="text"
            onChange={(e) =>
              setFormInput({ ...formInput, description: e.target.value })
            }
          />
        </div>
        <div
          style={{
            padding: "10px 0 10px 0",
          }}
        >
          <Input
            placeholder="Enter maximum number of guest"
            name="Max number of guests"
            label="Max number of guests"
            width="100%"
            type="number"
            validation={{ numberMin: 1 }}
            value={1}
            onChange={(e) =>
              setFormInput({ ...formInput, maxGuests: Number(e.target.value) })
            }
          />
        </div>
        <div
          style={{
            padding: "10px 0 10px 0",
          }}
        >
          <Input
            placeholder="Enter rent price per day"
            name="Price per day"
            label="Price per day"
            width="100%"
            type="text"
            onChange={(e) =>
              setFormInput({
                ...formInput,
                pricePerDay: Number(e.target.value),
              })
            }
          />
        </div>
        <input
          type="file"
          title="Chooser"
          onChange={(e) => {
            if (e.target.files) {
              setFormInput({ ...formInput, imageUrl: e.target.files[0] });
            }
          }}
        />
      </Modal>
    </>
  );
}

export default AddRental;
