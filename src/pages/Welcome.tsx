// import { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'

// const roles = [
//   {
//     id: 'DIRECTOR',
//     label: 'Director',
//     description: 'Oversee workbooks, approve grades, manage the academic pipeline.',
//     icon: '◈',
//     color: '#7C3AED',
//     path: '/director',
//   },
//   {
//     id: 'TEACHER',
//     label: 'Teacher',
//     description: 'Create questions, annotate answers, and submit grades for review.',
//     icon: '◆',
//     color: '#0369A1',
//     path: '/teacher',
//   },
//   {
//     id: 'STUDENT',
//     label: 'Student',
//     description: 'Answer questions, track your progress, and view approved grades.',
//     icon: '◉',
//     color: '#065F46',
//     path: '/student',
//   },
// ]

// const words = ['Collaborate.', 'Annotate.', 'Evaluate.', 'Elevate.']

// export const Welcome = () => {
//   const { user } = useAuth()
//   const [wordIndex, setWordIndex] = useState(0)
//   const [visible, setVisible] = useState(true)
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//     const interval = setInterval(() => {
//       setVisible(false)
//       setTimeout(() => {
//         setWordIndex(i => (i + 1) % words.length)
//         setVisible(true)
//       }, 400)
//     }, 2200)
//     return () => clearInterval(interval)
//   }, [])

//   const dashboardPath =
//     user?.role === 'DIRECTOR' ? '/director'
//     : user?.role === 'TEACHER' ? '/teacher'
//     : user?.role === 'STUDENT' ? '/student'
//     : null

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: '#0C0A09',
//       color: '#FAF8F5',
//       fontFamily: '"DM Mono", monospace',
//       overflowX: 'hidden',
//       position: 'relative',
//     }}>

//       {/* Grid background */}
//       <div style={{
//         position: 'fixed', inset: 0, zIndex: 0,
//         backgroundImage: `
//           linear-gradient(rgba(250,248,245,0.03) 1px, transparent 1px),
//           linear-gradient(90deg, rgba(250,248,245,0.03) 1px, transparent 1px)
//         `,
//         backgroundSize: '48px 48px',
//       }} />

//       {/* Glow blobs */}
//       <div style={{
//         position: 'fixed', top: '-20%', left: '-10%', width: '600px', height: '600px',
//         background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
//         borderRadius: '50%', zIndex: 0, pointerEvents: 'none',
//       }} />
//       <div style={{
//         position: 'fixed', bottom: '-20%', right: '-10%', width: '500px', height: '500px',
//         background: 'radial-gradient(circle, rgba(3,105,161,0.10) 0%, transparent 70%)',
//         borderRadius: '50%', zIndex: 0, pointerEvents: 'none',
//       }} />

//       {/* Nav */}
//       <nav style={{
//         position: 'relative', zIndex: 10,
//         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//         padding: '24px 48px',
//         borderBottom: '1px solid rgba(250,248,245,0.06)',
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//           <div style={{
//             width: '32px', height: '32px', background: '#FAF8F5',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//           }}>
//             <span style={{ color: '#0C0A09', fontSize: '16px', fontWeight: 700 }}>W</span>
//           </div>
//           <span style={{ fontSize: '14px', letterSpacing: '0.15em', opacity: 0.7, textTransform: 'uppercase' }}>
//             Workbook
//           </span>
//         </div>
//         <div style={{ display: 'flex', gap: '12px' }}>
//           {user && dashboardPath ? (
//             <Link to={dashboardPath} style={{
//               padding: '8px 20px', background: '#FAF8F5', color: '#0C0A09',
//               fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase',
//               textDecoration: 'none', fontWeight: 600,
//               transition: 'opacity 0.2s',
//             }}
//               onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
//               onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
//             >
//               Dashboard →
//             </Link>
//           ) : (
//             <>
//               <Link to="/login" style={{
//                 padding: '8px 20px', border: '1px solid rgba(250,248,245,0.2)',
//                 color: '#FAF8F5', fontSize: '12px', letterSpacing: '0.1em',
//                 textTransform: 'uppercase', textDecoration: 'none',
//                 transition: 'border-color 0.2s',
//               }}
//                 onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(250,248,245,0.5)')}
//                 onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(250,248,245,0.2)')}
//               >
//                 Sign In
//               </Link>
//               <Link to="/register" style={{
//                 padding: '8px 20px', background: '#FAF8F5', color: '#0C0A09',
//                 fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase',
//                 textDecoration: 'none', fontWeight: 600,
//               }}>
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       </nav>

