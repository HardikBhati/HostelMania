interface review{
  body: string;
  rating: number;
}
interface author_interface{
username: string;
}
export interface response {
    _id: number;
    name: string;
    description: string;
    location: string;
    image: string;
    price: number;
    author:author_interface;
    reviews: review[];
  }

  export interface child{
    children: React.ReactNode;
}