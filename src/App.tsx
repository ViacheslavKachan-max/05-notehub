import { useState, type ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import Modal from "./components/Modal/Modal";
import NoteForm from "./components/NoteForm/NoteForm";
import NoteList from "./components/NoteList/NoteList";
import Pagination from "./components/Pagination/Pagination";
import SearchBox from "./components/SearchBox/SearchBox";
import css from "./App.module.css";
import {
  createNote,
  deleteNote,
  fetchNotes,
  type CreateNotePayload,
} from "./services/noteService";
import type { Note } from "./types/note";

export default function App() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search,
      }),
    placeholderData: keepPreviousData,
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      setIsModalOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setPage(1);
    setSearch(value.trim());
  }, 300);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    updateSearchQuery(event.target.value);
  };

  const handleCreateNote = async (values: CreateNotePayload): Promise<void> => {
    await createNoteMutation.mutateAsync(values);
  };

  const handleDeleteNote = (noteId: Note["id"]): void => {
    deleteNoteMutation.mutate(noteId);
  };

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const statusLabel = isLoading
    ? "Loading notes..."
    : isError
      ? "Failed to load notes. Check token and network."
      : notes.length === 0
        ? "No notes found."
        : "";

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        <button
          className={css.button}
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {statusLabel && <p className={css.status}>{statusLabel}</p>}

      {notes.length > 0 && (
        <NoteList
          notes={notes}
          onDelete={handleDeleteNote}
          deletingNoteId={deleteNoteMutation.variables ?? null}
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={handleCreateNote}
            onCancel={() => setIsModalOpen(false)}
            isPending={createNoteMutation.isPending}
          />
        </Modal>
      )}
    </div>
  );
}