//       {/* Hero */}
//       <section style={{
//         position: 'relative', zIndex: 10,
//         maxWidth: '1100px', margin: '0 auto',
//         padding: '120px 48px 80px',
//       }}>
//         <div style={{
//           fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase',
//           color: 'rgba(250,248,245,0.4)', marginBottom: '32px',
//           opacity: mounted ? 1 : 0,
//           transform: mounted ? 'translateY(0)' : 'translateY(16px)',
//           transition: 'all 0.6s ease',
//         }}>
//           ◈ Collaborative Learning Platform
//         </div>

//         <h1 style={{
//           fontFamily: '"Playfair Display", serif',
//           fontSize: 'clamp(52px, 8vw, 96px)',
//           fontWeight: 700, lineHeight: 1.0,
//           margin: '0 0 8px',
//           opacity: mounted ? 1 : 0,
//           transform: mounted ? 'translateY(0)' : 'translateY(24px)',
//           transition: 'all 0.7s ease 0.1s',
//         }}>
//           Learn.
//         </h1>
//         <h1 style={{
//           fontFamily: '"Playfair Display", serif',
//           fontSize: 'clamp(52px, 8vw, 96px)',
//           fontWeight: 700, lineHeight: 1.0,
//           margin: '0 0 8px',
//           color: 'rgba(250,248,245,0.25)',
//           opacity: mounted ? 1 : 0,
//           transform: mounted ? 'translateY(0)' : 'translateY(24px)',
//           transition: 'all 0.7s ease 0.2s',
//         }}>
//           Teach.
//         </h1>
//         <h1 style={{
//           fontFamily: '"Playfair Display", serif',
//           fontSize: 'clamp(52px, 8vw, 96px)',
//           fontWeight: 700, lineHeight: 1.0,
//           margin: '0 0 48px',
//           color: visible ? '#7C3AED' : 'transparent',
//           transition: 'color 0.3s ease',
//           opacity: mounted ? 1 : 0,
//         }}>
//           {words[wordIndex]}
//         </h1>

//         <p style={{
//           fontSize: '16px', lineHeight: 1.8,
//           color: 'rgba(250,248,245,0.5)',
//           maxWidth: '480px', marginBottom: '48px',
//           opacity: mounted ? 1 : 0,
//           transform: mounted ? 'translateY(0)' : 'translateY(16px)',
//           transition: 'all 0.7s ease 0.4s',
//         }}>
//           A structured workspace where directors, teachers, and students
//           collaborate through worksheets, annotations, and graded assessments —
//           all in real time.
//         </p>

//         <div style={{
//           display: 'flex', gap: '16px', flexWrap: 'wrap',
//           opacity: mounted ? 1 : 0,
//           transform: mounted ? 'translateY(0)' : 'translateY(16px)',
//           transition: 'all 0.7s ease 0.5s',
//         }}>
//           {user && dashboardPath ? (
//             <Link to={dashboardPath} style={{
//               padding: '14px 32px', background: '#FAF8F5', color: '#0C0A09',
//               fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase',
//               textDecoration: 'none', fontWeight: 700,
//             }}>
//               Go to Dashboard →
//             </Link>
//           ) : (
//             <>
//               <Link to="/register" style={{
//                 padding: '14px 32px', background: '#FAF8F5', color: '#0C0A09',
//                 fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase',
//                 textDecoration: 'none', fontWeight: 700,
//               }}>
//                 Get Started →
//               </Link>
//               <Link to="/login" style={{
//                 padding: '14px 32px', border: '1px solid rgba(250,248,245,0.2)',
//                 color: '#FAF8F5', fontSize: '13px', letterSpacing: '0.12em',
//                 textTransform: 'uppercase', textDecoration: 'none',
//               }}>
//                 Sign In
//               </Link>
//             </>
//           )}
//         </div>
//       </section>

