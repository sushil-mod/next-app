
import client from "@/db";

async function getUserData (){
    const user = await client.user.findFirst();
    console.log("user",user);
    return {
        username:user?.username,
        name:"sushil"
    }
}

export default async function User() {
    
    const data = await getUserData()

    

    return (<div>

        hi there 
        {data.username}
        {data.name}

    </div>);


}
// export default function Home() {
//     return (
//       <div>
//         this is a next website
//       </div>
//     );
//   }