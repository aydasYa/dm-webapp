import { SayHello } from "./ui/say-hello";
import DashboardPage from "./dashboard/page";
import { redirect } from "next/navigation";

export default function Home() {
  redirect('/login');

  // return (
  //   <>
  //     {/* Der rest der UI kommt später */}
  //     <SayHello />  
  //   </>
  // )
}