//       {/* Role cards */}
//       <section style={{
//         position: 'relative', zIndex: 10,
//         maxWidth: '1100px', margin: '0 auto',
//         padding: '0 48px 80px',
//       }}>
//         <div style={{
//           fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase',
//           color: 'rgba(250,248,245,0.3)', marginBottom: '32px',
//           borderTop: '1px solid rgba(250,248,245,0.06)', paddingTop: '48px',
//         }}>
//           Three roles. One platform.
//         </div>
//         <div style={{
//           display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
//           gap: '1px', background: 'rgba(250,248,245,0.06)',
//         }}>
//           {roles.map((role, i) => (
//             <div key={role.id}
//               style={{
//                 background: '#0C0A09', padding: '40px 36px',
//                 borderTop: `2px solid ${role.color}`,
//                 opacity: mounted ? 1 : 0,
//                 transform: mounted ? 'translateY(0)' : 'translateY(32px)',
//                 transition: `all 0.6s ease ${0.2 + i * 0.1}s`,
//                 cursor: 'default',
//               }}
//               onMouseEnter={e => {
//                 e.currentTarget.style.background = `rgba(${role.id === 'DIRECTOR' ? '124,58,237' : role.id === 'TEACHER' ? '3,105,161' : '6,95,70'},0.08)`
//               }}
//               onMouseLeave={e => {
//                 e.currentTarget.style.background = '#0C0A09'
//               }}
//             >
//               <div style={{
//                 fontSize: '28px', color: role.color, marginBottom: '20px',
//                 fontFamily: 'monospace',
//               }}>
//                 {role.icon}
//               </div>
//               <div style={{
//                 fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase',
//                 color: role.color, marginBottom: '12px', fontWeight: 600,
//               }}>
//                 {role.label}
//               </div>
//               <p style={{
//                 fontSize: '14px', lineHeight: 1.7,
//                 color: 'rgba(250,248,245,0.5)', margin: 0,
//               }}>
//                 {role.description}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Features strip */}
//       <section style={{
//         position: 'relative', zIndex: 10,
//         borderTop: '1px solid rgba(250,248,245,0.06)',
//         borderBottom: '1px solid rgba(250,248,245,0.06)',
//         padding: '40px 48px',
//         display: 'flex', gap: '48px', flexWrap: 'wrap',
//         justifyContent: 'center',
//       }}>
//         {[
//           ['⚡', 'Real-time updates via WebSockets'],
//           ['◈', 'Role-based access control'],
//           ['◆', 'Inline teacher annotations'],
//           ['◉', 'Director grade approval flow'],
//         ].map(([icon, text]) => (
//           <div key={text as string} style={{
//             display: 'flex', alignItems: 'center', gap: '12px',
//             fontSize: '13px', color: 'rgba(250,248,245,0.45)',
//             letterSpacing: '0.05em',
//           }}>
//             <span style={{ color: 'rgba(250,248,245,0.2)', fontSize: '16px' }}>{icon}</span>
//             {text}
//           </div>
//         ))}
//       </section>

//       {/* Footer */}
//       <footer style={{
//         position: 'relative', zIndex: 10,
//         padding: '32px 48px',
//         display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//         flexWrap: 'wrap', gap: '16px',
//       }}>
//         <span style={{ fontSize: '12px', color: 'rgba(250,248,245,0.2)', letterSpacing: '0.1em' }}>
//           © 2026 WORKBOOK
//         </span>
//         <div style={{ display: 'flex', gap: '32px' }}>
//           {[['Sign In', '/login'], ['Register', '/register']].map(([label, path]) => (
//             <Link key={path} to={path} style={{
//               fontSize: '12px', color: 'rgba(250,248,245,0.3)',
//               textDecoration: 'none', letterSpacing: '0.1em',
//               textTransform: 'uppercase',
//             }}>
//               {label}
//             </Link>
//           ))}
//         </div>
//       </footer>
//     </div>
//   )
// }










