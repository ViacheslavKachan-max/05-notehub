import axios from "axios";

import type { Note, NoteTag } from "../types/note";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const notesApi = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

const ensureToken = (): void => {
  if (!token) {
    throw new Error("Missing VITE_NOTEHUB_TOKEN in environment variables.");
  }
};

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
  totalItems: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  ensureToken();

  const params: FetchNotesParams = {
    page,
    perPage,
  };

  if (search) {
    params.search = search;
  }

  const response = await notesApi.get<FetchNotesResponse>("/notes", {
    params,
  });

  return response.data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  ensureToken();

  const response = await notesApi.post<Note>("/notes", payload);
  return response.data;
};

export const deleteNote = async (noteId: Note["id"]): Promise<Note> => {
  ensureToken();

  const response = await notesApi.delete<Note>(`/notes/${noteId}`);
  return response.data;
};
