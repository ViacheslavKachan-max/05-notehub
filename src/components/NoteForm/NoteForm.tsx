import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import type { CreateNotePayload } from "../../services/noteService";
import type { NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onSubmit: (values: CreateNotePayload) => Promise<void> | void;
  onCancel: () => void;
  isPending: boolean;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const noteFormSchema = Yup.object({
  title: Yup.string().min(3).max(50).required(),
  content: Yup.string().max(500),
  tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required(),
});

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

export default function NoteForm({
  onSubmit,
  onCancel,
  isPending,
}: NoteFormProps) {
  const handleSubmit = async (values: NoteFormValues): Promise<void> => {
    await onSubmit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={noteFormSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty, touched, errors }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <span data-name="title" className={css.error}>
              {touched.title ? errors.title : ""}
            </span>
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              as="textarea"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <span data-name="content" className={css.error}>
              {touched.content ? errors.content : ""}
            </span>
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field id="tag" as="select" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <span data-name="tag" className={css.error}>
              {touched.tag ? errors.tag : ""}
            </span>
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isPending || !isValid || !dirty}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
