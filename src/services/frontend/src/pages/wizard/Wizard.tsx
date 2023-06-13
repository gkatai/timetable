import { User } from "firebase/auth";
import {
  Link,
  Outlet,
  useLocation,
  useOutletContext,
  useParams,
} from "react-router-dom";

export default function Wizard() {
  const { timetableUid } = useParams();
  const location = useLocation();
  const currentUser: User = useOutletContext();

  let step = 1;
  if (location.pathname.includes("rooms")) {
    step = 1;
  } else if (location.pathname.includes("teachers")) {
    step = 2;
  } else if (location.pathname.includes("subjects")) {
    step = 3;
  } else if (location.pathname.includes("classes")) {
    step = 4;
  } else if (location.pathname.includes("generate")) {
    step = 5;
  }

  return (
    <div>
      <ul className="steps w-full py-8">
        <li className="step step-primary">
          <Link to={`/timetables/${timetableUid}/rooms`}>Rooms</Link>
        </li>
        <li className={`step ${step > 1 && "step-primary"}`}>
          <Link to={`/timetables/${timetableUid}/teachers`}>Teachers</Link>
        </li>
        <li className={`step ${step > 2 && "step-primary"}`}>
          <Link to={`/timetables/${timetableUid}/subjects`}>Subjects</Link>
        </li>
        <li className={`step ${step > 3 && "step-primary"}`}>
          <Link to={`/timetables/${timetableUid}/classes`}>Classes</Link>
        </li>
        <li className={`step ${step > 4 && "step-primary"}`}>
          <Link to={`/timetables/${timetableUid}/generate`}>Generate</Link>
        </li>
      </ul>
      <Outlet context={currentUser} />
    </div>
  );
}
