
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
    id: "cars",
    name: "Cars",
    description: "High-octane automotive posters for car enthusiasts",
    image: "https://images.unsplash.com/photo-1493238792000-8113da705763",
  },
  {
    id: "movies",
    name: "Movies",
    description: "Celebrate your favorite films with artistic posters",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
  },
  {
    id: "gym-motivation",
    name: "Gym Motivation",
    description: "Inspirational fitness and workout motivation posters",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
  },
  {
    id: "gun-games",
    name: "Gun Games",
    description: "Action-packed gaming and tactical themed posters",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
  },
];
