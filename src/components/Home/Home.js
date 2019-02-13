import React, { Component } from 'react';
import { API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE, BACKDROP_SIZE } from '../../config';
import './Home.css';
import HeroImage from '../elements/HeroImage/HeroImage';
import SearchBar from '../elements/SearchBar/SearchBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import Spinner from '../elements/Spinner/Spinner';
import LoadMoreBtn from '../elements/LoadMoreBtn/LoadMoreBtn';
import MovieThumb from '../elements/MovieThumb/MovieThumb';
class Home extends Component {
    state = {
        movies: [],
        heroImage: null,
        loading: false,
        currentPage: 0,
        totalPages: 0,
        searchTerm: ''
    }
    componentDidMount() {
        if (localStorage.getItem('HomeState')) {
            const state = JSON.parse(localStorage.getItem('HomeState'));
            this.setState({
                ...state
            });
        } else {
            this.setState({ loading: true });
            const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
            this.fetchItem(endpoint);
        }

    }

    searchItems = (searchTerm) => {
        let endpoint = '';
        this.setState({
            movies: [],
            loading: true,
            searchTerm
        })

        if (searchTerm === '') {
            endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        } else {
            endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}`;
        }
        this.fetchItem(endpoint);

    }


    loadMoreItems = () => {
        let endpoint = '';
        const { currentPage, searchTerm } = this.state;
        this.setState({
            loading: true
        });

        if (this.state.searchTerm === '') {
            endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${currentPage + 1}`;
        } else {
            endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}&page=${currentPage + 1}`;
        }
        this.fetchItem(endpoint);
    }

    fetchItem = endpoint => {
        fetch(endpoint)
            .then(result => result.json())
            .then(result => {

                this.setState({
                    movies: [...this.state.movies, ...result.results],
                    heroImage: this.state.heroImage || result.results[0],
                    loading: false,
                    currentPage: result.page,
                    totalPages: result.total_pages
                }, () => {
                    if (this.state.searchTerm === "") {
                        localStorage.setItem('HomeState', JSON.stringify(this.state));
                    }

                })
            })
            .catch(err => console.error('Error: ', err))
    }
    render() {
        const { heroImage, searchTerm, loading, movies, currentPage, totalPages } = this.state;
        return (
            <div className="rmdb-home">
                {heroImage && (
                    <div>
                        <HeroImage
                            image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}/${heroImage.backdrop_path}`}
                            title={heroImage.original_title}
                            text={heroImage.overview}
                        />
                        <SearchBar callback={this.searchItems} />
                    </div>
                )}
                <div className="rmdb-home-grid" >
                    <FourColGrid
                        header={searchTerm ? 'Search Result' : 'Popular Movies'}
                        loading={loading}
                    >
                        {movies.map((element, i) => {
                            return (
                                <MovieThumb key={i}
                                    clickable={true}
                                    image={element.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}/${element.poster_path}` : './images/no_image.jpg'}
                                    movieId={element.id}
                                    movieName={element.original_title}
                                />
                            );
                        })}
                    </FourColGrid>
                    {loading ? <Spinner /> : null}
                    {(currentPage <= totalPages && !loading) ?
                        <LoadMoreBtn text="Load More" onClick={this.loadMoreItems} />
                        : null}
                </div>



            </div>
        );
    }
}

export default Home;