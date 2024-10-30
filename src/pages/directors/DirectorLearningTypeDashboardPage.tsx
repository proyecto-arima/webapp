import { useEffect, useState } from "react";
import { Card, CardHeader, Table } from "reactstrap";
import Select from 'react-select';
import { get } from "../../utils/network";

interface ICourse {
  id: string;
  courseName: string;
}

interface IStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  learningProfile: string; // Tipo de aprendizaje
  courseId?: string; // ID del curso asociado
}

interface ITeacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const learningTypes = [
  { value: '', label: 'Todos' },
  { value: 'ACOMODADOR', label: 'Acomodador' },
  { value: 'DIVERGENTE', label: 'Divergente' },
  { value: 'CONVERGENTE', label: 'Convergente' },
  { value: 'ASIMILADOR', label: 'Asimilador' },
];

export const DirectorLearningTypeDashboardPage = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [courseId, setCourseId] = useState<string>(''); // Inicializar en ''
  const [selectedLearningType, setSelectedLearningType] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<ITeacher | null>(null); // Estado para docente seleccionado
  const [students, setStudents] = useState<IStudent[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<IStudent[]>([]);
  const [teachers, setTeachers] = useState<ITeacher[]>([]); // Estado para la lista de docentes
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get('/directors/courses/')
      .then(res => res.json())
      .then(res => res.data)
      .then((data: ICourse[]) => {
        const allCoursesOption = { id: '', courseName: 'Todos los cursos' };
        setCourses([allCoursesOption, ...data.map((course: ICourse) => ({
          id: course.id,
          courseName: course.courseName,
        }))]);
      });

    fetchStudents();
    fetchTeachers(); // Llamar para obtener docentes
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    await get('/students/learning-profile')
      .then(res => res.json())
      .then(res => res.data)
      .then((data: IStudent[]) => {
        setStudents(data);
        setLoading(false);
      });
  };

  const fetchTeachers = async () => {
    await get('/teachers') 
      .then(res => res.json())
      .then(res => res.data)
      .then((data: any[]) => {
        setTeachers(data.map(teacherObject => ({
          id: teacherObject.user._id,
          firstName: teacherObject.user.firstName,
          lastName: teacherObject.user.lastName,
          email: teacherObject.user.email,
        })));
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFilteredStudents();
  }, [courseId, selectedLearningType, selectedStudent, selectedTeacher]); // Agregar selectedTeacher a las dependencias

  const fetchFilteredStudents = async () => {
    setLoading(true);
    let endpoint = '/students/learning-profile';
    const queryParams: string[] = [];

    if (courseId) {
      queryParams.push(`courseId=${courseId}`);
    }

    if (selectedLearningType) {
      queryParams.push(`learningProfile=${selectedLearningType}`);
    }

    if (selectedStudent) {
      queryParams.push(`studentUserId=${selectedStudent.id}`);
    }

    if (selectedTeacher) { // Nuevo filtro por docente
      queryParams.push(`teacherUserId=${selectedTeacher.id}`);
    }

    if (queryParams.length > 0) {
      endpoint += `?${queryParams.join('&')}`;
    }

    await get(endpoint)
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
      .catch((error) => {
        console.error("Error fetching students:", error);
        setFilteredStudents([]);
      });
      setLoading(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100vh',
        backgroundColor: '#f6effa',
        width: '100vw',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '20px',
          width: '100%',
          height: '100%',
        }}
      >
        <Card style={{ width: '100%', paddingInline: '2rem', paddingBlock: '1rem', height: '100%', overflow: 'scroll' }}>
          <div className="d-flex flex-column">
            {/* Filtros en una fila */}
            <div className="d-flex flex-row align-items-center w-100 gap-3 mb-3">
              <Select
                options={courses.map(course => ({ value: course.id, label: course.courseName }))}
                placeholder="Seleccionar curso"
                onChange={(selectedOption) => {
                  setCourseId(selectedOption ? selectedOption.value : '');
                }}
                className="w-50" // Ajustar ancho del select
              />
              <Select
                options={learningTypes}
                placeholder="Seleccionar tipo de aprendizaje"
                onChange={(selectedOption) => {
                  setSelectedLearningType(selectedOption ? selectedOption.value : '');
                }}
                className="w-50" // Ajustar ancho del select
              />
            </div>

            <div className="d-flex flex-row align-items-center w-100 gap-3 mb-3">
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

            <div className="d-flex flex-row align-items-center w-100 gap-3 mb-3">
              <Select
                className="w-100"
                placeholder="Buscar docente"
                isClearable
                isSearchable
                options={teachers} // Asegúrate de tener la lista de docentes en esta variable
                noOptionsMessage={() => "No hay docentes disponibles"}
                value={selectedTeacher}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName} - ${option.email}`}
                getOptionValue={(option) => option.id}
                onChange={(value) => setSelectedTeacher(value || null)} // Asegúrate de que value sea de tipo ITeacher
              />
            </div>

            <hr />

            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <strong>Cargando...</strong>
              </div>
            ) : (
              <Card>
                <CardHeader tag='h4'>
                  Resultados
                </CardHeader>
                {filteredStudents.length === 0 ? ( // Condición para mostrar el mensaje si no hay resultados
                  <div style={{
                    textAlign: 'center',
                    padding: '20px',
                    color: '#888',
                    fontSize: '1.2rem',
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
              </Card>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
