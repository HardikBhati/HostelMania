import React, { useRef, useState, useContext, useEffect } from "react";
import TextField from "@mui/material/TextField";
import classes from "../../styles/new.module.scss";
import Link from "next/link";
import Head from "next/head";
import axios from "axios";
import Alert from "../../modals/alerts/Alert";
import { notifyMessage } from "../../helper/toast";
import { useRouter } from "next/router";
import AuthContext from "../../context/authContext";
import Cookie from "js-cookie";
import { createHostel } from "../api/hostels";

interface ress {
  title: string;
  description: string;
  location: string;
  image: string;
  price: number;
  reviews: string[];
  __id: string;
}

interface result {
  ok: boolean;
  res: ress;
}

const Index = () => {
  const { auth, removeAuth } = useContext(AuthContext);
  const [err, seteErr] = useState<boolean>(false);
  const title = useRef<HTMLInputElement>(null);
  const location = useRef<HTMLInputElement>(null);
  const imgUrl = useRef<HTMLInputElement>(null);
  const price = useRef<HTMLInputElement>(null);
  const dsc = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      removeAuth();
    }
  }, [auth]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      title.current &&
      imgUrl.current &&
      price.current &&
      dsc.current
    ) {
      const tit = title.current.value;
      const img = imgUrl.current.value;
      const dscs = dsc.current.value;
      const pr = price.current.value;

      if (
        tit.length <= 0 ||
        img.length <= 0 ||
        dscs.length <= 0 ||
        pr.length <= 0
      ) {
        alert("Please enter all input");
      } else {
        const dt = {
          name: tit,
          description: dscs,
          image_url: img,
          price: pr,
        };

        const sendData = async () => {
          try {
            const token = Cookie.get("jwt"); // Get the JWT token from cookies
            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_API}/hostels/`,
              dt,
              {
                headers: {
                  Authorization: `Bearer ${token}` // Add the token to the headers
                }
              }
            );
            // const res = await createHostel(dt, token)
            if (res.status>201) {
              seteErr(true);
              throw new Error("Could not add the hostel. Something went wrong.");
            }

            notifyMessage("New camp was added successfully");
            router.push("/hostels"); // Redirect after successful addition
          } catch (e) {
            notifyMessage(e.message || "An error occurred");
          }
        };

        sendData();
      }
    }
  };

  return (
    <>
      <div className={classes.main}>
        <Head>
          <title>New Camp</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <h1>Post Hostel</h1>
        <form onSubmit={onSubmit} className={classes.cont}>
          <div className={`${classes.input} flex col put`}>
            <div className="col">
              <label htmlFor="outlined-search">Name</label>
              <TextField
                id="outlined-search"
                label=""
                type="search"
                variant="outlined"
                className={classes.text}
                required
                inputRef={title}
              />
            </div>
            <div className="col">
              <label htmlFor="outlined-search">Image URL</label>
              <TextField
                id="outlined-search"
                label=""
                type="search"
                variant="outlined"
                required
                className={classes.text}
                inputRef={imgUrl}
              />
            </div>
            <div className="col">
              <label htmlFor="outlined-search">Price</label>
              <TextField
                id="outlined-search"
                label=""
                type="number"
                variant="outlined"
                className={classes.text}
                required
                inputRef={price}
              />
            </div>
            <div className="col">
              <TextField
                id="outlined-multiline-static"
                label="Description"
                multiline
                rows={4}
                variant="outlined"
                className={classes.text}
                inputRef={dsc}
              />
            </div>
            <div className={`${classes.tns} flex`}>
              <button className="btn" type="submit">Submit</button>
              <button className="btn">
                <Link href="/hostels">Hostels</Link>
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Index;
