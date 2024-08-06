// import React, { useContext, useEffect } from "react";
// import Head from "next/head";
// import { GetServerSideProps } from "next";
// import classes from "../../styles/camp.module.scss";
// import { v4 as uuidv4 } from "uuid";
// import Cards from "../../components/Cards";
// import axios from "axios";
// import { response } from "../../type/res";
// import { useRouter } from "next/router";
// import AuthContext from "../../context/authContext";
// import cookie from 'cookie';

// interface CampsProps {
//   data: response[];
// }

// const Hostels = ({ data }: CampsProps) => {
//   // const { auth } = useContext(AuthContext);
//   const router = useRouter();
//   // console.log(data)
//   // useEffect(() => {
//   //   if (!auth) {
//   //     router.push("/login");
//   //   }
//   // }, [auth, router]);

//   return (
//     <div className={classes.bd}>
//       <Head>
//         <title>Hostels</title>
//       </Head>
//       <div className={`${classes.banner} overlay`}>
//         <h1>Welcome to HostelMania</h1>
//         <h4>View Hostels All Over The World</h4>
//       </div>
//       <div className={classes.camp}>
//         {data.map((el: response) => (
//           <Cards {...el} key={uuidv4()} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Hostels;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   let data = null;
//   try {

//     const cookies = cookie.parse(context.req.headers.cookie || '');
//     const token = cookies.jwt;
//     console.log("token", token)
//     const API = `${process.env.NEXT_PUBLIC_API}/hostels`;
//     const response = await axios.get(API, {  headers: {
//       Authorization: `Bearer ${token}`
//     }});
//     data = response.data["hostels"];
//     // if (!Array.isArray(data)) {
//     //   return {
//     //     notFound: true,
//     //   };
//     // }
//   } catch (error) {
//     console.log("inside catch")
//     // console.error("Error fetching hostels:", error);
//     // Redirect to login if there’s an issue with fetching data
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: {
//       data: data,
//     },
//   };
// };

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
    const API = `${process.env.NEXT_PUBLIC_API}/hostels`;
    const response = await axios.get(API, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        username: authorUsername
      }
    });
    data = response.data["hostels"];
  } catch (error) {
    console.log("inside catch");
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
