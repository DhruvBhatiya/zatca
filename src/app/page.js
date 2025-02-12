'use client'

import DetailTable from "@/components/BaseTable/DetailTable";
import MainTable from "@/components/BaseTable/MainTable";
import CardTitle from "@/components/CardTitle";
import BasicPie from "@/components/Charts/BasicPie";
import Charts from "@/components/Charts/Charts";
import MyContainer from "@/components/MyContainer";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Charts />
      <MainTable />
      
    </>
  );
}
