"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { ArrowBigUp } from 'lucide-react';
import axios from "axios";

export function StoryIdeas (){
  
    const [popupMessage, setPopupMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [stories,setStories] = useState([]);
    let token : any = "";
    if (typeof window !== "undefined") {    
      token = localStorage.getItem("encodedToken");
    }
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      try {
        const response = await axios.post("https://next-app-tau-puce.vercel.app/api/story", {
          title,
          description,
        },
        {
            headers: {
                Authorization: token
            }
        });
  
        console.log("response", response.data);
        if(response.status === 200){
            
            let newStory = { 
                ...response?.data?.story,
                storyUpvote: 0,
                isUserUpvote: false
            }
            let modifiedArray : any = [newStory , ...stories];
            setStories(modifiedArray);
            setDescription("");
            setTitle("");
        }else if (response.status === 201) {
            const nextAllowedTime = response.data.nextAllowedTime;
            const hours = Math.floor(nextAllowedTime / 3600000);
            const minutes = Math.floor((nextAllowedTime % 3600000) / 60000);
            setPopupMessage(`Daily limit reached. Try again in ${hours}h ${minutes}m`);
            setShowPopup(true);
        }
        
      } catch (error) {
        console.error("Error submitting story:", error);
      }
    };

    const getStoryIdeas = async () => {
       
        try {
            const response = await axios.get("https://next-app-tau-puce.vercel.app/api/story", {
                headers: {
                    Authorization: token
                }
            });
            console.log("response",response.data);
            if(response.status === 200){
                setStories(response.data?.stories);
            }

        } catch (error) {
            console.log("error",error);
        }
    }

    const upvoteHandler = async (story_id: any,upvote: any) => {
        console.log(story_id,upvote);
        try {
            const response = await axios.post("https://next-app-tau-puce.vercel.app/api/upvote",{story_id,upvote:!upvote},
                {
                    headers: {
                        Authorization: token
                    }
                }
            );
            console.log("response",response);
            if(response.status === 200){
                const modifiedStories : any = stories?.map((story :any) =>{ 
                    if((story.id === response.data?.upvote?.story_id)){
                        return {
                            ...story,
                            isUserUpvote:response.data?.upvote?.upvote,
                            storyUpvote:response.data?.upvoteCount
                        }
                    }else {
                        return story
                    }
                }  );
                console.log("modified",modifiedStories);
                setStories(modifiedStories);
              
            }
        } catch (error) {
            console.log("error",error);
        }
    }


    useEffect(()=> {
        getStoryIdeas();
    },[]);
    
    return <>
        <div className="flex flex-col h-screen pt-8 pb-10">

            <div className=" w-3/5 ml-auto mr-auto flex justify-between flex-row items-center">
                <div >
                    <h2 className="text-2xl font-bold mb-2 text-gray-800">Welcome,</h2>
                    
                </div>
                <div className="gap-2 flex">
                    <Button variant="outline" className="border-black">Sort</Button>
                    <Button variant="outline" className="border-black">Filter</Button>
                </div>
            </div>
            <div className=" w-3/5 ml-auto mr-auto flex ">
        
                    <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white rounded-lg ">
                        <h2 className="text-xl font-bold mb-2 text-gray-600">Submit Your Story</h2>
                        
                        <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        </div>

                        <div className="mb-6">
                        <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={5}
                            required
                        ></textarea>
                        </div>
                        <Button type="submit" variant="outline" className="w-fullfont-semibold py-2 px-4 rounded-lg border-black">Submit</Button>
                    </form>
                  
            </div>
            <div className="w-3/5 ml-auto mr-auto border-t-2 border-gray-200 my-3"></div>
            <div className=" w-3/5 ml-auto mr-auto flex flex-col p-4 gap-2 flex-grow overflow-y-auto custom-scrollbar">

                {
                    stories?.map((item : any) => 
                        <div key={item?.id} className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">{item?.title}</p>
                      <p className="text-gray-600">{item?.description}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <ArrowBigUp
                        fill={item?.isUserUpvote ? "red" : "white"}
                        cursor={"pointer"}
                        onClick={() => upvoteHandler(item?.id, item?.isUserUpvote)}
                        className="w-6 h-6"
                      />
                      <div className="text-sm text-gray-700">{item?.storyUpvote}</div>
                    </div>
                  </div>
                    )
                }

            </div>
            {showPopup && (
                 <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                 <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
                   <button
                     onClick={() => setShowPopup(false)}
                     className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                   </button>
                   <p className="text-lg font-bold text-gray-800">{popupMessage}</p>
                 </div>
               </div>
            )}
        </div>
        <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: #a0aec0; /* Gray color for the scrollbar thumb */
                border-radius: 9999px; /* Fully rounded edges */
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background-color: #edf2f7; /* Light background color for the track */
            }
        `}</style>
    </>
}