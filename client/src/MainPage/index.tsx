export { default as Map } from './Map/Map';
export { default as NewShelters } from './NewShelters/NewShelters';
import { Routes, Route, Navigate } from "react-router";
import { Map, NewShelters } from "./";
import ShelterForm from "./NewShelters/NewShelters";
export default function MainPage() {

  return (
    <div id="wd-mainpage">
      <table>
        <tr>
          <td valign="top">
            <Routes>
              <Route path="/" element={<Navigate to="/MainPage/Map" />} />
              <Route path="/Map" element={<Map />} />
              {/* <Route path="/ShelterForm" element={<ShelterForm />} /> */}
            </Routes>
          </td>
        </tr>
      </table>
    </div>
  );
}
