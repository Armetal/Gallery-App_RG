import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditPhoto = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [captions, setCaptions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetch('https://gallery-app-server.vercel.app/photos/' + id)
      .then((response) => response.json())
      .then((json) => {
        setImageUrl(json.imageUrl);
        setCaptions(json.captions);
        setLoading(false);
        console.log(json);
      });
  }, [id]);
  const editPhoto = (e) => {
    e.preventDefault();
    const obj = {
      imageUrl: imageUrl,
      captions: captions,
      updatedAt: new Date(),
    };
    fetch('https://gallery-app-server.vercel.app/photos/' + id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          return setError(data.error);
        }
        return navigate('/photos');
      });
    // .then((json) => console.log(json));
  };

  if (error) return <div>Error!</div>;

  return (
    <>
      {loading ? (
        <h1 style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>Loading...</h1>
      ) : (
        <div className="container">
          <form className="edit-form" onSubmit={editPhoto}>
            <label>
              Image Url:
              <input className="edit-input" type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </label>
            <label>
              Captions:
              <input className="edit-input" type="text" value={captions} data-testid="captions" onChange={(e) => setCaptions(e.target.value)} />
            </label>
            <input className="submit-btn" type="submit" value="Submit" data-testid="submit" />
          </form>
        </div>
      )}
    </>
  );
};

export default EditPhoto;
