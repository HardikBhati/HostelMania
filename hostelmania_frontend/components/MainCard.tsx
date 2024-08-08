import React, { useState } from "react";
import Image from "next/image";
import { response } from "../type/res";
import classes from "./main.module.scss";
import Button from "@mui/material/Button";
import { deleteHostel } from "../pages/api/hostels";
import { useRouter } from "next/router";
import Cookie from "js-cookie";

const MainCard: React.FC<response> = (props) => {
  const [show, setShow] = useState<boolean>(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const token = Cookie.get("jwt"); // Retrieve the token from cookies
      if (!token) {
        console.log("Token not found");
        return;
      }
      console.log("delete id", props._id, "token", token);
      await deleteHostel(props._id, token);
      router.push("/hostels"); // Adjust the path as necessary
    } catch (error) {
      console.error("Failed to delete the hostel.", error);
    }
  };

  return (
    <div className={classes.body}>
      <div className={classes.box}>
        <div className={classes.info}>
          <div className={classes.box_sub}>
            <h2>Posted by {props.author.username}</h2>
          </div>
          <p className={classes.description}>{props.description}</p>
          {/* <div className={classes.price}>${props.price}</div> */}
          <Button className={classes.deletebtn} variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </div>
        <div className={classes.img}>
          <Image
            src={props.image}
            width={400}
            height={400}
            key={props._id}
            alt={props.name}
            className={classes.img}
          />
        </div>
      </div>
    </div>
  );
};

export default MainCard;
