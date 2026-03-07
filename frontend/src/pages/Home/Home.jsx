import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import MovieSlider from '../../components/MovieSlider/MovieSlider';
import Footer from '../../components/Footer/Footer';
import './Home.css';

const Home = () => {
  const [movies, setMovies] = useState({});

  useEffect(() => {
    // Fetch movies by language
    const languages = ['en', 'es', 'fr', 'ja', 'zh', 'de', 'ta'];
    // API calls would go here
  }, []);

  return (
    <div className="home">
      <Navbar />
      <div className="hero-banner">
        <h1>Unlimited movies, TV shows, and more</h1>
        <p>Watch anywhere. Cancel anytime.</p>
      </div>
      <MovieSlider title="Trending English Movies" movies={[]} />
      <MovieSlider title="Trending Spanish Movies" movies={[]} />
      <MovieSlider title="Trending French Movies" movies={[]} />
      <MovieSlider title="Trending Japanese Movies" movies={[]} />
      <MovieSlider title="Trending Chinese Movies" movies={[]} />
      <MovieSlider title="Trending German Movies" movies={[]} />
      <MovieSlider title="Trending Tamil Movies" movies={[]} />
      <Footer />
    </div>
  );
};

export default Home;
