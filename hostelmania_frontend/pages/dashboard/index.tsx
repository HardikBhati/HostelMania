import React from "react";
import Head from "next/head";
import jwt, { JwtPayload } from 'jsonwebtoken';
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

const Dashboard = ({ data }: CampsProps) => {
  const router = useRouter();

  return (
    <div className={classes.bd}>
      <Head>
        <title>My Blogs</title>
      </Head>
      <div className={classes.camp}>
        {data.map((el: response) => (
          <Cards {...el} key={uuidv4()} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  let data = null;
  try {
    const cookies = cookie.parse(context.req.headers.cookie || '');
    const token = cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    let userId: string | undefined;

    if (typeof decoded !== "string" && (decoded as JwtPayload).id) {
        userId = (decoded as JwtPayload).id as string; // Safely extract userId
    } else {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
    // const response = await fetchHostels(token,{
    //   username: userId
    // })
    console.log("user_id",userId)
    const response = await fetchHostels(token, {user_id:userId});
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
