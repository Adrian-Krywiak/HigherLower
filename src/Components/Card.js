import React, { useState } from 'react';
import BollywoodMovies from '../BollywoodMovies';
import BollywoodMoviesRatings from '../BollywoodMoviesRatings';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import correctSVG from '../SVGs/correct.svg';
import wrongSVG from '../SVGs/wrong.svg';
import ImageNotFound from '../SVGs/images.png';
import '../App.css';

BollywoodMovies.forEach(movie => {
  BollywoodMoviesRatings.forEach(rating => {
    if (movie.imdb_id === rating.imdb_id) {
      movie['ratings'] = rating.imdb_rating;
      movie['votes'] = rating.imdb_votes;
    }
  });
});

let MovieArray = BollywoodMovies.filter(movie => movie.ratings > 0 && movie.votes > 0);

function formatNumberWithCommas(number) {
  return number.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function pickUniqueRandomMovie(excludeMovie) {
  let randomMovie;
  do {
    randomMovie = MovieArray[Math.floor(Math.random() * MovieArray.length)];
  } while (randomMovie.imdb_id === excludeMovie.imdb_id);
  return randomMovie;
}

function Card(props) {
  // Picking Random Movies from an Array
  const rnum1 = MovieArray[Math.floor(Math.random() * MovieArray.length)];
  const rnum2 = pickUniqueRandomMovie(rnum1);
  const rnum3 = pickUniqueRandomMovie(rnum2);

  // Inserting them in a new Array
  const getMovies = [rnum1, rnum2];
  const [movies, setMovies] = useState(getMovies);

  const [lost, setLost] = useState('undefined');
  const [animate, setAnimate] = useState(false);
  const [showCounter, setShowCounter] = useState(false);
  const withRatings = true;

  function guessedCorrect() {
    setLost('false');
    setShowCounter(true);
    setTimeout(() => {
      setShowCounter(false);
      setAnimate(true);
      setLost('undefined');
      setTimeout(() => {
        setShowCounter(false);
        setMovies(movie => {
          const oldMovies = [...movie].splice(1, 1);
          const newmovie = [...oldMovies, rnum3];
          return newmovie;
        });
        setAnimate(false);
      }, 500);
    }, 800);
  }

  function guessedWrong() {
    setLost('animate');
    setTimeout(() => {
      setLost('true');
    }, 1000);
  }

  function AnimatedCounter() {
    if (withRatings) {
      return (
        <CountUp
          className='counter'
          style={showCounter ? { opacity: 1 } : { opacity: 0 }}
          end={showCounter ? movies[1].ratings : 0}
          decimals={1}
          duration={0.3}
          formattingFn={formatNumberWithCommas}
        />
      );
    } else {
      return (
        <CountUp
          className='counter'
          style={showCounter ? { opacity: 1 } : { opacity: 0 }}
          end={showCounter ? movies[1].votes : 0}
          duration={0.3}
          formattingFn={formatNumberWithCommas}
        />
      );
    }
  }

  const displayMovies = movies.map((movie, index) => {
    if (index === 0) {
      return (
        <motion.div exit={{ x: '-50%' }} className='section1'>
          <img src={ImageNotFound} alt="" className='movie-bg2' />
          <img src={movie.poster_path} alt="" className="movie-bg" />
          <div className="about-movie">
            <h2 className='movie-title'>{movie.title}</h2>
            {withRatings ? <h3 className='large-text'> produit {movie.ratings.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} tonnes de CO2</h3> : <h3>has a popularity of {movie.votes}</h3>}
          </div>
        </motion.div>
      );
    } else if (index === 1) {
      return (
        <motion.div className={animate ? 'section2-animate' : 'section2'}>
          {animate ? <div className='section3'></div> : null}
          <img src={ImageNotFound} alt="" className='movie-bg2' />
          <img src={movie.poster_path} alt="" className="movie-bg" />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="about-movie">
            <h2 className='smaller_text'><b className='movie-title'>'{movie.title}'</b> est?</h2>
            <div className="btn-wrapper">
              <button className="btn" onClick={() => {
                setShowCounter(true);
                if (withRatings) {
                  movies[0].ratings < movie.ratings ? guessedCorrect() : movies[0].ratings === movie.ratings ? guessedCorrect() : guessedWrong();
                } else {
                  movies[0].votes < movie.votes ? guessedCorrect() : movies[0].votes === movie.votes ? guessedCorrect() : guessedWrong();
                }
              }}>Plus  <div className='arrow-up'></div>
              </button>
              <button className="btn" onClick={() => {
                setShowCounter(true);
                if (withRatings) {
                  movies[0].ratings > movie.ratings ? guessedCorrect() : movies[0].ratings === movie.ratings ? guessedCorrect() : guessedWrong();
                } else {
                  movies[0].votes > movie.votes ? guessedCorrect() : movies[0].votes === movie.votes ? guessedCorrect() : guessedWrong();
                }
              }}>Moins <div className='arrow-down'></div></button>
            </div>
            <AnimatedCounter />
          </motion.div>
        </motion.div>
      );
    }
  });

  function YouLost() {
    return (
      <div className="lost-overlay">
        <div className="lost-box">
          <h2>Vous Avez Perdu</h2>
        </div>
      </div>
    );
  }

  function DisplayCards() {
    return displayMovies;
  }

  function AnimateAnswer() {
    if (lost === 'undefined') {
      return (
        <div className="circle">
          <h1 className='VS'>VS</h1>
        </div>
      );
    } else if (lost === 'animate') {
      return (
        <div className='circle'>
          <div className='wrong'></div>
          <img className='answer-svg' alt='' src={wrongSVG} />
        </div>
      );
    } else if (lost === 'false') {
      return (
        <div className='circle'>
          <div className='correct'></div>
          <img className='answer-svg' alt='' src={correctSVG} />
        </div>
      );
    }
  }

  return (
    <AnimatePresence className='App'>
      <DisplayCards />
      <AnimateAnswer />
      {lost === 'true' ? <YouLost /> : null}
    </AnimatePresence>
  );
}

export default Card;
