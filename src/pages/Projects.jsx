import ProjectsShowcase from '../components/projects/ProjectsShowcase.jsx'

/**
 * /projects is the showcase and nothing else — three full-height panels, each
 * cycling through the works in its category. There is no separate index below
 * it: every work is reachable from a panel, so a second list would only
 * repeat what the panels already say.
 */
export default function Projects() {
  return <ProjectsShowcase />
}
