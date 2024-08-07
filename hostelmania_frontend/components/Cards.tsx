import React from "react";
import styles from "./card.module.scss";
import Image from "next/image";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { response } from "../type/res";
const Cards: React.FC<response> = (props) => {
  const el = props;

  const router = useRouter();
  return (
    <div className={styles.box} key={el._id}>
      <Image
        src={el.image}
        width={300}
        height={450}
        key={el._id}
        alt={el.name}
        className={styles.img}
      />
      <div className={styles.box_sub}>
        <h2>{el.name}</h2>
        <h2>${el.price}</h2>
      </div>
      <div className={styles.info}>
        <Button
          variant="contained"
          onClick={() => router.push(`/hostels/${el._id}`)}
        >
          View Hostel
        </Button>
      </div>
    </div>
  );
};

export default Cards;
