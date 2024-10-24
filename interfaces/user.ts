
import { v4 as uuid4 } from "uuid";


export interface User {
  id?: string | typeof uuid4;
  username: string;
  age: number;
  hobbies: string[];
}