import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roles = [
  {
    id: 'DIRECTOR',
    label: 'Director',
    description: 'Oversee workbooks, approve grades, manage the academic pipeline.',
    icon: '◈',
    accent: '#5B21B6',
    badge: 'badge-director',
  },
  {
    id: 'TEACHER',
    label: 'Teacher',
    description: 'Create questions, annotate answers, and submit grades for review.',
    icon: '◆',
    accent: '#0E6EA6',
    badge: 'badge-teacher',
  },
  {
    id: 'STUDENT',
    label: 'Student',
    description: 'Answer questions, track your progress, and view approved grades.',
    icon: '◉',
    accent: '#0F766E',
    badge: 'badge-student',
  },
]

const words = ['Collaborate.', 'Annotate.', 'Evaluate.', 'Elevate.']
const wordColors = ['#2563A8', '#5B21B6', '#0E6EA6', '#0F766E']

export const Welcome = () => {
  const { user } = useAuth()
  const [wordIndex, setWordIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setWordIndex(i => (i + 1) % words.length)
        setVisible(true)
      }, 350)
    }, 2400)
    return () => clearInterval(interval)
  }, [])

  const dashboardPath =
    user?.role === 'DIRECTOR' ? '/director'
    : user?.role === 'TEACHER' ? '/teacher'
    : user?.role === 'STUDENT' ? '/student'
    : null

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-paper)' }}>

      {/* ── Ruled lines overlay (matches body but explicit for hero) ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          repeating-linear-gradient(180deg, transparent 0px, transparent 31px, #8ba5c41e 31px, #8ba5c41e 32px),
          linear-gradient(90deg, transparent 55px, #2563a812 56px, transparent 57px)
        `,
      }} />

      {/* ── Nav ── */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px',
        borderBottom: '1px solid var(--color-rule)',
        background: 'var(--color-paper)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px', height: '30px',
            background: 'var(--color-ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'var(--color-paper)', fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>W</span>
          </div>
          <span style={{
            fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase',
            fontFamily: 'var(--font-mono)', color: 'var(--color-ink-2)',
          }}>
            Workbook
          </span>
        </div>

        {/* Folio marker */}
        <span className="folio hidden md:block">
          Collaborative Learning Platform — Est. 2026
        </span>

        <div style={{ display: 'flex', gap: '10px' }}>
          {user && dashboardPath ? (
            <Link to={dashboardPath} className="btn-primary text-xs">Dashboard →</Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-xs">Sign In</Link>
              <Link to="/register" className="btn-primary text-xs">Register</Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        position: 'relative', zIndex: 10,
        maxWidth: '1100px', margin: '0 auto',
        padding: '100px 48px 72px',
      }}>

        {/* Chapter marker */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          marginBottom: '40px',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(12px)',
          transition: 'all 0.5s ease',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px',
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--color-accent)', opacity: 0.7,
          }}>
            § 001
          </span>
          <div style={{ height: '1px', width: '48px', background: 'var(--color-rule)' }} />
          <span className="folio">Introduction</span>
        </div>

        {/* Main headline */}
        <div style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(20px)',
          transition: 'all 0.6s ease 0.1s',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(56px, 8vw, 104px)',
            fontWeight: 900, lineHeight: 0.95,
            color: 'var(--color-ink)',
            margin: 0,
            fontVariationSettings: '"opsz" 144',
          }}>
            Learn.
          </h1>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(56px, 8vw, 104px)',
            fontWeight: 900, lineHeight: 0.95,
            color: 'var(--color-rule)',
            margin: '4px 0',
            fontVariationSettings: '"opsz" 144',
          }}>
            Teach.
          </h1>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(56px, 8vw, 104px)',
            fontWeight: 900, lineHeight: 0.95,
            margin: '4px 0 0',
            color: visible ? wordColors[wordIndex] : 'transparent',
            transition: 'color 0.3s ease',
            fontVariationSettings: '"opsz" 144',
            fontStyle: 'italic',
          }}>
            {words[wordIndex]}
          </h1>
        </div>

        {/* Ruled divider */}
        <div style={{
          margin: '48px 0',
          height: '1px',
          background: 'linear-gradient(90deg, var(--color-ink) 120px, var(--color-rule) 120px)',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.6s ease 0.3s',
        }} />

        {/* Description + CTA in columns */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto',
          gap: '48px', alignItems: 'end',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(16px)',
          transition: 'all 0.6s ease 0.4s',
        }}>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '17px', lineHeight: 1.85,
            color: 'var(--color-ink-2)', opacity: 0.75,
            maxWidth: '460px', margin: 0,
          }}>
            A structured workspace where directors, teachers, and students
            collaborate through worksheets, annotations, and graded
            assessments — all in real time.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexShrink: 0 }}>
            {user && dashboardPath ? (
              <Link to={dashboardPath} className="btn-primary">Go to Dashboard →</Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary">Get Started →</Link>
                <Link to="/login" className="btn-ghost" style={{ textAlign: 'center' }}>Sign In</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Role cards ── */}
      <section style={{
        position: 'relative', zIndex: 10,
        maxWidth: '1100px', margin: '0 auto',
        padding: '0 48px 80px',
      }}>

        {/* Section header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px',
          marginBottom: '32px',
          paddingTop: '48px',
          borderTop: '2px solid var(--color-ink)',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px',
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--color-accent)', opacity: 0.7,
          }}>§ 002</span>
          <div style={{ height: '1px', width: '48px', background: 'var(--color-rule)' }} />
          <span className="folio">Three Roles. One Platform.</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1px',
          background: 'var(--color-rule)',
          border: '1px solid var(--color-rule)',
        }}>
          {roles.map((role, i) => (
            <div key={role.id}
              className="group"
              style={{
                background: 'var(--color-cream)',
                padding: '40px 32px',
                borderTop: `3px solid ${role.accent}`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'none' : 'translateY(24px)',
                transition: `all 0.5s ease ${0.1 + i * 0.08}s`,
                cursor: 'default',
                position: 'relative',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--color-paper)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--color-cream)'
                e.currentTarget.style.transform = 'none'
              }}
            >
              {/* Corner bracket */}
              <div style={{
                position: 'absolute', top: '12px', right: '12px',
                width: '12px', height: '12px',
                borderTop: `1.5px solid ${role.accent}`,
                borderRight: `1.5px solid ${role.accent}`,
                opacity: 0.4,
              }} />

              <div style={{
                fontSize: '24px', color: role.accent,
                marginBottom: '16px', fontFamily: 'monospace',
              }}>
                {role.icon}
              </div>

              <span className={role.badge} style={{ display: 'inline-block', marginBottom: '16px' }}>
                {role.label}
              </span>

              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '14px', lineHeight: 1.75,
                color: 'var(--color-ink-2)', opacity: 0.7,
                margin: 0,
              }}>
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features strip ── */}
      <section style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid var(--color-rule)',
        borderBottom: '1px solid var(--color-rule)',
        background: 'var(--color-vellum)',
        padding: '28px 48px',
        display: 'flex', gap: '40px', flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {[
          ['⚡', 'Real-time WebSocket updates'],
          ['◈', 'Role-based access control'],
          ['◆', 'Inline teacher annotations'],
          ['◉', 'Director grade approval flow'],
        ].map(([icon, text]) => (
          <div key={text as string} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px', letterSpacing: '0.05em',
            color: 'var(--color-ink-2)', opacity: 0.6,
          }}>
            <span style={{ color: 'var(--color-accent)', opacity: 0.6 }}>{icon}</span>
            {text}
          </div>
        ))}
      </section>

      {/* ── Footer ── */}
      <footer style={{
        position: 'relative', zIndex: 10,
        padding: '28px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '12px',
        borderTop: '1px solid var(--color-rule)',
      }}>
        <span className="folio">© 2026 Workbook — All rights reserved</span>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[['Sign In', '/login'], ['Register', '/register']].map(([label, path]) => (
            <Link key={path} to={path} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px', letterSpacing: '0.15em',
              textTransform: 'uppercase', textDecoration: 'none',
              color: 'var(--color-ink-2)', opacity: 0.45,
              transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.45')}
            >
              {label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  )
}