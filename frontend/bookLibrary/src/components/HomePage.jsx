import React, { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router';
import { UserContext } from '../App';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {

  const { userAuth, userAuth: { access_token, role }, setUserAuth } = useContext(UserContext);
  const [books, setBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [oldBooks, setOldBooks] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/getBooks`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const allBooks = response.data.books;
        const now = new Date();

        const recent = allBooks.filter((book) => {
          const createdAt = new Date(book.createdAt);
          const timeDifference = (now - createdAt) / (1000 * 60); // difference in minutes
          return timeDifference <= 10;
        });

        const old = allBooks.filter((book) => {
          const createdAt = new Date(book.createdAt);
          const timeDifference = (now - createdAt) / (1000 * 60); // difference in minutes
          return timeDifference > 10;
        });

        setBooks(allBooks);
        setRecentBooks(recent);
        setOldBooks(old);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [access_token]);

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const filteredBooks = filter === 'recent' ? recentBooks : filter === 'old' ? oldBooks : books;

  return (
    !access_token ? <Navigate to="signin" /> :
      <>
        <Link className='absolute btn-dark bottom-0 right-0' to="/possibleImprovments">My Thoughts</Link>
        <section className='h-cover'>
          {role === 'creator' && <Link to="/create" className='btn-dark'>Create Book</Link>}

          <div className="mt-8">
            <label className="block mb-2 text-gray-600">Filter:</label>
            <select
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="border p-2 rounded-md"
            >
              <option value="all">All Books</option>
              <option value="recent">Recent Books (created in the last 10 mins)</option>
              <option value="old">Older Books (created more than 10 mins ago)</option>
            </select>
          </div>

          <div className="mt-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => (
              <div key={book._id} className="p-4 border rounded-md">
                <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
                <p className="text-gray-600">Authors: {book.authors.join(', ')}</p>
                <p className="text-gray-600">ISBN: {book.isbn}</p>
                <img src={book.image} alt={book.title} className="mt-2 w-full h-32 object-cover" />
              </div>
            ))}
          </div>
        </section>
      </>
  );
}

export default HomePage