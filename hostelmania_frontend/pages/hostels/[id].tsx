import React, { useState, useRef, useEffect } from "react";
import { GetServerSideProps } from "next";
import classes from "../../styles/sub.module.scss";
import MainCard from "../../components/MainCard";
import axios from "axios";
import cookie from 'cookie';
import { fetchHostelById } from "../api/hostels";

const Id = ({ data }: any) => {
  return (
    <div className={`flex`}>
      <div className={classes.main}>
        <MainCard {...data} />
      </div>
    </div>
  );
};

export default Id;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { params } = ctx;
  const cookies = cookie.parse(ctx.req.headers.cookie || '');
  const token = cookies.jwt;
  const response = await fetchHostelById(params.id, token)
  if (!response) {
    return {
      redirect: {
        permanent: false,
        destination: "/hostels",
      },
    };
  }
  const res = response.data["hostel_found"];
  return {
    props: {
      data: res,
    },
  };
};
