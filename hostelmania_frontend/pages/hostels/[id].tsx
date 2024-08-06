import React, { useState, useRef, useEffect } from "react";
import { response } from "../../type/res";
import { GetServerSideProps } from "next";
import classes from "../../styles/sub.module.scss";
import MainCard from "../../components/MainCard";
// import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import cookie from 'cookie';

// import mapboxgl from "mapbox-gl";
// mapboxgl.accessToken = process.env.MAPBOX;

interface dt {
  description: string;
  image: string;
  location: string;
  author:interface_auth;
  price: number;
  title: string;
  _id: string;
  comments: rev[];
}
interface interface_auth{
  username:string;
}
interface rev {
  body: string;
  rating: number;
  _id: string;
}

const Id = ({ data }: any) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    // map.current = new mapboxgl.Map({
    //   container: mapContainer.current,
    //   style: "mapbox://styles/mapbox/streets-v11",
    //   center: [lng, lat],
    //   zoom: zoom,
    // });
  }, []);
  return (
    <div className={`flex`}>
      <div className={`classes.sub`}>
        <div ref={mapContainer} className={classes.map} />
      </div>
      <div className={classes.main}>
        <MainCard {...data} />
      </div>
    </div>
  );
};

export default Id;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { params } = ctx;
  let data;
  console.log(ctx)
  const cookies = cookie.parse(ctx.req.headers.cookie || '');
  const token = cookies.jwt;
  const API = `${process.env.NEXT_PUBLIC_API}/hostels/${params.id}`;
  const response = await axios.get(API, {  headers: {
    Authorization: `Bearer ${token}`
  }});
  const res = response.data["hostel_found"];
  if (!res) {
    return {
      redirect: {
        permanent: false,
        destination: "/404", //provide the patj
      },
    };
  }
  return {
    props: {
      data: res,
    },
  };
};
