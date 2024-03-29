import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@timetable/components";
import { SimpleTable } from "@timetable/components";
import { database } from "@timetable/firebase";
import { User, databaseOperations } from "@timetable/firebase";
import { Class, Timetable, classesSchema } from "@timetable/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useOutletContext, useParams } from "react-router-dom";
import { z } from "zod";

import { Modal } from "../../../components/Modal";

export default function Classes() {
  const { timetableUid } = useParams();
  const {
    currentUser,
    timetable,
  }: { currentUser: User; timetable: Timetable } = useOutletContext();

  if (!timetableUid) {
    return <Navigate to="/timetables" />;
  }

  return (
    <ClassesLoaded
      classes={timetable.classes}
      currentUserId={currentUser.uid}
      timetableId={timetableUid}
    />
  );
}

type FormValues = z.infer<typeof classesSchema>;

const columns: ColumnDef<Class>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
];

type ClassesLoadedProps = {
  classes: Class[];
  currentUserId: string;
  timetableId: string;
};

function ClassesLoaded({
  classes,
  currentUserId,
  timetableId,
}: ClassesLoadedProps) {
  const [defaultValues, setDefaultValues] = useState<FormValues>({
    name: "",
    lessons: {},
  });

  const handleCreate = () => {
    window["form-modal"].showModal();
    setDefaultValues({ name: "", lessons: {} });
  };
  const handleEdit = (uid: string) => {
    const foundClass = classes.find((d) => d.uid === uid);

    if (foundClass) {
      window["form-modal"].showModal();
      setDefaultValues({
        uid,
        name: foundClass.name,
        lessons: foundClass.lessons,
      });
    }
  };
  const handleDelete = (uid: string) => {
    const timetableFlatRef = databaseOperations.ref(
      database,
      `users/${currentUserId}/timetables/${timetableId}/classes/${uid}`
    );

    databaseOperations.remove(timetableFlatRef);
  };

  return (
    <>
      <Form
        currentUserId={currentUserId}
        defaultValues={defaultValues}
        timetableId={timetableId}
      />
      <SimpleTable
        data={classes}
        columns={columns}
        createAction={handleCreate}
        deleteAction={(uid) => handleDelete(uid)}
        editAction={(uid) => handleEdit(uid)}
        openLink={(uid) => (
          <Link
            className="btn btn-secondary"
            to={`/timetables/${timetableId}/classes/${uid}/lessons`}
          >
            Open
          </Link>
        )}
      />
    </>
  );
}

type FormProps = {
  currentUserId: string;
  defaultValues: FormValues;
  timetableId: string;
};

function Form({ currentUserId, defaultValues, timetableId }: FormProps) {
  const { formState, register, reset, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(classesSchema),
  });

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const handleSave = (data: FormValues) => {
    return new Promise<void>((resolve, reject) => {
      if (defaultValues.uid) {
        databaseOperations
          .update(
            databaseOperations.ref(
              database,
              `users/${currentUserId}/timetables/${timetableId}/classes/${defaultValues.uid}`
            ),
            { name: data.name, lessons: data.lessons }
          )
          .then(() => resolve())
          .catch((error) => reject(error));
      } else {
        databaseOperations
          .push(
            databaseOperations.ref(
              database,
              `users/${currentUserId}/timetables/${timetableId}/classes`
            ),
            {
              name: data.name,
              lessons: data.lessons,
            }
          )
          .then(() => resolve())
          .catch((error) => reject(error));
      }
    });
  };

  return (
    <Modal
      title="Class"
      save={handleSave}
      reset={reset}
      handleSubmit={handleSubmit}
    >
      <Input label="Name" error={formState.errors["name"]}>
        <input
          type="text"
          className="input-bordered input w-full"
          {...register("name")}
        />
      </Input>
    </Modal>
  );
}
