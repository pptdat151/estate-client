import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";
import { listData, singlePostData, userData } from "./dummydata";

// Set to false once the API has /posts, /chats and /users/profilePosts routes
const USE_DUMMY_DATA = false

// Wrap dummy data like an axios response so pages can read `.data` either way
const fakeResponse = (data) => Promise.resolve({ data });

const dummyPost = (id) => {
  const post = listData.find((p) => String(p.id) === String(id)) ?? listData[0];
  return {
    ...post,
    images: [...post.images, ...singlePostData.images.slice(1)],
    isSaved: false,
    user: { username: userData.name, avatar: userData.img },
    postDetail: {
      desc: singlePostData.description,
      utilities: "owner",
      pet: "allowed",
      income: "Must have 3x the rent in total household income",
      size: singlePostData.size,
      school: 250,
      bus: 100,
      restaurant: 50,
    },
  };
};

export const singlePageLoader = async ({ params }) => {
  if (USE_DUMMY_DATA) return dummyPost(params.id);
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};
export const listPageLoader = async ({ request }) => {
  if (USE_DUMMY_DATA) return defer({ postResponse: fakeResponse(listData) });
  const query = request.url.split("?")[1];
  const postPromise = apiRequest("/posts?" + query);
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  if (USE_DUMMY_DATA)
    return defer({
      postResponse: fakeResponse({
        userPosts: listData.slice(0, 4),
        savedPosts: listData.slice(4),
      }),
      chatResponse: fakeResponse([]),
    });
  const postPromise = apiRequest("/users/profilePosts");
  const chatPromise = apiRequest("/chats");
  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise,
  });
};
