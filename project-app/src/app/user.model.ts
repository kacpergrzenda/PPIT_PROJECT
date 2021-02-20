//custom data to Firebase user and this will force us use a consistent data model across the entire app
export interface User {
    username: string;
    email: string;
    password: string;
  }