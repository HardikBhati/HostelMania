import React from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import classes from "../../styles/camp.module.scss";
import { v4 as uuidv4 } from "uuid";
import Cards from "../../components/Cards";
import axios from "axios";
import { response } from "../../type/res";
import { useRouter } from "next/router";
import cookie from 'cookie';
import AuthorFilter from "../../components/AuthorFilter";
import { fetchHostels } from "../api/hostels";

interface CampsProps {
  data: response[];
}

const Hostels = ({ data }: CampsProps) => {
  const router = useRouter();

  return (
    <div className={classes.bd}>
      <Head>
        <title>Hostels</title>
      </Head>
      <div className={`${classes.banner} overlay`}>
        <h1>Welcome to HostelMania</h1>
        <h4>View Hostels All Over The World</h4>
      </div>
      <AuthorFilter />
      <div className={classes.camp}>
        {data.map((el: response) => (
          <Cards {...el} key={uuidv4()} />
        ))}
      </div>
    </div>
  );
};

export default Hostels;

export const getServerSideProps: GetServerSideProps = async (context) => {
  let data = null;
  try {
    const cookies = cookie.parse(context.req.headers.cookie || '');
    const token = cookies.jwt;
    const authorUsername = context.query.username || '';
    const response = await fetchHostels(token,{
      username: authorUsername
    })
    data = response.data["hostels"];
    console.log(data)
  } catch (error) {
    console.log("inside catch");
    console.log(error)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      data: data,
    },
  };
};
