import { useEffect, useState } from "react";
import { Card, CardHeader, Table } from "reactstrap";
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
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>({ id: '', title: 'Todos los cursos' });
  const [selectedLearningType, setSelectedLearningType] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
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
        setCourses([allCoursesOption, ...data.map((course: ICourse) => ({
          id: course.id,
          title: course.title,
        }))]);
      }).then(() => fetchStudents()).then(() => setLoading(false));
  }, []);

  const fetchStudents = () => get('/students/learning-profile')
      .then(res => res.json())
      .then(res => res.data)
      .then((data: IStudent[]) => setStudents(data));
  

  useEffect(() => {
    fetchFilteredStudents();
  }, [selectedCourse?.id, selectedLearningType, selectedStudent]);

  const fetchFilteredStudents = () => {
    setLoading(true);
    let endpoint = '/students/learning-profile';
    const queryParams: string[] = [];

    if (selectedCourse?.id) {
      queryParams.push(`courseId=${selectedCourse.id}`);
    }

    if (selectedLearningType) {
      queryParams.push(`learningProfile=${selectedLearningType}`);
    }

    if (selectedStudent) {
      queryParams.push(`studentUserId=${selectedStudent.id}`);
    }

    if (queryParams.length > 0) {
      endpoint += `?${queryParams.join('&')}`;
    }

    get(endpoint)
      .then(res => res.json())
      .then(res => {
        const data = res.data;
        return data;
      })
      .then((data: IStudent[] | null) => {
        if (!data || !Array.isArray(data)) {
          setFilteredStudents([]);
          return;
        }

        const formattedStudents = data.map(student => ({
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          learningProfile: student.learningProfile || 'No definido',
          courseId: student.courseId || '',
        }));

        setFilteredStudents(formattedStudents);
      })
      .then(() => setLoading(false))
      .catch((error) => {
        console.error("Error fetching students:", error);
        setFilteredStudents([]);
        setLoading(false);
      });
    
  };

  return (<PageWrapper title="Tipos de Aprendizaje">
    <div className="d-flex flex-column">
      {/* Filtros en una fila */}
      <div className="d-flex flex-row align-items-center w-100 gap-3 mb-3">
        <div className="d-flex flex-column w-100">
          <label>Curso</label>
          <Select
            options={courses}
            getOptionLabel={(option) => option.title}
            getOptionValue={(option) => option.id}
            placeholder="Buscar curso"
            value={selectedCourse}
            onChange={(selectedOption) => {
              setSelectedCourse(selectedOption);
            }}
          />
        </div>
        <div className="d-flex flex-column w-100">
          <label>Tipo de Aprendizaje</label>
          <Select
            options={learningTypes}
            placeholder="Buscar tipo de aprendizaje"
            value={learningTypes.find(option => option.value === selectedLearningType)}
            onChange={(selectedOption) => {
              setSelectedLearningType(selectedOption ? selectedOption.value : '');
            }}
            className="w-100" // Ajustar ancho del select
          />
        </div>
        <div className="d-flex flex-column w-100">
          <label>Estudiante</label>
          <Select
            className="w-100"
            placeholder="Buscar estudiante"
            isClearable
            isSearchable
            options={students}
            noOptionsMessage={() => "No hay estudiantes disponibles"}
            value={selectedStudent}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName} - ${option.email}`}
            getOptionValue={(option) => option.id}
            onChange={(value) => setSelectedStudent(value || null)}
          />
        </div>
      </div>

      {loading ? ( <div style={{opacity: 0.5}}><TableSkeleton /></div> ) : (
        <div>
          {filteredStudents.length === 0 ? ( // Condición para mostrar el mensaje si no hay resultados
            <div style={{
              textAlign: 'center',
            }}>
              <strong>No hay resultados para esa búsqueda</strong>
            </div>
          ) : (
            <Table striped responsive>
              <thead>
                <tr>
                  <th className="text-center">Alumno</th>
                  <th className="text-center">Email</th>
                  <th className="text-center">Tipo de Aprendizaje</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="text-center">{`${student.firstName} ${student.lastName}`}</td>
                    <td className="text-center">{student.email}</td>
                    <td className="text-center">{student.learningProfile}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      )}
    </div>
  </PageWrapper>
  );
};
