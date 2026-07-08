export type StudentHostelAllocation = {
  hostelName: string;
  block: string;
  roomNumber: string;
  floor: string;
  roomType: string;
  bed: string;
};

export type StudentHostelRoomOption = {
  value: string;
  label: string;
};

export type StudentHostelOption = {
  id: string;
  name: string;
  roomCount: number;
  rooms: StudentHostelRoomOption[];
};

export type StudentHostelListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: StudentHostelOption[];
};
