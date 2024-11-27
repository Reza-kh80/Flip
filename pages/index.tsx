import React, { Fragment } from "react";
import { CreateAlertFunction } from "@/types/common";

// import components
import {
  Container
} from "@mui/material";
import Layout from "@/components/Layout";
import Header from "@/components/Header";

interface ComponentProps {
  createAlert: CreateAlertFunction;
}

export default function Home({ createAlert }: ComponentProps) {
  return (
    <Fragment>
      <Layout title="Home">
        <main className='bg-main-home'>
          <Container maxWidth='sm' className='p-4'>
            <Header createAlert={createAlert} />
          </Container>
        </main>
      </Layout>
    </Fragment>
  );
}