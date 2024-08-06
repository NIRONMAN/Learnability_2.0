import { Spin } from "antd";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return <div className=" flex justify-center items-center bg-black h-screen">
        <Spin size="large" ></Spin>
        </div>
  }
