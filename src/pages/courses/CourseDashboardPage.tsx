import { Table } from 'reactstrap';
import SidebarCourses from './SidebarCourses';

interface ICourseCreationFormValues {
  title?: string;
  description?: string;
  imageUrl?: string;
  students?: { value: string; label: string }[];
}

export const CourseDashboardPage = () => {

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f6effa',
        width: '100vw',
      }}
    >
      <SidebarCourses />
      <Table>
        <thead>
          <tr>
            <th>Curso</th>
            <th>Descripción</th>
            <th>Imagen</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Curso 1</td>
            <td>Descripción 1</td>
            <td>Imagen 1</td>
          </tr>
          <tr>
            <td>Curso 2</td>
            <td>Descripción 2</td>
            <td>Imagen 2</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};
