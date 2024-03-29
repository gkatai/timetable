import { database } from "@timetable/firebase";
import { DataSnapshot, databaseOperations } from "@timetable/firebase";
import { useList } from "react-firebase-hooks/database";

export function useGetLessons(
  currentUserId: string,
  timetableId?: string,
  classId?: string
): [
  {
    lessons: DataSnapshot[] | undefined;
    classes: DataSnapshot[] | undefined;
    teachers: DataSnapshot[] | undefined;
    subjects: DataSnapshot[] | undefined;
  },
  boolean,
  string | null
] {
  const [lessons, lessonsLoading, lessonsError] = useList(
    databaseOperations.ref(
      database,
      `users/${currentUserId}/timetables/objects/${timetableId}/classes/${classId}/lessons`
    )
  );

  const [classes, classesLoading, classesError] = useList(
    databaseOperations.ref(
      database,
      `users/${currentUserId}/timetables/objects/${timetableId}/classes`
    )
  );

  const [teachers, teachersLoading, teachersError] = useList(
    databaseOperations.ref(
      database,
      `users/${currentUserId}/timetables/objects/${timetableId}/teachers`
    )
  );

  const [subjects, subjectsLoading, subjectsError] = useList(
    databaseOperations.ref(
      database,
      `users/${currentUserId}/timetables/objects/${timetableId}/subjects`
    )
  );

  const data = { lessons, teachers, subjects, classes };
  const loading =
    lessonsLoading || teachersLoading || subjectsLoading || classesLoading;
  let error: string | null = null;

  if (lessonsError || teachersError || subjectsError || classesError) {
    error = "Error fetching data!";
  }

  return [data, loading, error];
}
