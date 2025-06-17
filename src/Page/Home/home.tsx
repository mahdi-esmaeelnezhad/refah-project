import Content from "../../Components/Base/SideMenu/Content";
import { NavBar } from "../../Components/Base/SideMenu/NavBar";
import SideMenu from "../../Components/Base/SideMenu/SideMenu";

export default function Home() {
  return (
    <>
      <SideMenu />
      <NavBar></NavBar>
      <Content />
    </>
  );
}
