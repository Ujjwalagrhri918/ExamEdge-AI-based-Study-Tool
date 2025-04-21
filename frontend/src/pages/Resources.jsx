import React, { useContext, useEffect, useState } from 'react';
import { UploadContext } from '../context/UploadContext';
import './Resources.css';

const Resources = () => {
  const { selectedFile } = useContext(UploadContext);
  const [books, setBooks] = useState({});
  const [videos, setVideos] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      if (!selectedFile) return;

      const cachedBooks = localStorage.getItem(`books-${selectedFile}`);
      const cachedVideos = localStorage.getItem(`videos-${selectedFile}`);

      if (cachedBooks && cachedVideos) {
        setBooks(JSON.parse(cachedBooks));
        setVideos(JSON.parse(cachedVideos));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const bookRes = await fetch(
          `https://02c9-35-185-161-252.ngrok-free.app/fetch-books/${selectedFile}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }
        );
        const bookData = await bookRes.json();

        const videoRes = await fetch(
          `https://02c9-35-185-161-252.ngrok-free.app/fetch-videos/${selectedFile}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }
        );
        const videoData = await videoRes.json();

        const booksData = bookData.books[0];
        const videosData = videoData.videos;

        setBooks(booksData);
        setVideos(videosData);

        localStorage.setItem(`books-${selectedFile}`, JSON.stringify(booksData));
        localStorage.setItem(`videos-${selectedFile}`, JSON.stringify(videosData));
      } catch (error) {
        console.error('Failed to fetch resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [selectedFile]);

  return (
    <div className="resources-container">
      <h1>Related Resources</h1>
  
      {!selectedFile ? (
        <p className="no-file-message">Please upload a file to view related resources.</p>
      ) : loading ? (
        <p className="loading">Fetching content...</p>
      ) : (
        <>
          <section className="section">
            <p className="heading">📚 Related Books</p>
            <div className="cards-container">
              {Object.entries(books).map(([topic, book]) => (
                <div className="card" key={topic}>
                  <img src={book.thumbnail} alt={book.title} className="thumbnail" />
                  <div className="card-content">
                    <h3>{book.title}</h3>
                    <p className="author">{book.authors}</p>
                    <p className="desc">{book.description}</p>
                    <a
                      href={book.preview}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                    >
                      Preview
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
  
          <section className="section">
            <p className="heading">🎥 Related Videos</p>
            <div className="cards-container">
              {Object.entries(videos).map(([topic, video]) => (
                <div className="card" key={topic}>
                  <img src={video.thumbnail} alt={video.title} className="thumbnail" />
                  <div className="card-content">
                    <h3>{video.title}</h3>
                    <p className="author">{video.channel}</p>
                    <p className="desc">{video.description}</p>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                    >
                      Watch
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
  
};

export default Resources;
