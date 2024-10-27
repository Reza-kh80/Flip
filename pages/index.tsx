import React, { useState, Fragment, useEffect } from "react";
import { CreateAlertFunction } from "@/types/common";
import { getCookie } from "cookies-next";

// import components
import Login from "@/components/LoginProcess/Login";
import Layout from "@/components/Layout";

interface ComponentProps {
  createAlert: CreateAlertFunction;
}


export default function Home({ createAlert }: ComponentProps) {
  const [token, setToken] = useState<boolean>();

  useEffect(() => {
    getCookie('token') === undefined ? setToken(false) : setToken(true);
  }, [])

  return (
    <Fragment>
      {
        !token ? (
          <Login createAlert={createAlert} />
        )
          : (
            <Layout title="Home">
              Hello
            </Layout>
          )
      }
    </Fragment>
  );
}
