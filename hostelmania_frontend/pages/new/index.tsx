import React, { useState, useContext, useEffect } from "react";
import TextField from "@mui/material/TextField";
import classes from "../../styles/new.module.scss";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import AuthContext from "../../context/authContext";
import Cookie from "js-cookie";
import { notifyMessage } from "../../helper/toast";
import axios from "axios";

const Index: React.FC = () => {
  const { auth, removeAuth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    price: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      removeAuth();
    }
  }, [auth, removeAuth]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateImageUrl = (url: string) => {
    const domain = "images.unsplash.com"; // Replace with your required domain
    const urlPattern = new RegExp(`^(https?://)?(www\\.)?${domain}/.*`, "i");
    return urlPattern.test(url);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, imageUrl, price, description } = formData;

    if (!name || !imageUrl || !price || !description) {
      notifyMessage("Please fill in all fields");
      return;
    }

    if (!validateImageUrl(imageUrl)) {
      notifyMessage(`Image URL must be from the domain ${"example.com"}`);
      return;
    }

    const data = {
      name,
      description,
      image_url: imageUrl,
      price: Number(price),
    };

    try {
      const token = Cookie.get("jwt");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        return;
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/hostels/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status > 201) {
        throw new Error("Failed to add the hostel. Please try again.");
      }

      notifyMessage("New hostel added successfully!");
      router.push("/hostels");
    } catch (error) {
      setError(error.message || "An error occurred. Please try again.");
      notifyMessage(error.message || "An error occurred.");
    }
  };

  return (
    <>
      <Head>
        <title>New Blog</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className={classes.main}>
        <h1>Post Blog</h1>
        {error && <p className={classes.error}>{error}</p>}
        <form onSubmit={onSubmit} className={classes.cont}>
          <div className={`${classes.input} flex col put`}>
            <div className="col">
              <label htmlFor="name">Name</label>
              <TextField
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                className={classes.text}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="imageUrl">Image URL</label>
              <TextField
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                variant="outlined"
                className={classes.text}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="price">Price</label>
              <TextField
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                type="number"
                variant="outlined"
                className={classes.text}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="description">Description</label>
              <TextField
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                variant="outlined"
                className={classes.text}
                required
              />
            </div>
            <div className={`${classes.tns} flex`}>
              <button className="btn" type="submit">
                Submit
              </button>
              <Link href="/hostels">
                <button className="btn" type="button">
                  Hostels
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Index;
