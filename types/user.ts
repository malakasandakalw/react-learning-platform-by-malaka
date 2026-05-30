export type Address = {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: Address;
};
