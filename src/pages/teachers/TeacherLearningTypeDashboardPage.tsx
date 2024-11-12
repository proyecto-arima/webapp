import { useEffect, useState } from "react";
import { Table } from "reactstrap";
import Select from 'react-select';
import { get } from "../../utils/network";
import PageWrapper from "../../components/PageWrapper";
import TableSkeleton from "../../components/TableSkeleton";

interface ICourse {
  id: string;
  title: string;
}

interface IStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  learningProfile: string; // Tipo de aprendizaje
  courseId?: string; // ID del curso asociado
}

const learningTypes = [
  { value: '', label: 'Todos' },
  { value: 'ACOMODADOR', label: 'Acomodador' },
  { value: 'DIVERGENTE', label: 'Divergente' },
  { value: 'CONVERGENTE', label: 'Convergente' },
  { value: 'ASIMILADOR', label: 'Asimilador' },
];

export const TeacherLearningTypeDashboardPage = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedLearningType, setSelectedLearningType] = useState<string>('');
  const [students, setStudents] = useState<IStudent[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    get('/teachers/me/courses/')
      .then(res => res.json())
      .then(res => res.data)
      .then((data: ICourse[]) => {
        const allCoursesOption = { id: '', title: 'Todos los cursos' };
        setCourses([allCoursesOption, ...data]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchFilteredStudents();
  }, [selectedCourse, selectedLearningType]);

  const fetchFilteredStudents = () => {
    setLoading(true);
    let endpoint = '/students/learning-profile';
    const queryParams: string[] = [];

    if (selectedCourse) {
      queryParams.push(`courseId=${selectedCourse}`);
    }

    if (selectedLearningType) {
      queryParams.push(`learningProfile=${selectedLearningType}`);
    }

    if (queryParams.length > 0) {
      endpoint += `?${queryParams.join('&')}`;
    }

    get(endpoint)
      .then(res => res.json())
      .then(res => {
        const data = res.data;
        if (!data || !Array.isArray(data)) {
          setFilteredStudents([]);
          return;
        }
        setFilteredStudents(data);
      })
      .finally(() => setLoading(false));
  };

  return (
    <PageWrapper title="Tipos de Aprendizaje de Estudiantes">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        height: '100%',
      }}>
        <div className="d-flex flex-row align-items-center w-100 gap-2 mb-3">
          <div className="d-flex flex-column w-100">
            <label>Curso</label>
            <Select
              options={courses.map(course => ({ value: course.id, label: course.title }))}
              noOptionsMessage={() => 'No hay cursos disponibles'}
              placeholder="Seleccione un curso"
              isClearable
              isSearchable
              onChange={(selectedOption) => {
                setSelectedCourse(selectedOption ? selectedOption.value : '');
              }}
            />
          </div>

          <div className="d-flex flex-column w-100">
            <label>Tipo de Aprendizaje</label>
            <Select
              options={learningTypes}
              placeholder="Seleccione un tipo de aprendizaje"
              isClearable
              onChange={(selectedOption) => {
                setSelectedLearningType(selectedOption ? selectedOption.value : '');
              }}
            />
          </div>
        </div>
        <hr />

        {loading ? (
          <TableSkeleton columnsCount={5} />
        ) : (
          <Table striped>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Tipo de Aprendizaje</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student: IStudent) => (
                  <tr key={student.id}>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.email}</td>
                    <td>{student.learningProfile === "SIN_PERFIL" ? "SIN PERFIL" : student.learningProfile}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center' }}>No se encontraron estudiantes</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </div>
    </PageWrapper>
  );
};
