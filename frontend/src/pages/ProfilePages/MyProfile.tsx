import { Route, Routes } from "react-router-dom";
import { MyProfileRecord } from "./MyProfileRecord";
import { MyProfileUpdate } from "./MyProfileUpdate";
import { MyProfileMain } from "./MyProfileMain";

export const MyProfile = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<MyProfileMain />} />
        <Route path="/update" element={<MyProfileUpdate />} />
        <Route path="/record" element={<MyProfileRecord />} />
      </Routes>
    </>
  );
};
