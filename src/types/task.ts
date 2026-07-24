export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface CreateTask {
  text: string;
}

export interface UpdateTask {
  completed: boolean;
}
