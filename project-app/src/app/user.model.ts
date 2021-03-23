//custom data to Firebase user and this will force us use a consistent data model across the entire app
export interface User {
  uid: string;
  email: string;
}