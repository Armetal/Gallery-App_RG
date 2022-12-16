import { useEffect } from 'react';
import { useState } from 'react';
import Card from '../components/Card';

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [sort, setSort] = useState('');
  const [submited, setSubmited] = useState('');
  const [search, setSearch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deletePhoto = (id) => {
    fetch('https://gallery-app-server.vercel.app/photos/' + id, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((json) => {
        setPhotos((json) => {
          return json.filter((photo) => photo.id !== id);
        });
      });
  };

  useEffect(() => {
    if (search !== null) {
      var url = 'https://gallery-app-server.vercel.app/photos?q=' + search;
      if (sort === 'desc') {
        url += '&_sort=id&_order=desc';
      } else if (sort === 'asc') {
        url += '&_sort=id&_order=asc';
      }
    } else {
      url = 'https://gallery-app-server.vercel.app/photos';
      if (sort === 'desc') {
        url += '?_sort=id&_order=desc&';
      } else if (sort === 'asc') {
        url += '?_sort=id&_order=asc&';
      }
    }
    try {
      fetch(url)
        .then((response) => response.json())
        .then((json) => {
          setPhotos(json);
          setLoading(false);
          console.log(json);
        });
    } catch (error) {
      setError(error);
    }
  }, [sort, submited, search]);

  if (error) return <h1 style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>Error!</h1>;

  return (
    <>
      <div className="container">
        <div className="options">
          <select onChange={(e) => setSort(e.target.value)} data-testid="sort" className="form-select" style={{}}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmited(search);
            }}
          >
            <input type="text" data-testid="search" onChange={(e) => setSearch(e.target.value)} className="form-input" />
            <input type="submit" value="Search" data-testid="submit" className="form-btn" />
          </form>
        </div>
        <div className="content">
          {loading ? (
            <h1 style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>Loading...</h1>
          ) : (
            photos.map((photo) => {
              return <Card key={photo.id} photo={photo} deletePhoto={deletePhoto} />;
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Photos;
