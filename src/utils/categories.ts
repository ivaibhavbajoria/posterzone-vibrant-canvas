
export type CategoryType = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export const categories: CategoryType[] = [
  {
    id: "all",
    name: "All Posters",
    description: "Browse our complete collection of beautiful posters",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04",
  },
  {
    id: "nature",
    name: "Nature",
    description: "Bring the beauty of the outdoors into your home",
    image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
  },
  {
    id: "abstract",
    name: "Abstract",
    description: "Bold patterns and unique designs for modern spaces",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean, simple designs with powerful impact",
    image: "https://images.unsplash.com/photo-1486718448742-163732cd1544",
  },
  {
    id: "typography",
    name: "Typography",
    description: "Words and letters transformed into art",
    image: "https://images.unsplash.com/photo-1471970394675-613138e45da3",
  },
  {
    id: "movies",
    name: "Movies",
    description: "Celebrate your favorite films with artistic posters",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
  },
];
