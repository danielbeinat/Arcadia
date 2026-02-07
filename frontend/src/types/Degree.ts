export interface RawDegree {
  id: number;
  image: string;
  name: string;
  Type: string;
  duration: string;
  program: string;
  title?: string;
  degree?: string;
  category: string;
  Time: string;
  subjects?: { semester: number; name: string }[];
}

export interface Degree {
  id: number;
  image: string;
  name: string;
  type: string;
  duration: string;
  program: string;
  title?: string;
  degree?: string;
  category: string;
  time: string;
}
