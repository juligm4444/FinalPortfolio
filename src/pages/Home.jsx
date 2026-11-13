import Hero from '../sections/Hero.jsx'
import Bio from '../sections/Bio.jsx'
import Herbarium from '../sections/Herbarium.jsx'
import { PlushProvider } from '../components/plush/PlushProvider.jsx'

/* REDESIGN §5 Home: hero, mini bio, Herbario. */
export default function Home() {
  return (
    <PlushProvider>
      <Hero />
      <Bio />
      <Herbarium />
    </PlushProvider>
  )
}
