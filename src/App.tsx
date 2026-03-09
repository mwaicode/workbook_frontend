// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import { useAuth } from './context/AuthContext'
// import { AuthGuard, RoleGuard } from './guards/RoleGuard'
// import { Layout } from './components/Layout'
// import { Login } from './pages/Login'
// import { Register } from './pages/Register'
// import { DirectorWorkbook } from './pages/director/DirectorWorkbook'
// import { GradeApprovals } from './pages/director/GradeApproval'
// import { TeacherWorkbook } from './pages/teacher/TeacherWorkbook'
// import { TeacherGrading } from './pages/teacher/TeacherGrading'
// import { StudentWorkbook } from './pages/student/StudentWorkbook'
// import { StudentGrades } from './pages/student/StudentGrades'

// const Home = () => {
//   const { user } = useAuth()
//   if (!user) return <Navigate to="/login" replace />
//   const routes: Record<string, string> = { DIRECTOR: '/director', TEACHER: '/teacher', STUDENT: '/student' }
//   return <Navigate to={routes[user.role] || '/login'} replace />
// }

// export const AppRouter = () => (
//   <BrowserRouter>
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/" element={<AuthGuard><Layout><Home /></Layout></AuthGuard>} />

//       <Route path="/director" element={<RoleGuard roles={['DIRECTOR']}><Layout><DirectorWorkbook /></Layout></RoleGuard>} />
//       <Route path="/director/grades" element={<RoleGuard roles={['DIRECTOR']}><Layout><GradeApprovals /></Layout></RoleGuard>} />

//       <Route path="/teacher" element={<RoleGuard roles={['TEACHER']}><Layout><TeacherWorkbook /></Layout></RoleGuard>} />
//       <Route path="/teacher/grading" element={<RoleGuard roles={['TEACHER']}><Layout><TeacherGrading /></Layout></RoleGuard>} />

//       <Route path="/student" element={<RoleGuard roles={['STUDENT']}><Layout><StudentWorkbook /></Layout></RoleGuard>} />
//       <Route path="/student/grades" element={<RoleGuard roles={['STUDENT']}><Layout><StudentGrades /></Layout></RoleGuard>} />

//       <Route path="/unauthorized" element={
//         <div className="flex items-center justify-center h-screen">
//           <div className="text-center"><h1 className="font-display text-3xl font-bold mb-2">Unauthorized</h1>
//           <p className="text-ink/50 font-mono text-sm">You don't have permission to view this page.</p></div>
//         </div>
//       } />
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   </BrowserRouter>
// )

// export default AppRouter
























import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { RoleGuard } from './guards/RoleGuard'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Welcome } from './pages/Welcome'
import { DirectorWorkbook } from './pages/director/DirectorWorkbook'
import { GradeApprovals } from './pages/director/GradeApproval'
import { TeacherWorkbook } from './pages/teacher/TeacherWorkbook'
import { TeacherGrading } from './pages/teacher/TeacherGrading'
import { StudentWorkbook } from './pages/student/StudentWorkbook'
import { StudentGrades } from './pages/student/StudentGrades'

const Home = () => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/welcome" replace />
  const routes: Record<string, string> = { DIRECTOR: '/director', TEACHER: '/teacher', STUDENT: '/student' }
  return <Navigate to={routes[user.role] || '/welcome'} replace />
}

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />

      <Route path="/director" element={<RoleGuard roles={['DIRECTOR']}><Layout><DirectorWorkbook /></Layout></RoleGuard>} />
      <Route path="/director/grades" element={<RoleGuard roles={['DIRECTOR']}><Layout><GradeApprovals /></Layout></RoleGuard>} />

      <Route path="/teacher" element={<RoleGuard roles={['TEACHER']}><Layout><TeacherWorkbook /></Layout></RoleGuard>} />
      <Route path="/teacher/grading" element={<RoleGuard roles={['TEACHER']}><Layout><TeacherGrading /></Layout></RoleGuard>} />

      <Route path="/student" element={<RoleGuard roles={['STUDENT']}><Layout><StudentWorkbook /></Layout></RoleGuard>} />
      <Route path="/student/grades" element={<RoleGuard roles={['STUDENT']}><Layout><StudentGrades /></Layout></RoleGuard>} />

      <Route path="/unauthorized" element={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center"><h1 className="font-display text-3xl font-bold mb-2">Unauthorized</h1>
          <p className="text-ink/50 font-mono text-sm">You don't have permission to view this page.</p></div>
        </div>
      } />
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  </BrowserRouter>
)

export default AppRouter